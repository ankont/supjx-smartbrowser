<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;
use Joomla\CMS\Application\CMSApplicationInterface;
use Joomla\CMS\Router\Route;
use Joomla\CMS\Uri\Uri;
use Joomla\Component\Content\Site\Helper\RouteHelper;
defined('_JEXEC') or die;

final class SiteArticleEditorRoute
{
    public static function link(CMSApplicationInterface $app, int $id, int $categoryId, string $language, array $query = []): string
    {
        $base = RouteHelper::getArticleRoute($id, $categoryId, $language);
        $itemId = $app->getInput()->getInt('Itemid');
        $item = $itemId > 0 ? $app->getMenu('site')->getItem($itemId) : null;
        if (($item->query['option'] ?? '') === 'com_content') $base .= '&Itemid=' . $itemId;
        $uri = new Uri(Route::_($base, false));
        foreach ($query as $key => $value) $uri->setVar($key, $value);
        return $uri->toString();
    }

    public static function editor(CMSApplicationInterface $app, int $id, int $categoryId, string $language, array $query = []): string
    {
        return self::link($app, $id, $categoryId, $language, array_replace([
            'sbEditor' => 1, 'a_id' => $id, 'sbpage' => 1, 'layout' => 'modal',
        ], $query));
    }
}
