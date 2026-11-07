<?php
namespace Joomla\CMS\Language { class Text { public static function _($key) { return $key; } } }
namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter {
    class FixtureCategory {
        public function __construct(public int $id, public int $level, public array $path, public array $children = [], public int $access = 1, public string $title = '') { $this->title = 'Category ' . $id; }
        public function getChildren($recursive = false): array {
            $result = [];
            foreach ($this->children as $id) { $child = ArticleCollectionAdapter::$categories[$id]; $result[] = $child; if ($recursive) array_push($result, ...$child->getChildren(true)); }
            return $result;
        }
        public function getPath(): array { return array_fill_keys($this->path, true); }
    }
    abstract class ArticleCollectionAdapter {
        protected ?string $browseRoot = null;
        public static array $categories = [];
        public array $queries = [];
        protected object $app;
        public function __construct() { $this->app = new class { public function getIdentity() { return new class { public function authorise(...$args) { return false; } }; } }; }
        public function configureBrowseRoot($root) { $this->browseRoot = $root; }
        protected function categoryRoot() { return self::$categories[1]; }
        protected function getCategory($id) { $node = self::$categories[$id] ?? null; if (!$node || !$this->canViewCategory($node)) throw new \RuntimeException('Unavailable', 403); return $node; }
        protected function canViewCategory($node) { return $node->access === 1; }
        protected function categoryId($id) { if ($id === static::ROOT_ID) return 0; if (!preg_match('/^category:([1-9][0-9]*)$/D', $id, $match)) throw new \InvalidArgumentException('Invalid', 400); return (int) $match[1]; }
        protected function browseRootNumericId() { return (int) substr($this->browseRoot ?? '', 9); }
        protected function categoryWithinBrowseRoot($id) { $root = $this->getCategory($this->browseRootNumericId()); return $id === $root->id || in_array($id, array_column($root->getChildren(true), 'id'), true); }
        public function assertBrowseScope($ids) { foreach ($ids as $id) if ($this->browseRoot && $id !== static::ROOT_ID && !$this->categoryWithinBrowseRoot($this->categoryId($id))) throw new \RuntimeException('Outside scope', 403); }
        protected function normalizeCategory($node) { return ['id' => 'category:' . $node->id, 'title' => $node->title, 'kind' => 'node', 'type' => 'category', 'navigable' => true]; }
        protected function title($title) { return $title; }
        protected function categoryCapabilities($id) { return ['newArticle' => false]; }
        protected function articleActions() { return []; }
        protected function articlePresentation(...$args) { return ['columns' => [], 'infoFields' => [], 'sortFields' => [], 'filters' => [['id' => 'featured'], ['id' => 'category']]]; }
        protected function categoryOptions(...$args) { return []; }
        protected function getAllArticles($options) { $this->queries[] = ['ids' => null, 'options' => $options]; return []; }
        public function resolveArticles($options, $ids) { $this->queries[] = ['ids' => $ids, 'options' => $options]; return []; }
    }
}
namespace {
    define('_JEXEC', 1);
    require __DIR__ . '/../package/component/admin/src/Adapter/FlatLevels.php';
    require __DIR__ . '/../package/component/admin/src/Adapter/FlatArticleAdapter.php';
    require __DIR__ . '/../package/component/admin/src/Adapter/FeaturedArticleAdapter.php';
    use SuperSoft\Component\Smartbrowser\Administrator\Adapter\ArticleCollectionAdapter as Base;
    use SuperSoft\Component\Smartbrowser\Administrator\Adapter\FixtureCategory as Node;
    use SuperSoft\Component\Smartbrowser\Administrator\Adapter\FeaturedArticleAdapter as Featured;
    function check($value, $message) { if (!$value) throw new \RuntimeException($message); }
    Base::$categories = [1 => new Node(1, 0, [], [10, 20, 90]), 10 => new Node(10, 1, [10], [11, 12]), 11 => new Node(11, 2, [10, 11], [13]), 12 => new Node(12, 2, [10, 12], [], 2), 13 => new Node(13, 3, [10, 11, 13]), 20 => new Node(20, 1, [20]), 90 => new Node(90, 1, [90], [], 2)];
    $adapter = new Featured();
    $root = $adapter->getResources('featured-articles:root');
    check(array_column($root['nodes'], 'id') === ['category:10', 'category:20'], 'Root tree must contain accessible categories');
    check($root['presentation']['navigationOnlyNodes'] === true, 'Tree nodes must not enter the article results');
    check(end($adapter->queries)['options']['filters']['featured'] === '1', 'Featured-only filter must remain forced');
    $options = ['filters' => ['state' => 'all', 'category' => '', 'tag' => '7']];
    $branch = $adapter->getResources('category:10', $options);
    check(end($adapter->queries)['ids'] === [10, 11, 13], 'Tree must include recursive accessible descendants');
    check($options['filters']['category'] === '' && end($adapter->queries)['options']['filters']['tag'] === '7', 'Tree must preserve independent filters');
    check(array_column($branch['nodes'], 'id') === ['category:11'], 'Tree must omit inaccessible children');
    check(array_column($adapter->getBreadcrumb('category:13'), 'id') === ['featured-articles:root', 'category:10', 'category:11', 'category:13'], 'Breadcrumb must retain featured root and category path');
    $adapter->getResources('category:10', ['filters' => ['category' => '11']]);
    check(end($adapter->queries)['ids'] === [11, 13], 'Dropdown scope must intersect the tree');
    $queries = count($adapter->queries);
    $disjoint = $adapter->getResources('category:10', ['filters' => ['category' => '20']]);
    check(count($adapter->queries) === $queries && $disjoint['items'] === [], 'Disjoint scopes must not query all articles');
    $adapter->getResources('category:10', ['filters' => ['maxLevels' => '1']]);
    check(end($adapter->queries)['ids'] === [10], 'Depth filter must apply from the selected category');
    $adapter->configureBrowseRoot('category:10');
    check($adapter->getInitialNode('category:13') === 'category:13', 'Valid category URL must reopen');
    check($adapter->getInitialNode('category:20') === 'featured-articles:root', 'Out-of-scope URL must fall back');
    try { $adapter->getResources('category:20'); throw new \RuntimeException('Outside scope accepted'); } catch (\RuntimeException $error) { check($error->getCode() === 403, 'Browse-root restrictions must remain enforced'); }
    $adapter->getResources('featured-articles:root');
    check(end($adapter->queries)['options']['filters']['featured'] === '1', 'Returning to root must retain featured-only filtering');
    echo "Featured category tree, recursive filtering, independent filters and access scope OK\n";
}
