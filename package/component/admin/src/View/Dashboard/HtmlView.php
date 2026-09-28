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
        ToolbarHelper::title('SuperSoftJx - SmartBrowser', 'folder-open');
        if ($this->getCurrentUser()->authorise('core.options', 'com_smartbrowser')) ToolbarHelper::preferences('com_smartbrowser');
        $this->getDocument()->getWebAssetManager()->useStyle('com_smartbrowser.app');
        $this->items = (new DashboardProvider(Factory::getApplication()))->items();
        parent::display($tpl);
    }
}
