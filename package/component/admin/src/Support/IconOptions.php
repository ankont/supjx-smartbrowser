<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;
use Joomla\CMS\Component\ComponentHelper;
defined('_JEXEC') or die;

final class IconOptions
{
    public const DEFAULTS = [
        'media' => ['adapter' => 'fas fa-photo-video', 'node' => 'fas fa-folder', 'open' => 'fas fa-folder-open', 'item' => 'fas fa-file', 'image' => 'fas fa-file-image', 'video' => 'fas fa-file-video', 'audio' => 'fas fa-file-audio', 'pdf' => 'fas fa-file-pdf', 'word' => 'fas fa-file-word', 'excel' => 'fas fa-file-excel', 'powerpoint' => 'fas fa-file-powerpoint', 'archive' => 'fas fa-file-archive', 'code' => 'fas fa-file-code', 'text' => 'fas fa-file-alt'],
        'articles' => ['adapter' => 'fas fa-book-open', 'node' => 'fas fa-box', 'open' => 'fas fa-box-open', 'item' => 'fas fa-newspaper'],
        'flat-articles' => ['adapter' => 'fas fa-book-open', 'node' => 'fas fa-box', 'open' => 'fas fa-box-open', 'item' => 'fas fa-newspaper'],
        'featured-articles' => ['adapter' => 'fas fa-star', 'node' => 'fas fa-star', 'open' => 'fas fa-star', 'item' => 'fas fa-newspaper'],
        'categories' => ['adapter' => 'fas fa-boxes', 'node' => 'fas fa-box', 'open' => 'fas fa-box-open', 'item' => 'fas fa-newspaper'],
        'menus' => ['adapter' => 'fas fa-diagram-next', 'node' => 'fas fa-diagram-predecessor', 'open' => 'fas fa-diagram-successor', 'item' => 'fas fa-diagram-predecessor', 'heading' => 'fas fa-list', 'heading_node' => 'fas fa-diagram-predecessor', 'heading_open' => 'fas fa-diagram-successor', 'separator' => 'fas fa-minus'],
        'tags' => ['adapter' => 'fas fa-hashtag', 'node' => 'fas fa-tag', 'open' => 'fas fa-tags', 'item' => 'fas fa-tag'],
        'articles-by-tag' => ['adapter' => 'fas fa-hashtag', 'node' => 'fas fa-tag', 'open' => 'fas fa-tags', 'item' => 'fas fa-newspaper'],
        'users' => ['adapter' => 'fas fa-users', 'node' => 'fas fa-users-rectangle', 'open' => 'fas fa-users-viewfinder', 'item' => 'fas fa-user'],
    ];
    private static ?array $saved = null;

    public static function normalize(mixed $value): array
    {
        if (is_string($value)) $value = json_decode($value, true);
        if (!is_array($value)) return [];
        $result = [];
        foreach (self::DEFAULTS as $adapter => $roles) foreach ($roles as $role => $default) {
            $icon = $value[$adapter][$role] ?? '';
            if (!is_string($icon)) continue;
            $icon = trim($icon);
            if (preg_match('/^fa-[a-z0-9-]+$/', $icon)) $icon = 'fas ' . $icon;
            if (preg_match('/^(?:fas|far|fab|fa-solid|fa-regular|fa-brands) fa-[a-z0-9-]+$/', $icon) && $icon !== $default) $result[$adapter][$role] = $icon;
        }
        return $result;
    }

    public static function forAdapter(string $adapter, ?array $saved = null): array
    {
        $adapter = match ($adapter) { 'flat-categories' => 'categories', 'flat-media' => 'media', default => $adapter };
        if ($saved === null) {
            self::$saved ??= class_exists(ComponentHelper::class) ? self::normalize(ComponentHelper::getParams('com_smartbrowser')->get('icon_profiles', [])) : [];
            $saved = self::$saved;
        }
        return array_replace(self::DEFAULTS[$adapter] ?? self::DEFAULTS['media'], $saved[$adapter] ?? []);
    }

    public static function resource(array $resource, string $adapter, ?array $saved = null): array
    {
        $adapter = match ($adapter) { 'flat-categories' => 'categories', 'flat-media' => 'media', default => $adapter };
        $defaults = self::DEFAULTS[$adapter] ?? self::DEFAULTS['media'];
        $icons = self::forAdapter($adapter, $saved);
        $icon = $resource['icon'] ?? '';
        $role = ($resource['kind'] ?? 'node') === 'item' ? 'item' : 'node';
        if ($adapter === 'menus' && ($resource['type'] ?? '') === 'menu-item') {
            foreach (['heading', 'heading_node', 'separator'] as $special) {
                if ($special === 'heading_node' && ($resource['metadata']['menuItemKind'] ?? '') !== 'heading') continue;
                if ($icon === $defaults[$special]) { $role = $special; break; }
            }
        }
        if ($icon === $defaults[$role]) {
            $resource['icon'] = $icons[$role];
            if (in_array($role, ['node', 'heading_node'], true)) {
                $resource['closedIcon'] = $icons[$role];
                $resource['openIcon'] = $icons[$role === 'heading_node' ? 'heading_open' : 'open'];
            }
        } elseif ($adapter === 'media' && ($resource['kind'] ?? '') === 'item') {
            foreach ($defaults as $type => $default) {
                if (in_array($type, ['adapter', 'node', 'open', 'item'], true) || $icon !== $default) continue;
                $resource['icon'] = $icons[$type]; break;
            }
        }
        return $resource;
    }
}
