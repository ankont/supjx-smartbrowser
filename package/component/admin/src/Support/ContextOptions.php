<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

use Joomla\CMS\Component\ComponentHelper;

defined('_JEXEC') or die;

final class ContextOptions
{
    public static function enabled(string $adapterId, bool $site): bool
    {
        if (!in_array($adapterId, ['categories', 'tags', 'menus'], true)) return false;

        return (bool) ComponentHelper::getParams('com_smartbrowser')->get(
            'context_' . $adapterId . ($site ? '_site' : '_admin'),
            0
        );
    }
}
