<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\View\Browser;

use Joomla\CMS\Factory;
use Joomla\CMS\Component\ComponentHelper;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Toolbar\ToolbarHelper;
use SuperSoft\Component\Smartbrowser\Administrator\Support\BrowserViewSupport;

defined('_JEXEC') or die;

final class HtmlView extends BaseHtmlView
{
    public function display($tpl = null): void
    {
        $app = Factory::getApplication();
        $app->getLanguage()->load('com_smartbrowser', JPATH_ADMINISTRATOR, null, true);
        $input = $app->getInput();
        $adapter = $input->getCmd('adapter', 'media');
        if ($adapter === 'flat-articles' && $input->getBool('featuredOnly')) $adapter = 'featured-articles';
        $integrated = \SuperSoft\Component\Smartbrowser\Administrator\Support\IntegrationOptions::browserEnabled($adapter, true, $input->getCmd('mode', 'manage'));
        $options = (new BrowserViewSupport($app))->prepare($this->getDocument());
        $this->getDocument()->getWebAssetManager()->registerAndUseStyle('com_smartbrowser.identity', 'com_smartbrowser/identity.css', ['version'=>'auto']);
        $menuTitle = $input->getString('browseRoot') !== '' ? ($options['roots'][0]['title'] ?? '') : '';
        $component = $integrated
            ? match ($adapter) {
                'articles', 'flat-articles', 'featured-articles', 'categories', 'flat-categories', 'articles-by-tag', 'flat-articles-by-tag' => 'com_content',
                'tags', 'flat-tags' => 'com_tags',
                'menus', 'flat-menus' => 'com_menus',
                'users', 'flat-users' => 'com_users',
                'media', 'flat-media' => 'com_media',
                default => 'com_smartbrowser',
            }
            : 'com_smartbrowser';
        if ($integrated && $component !== 'com_smartbrowser') $app->getLanguage()->load($component, JPATH_ADMINISTRATOR, null, true);
        if ($adapter === 'categories' || $adapter === 'flat-categories') $app->getLanguage()->load('com_categories', JPATH_ADMINISTRATOR, null, true);
        [$title, $icon] = $integrated ? match ($adapter) {
            'articles', 'flat-articles', 'articles-by-tag', 'flat-articles-by-tag' => [Text::_('COM_CONTENT_ARTICLES_TITLE'), 'copy article'],
            'featured-articles' => [Text::_('COM_SMARTBROWSER_ADAPTER_FEATURED_ARTICLES'), 'star'],
            'categories', 'flat-categories' => [Text::sprintf('COM_CATEGORIES_CATEGORIES_TITLE', Text::_('COM_CONTENT')), 'folder categories content-categories'],
            'tags', 'flat-tags' => [Text::_('COM_TAGS_MANAGER_TAGS'), 'tags'],
            'menus', 'flat-menus' => [$menuTitle !== ''
                ? Text::sprintf('COM_MENUS_VIEW_ITEMS_MENU_TITLE', htmlspecialchars($menuTitle, ENT_QUOTES, 'UTF-8'))
                : Text::_('COM_MENUS_VIEW_ITEMS_ALL_TITLE'), 'list menumgr'],
            'users', 'flat-users' => [Text::_('COM_USERS_VIEW_USERS_TITLE'), 'users user'],
            'media', 'flat-media' => [Text::_('COM_MEDIA'), 'images mediamanager'],
            default => ['SuperSoftJx - SmartBrowser', 'folder-open'],
        } : ['SuperSoftJx - SmartBrowser', 'folder-open'];
        ToolbarHelper::title($title, $icon);
        $toolbar = $this->getDocument()->getToolbar();
        if (!empty($options['nativeToolbarTarget'])) {
            $toolbar->customButton('smartbrowser-intro')->html('<div id="sb-native-intro"></div><div id="sb-native-manager"></div>');
            $toolbar->customButton('smartbrowser-actions')->html('<div id="sb-native-actions"></div>');
        }
        if ($this->getCurrentUser()->authorise('core.admin', 'com_smartbrowser')
            || $this->getCurrentUser()->authorise('core.options', 'com_smartbrowser')) {
            $label = htmlspecialchars(Text::_('COM_SMARTBROWSER_OPTIONS_BUTTON'), ENT_QUOTES, 'UTF-8');
            $return = rawurlencode(base64_encode((string) \Joomla\CMS\Uri\Uri::getInstance()));
            $toolbar->customButton('smartbrowser-options')->html('<a class="btn btn-outline-secondary sb-options-icon" href="index.php?option=com_config&amp;view=component&amp;component=com_smartbrowser&amp;return=' . $return . '" title="' . $label . '" aria-label="' . $label . '"><span class="icon-sb-brand" aria-hidden="true"></span><span class="sb-options-label">' . $label . '</span></a>');
        }
        if ($component !== 'com_smartbrowser' && ($this->getCurrentUser()->authorise('core.admin', $component)
            || $this->getCurrentUser()->authorise('core.options', $component))) {
            ToolbarHelper::preferences($component);
        }

        parent::display($tpl);
    }
}
