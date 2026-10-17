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
            if (($resource['type'] ?? '') === 'article' && !in_array('article.displayedName', $keys, true)) $definitions[] = [
                'key' => 'article.displayedName', 'type' => 'string', 'editor' => 'text', 'default' => null, 'icon' => 'fas fa-font',
                'label' => 'COM_SMARTBROWSER_USAGE_DISPLAYED_NAME', 'validation' => ['maxLength' => 255], 'address' => ['name' => 'titleOverride'],
            ];
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
            ['key' => 'visual.presentation', 'type' => 'string', 'editor' => 'select', 'default' => null, 'icon' => 'fas fa-layer-group',
                'label' => 'COM_SMARTBROWSER_USAGE_VISUAL_PRESENTATION', 'address' => ['name' => 'presentation'], 'options' => [
                    ['value' => 'thumbnail', 'label' => 'COM_SMARTBROWSER_USAGE_THUMBNAIL'],
                    ['value' => 'icon', 'label' => 'COM_SMARTBROWSER_USAGE_ICON'],
                    ['value' => 'both', 'label' => 'COM_SMARTBROWSER_USAGE_VISUAL_BOTH'],
                ]],
            ['key' => 'visual.thumbnailOverride', 'type' => 'resource', 'editor' => 'resource', 'visualRole' => 'thumbnail', 'icon' => 'fas fa-image',
                'label' => 'COM_SMARTBROWSER_USAGE_THUMBNAIL', 'default' => null, 'pickerLabel' => 'COM_SMARTBROWSER_USAGE_PICK_IMAGE',
                'address' => ['name' => 'thumbnailOverride', 'codec' => 'joomlaImage', 'alias' => 't'],
                'picker' => ['adapter' => 'media', 'selectionTarget' => 'item', 'allowedResourceTypes' => ['image']]],
            ['key' => 'visual.iconOverride', 'type' => 'string', 'editor' => 'text', 'visualRole' => 'icon', 'icon' => 'fas fa-icons',
                'label' => 'COM_SMARTBROWSER_USAGE_ICON', 'default' => null, 'address' => ['name' => 'iconOverride'],
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

    public static function displayedName(array $resource, array $usage): string
    {
        $name = $usage['article.displayedName'] ?? null;
        return ($resource['type'] ?? '') === 'article' && is_string($name) && trim($name) !== ''
            ? trim($name) : (string) ($resource['title'] ?? '');
    }
}
