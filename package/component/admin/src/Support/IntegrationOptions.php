<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;
use Joomla\CMS\Component\ComponentHelper;
defined('_JEXEC') or die;

final class IntegrationOptions
{
    public static function enabled(string $key, ?object $params = null): bool
    {
        $params ??= ComponentHelper::getParams('com_smartbrowser');
        return (bool) $params->get('replace_all', 0) || (string) $params->get($key, '0') === '1';
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
