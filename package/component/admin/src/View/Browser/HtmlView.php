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
        $integrated = $input->getBool('integrated', false) && $input->getCmd('mode', 'manage') === 'manage';
        $adapter = $input->getCmd('adapter', '');
        $component = $integrated
            ? match ($adapter) {
                'articles', 'flat-articles', 'categories', 'flat-categories', 'articles-by-tag', 'flat-articles-by-tag' => 'com_content',
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
            'categories', 'flat-categories' => [Text::sprintf('COM_CATEGORIES_CATEGORIES_TITLE', Text::_('COM_CONTENT')), 'folder categories content-categories'],
            'tags', 'flat-tags' => [Text::_('COM_TAGS_MANAGER_TAGS'), 'tags'],
            'menus', 'flat-menus' => [$input->getString('nativeMenuTitle')
                ? Text::sprintf('COM_MENUS_VIEW_ITEMS_MENU_TITLE', htmlspecialchars($input->getString('nativeMenuTitle'), ENT_QUOTES, 'UTF-8'))
                : Text::_('COM_MENUS_VIEW_ITEMS_ALL_TITLE'), 'list menumgr'],
            'users', 'flat-users' => [Text::_('COM_USERS_VIEW_USERS_TITLE'), 'users user'],
            'media', 'flat-media' => [Text::_('COM_MEDIA'), 'images mediamanager'],
            default => ['SuperSoftJx - SmartBrowser', 'folder-open'],
        } : ['SuperSoftJx - SmartBrowser', 'folder-open'];
        ToolbarHelper::title($title, $icon);
        if ($component !== 'com_smartbrowser'
            && ComponentHelper::getParams('com_smartbrowser')->get('hide_component_menu', 0)
            && ($this->getCurrentUser()->authorise('core.admin', 'com_smartbrowser')
                || $this->getCurrentUser()->authorise('core.options', 'com_smartbrowser'))) {
            ToolbarHelper::preferences('com_smartbrowser', alt: 'COM_SMARTBROWSER_OPTIONS_BUTTON');
        }
        if ($this->getCurrentUser()->authorise('core.admin', $component)
            || $this->getCurrentUser()->authorise('core.options', $component)) {
            ToolbarHelper::preferences($component);
        }

        (new BrowserViewSupport(Factory::getApplication()))->prepare($this->getDocument());
        parent::display($tpl);
    }
}
