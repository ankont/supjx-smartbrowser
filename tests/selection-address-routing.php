<?php
namespace Joomla\CMS\Application { interface CMSApplicationInterface {} }
namespace Joomla\CMS\Categories {
    class CategoryNode {
        public int $id = 7, $access = 1, $published = 1;
        public function getParent() { return null; }
    }
}
namespace Joomla\Component\Content\Site\Helper {
    class RouteHelper {
        public static array $calls = [];
        public static function getArticleRoute($id, $catid, $language) { self::$calls[] = [$id, $catid, $language]; return 'routed-article'; }
        public static function getCategoryRoute($id, $language) { self::$calls[] = [$id, $language]; return 'routed-category'; }
    }
}
namespace Joomla\CMS\Router {
    class Route {
        public static array $calls = [];
        public static function link($client, $route, $xhtml, $tls, $absolute) {
            self::$calls[] = [$client, $route, $xhtml, $tls, $absolute];
            return 'https://example.org/real-menu-context/' . $route;
        }
    }
}
namespace {
    define('_JEXEC', 1);
    $base = __DIR__ . '/../package/component/admin/src/';
    foreach (['Adapter/ResourceAdapterInterface.php', 'Adapter/BrowseRootAwareInterface.php', 'Adapter/ReadableResourceAdapterInterface.php', 'Adapter/ReadVisibility.php', 'Adapter/ContentAdapter.php'] as $file) require $base . $file;
    $app = new class implements \Joomla\CMS\Application\CMSApplicationInterface {
        public function getIdentity() { return new class { public function getAuthorisedViewLevels() { return [1]; } }; }
    };
    $adapter = new class($app) extends \SuperSoft\Component\Smartbrowser\Administrator\Adapter\ContentAdapter {
        public \Joomla\CMS\Categories\CategoryNode $category;
        public function __construct($app) { $this->app = $app; $this->category = new \Joomla\CMS\Categories\CategoryNode(); }
        public function getId(): string { return 'articles'; }
        public function getResources(string $id, array $options = []): array { return []; }
        public function getActions(array $selection = []): array { return []; }
        public function executeAction(string $action, array $selection, array $payload = []): mixed { return null; }
        protected function getCategory(int $id): \Joomla\CMS\Categories\CategoryNode { return $this->category; }
    };
    $method = new \ReflectionMethod(\SuperSoft\Component\Smartbrowser\Administrator\Adapter\ContentAdapter::class, 'selectionPublicUrl');
    $record = (object) ['id' => 43, 'alias' => 'actual-alias', 'catid' => 7, 'language' => 'el-GR', 'state' => 1, 'access' => 1];
    $url = $method->invoke($adapter, $record, true);
    if ($url !== 'https://example.org/real-menu-context/routed-article') throw new \RuntimeException('Frontend router result not used');
    if (\Joomla\Component\Content\Site\Helper\RouteHelper::$calls[0] !== ['43:actual-alias', 7, 'el-GR']) throw new \RuntimeException('Article route context lost');
    if (\Joomla\CMS\Router\Route::$calls[0] !== ['site', 'routed-article', false, 0, true]) throw new \RuntimeException('Not an absolute site route');
    $record->state = 0;
    if ($method->invoke($adapter, $record, true) !== '') throw new \RuntimeException('Unpublished public URL fabricated');
    $record->state = 1; $adapter->category->published = 0;
    if ($method->invoke($adapter, $record, true) !== '') throw new \RuntimeException('Unpublished category public URL fabricated');
    $adapter->category->published = 1; $record->access = 9;
    if ($method->invoke($adapter, $record, true) !== '') throw new \RuntimeException('Private public URL fabricated');
    echo "Selection addresses delegate public URLs to Joomla site routing with category, language and publication context OK\n";
}
