<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter;

defined('_JEXEC') or die;

final class FlatLevels
{
    public static function limit(array $options): int
    {
        $value = (string) ($options['filters']['maxLevels'] ?? '');
        return preg_match('/^[1-9][0-9]*$/', $value) ? min((int) $value, 100) : 0;
    }

    public static function filter(): array
    {
        return [
            'id' => 'maxLevels', 'label' => 'COM_SMARTBROWSER_MAX_LEVELS',
            'type' => 'select', 'default' => '',
            'options' => array_merge([['value' => '', 'label' => 'COM_SMARTBROWSER_SELECT_MAX_LEVELS']], array_map(
                static fn (int $level): array => ['value' => (string) $level, 'label' => (string) $level],
                range(1, 10)
            )),
        ];
    }
}
