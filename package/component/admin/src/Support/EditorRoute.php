<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;
use Joomla\CMS\Application\CMSApplicationInterface;
use Joomla\CMS\Router\Route;
defined('_JEXEC') or die;
final class EditorRoute
{
    public static function link(CMSApplicationInterface $app, string $administratorUrl): string
    {
        parse_str((string) parse_url($administratorUrl, PHP_URL_QUERY), $query);
        $option = (string) ($query['option'] ?? '');
        if (!$app->isClient('site')) {
            $newForms = [
                'com_content:article.add' => ['article', 'modal', 'com_content.edit.article.data'],
                'com_categories:category.add' => ['category', 'modal', 'com_categories.edit.category.data'],
                'com_tags:tag.add' => ['tag', 'edit', 'com_tags.edit.tag.data'],
                'com_menus:item.add' => ['item', 'modal', 'com_menus.edit.item.data'],
                'com_users:user.add' => ['user', 'edit', 'com_users.edit.user.data'],
            ];
            $newForm = $newForms[$option . ':' . ($query['task'] ?? '')] ?? null;
            if ($newForm !== null) {
                [$view, $layout, $stateKey] = $newForm;
                $app->setUserState($stateKey, null);
                if ($option === 'com_menus') {
                    foreach (['type', 'link'] as $key) $app->setUserState('com_menus.edit.item.' . $key, null);
                    $app->setUserState('com_menus.edit.item.parent_id', (int) ($query['parent_id'] ?? 1));
                    $app->setUserState($stateKey, ['id' => null, 'parent_id' => (int) ($query['parent_id'] ?? 1), 'menutype' => (string) ($query['menutype'] ?? '')]);
                }
                if ($option === 'com_users' && (int) ($query['sbGroupId'] ?? 0) > 0) {
                    $app->setUserState($stateKey, ['groups' => [(int) $query['sbGroupId']]]);
                }
                unset($query['task']);
                $query['view'] = $view;
                $query['layout'] = $layout;
                $query['tmpl'] = 'component';
                return AdministratorRoute::link($app, 'index.php?' . http_build_query($query, '', '&', PHP_QUERY_RFC3986));
            }
            return AdministratorRoute::link($app, $administratorUrl . '&layout=modal&tmpl=component');
        }
        $type = match ($option) {
            'com_content' => 'article', 'com_categories' => 'category', 'com_tags' => 'tag',
            'com_menus' => 'menu-item', 'com_users' => 'user', default => null,
        };
        if ($type === null) throw new \RuntimeException('No frontend editor is available for this resource.', 501);
        $url = 'index.php?option=com_smartbrowser&view=editor&layout=modal&tmpl=component&Itemid=0&type=' . $type . '&id=' . (int) ($query['id'] ?? 0);
        foreach (['extension', 'parent_id', 'menutype', 'catid', 'sbTagId', 'sbGroupId'] as $key) if (isset($query[$key]) && $query[$key] !== '') $url .= '&' . $key . '=' . rawurlencode((string) $query[$key]);
        return Route::_($url, false);
    }

}
