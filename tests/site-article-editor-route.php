<?php
namespace Joomla\CMS\Application { interface CMSApplicationInterface {} }
namespace Joomla\CMS\Router {
    class Route {
        public static string $last = '';
        public static function _($url, ...$args) {
            self::$last = $url;
            return '/library/sources/article.html';
        }
    }
}
namespace {
    define('_JEXEC', 1);
    require __DIR__ . '/fixtures/article-routing.php';
    require __DIR__ . '/../package/component/admin/src/Support/SiteArticleEditorRoute.php';
    $app = new class implements \Joomla\CMS\Application\CMSApplicationInterface {
        public string $menuComponent = 'com_content';
        public function getInput() { return new class { public function getInt($key) { return 23; } }; }
        public function getMenu($client) {
            return new class($this->menuComponent) {
                public function __construct(private string $component) {}
                public function getItem($id) { return (object) ['query'=>['option'=>$this->component]]; }
            };
        }
    };
    $route = \SuperSoft\Component\Smartbrowser\Administrator\Support\SiteArticleEditorRoute::class;
    $url = $route::editor($app, 69, 11, '*', ['task'=>'editor.save']);
    parse_str(parse_url($url, PHP_URL_QUERY), $query);
    if (parse_url($url, PHP_URL_PATH) !== '/library/sources/article.html'
        || $query['a_id'] !== '69' || $query['sbEditor'] !== '1' || $query['task'] !== 'editor.save'
        || !str_contains(\Joomla\CMS\Router\Route::$last, '&Itemid=23')) throw new \RuntimeException('Article editor lost route/context');
    $url = $route::link($app, 69, 11, '*', ['task'=>'article.edit', 'a_id'=>69, 'sbNative'=>1]);
    parse_str(parse_url($url, PHP_URL_QUERY), $query);
    if ($query['a_id'] !== '69' || $query['task'] !== 'article.edit' || isset($query['sbEditor'])) throw new \RuntimeException('Native fallback lost identity or retained SmartBrowser mode');
    $app->menuComponent = 'com_smartbrowser';
    $route::editor($app, 69, 11, '*');
    if (str_contains(\Joomla\CMS\Router\Route::$last, 'Itemid=')) throw new \RuntimeException('Unrelated component menu reused');
    echo "Article SEF path, menu context, save route and native a_id fallback OK\n";
}
