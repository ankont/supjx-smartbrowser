<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

use Joomla\CMS\Component\ComponentHelper;

defined('_JEXEC') or die;

final class ContextOptions
{
    public static function enabled(string $adapterId, bool $site): bool
    {
        if (!in_array($adapterId, ['categories', 'tags', 'menus'], true)) return false;
        $personal = 'inherit';
        if (class_exists(UserViewPreferences::class)) {
            $byAdapter = UserViewPreferences::option('contextItemsByAdapter', []);
            $personal = is_array($byAdapter) && isset($byAdapter[$adapterId]) ? $byAdapter[$adapterId] : UserViewPreferences::option('contextItems', 'inherit');
        }
        if (in_array($personal, ['show', 'hide'], true)) return $personal === 'show';

        return (bool) ComponentHelper::getParams('com_smartbrowser')->get(
            'context_' . $adapterId . ($site ? '_site' : '_admin'),
            0
        );
    }
}
