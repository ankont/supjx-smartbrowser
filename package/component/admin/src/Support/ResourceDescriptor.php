<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

defined('_JEXEC') or die;

final class ResourceDescriptor
{
    public static function complete(array $resource, array $presentation = []): array
    {
        if (!empty($resource['unavailable'])) return $resource;
        if (($resource['selectable'] ?? true) && ($resource['type'] ?? '') !== 'root') {
            $definitions = $resource['selectionCapabilities'] ?? [];
            $keys = array_column($definitions, 'key');
            foreach (self::visualCapabilities() as $definition) if (!in_array($definition['key'], $keys, true)) $definitions[] = $definition;
            $resource['selectionCapabilities'] = $definitions;
        }
        $resource['infoFields'] = array_values(array_filter($presentation['infoFields'] ?? ($resource['infoFields'] ?? []), static function ($field) use ($resource) {
            if (isset($field['kinds']) && !in_array($resource['kind'] ?? '', $field['kinds'], true)) return false;
            $value = $resource;
            foreach (explode('.', $field['source'] ?? '') as $part) $value = is_array($value) ? ($value[$part] ?? null) : null;
            return $value !== null && $value !== '';
        }));
        return $resource;
    }

    public static function visualCapabilities(): array
    {
        return [
            ['key' => 'visual.thumbnailOverride', 'type' => 'resource', 'editor' => 'resource', 'visualRole' => 'thumbnail',
                'label' => 'COM_SMARTBROWSER_USAGE_THUMBNAIL', 'default' => null, 'pickerLabel' => 'COM_SMARTBROWSER_USAGE_PICK_IMAGE',
                'picker' => ['adapter' => 'media', 'selectionTarget' => 'item', 'allowedResourceTypes' => ['image']]],
            ['key' => 'visual.iconOverride', 'type' => 'string', 'editor' => 'text', 'visualRole' => 'icon',
                'label' => 'COM_SMARTBROWSER_USAGE_ICON', 'default' => null,
                'validation' => ['maxLength' => 160, 'pattern' => '^[a-zA-Z0-9_-]+(?: [a-zA-Z0-9_-]+)*$']],
        ];
    }

    public static function effectiveIcon(array $resource, array $usage): ?string
    {
        if (!empty($resource['unavailable'])) return null;
        $override = $usage['visual.iconOverride'] ?? null;
        return is_string($override) && strlen($override) <= 160 && preg_match('/^[a-zA-Z0-9_-]+(?: [a-zA-Z0-9_-]+)*$/D', $override)
            ? $override : ($resource['icon'] ?? 'fas fa-file');
    }
}
