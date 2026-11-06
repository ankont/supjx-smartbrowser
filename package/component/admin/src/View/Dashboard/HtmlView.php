<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\View\Dashboard;

use Joomla\CMS\Factory;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use Joomla\CMS\Toolbar\ToolbarHelper;
use SuperSoft\Component\Smartbrowser\Administrator\Support\DashboardProvider;

defined('_JEXEC') or die;

final class HtmlView extends BaseHtmlView
{
    public array $items = [];

    public function display($tpl = null): void
    {
        ToolbarHelper::title('SuperSoftJx - SmartBrowser', 'sb-brand');
        $this->getDocument()->setTitle('SmartBrowser Dashboard');
        $title = htmlspecialchars(\Joomla\CMS\Language\Text::_('COM_SMARTBROWSER_DASHBOARD'), ENT_QUOTES, 'UTF-8');
        $this->getDocument()->getToolbar()->customButton('smartbrowser-dashboard-title')->html('<h2 class="sb-dashboard-toolbar-title"><span class="icon-sb-brand" aria-hidden="true"></span>' . $title . '</h2>');
        if ($this->getCurrentUser()->authorise('core.options', 'com_smartbrowser')) ToolbarHelper::preferences('com_smartbrowser');
        $this->getDocument()->getWebAssetManager()->useStyle('com_smartbrowser.app');
        $this->getDocument()->getWebAssetManager()->registerAndUseStyle('com_smartbrowser.identity', 'com_smartbrowser/identity.css', ['version'=>'auto']);
        $this->items = (new DashboardProvider(Factory::getApplication()))->items();
        parent::display($tpl);
    }
}
