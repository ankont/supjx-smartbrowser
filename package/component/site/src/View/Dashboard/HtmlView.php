<?php

namespace SuperSoft\Component\Smartbrowser\Site\View\Dashboard;

use Joomla\CMS\Factory;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use SuperSoft\Component\Smartbrowser\Administrator\Support\BrowserViewSupport;
use SuperSoft\Component\Smartbrowser\Administrator\Support\DashboardProvider;

defined('_JEXEC') or die;

final class HtmlView extends BaseHtmlView
{
    public array $items = [];
    public bool $browserMode = false;

    public function display($tpl = null): void
    {
        $app = Factory::getApplication();
        $app->getLanguage()->load('com_smartbrowser', JPATH_ADMINISTRATOR, null, true);
        $params = $app->getParams();
        $this->browserMode = $params->get('display_mode', 'dashboard') === 'browser';

        if ($this->browserMode) {
            $input = $app->getInput();
            foreach (['adapter', 'mode', 'browseRoot', 'showContextResources', 'defaultView', 'allowedResourceTypes', 'showAdapterSwitcher'] as $name) {
                if ($input->getString($name, '') === '' && $params->get($name, '') !== '') $input->set($name, $params->get($name));
            }
            (new BrowserViewSupport($app))->prepare($this->getDocument());
        } else {
            $this->getDocument()->getWebAssetManager()->useStyle('com_smartbrowser.app');
            $this->items = (new DashboardProvider($app))->items($params);
        }

        parent::display($tpl);
    }
}
