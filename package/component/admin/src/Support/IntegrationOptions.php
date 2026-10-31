<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;
use Joomla\CMS\Component\ComponentHelper;
use Joomla\CMS\Plugin\PluginHelper;
defined('_JEXEC') or die;

final class IntegrationOptions
{
    public static function browserEnabled(string $adapter, bool $administrator, string $mode = 'manage', ?object $params = null): bool
    {
        if (!$administrator || $mode !== 'manage' || !PluginHelper::isEnabled('system', 'smartbrowserintegration')) return false;
        $key = match (preg_replace('/^flat-/', '', $adapter)) {
            'articles', 'articles-by-tag' => 'replace_articles', 'featured-articles' => 'replace_featured_articles',
            'categories' => 'replace_categories', 'tags' => 'replace_tags', 'menus' => 'replace_menus',
            'users' => 'replace_users', 'media' => 'replace_media', default => null,
        };
        return $key !== null && self::enabled($key, $params);
    }

    public static function enabled(string $key, ?object $params = null): bool
    {
        $params ??= ComponentHelper::getParams('com_smartbrowser');
        return ($key !== 'hide_component_menu' && (bool) $params->get('replace_all', 0)) || (string) $params->get($key, '0') === '1';
    }

    public static function editorKey(string $type, bool $site): ?string
    {
        if ($site) return $type === 'article' ? 'replace_editor_article_site' : null;
        return match ($type) {
            'article' => 'replace_editor_article_admin', 'category' => 'replace_editor_category_admin',
            'tag' => 'replace_editor_tag_admin', 'menu-item' => 'replace_editor_menu_admin',
            'user' => 'replace_editor_user_admin', default => null,
        };
    }
}
