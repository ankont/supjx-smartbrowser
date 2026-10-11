<?php
namespace SuperSoft\Component\Smartbrowser\Site\View\Editor;
use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use Joomla\CMS\Language\Text;
use SuperSoft\Component\Smartbrowser\Administrator\Support\SiteAuthentication;
use SuperSoft\Component\Smartbrowser\Site\Service\FrontendEditorService;
defined('_JEXEC') or die;
class HtmlView extends BaseHtmlView
{
    public $editorForm = null;
    public $editorTitle = '';
    public $resourceType = '';
    public $resourceId = 0;
    public string $menuItemType = '';
    public $editorComplete = false;
    public string $editorError = '';

    public function display($tpl = null): void
    {
        $app = Factory::getApplication();
        if ($app->isClient('administrator')) {
            $app->getInput()->set('hidemainmenu', true);
        }
        if ($app->getIdentity()->guest) {
            $app->redirect(SiteAuthentication::loginUrl());
            $app->close();
        }
        $app->getLanguage()->load('com_smartbrowser', JPATH_ADMINISTRATOR, null, true);
        $this->editorComplete = $app->getInput()->getBool('done');
        if ($this->editorComplete && $app->getInput()->getBool('sbpage')) {
            $encoded = $app->getInput()->getString('sbReturn');
            $return = strlen($encoded) <= 4096 ? base64_decode($encoded, true) : false;
            if ($return && \Joomla\CMS\Uri\Uri::isInternal($return)) {
                $app->redirect($return);
                $app->close();
            }
        }
        $this->resourceType = $app->getInput()->getCmd('type');
        $this->resourceId = $app->getInput()->getInt('id');
        if (!$this->editorComplete) {
            $service = new FrontendEditorService($app);
            $this->editorForm = $service->getForm($this->resourceType, $this->resourceId);
            if ($app->isClient('site') && $this->resourceType === 'article' && $this->resourceId > 0
                && $app->getInput()->getBool('sbpage') && !$app->getInput()->getBool('sbEditor')) {
                $url = \SuperSoft\Component\Smartbrowser\Administrator\Support\SiteArticleEditorRoute::editor(
                    $app, $this->resourceId, (int) $this->editorForm->getValue('catid'), (string) $this->editorForm->getValue('language', null, '*'),
                    ['sbReturn' => $app->getInput()->getString('sbReturn')]
                );
                $app->redirect($url);
                $app->close();
            }
            $failure = $app->getUserState('com_smartbrowser.editor.failure');
            $app->setUserState('com_smartbrowser.editor.failure', null);
            if (is_array($failure) && ($failure['type'] ?? '') === $this->resourceType && (int) ($failure['id'] ?? -1) === $this->resourceId) {
                $this->editorError = (string) ($failure['message'] ?? '');
                if (is_array($failure['data'] ?? null)) $this->editorForm->bind($failure['data']);
            }
            $this->editorTitle = $service->title($this->resourceType, $this->resourceId);
            if ($this->resourceType === 'user') {
                $this->editorForm->setValue('password', null, '');
                $this->editorForm->setValue('password2', null, '');
            }
            if ((!in_array($this->resourceType, ['article', 'category'], true)
                || ($app->isClient('administrator') && in_array($this->resourceType, ['article', 'category'], true)))
                && $this->editorForm->getFieldset('item_associations')) {
                Text::script('JGLOBAL_ASSOC_NOT_POSSIBLE');
                Text::script('JGLOBAL_ASSOCIATIONS_RESET_WARNING');
                $document = $this->getDocument();
                $document->getWebAssetManager()->getRegistry()->addExtensionRegistryFile('com_associations');
                $document->getWebAssetManager()->useScript('com_smartbrowser.associations');
                $document->addScriptOptions('system.associations.edit', [
                    'formControl' => $this->editorForm->getFormControl(),
                    'hidden' => (int) ($this->editorForm->getValue('language', null, '*') === '*'),
                ]);
            }
            if ($this->resourceType === 'menu-item') {
                $selectedType = $app->getInput()->getBool('menuTypeSelected') ? $app->getInput()->getCmd('selectedType') : '';
                $this->menuItemType = $selectedType !== '' ? $selectedType : $service->storedMenuItemType($this->resourceId);
            }
        }
        HTMLHelper::_('behavior.keepalive');
        \SuperSoft\Component\Smartbrowser\Administrator\Support\ImageSelectorSupport::prepare($this->getDocument());
        HTMLHelper::_('behavior.formvalidator');
        $this->getDocument()->getWebAssetManager()->getRegistry()->addExtensionRegistryFile('com_smartbrowser');
        $this->getDocument()->getWebAssetManager()
            ->useStyle('com_smartbrowser.editor')
            ->useScript('com_smartbrowser.editor-fields');
        if ($app->isClient('administrator') && $this->resourceType === 'article'
            && $app->getInput()->getBool('sbpage') && !$this->editorComplete) {
            \Joomla\CMS\Toolbar\ToolbarHelper::title(Text::_($this->resourceId > 0 ? 'COM_CONTENT_PAGE_EDIT_ARTICLE' : 'COM_CONTENT_PAGE_ADD_ARTICLE'), 'pencil-alt article');
            \Joomla\CMS\Toolbar\ToolbarHelper::custom('smartbrowser.apply', 'save', '', 'JTOOLBAR_APPLY', false);
            \Joomla\CMS\Toolbar\ToolbarHelper::custom('smartbrowser.save', 'save', '', 'JTOOLBAR_SAVE', false);
            if ($this->resourceId > 0) \Joomla\CMS\Toolbar\ToolbarHelper::custom('smartbrowser.copy', 'copy', '', 'JTOOLBAR_SAVE_AS_COPY', false);
            \Joomla\CMS\Toolbar\ToolbarHelper::custom('smartbrowser.cancel', 'times', '', 'JCLOSE', false);
            if ($this->resourceId > 0) {
                if (\Joomla\CMS\Component\ComponentHelper::getParams('com_content')->get('save_history', 0)
                    && \Joomla\CMS\Component\ComponentHelper::isEnabled('com_contenthistory')) {
                    \Joomla\CMS\Toolbar\ToolbarHelper::versions('com_content.article', $this->resourceId);
                }
                $url = \Joomla\CMS\Router\Route::link('site', \Joomla\Component\Content\Site\Helper\RouteHelper::getArticleRoute(
                    $this->resourceId, (int) $this->editorForm->getValue('catid'), (string) $this->editorForm->getValue('language', null, '*')
                ), false);
                Text::script('COM_SMARTBROWSER_EDITOR_MAXIMIZE');
                Text::script('COM_SMARTBROWSER_EDITOR_RESTORE');
                $this->getDocument()->getToolbar()->preview($url, 'JGLOBAL_PREVIEW', false)
                    ->popupType('iframe')->modalWidth('90vw')->modalHeight('90vh');
            }
        }
        if ($app->isClient('administrator') && $this->resourceType === 'category'
            && $app->getInput()->getBool('sbpage') && !$this->editorComplete) {
            $extension = $app->getInput()->getCmd('extension', 'com_content');
            $app->getLanguage()->load('com_categories', JPATH_ADMINISTRATOR, null, true);
            $titleKey = $extension . '_CATEGORY_' . ($this->resourceId > 0 ? 'EDIT' : 'ADD') . '_TITLE';
            $categoryTitle = $app->getLanguage()->hasKey($titleKey) ? Text::_($titleKey)
                : Text::_('COM_CATEGORIES_CATEGORY_BASE_' . ($this->resourceId > 0 ? 'EDIT' : 'ADD') . '_TITLE');
            \Joomla\CMS\Toolbar\ToolbarHelper::title($categoryTitle, 'folder');
            \Joomla\CMS\Toolbar\ToolbarHelper::custom('smartbrowser.apply', 'save', '', 'JTOOLBAR_APPLY', false);
            \Joomla\CMS\Toolbar\ToolbarHelper::custom('smartbrowser.save', 'save', '', 'JTOOLBAR_SAVE', false);
            \Joomla\CMS\Toolbar\ToolbarHelper::custom('smartbrowser.cancel', 'times', '', 'JCLOSE', false);
            if ($this->resourceId > 0 && \Joomla\CMS\Component\ComponentHelper::getParams($extension)->get('save_history', 0)
                && \Joomla\CMS\Component\ComponentHelper::isEnabled('com_contenthistory')) {
                \Joomla\CMS\Toolbar\ToolbarHelper::versions($extension . '.category', $this->resourceId);
            }
        }
        if ($app->isClient('administrator') && in_array($this->resourceType, ['tag', 'menu-item', 'user'], true)
            && $app->getInput()->getBool('sbpage') && !$this->editorComplete) {
            $new = $this->resourceId === 0;
            [$title, $icon] = match ($this->resourceType) {
                'tag' => [$new ? 'COM_TAGS_MANAGER_TAG_NEW' : 'COM_TAGS_MANAGER_TAG_EDIT', 'tag'],
                'menu-item' => [$new ? 'COM_MENUS_VIEW_NEW_ITEM_TITLE' : 'COM_MENUS_VIEW_EDIT_ITEM_TITLE', 'list'],
                'user' => [$new ? 'COM_USERS_VIEW_NEW_USER_TITLE' : 'COM_USERS_VIEW_EDIT_USER_TITLE', 'user'],
            };
            \Joomla\CMS\Toolbar\ToolbarHelper::title(Text::_($title), $icon);
            \Joomla\CMS\Toolbar\ToolbarHelper::custom('smartbrowser.apply', 'save', '', 'JTOOLBAR_APPLY', false);
            \Joomla\CMS\Toolbar\ToolbarHelper::custom('smartbrowser.save', 'save', '', 'JTOOLBAR_SAVE', false);
            \Joomla\CMS\Toolbar\ToolbarHelper::custom('smartbrowser.cancel', 'times', '', 'JCLOSE', false);
            if ($this->resourceType === 'tag' && !$new && \Joomla\CMS\Component\ComponentHelper::getParams('com_tags')->get('save_history', 0)
                && \Joomla\CMS\Component\ComponentHelper::isEnabled('com_contenthistory')) {
                \Joomla\CMS\Toolbar\ToolbarHelper::versions('com_tags.tag', $this->resourceId);
            }
        }
        parent::display($tpl);
    }
}
