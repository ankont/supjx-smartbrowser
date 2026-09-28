<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;
use Joomla\CMS\Application\CMSApplicationInterface;
use Joomla\CMS\Router\Route;
defined('_JEXEC') or die;
final class EditorRoute
{
    public static function link(CMSApplicationInterface $app, string $administratorUrl): string
    {
        if (!$app->isClient('site')) return AdministratorRoute::link($app, $administratorUrl . '&layout=modal&tmpl=component');
        parse_str((string) parse_url($administratorUrl, PHP_URL_QUERY), $query);
        $option = (string) ($query['option'] ?? '');
        $type = match ($option) {
            'com_content' => 'article', 'com_categories' => 'category', 'com_tags' => 'tag',
            'com_menus' => 'menu-item', 'com_users' => 'user', default => null,
        };
        if ($type === null) throw new \RuntimeException('No frontend editor is available for this resource.', 501);
        $url = 'index.php?option=com_smartbrowser&view=editor&layout=modal&tmpl=component&Itemid=0&type=' . $type . '&id=' . (int) ($query['id'] ?? 0);
        foreach (['extension', 'parent_id', 'menutype', 'catid'] as $key) if (isset($query[$key]) && $query[$key] !== '') $url .= '&' . $key . '=' . rawurlencode((string) $query[$key]);
        return Route::_($url, false);
    }

}
