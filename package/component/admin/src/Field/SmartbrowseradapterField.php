<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Field;

use Joomla\CMS\Factory;
use Joomla\CMS\Form\Field\ListField;
use Joomla\CMS\HTML\HTMLHelper;
use SuperSoft\Component\Smartbrowser\Administrator\Adapter\AdapterRegistry;

defined('_JEXEC') or die;

final class SmartbrowseradapterField extends ListField
{
    protected $type = 'Smartbrowseradapter';
    protected function getOptions(): array
    {
        $app = Factory::getApplication();
        $app->getLanguage()->load('com_smartbrowser', JPATH_ADMINISTRATOR, null, true);
        $options = [];
        foreach ((new AdapterRegistry($app))->descriptors() as $adapter) {
            if (str_starts_with($adapter['id'], 'flat-')) continue;
            $options[] = HTMLHelper::_('select.option', $adapter['id'], $adapter['title']);
        }
        foreach ((array) $this->value as $value) if ($value && !in_array($value, array_column($options, 'value'), true)) $options[] = HTMLHelper::_('select.option', $value, $value);
        return $options;
    }
}
