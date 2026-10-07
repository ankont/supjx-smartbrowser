<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

use Joomla\CMS\Application\CMSApplicationInterface;
use Joomla\CMS\Language\Text;
use Joomla\Registry\Registry;
use SuperSoft\Component\Smartbrowser\Administrator\Adapter\AdapterRegistry;

defined('_JEXEC') or die;

final class DashboardProvider
{
    public function __construct(private readonly CMSApplicationInterface $app) {}

    public function items(?Registry $params = null): array
    {
        $items = [];
        foreach ((new AdapterRegistry($this->app))->descriptors() as $adapter) {
            $id = (string) $adapter['id'];
            if ($id === 'flat-articles') continue;
            if ($params && !$params->get('show_' . str_replace('-', '_', $id), 1)) continue;

            $items[] = [
                'label' => (string) $adapter['title'],
                'icon' => (string) $adapter['icon'],
                'description' => Text::_('COM_SMARTBROWSER_DASHBOARD_' . strtoupper(str_replace('-', '_', $id)) . '_DESC'),
                'adapter' => $id,
                'mode' => 'manage',
                'browseRoot' => null,
                'visible' => true,
                'url' => DashboardRoute::link($this->app, 'index.php?option=com_smartbrowser&view=browser&adapter=' . rawurlencode($id) . '&mode=manage&fromDashboard=1'),
            ];
        }

        return $items;
    }
}
