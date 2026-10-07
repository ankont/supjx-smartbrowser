<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

defined('_JEXEC') or die;

final class MediaSelectionCapabilities
{
    public static function forResource(bool $isNode, string $mime): array
    {
        if ($isNode) return [];
        if (str_starts_with($mime, 'image/')) return [
            ['key' => 'media.alt', 'type' => 'string', 'editor' => 'text', 'label' => 'COM_SMARTBROWSER_USAGE_ALT', 'default' => '', 'validation' => ['maxLength' => 2048]],
            ['key' => 'media.decorative', 'type' => 'boolean', 'editor' => 'boolean', 'label' => 'COM_SMARTBROWSER_USAGE_DECORATIVE', 'default' => false],
            ['key' => 'media.loading', 'type' => 'string', 'editor' => 'select', 'label' => 'COM_SMARTBROWSER_USAGE_LOADING', 'default' => 'auto', 'options' => [
                ['value' => 'auto', 'label' => 'COM_SMARTBROWSER_USAGE_AUTO'],
                ['value' => 'lazy', 'label' => 'COM_SMARTBROWSER_USAGE_LAZY'],
                ['value' => 'eager', 'label' => 'COM_SMARTBROWSER_USAGE_EAGER'],
            ]],
        ];
        if ($mime === 'application/pdf') return [
            ['key' => 'media.thumbnailOverride', 'type' => 'resource', 'editor' => 'resource', 'label' => 'COM_SMARTBROWSER_USAGE_THUMBNAIL', 'default' => null,
                'pickerLabel' => 'COM_SMARTBROWSER_USAGE_PICK_IMAGE', 'picker' => ['adapter' => 'media', 'selectionTarget' => 'item', 'allowedResourceTypes' => ['image']]],
        ];
        return [];
    }
}
