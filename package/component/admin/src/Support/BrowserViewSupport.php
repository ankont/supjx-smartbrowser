<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

use Joomla\CMS\Application\CMSApplicationInterface;
use Joomla\CMS\Component\ComponentHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Router\Route;
use Joomla\CMS\Session\Session;
use Joomla\CMS\Uri\Uri;
use SuperSoft\Component\Smartbrowser\Administrator\Adapter\AdapterRegistry;
use SuperSoft\Component\Smartbrowser\Administrator\Adapter\BrowseRootAwareInterface;
use SuperSoft\Component\Smartbrowser\Administrator\Adapter\FlatHierarchyAdapter;

defined('_JEXEC') or die;

final class BrowserViewSupport
{
    public function __construct(private readonly CMSApplicationInterface $app) {}

    public function prepare(object $document): array
    {
        $language = $this->app->getLanguage();
        $language->load('joomla', JPATH_ADMINISTRATOR, null, true);
        $language->load('com_smartbrowser', JPATH_ADMINISTRATOR, null, true);
        foreach ($this->languageKeys() as $key) Text::script($key);

        Text::script('JGLOBAL_SELECT_NO_RESULTS_MATCH');
        Text::script('JGLOBAL_SELECT_PRESS_TO_SELECT');
        $document->getWebAssetManager()->usePreset('choicesjs')->useScript('webcomponent.field-fancy-select')->useScript('keepalive')
            ->useStyle('com_smartbrowser.app')->useScript('com_smartbrowser.app');

        $input = $this->app->getInput();
        $registry = new AdapterRegistry($this->app);
        $requestedMode = $input->getCmd('mode', 'manage');
        $mode = in_array($requestedMode, ['manage', 'select', 'readonly'], true) ? $requestedMode : 'manage';
        $adapterId = $input->getCmd('adapter', 'media');
        $featuredOnly = $adapterId === 'flat-articles' && $input->getBool('featuredOnly', false);
        $browseRoot = $input->getString('browseRoot') ?: null;
        $allowedResourceTypes = array_values(array_filter(array_map('trim', explode(',', $input->getString('allowedResourceTypes')))));
        $defaultView = $input->getCmd('defaultView');
        if (!in_array($defaultView, ['grid', 'details'], true)) $defaultView = null;
        $flatScope = $input->getString('flatScope') ?: null;
        $adapter = $registry->get($adapterId, $browseRoot, $flatScope);
        $showAdapterSwitcher = $input->getBool('showAdapterSwitcher', false);
        $adapterDescriptors = $registry->descriptors();
        if (str_starts_with($adapterId, 'flat-') && $adapterId !== 'flat-articles') {
            $sourceId = substr($adapterId, 5);
            foreach ($adapterDescriptors as $descriptor) {
                if ($descriptor['id'] === $sourceId) $adapterDescriptors[] = [...$descriptor, 'id' => $adapterId];
            }
        }
        if (!$showAdapterSwitcher) {
            $adapterDescriptors = array_values(array_filter($adapterDescriptors, static fn (array $descriptor): bool => $descriptor['id'] === $adapterId));
        }
        $selectionTarget = $input->getCmd('selectionTarget', $mode === 'manage' ? 'both' : 'item');
        if (!in_array($selectionTarget, ['item', 'node', 'both'], true)) $selectionTarget = 'item';

        $options = [
            'adapter' => $adapterId, 'adapters' => $adapterDescriptors,
            'featuredOnly' => $featuredOnly, 'initialFilters' => $featuredOnly ? ['featured' => '1'] : [],
            'flatRootNode' => $adapter instanceof FlatHierarchyAdapter ? $adapter->getFlatRootNode()
                : (str_starts_with($adapterId, 'flat-')
                    ? ($input->getString('flatFromBrowseRoot') ?: ($input->getString('flatFromAdapter') ? 'content:root' : ($browseRoot ?: 'content:root')))
                    : null),
            'preferencesResetToken' => (string) ComponentHelper::getParams('com_smartbrowser')->get('preferences_reset_token', ''),
            'showAdapterSwitcher' => $showAdapterSwitcher,
            'application' => $this->app->isClient('site') ? 'site' : 'administrator',
            'integrated' => $input->getBool('integrated', false) && $mode === 'manage',
            'editorMode' => (string) ComponentHelper::getParams('com_smartbrowser')->get($this->app->isClient('site') ? 'editor_site' : 'editor_admin', 'modal'),
            'mode' => $mode, 'multiple' => $mode === 'manage' || $input->getBool('multiple', false),
            'selectionTarget' => $selectionTarget, 'allowNoUser' => $mode === 'select' && in_array($adapterId, ['users', 'flat-users'], true) && $input->getBool('allowNoUser', false),
            'showContextResources' => $input->getBool('showContextResources', ContextOptions::enabled($adapterId, $this->app->isClient('site'))), 'browseRoot' => $browseRoot, 'flatScope' => $flatScope,
            'allowedResourceTypes' => $allowedResourceTypes,
            'defaultView' => $defaultView,
            'apiBaseUrl' => Uri::base() . 'index.php?option=com_smartbrowser&format=json',
            'csrfToken' => Session::getFormToken(),
            'initialNode' => $adapter instanceof BrowseRootAwareInterface ? $adapter->getInitialNode() : ($adapter->getRoots()[0]['id'] ?? ''),
            'currentNode' => $input->getString('node') && $adapter instanceof BrowseRootAwareInterface
                ? $adapter->getInitialNode($input->getString('node')) : $input->getString('node'),
            'roots' => $adapter->getRoots(), 'actions' => $mode === 'readonly' ? [] : $adapter->getActions([]),
            'maxUploadSizeMb' => (float) ComponentHelper::getParams('com_media')->get('upload_maxsize', 10),
            'returnUrl' => Route::_('index.php?option=com_smartbrowser&view=browser', false),
            'loginUrl' => $this->app->isClient('site') ? SiteAuthentication::loginUrl(Uri::getInstance()->toString()) : null,
            'managerUrl' => $mode === 'manage' ? ManagerUrlProvider::for($this->app, $adapterId, $featuredOnly) : null,
            'dashboardUrl' => $mode === 'manage' ? Route::_('index.php?option=com_smartbrowser&view=dashboard', false) : null,
        ];
        $document->addScriptOptions('com_smartbrowser', $options);
        return $options;
    }

    private function languageKeys(): array
    {
        return [
            'COM_SMARTBROWSER_ACTION_CREATE_FOLDER', 'COM_SMARTBROWSER_ACTION_DOWNLOAD', 'COM_SMARTBROWSER_ACTION_PREVIEW', 'COM_SMARTBROWSER_ACTION_SHARE', 'COM_SMARTBROWSER_ACTION_UPLOAD',
            'COM_SMARTBROWSER_ASCENDING', 'COM_SMARTBROWSER_CONFIRM_DELETE', 'COM_SMARTBROWSER_DATE_CREATED', 'COM_SMARTBROWSER_DATE_MODIFIED', 'COM_SMARTBROWSER_DATE',
            'COM_SMARTBROWSER_DETAILS', 'COM_SMARTBROWSER_COLUMNS', 'COM_SMARTBROWSER_DESCENDING', 'COM_SMARTBROWSER_DEFAULT_SORTING', 'COM_SMARTBROWSER_DIMENSIONS', 'COM_SMARTBROWSER_DROP_UPLOAD', 'COM_SMARTBROWSER_EMPTY_STATE',
            'COM_SMARTBROWSER_FILTER_ACTIVE', 'COM_SMARTBROWSER_FILTER_STATE', 'COM_SMARTBROWSER_FILTER_OPTIONS', 'COM_SMARTBROWSER_FILTER_ANY', 'COM_SMARTBROWSER_ALL_FILES',
            'COM_SMARTBROWSER_IMAGES', 'COM_SMARTBROWSER_DOCUMENTS', 'COM_SMARTBROWSER_VIDEOS', 'COM_SMARTBROWSER_AUDIO', 'COM_SMARTBROWSER_FILE_TYPE',
            'COM_SMARTBROWSER_MIME_TYPE', 'COM_SMARTBROWSER_EXTENSION', 'COM_SMARTBROWSER_LANGUAGE_KEY', 'COM_SMARTBROWSER_ALL_LANGUAGES', 'COM_SMARTBROWSER_CHECKED_OUT', 'COM_SMARTBROWSER_NOT_CHECKED_OUT',
            'COM_SMARTBROWSER_GRID', 'COM_SMARTBROWSER_NAME', 'COM_SMARTBROWSER_NEW_FOLDER_NAME', 'COM_SMARTBROWSER_NO_RESULTS', 'COM_SMARTBROWSER_RENAME',
            'COM_SMARTBROWSER_CANCEL',
            'COM_SMARTBROWSER_BATCH', 'COM_SMARTBROWSER_BATCH_ACTIONS', 'COM_SMARTBROWSER_BATCH_SELECT_ACTIONS', 'COM_SMARTBROWSER_BATCH_ACTION',
            'COM_SMARTBROWSER_SELECT_BATCH_ACTION', 'COM_SMARTBROWSER_SELECTED_ITEMS', 'COM_SMARTBROWSER_SELECTED_ITEM_COUNT_ONE', 'COM_SMARTBROWSER_SELECTED_ITEM_COUNT_MANY', 'COM_SMARTBROWSER_BATCH_APPLY',
            'COM_SMARTBROWSER_BATCH_RENAME', 'COM_SMARTBROWSER_BATCH_FIND', 'COM_SMARTBROWSER_BATCH_REPLACE', 'COM_SMARTBROWSER_BATCH_PREFIX', 'COM_SMARTBROWSER_BATCH_SUFFIX',
            'COM_SMARTBROWSER_BATCH_NUMBER', 'COM_SMARTBROWSER_BATCH_START_AT', 'COM_SMARTBROWSER_BATCH_PLACEMENT', 'COM_SMARTBROWSER_BATCH_MODE', 'COM_SMARTBROWSER_BATCH_KEEP_LOCATION',
            'COM_SMARTBROWSER_BATCH_MOVE', 'COM_SMARTBROWSER_BATCH_COPY', 'COM_SMARTBROWSER_BATCH_DESTINATION_FOLDER', 'COM_SMARTBROWSER_LOADING_FOLDERS', 'COM_SMARTBROWSER_BATCH_ZIP', 'COM_SMARTBROWSER_BATCH_ZIP_NAME',
            'COM_SMARTBROWSER_BATCH_SET_LANGUAGE', 'COM_SMARTBROWSER_BATCH_SET_ACCESS', 'COM_SMARTBROWSER_BATCH_ADD_TAG', 'COM_SMARTBROWSER_BATCH_CATEGORY_PLACEMENT',
            'COM_SMARTBROWSER_BATCH_PREVIEW', 'COM_SMARTBROWSER_BATCH_NO_CHANGES',
            'COM_SMARTBROWSER_BATCH_TAGS', 'COM_SMARTBROWSER_BATCH_REMOVE_TAG', 'COM_SMARTBROWSER_BATCH_KEEP_TAGS', 'COM_SMARTBROWSER_BATCH_VIEW_NAMES',
            'COM_SMARTBROWSER_BATCH_PARENT_CATEGORY', 'COM_SMARTBROWSER_BATCH_FLIP_ORDERING', 'COM_SMARTBROWSER_BATCH_MENU_PLACEMENT', 'COM_SMARTBROWSER_BATCH_MENU_DESTINATION', 'COM_SMARTBROWSER_BATCH_MENU_ROOT',
            'COM_SMARTBROWSER_BATCH_USER_GROUPS', 'COM_SMARTBROWSER_BATCH_GROUP_ADD', 'COM_SMARTBROWSER_BATCH_GROUP_REMOVE', 'COM_SMARTBROWSER_BATCH_GROUP_SET', 'COM_SMARTBROWSER_BATCH_PASSWORD_RESET', 'JYES', 'JNO',
            'COM_SMARTBROWSER_RENAME_TO', 'COM_SMARTBROWSER_SEARCH', 'COM_SMARTBROWSER_SELECT_ALL', 'COM_SMARTBROWSER_INVERT_SELECTION', 'COM_SMARTBROWSER_SELECT', 'COM_SMARTBROWSER_SELECT_CATEGORY',
            'COM_SMARTBROWSER_SIZE', 'COM_SMARTBROWSER_SORT_BY', 'COM_SMARTBROWSER_SORT_DIRECTION', 'COM_SMARTBROWSER_TOGGLE_INFO', 'COM_SMARTBROWSER_VIEW', 'COM_SMARTBROWSER_HIDE_TREE', 'COM_SMARTBROWSER_SHOW_TREE',
            'COM_SMARTBROWSER_CONTENT_ROOT', 'COM_SMARTBROWSER_CREATE_CHILD_CATEGORY', 'COM_SMARTBROWSER_CREATE_CHILD_TAG', 'COM_SMARTBROWSER_CREATE_CHILD_MENU_ITEM',
            'COM_SMARTBROWSER_OPEN_LINK', 'COM_SMARTBROWSER_COPY_LINK', 'COM_SMARTBROWSER_MENU', 'COM_SMARTBROWSER_COMPONENT', 'COM_SMARTBROWSER_SELECT_MENU', 'COM_SMARTBROWSER_SELECT_COMPONENT', 'COM_SMARTBROWSER_PARENT', 'COM_SMARTBROWSER_PARENT_CATEGORY', 'COM_SMARTBROWSER_CATEGORY_HIERARCHY', 'COM_SMARTBROWSER_TAG_HIERARCHY', 'COM_SMARTBROWSER_LOCATION', 'COM_SMARTBROWSER_CATEGORY', 'COM_SMARTBROWSER_MENU_ITEM_TYPE',
            'COM_SMARTBROWSER_MENU_ITEM_ALIAS', 'COM_SMARTBROWSER_URL', 'COM_SMARTBROWSER_USERS_ROOT', 'COM_SMARTBROWSER_USER_GROUP', 'COM_SMARTBROWSER_USER_GROUPS',
            'COM_SMARTBROWSER_USERNAME', 'COM_SMARTBROWSER_REGISTERED', 'COM_SMARTBROWSER_LAST_VISIT', 'COM_SMARTBROWSER_USER_ENABLED', 'COM_SMARTBROWSER_USER_BLOCKED',
            'COM_SMARTBROWSER_USER_PENDING', 'COM_SMARTBROWSER_ACTIVATION', 'COM_SMARTBROWSER_EDIT_USER', 'COM_SMARTBROWSER_BLOCK_USER', 'COM_SMARTBROWSER_UNBLOCK_USER',
            'COM_SMARTBROWSER_FILTER_MFA', 'COM_SMARTBROWSER_DATE_TODAY', 'COM_SMARTBROWSER_DATE_PAST_WEEK', 'COM_SMARTBROWSER_DATE_PAST_1MONTH', 'COM_SMARTBROWSER_DATE_PAST_3MONTH', 'COM_SMARTBROWSER_DATE_PAST_6MONTH', 'COM_SMARTBROWSER_DATE_PAST_YEAR', 'COM_SMARTBROWSER_DATE_POST_YEAR', 'COM_SMARTBROWSER_DATE_NEVER',
            'COM_SMARTBROWSER_SELECT_MAX_LEVELS', 'COM_SMARTBROWSER_SELECT_USER_GROUP', 'COM_SMARTBROWSER_SELECT_FOLDER', 'COM_SMARTBROWSER_SELECT_USER_STATE', 'COM_SMARTBROWSER_SELECT_ACTIVE_STATE', 'COM_SMARTBROWSER_SELECT_MFA', 'COM_SMARTBROWSER_SELECT_LAST_VISIT', 'COM_SMARTBROWSER_SELECT_REGISTERED', 'COM_SMARTBROWSER_ENABLED', 'COM_SMARTBROWSER_DISABLED',
            'COM_SMARTBROWSER_SELECT_FILE_TYPE', 'COM_SMARTBROWSER_SELECT_MIME_TYPE', 'COM_SMARTBROWSER_SELECT_EXTENSION', 'COM_SMARTBROWSER_SELECT_CREATED', 'COM_SMARTBROWSER_SELECT_MODIFIED', 'COM_SMARTBROWSER_SELECT_SIZE', 'COM_SMARTBROWSER_SELECT_DIMENSIONS',
            'COM_SMARTBROWSER_SIZE_SMALL', 'COM_SMARTBROWSER_SIZE_MEDIUM', 'COM_SMARTBROWSER_SIZE_LARGE', 'COM_SMARTBROWSER_SIZE_VERY_LARGE', 'COM_SMARTBROWSER_DIMENSIONS_NONE', 'COM_SMARTBROWSER_DIMENSIONS_SMALL', 'COM_SMARTBROWSER_DIMENSIONS_MEDIUM', 'COM_SMARTBROWSER_DIMENSIONS_LARGE', 'COM_SMARTBROWSER_DIMENSIONS_VERY_LARGE',
            'COM_SMARTBROWSER_MEDIA_IMAGE', 'COM_SMARTBROWSER_MEDIA_DOCUMENT', 'COM_SMARTBROWSER_MEDIA_VIDEO', 'COM_SMARTBROWSER_MEDIA_AUDIO',
            'COM_SMARTBROWSER_CONTENT_TAB', 'COM_SMARTBROWSER_FILE_NAME',
            'JSAVE', 'JAPPLY', 'JSAVEASCOPY',
            'COM_SMARTBROWSER_METADATA_TAB',
            'COM_SMARTBROWSER_ACTIVATE_USER', 'COM_SMARTBROWSER_NEW_USER', 'COM_SMARTBROWSER_DELETE', 'COM_SMARTBROWSER_REMOVE_FROM_GROUP', 'COM_SMARTBROWSER_CONFIRM_REMOVE_FROM_GROUP', 'COM_SMARTBROWSER_FLAT_VIEW', 'COM_SMARTBROWSER_MAX_LEVELS', 'COM_SMARTBROWSER_TAGS_ROOT', 'COM_SMARTBROWSER_NEW_ARTICLE', 'COM_SMARTBROWSER_ALL_ARTICLES',
            'COM_SMARTBROWSER_ADAPTER_MEDIA', 'COM_SMARTBROWSER_ADAPTER_ARTICLES', 'COM_SMARTBROWSER_ADAPTER_FLAT_ARTICLES',
            'COM_SMARTBROWSER_ADAPTER_CATEGORIES', 'COM_SMARTBROWSER_ADAPTER_TAGS', 'COM_SMARTBROWSER_ADAPTER_ARTICLES_BY_TAG',
            'COM_SMARTBROWSER_ADAPTER_MENUS', 'COM_SMARTBROWSER_ADAPTER_USERS', 'COM_SMARTBROWSER_ACTIONS', 'COM_SMARTBROWSER_FOLDER',
            'COM_SMARTBROWSER_TYPE', 'COM_SMARTBROWSER_RESOURCE', 'COM_SMARTBROWSER_SOURCE_TIMEZONE',
            'COM_SMARTBROWSER_CHECKOUT', 'COM_SMARTBROWSER_SELECT_STATUS', 'COM_SMARTBROWSER_SELECT_FEATURED',
            'COM_SMARTBROWSER_SELECT_ACCESS', 'COM_SMARTBROWSER_SELECT_LANGUAGE', 'COM_SMARTBROWSER_SELECT_AUTHOR', 'COM_SMARTBROWSER_SELECT_TAG',
            'COM_SMARTBROWSER_SELECT_CHECKOUT', 'COM_SMARTBROWSER_FILTER_ALL', 'COM_SMARTBROWSER_FILTER_PUBLISHED',
            'COM_SMARTBROWSER_FILTER_UNPUBLISHED', 'COM_SMARTBROWSER_FILTER_ARCHIVED', 'COM_SMARTBROWSER_FILTER_TRASHED',
            'COM_SMARTBROWSER_ACTION_TRASH', 'COM_SMARTBROWSER_ACTION_RESTORE', 'COM_SMARTBROWSER_ACTION_UNPUBLISH', 'COM_SMARTBROWSER_ACTION_ARCHIVE', 'COM_SMARTBROWSER_ACTION_UNARCHIVE', 'COM_SMARTBROWSER_ACTION_CHECKIN', 'COM_SMARTBROWSER_STATE_TRASHED',
            'COM_SMARTBROWSER_FILTER_FEATURED', 'COM_SMARTBROWSER_FILTER_UNFEATURED', 'COM_SMARTBROWSER_FILTER_CHECKED_OUT',
            'COM_SMARTBROWSER_FILTER_NOT_CHECKED_OUT',
            'COM_SMARTBROWSER_OPEN_JOOMLA_MANAGER',
            'COM_SMARTBROWSER_BACK_TO_DASHBOARD', 'COM_SMARTBROWSER_DASHBOARD',
            'JAUTHOR', 'JCATEGORY', 'JFIELD_LANGUAGE_LABEL', 'JGRID_HEADING_ORDERING', 'JSTATUS', 'JTOOLBAR_PUBLISH',
            'JFEATURE', 'JUNFEATURE', 'JALL', 'JARCHIVED', 'JPUBLISHED', 'JUNPUBLISHED', 'JACTION_DELETE', 'JACTION_EDIT', 'JCLEAR', 'JOPTION_NO_USER',
            'JFEATURED', 'JUNFEATURED', 'JFIELD_ACCESS_LABEL', 'COM_SMARTBROWSER_ALIAS_LABEL', 'JGLOBAL_EMAIL', 'JGLOBAL_FIELD_ID_LABEL', 'JTAG',
        ];
    }
}
