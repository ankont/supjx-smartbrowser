<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

use Joomla\CMS\Application\CMSApplicationInterface;
use Joomla\CMS\Router\Route;

defined('_JEXEC') or die;

final class DashboardRoute
{
    public static function link(CMSApplicationInterface $app, string $url): string
    {
        if ($app->isClient('site')) {
            $menu = $app->getMenu();
            $active = $menu->getActive();
            $items = $active ? [$active] : [];
            foreach ($menu->getItems('component', 'com_smartbrowser') ?: [] as $item) {
                if ($item !== $active) $items[] = $item;
            }

            foreach ($items as $item) {
                if (($item->query['option'] ?? '') !== 'com_smartbrowser'
                    || ($item->query['view'] ?? 'dashboard') !== 'dashboard'
                    || $item->getParams()->get('display_mode', 'dashboard') !== 'dashboard') continue;

                $url .= '&Itemid=' . (int) $item->id;
                break;
            }
        }

        return Route::_($url, false);
    }
}
