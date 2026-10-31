<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

use Joomla\CMS\Component\ComponentHelper;

defined('_JEXEC') or die;

final class BrowserDefaults
{
    public static function states(): array
    {
        $params = ComponentHelper::getParams('com_smartbrowser');
        $values = $params->get('default_resource_states', [0, 2]);
        if (is_string($values)) $values = explode(',', $values);
        $legacy = array_map('intval', (array) $values);
        $states = [1];
        if ((int) $params->get('default_unpublished', in_array(0, $legacy, true) ? 1 : 0)) $states[] = 0;
        if ((int) $params->get('default_archived', in_array(2, $legacy, true) ? 1 : 0)) $states[] = 2;
        return $states;
    }
}
