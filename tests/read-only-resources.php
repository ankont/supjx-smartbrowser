<?php
namespace Joomla\CMS\Application { interface CMSApplicationInterface {} }
namespace Joomla\CMS\Language { class Text { public static function _($key) { return $key; } } }
namespace Joomla\CMS\Categories {
    class CategoryNode {
        public int $id = 2;
        public int $access = 1;
        public int $published = 1;
        public ?self $parent = null;
        public function getParent() { return $this->parent; }
    }
}
namespace {
define('_JEXEC', 1);
require_once __DIR__ . '/../package/component/admin/src/Support/ResourceDescriptor.php';
$base = __DIR__ . '/../package/component/admin/src/';
foreach (['Adapter/ResourceAdapterInterface.php', 'Adapter/BrowseRootAwareInterface.php', 'Adapter/ReadableResourceAdapterInterface.php',
    'Adapter/ReadVisibility.php', 'Adapter/ContentAdapter.php', 'Adapter/AdapterRegistry.php', 'Support/CollectionResources.php',
    'Support/ReadOnlyResources.php', 'Support/SelectionFieldValue.php', 'Support/SelectionFieldSupport.php'] as $file) require $base . $file;
use SuperSoft\Component\Smartbrowser\Administrator\Adapter\ContentAdapter;
use SuperSoft\Component\Smartbrowser\Administrator\Adapter\AdapterRegistry;
use SuperSoft\Component\Smartbrowser\Administrator\Support\CollectionResources;
use SuperSoft\Component\Smartbrowser\Administrator\Support\ReadOnlyResources;
$identity = new class {
    public bool $guest = true;
    public array $levels = [1];
    public function getAuthorisedViewLevels() { return $this->levels; }
    public function authorise(...$args) { return false; }
};
$app = new class($identity) implements \Joomla\CMS\Application\CMSApplicationInterface {
    public function __construct(public object $identity) {}
    public function getIdentity() { return $this->identity; }
};
$adapter = new class($app) extends ContentAdapter {
    public object $article;
    public \Joomla\CMS\Categories\CategoryNode $category;
    public function __construct($app) {
        $this->app = $app;
        $this->category = new \Joomla\CMS\Categories\CategoryNode();
        $this->article = (object) ['id'=>1, 'catid'=>2, 'state'=>1, 'access'=>1];
    }
    public function getId(): string { return 'articles'; }
    public function getResources(string $id, array $options = []): array { return []; }
    public function getActions(array $selection = []): array { return []; }
    public function executeAction(string $action, array $selection, array $payload = []): mixed { return null; }
    protected function contentModel(string $name): object {
        return new class($this->article) {
            public function __construct(private object $article) {}
            public function getItem($id) { return $id === 1 ? $this->article : null; }
        };
    }
    protected function getCategory(int $id): \Joomla\CMS\Categories\CategoryNode { return $this->category; }
    protected function normalizeArticle(object $article): array {
        return ['id'=>'article:1', 'title'=>'Public title', 'image'=>'public.jpg', 'capabilities'=>['edit'=>true],
            'metadata'=>['id'=>1,'email'=>'private@example.test','checkedOutBy'=>'Private','alias'=>'public'], 'overlays'=>[['private'=>true]]];
    }
};
$check = static function ($condition, $message) { if (!$condition) throw new \RuntimeException($message); };
$denied = static function ($callback) use ($check) {
    try { $callback(); } catch (\RuntimeException $error) { $check(in_array($error->getCode(), [403,404]), 'Wrong denial'); return; }
    throw new \RuntimeException('Expected visibility denial');
};
foreach ([true, false] as $guest) {
    $identity->guest = $guest;
    $resource = $adapter->getReadableResource('article:1');
    $check($resource['title'] === 'Public title', 'Public resource rejected');
    $check(!isset($resource['metadata']['email']) && !$resource['capabilities'] && !$resource['overlays'], 'Private descriptor leaked');
}
$adapter->article->access = 9;
$denied(fn () => $adapter->getReadableResource('article:1'));
$identity->levels = [1,9];
$check($adapter->getReadableResource('article:1')['title'] === 'Public title', 'Special access rejected');
$identity->levels = [1]; $adapter->article->access = 1;
foreach ([0,2,-2] as $state) { $adapter->article->state = $state; $denied(fn () => $adapter->getReadableResource('article:1')); }
$adapter->article->state = 1;
$adapter->article->publish_up = '2999-01-01 00:00:00'; $denied(fn () => $adapter->getReadableResource('article:1'));
$adapter->article->publish_up = ''; $adapter->article->publish_down = '2000-01-01 00:00:00'; $denied(fn () => $adapter->getReadableResource('article:1'));
$adapter->article->publish_down = '';
$adapter->category->parent = new \Joomla\CMS\Categories\CategoryNode();
$adapter->category->parent->access = 9; $denied(fn () => $adapter->getReadableResource('article:1'));
$adapter->category->parent = null;
$entries = CollectionResources::entries([['adapter'=>'articles','id'=>'article:1'], ['adapter'=>'categories','id'=>'category:9']]);
$resources = CollectionResources::resolveEntries($entries, fn ($id, $ids) => ['resources'=> $id === 'articles' ? [$adapter->getReadableResource($ids[0])] : [CollectionResources::unavailable($ids[0])]]);
$check(count($resources) === 2 && empty($resources[0]['unavailable']) && $resources[1]['unavailable'], 'Mixed order/visibility failed');
$denied(fn () => $adapter->getReadableResource('article:999'));
$identity->guest = true;
$registry = new AdapterRegistry($app);
$denied(fn () => $registry->get('articles'));
$check(ReadOnlyResources::resolve($registry, 'unknown-provider', ['private:/image.jpg'])[0]['unavailable'], 'Unknown provider opened');
$config = \SuperSoft\Component\Smartbrowser\Administrator\Support\SelectionFieldSupport::configuration([
    'allowed_adapters'=>['media'], 'selection_profile'=>'{"visual.thumbnailOverride":true}',
]);
$raw = '{"version":1,"items":[{"selection":{"adapter":"media","id":"local-files:/public.pdf"},"usage":{"visual.thumbnailOverride":{"adapter":"media","id":"private:/cover.jpg"}}}]}';
$prepared = \SuperSoft\Component\Smartbrowser\Administrator\Support\SelectionFieldSupport::prepare($raw, $config,
    static fn ($reference) => $reference['id'] === 'private:/cover.jpg' ? CollectionResources::unavailable($reference['id']) : [
        'id'=>$reference['id'], 'type'=>'document', 'image'=>'public-fallback.jpg', 'metadata'=>[],
        'selectionCapabilities'=>[['key'=>'visual.thumbnailOverride', 'type'=>'resource', 'visualRole'=>'thumbnail',
            'picker'=>['adapter'=>'media','allowedResourceTypes'=>['image']]]],
    ], true);
$check($prepared['items'][0]['effectiveThumbnail'] === 'public-fallback.jpg', 'Restricted thumbnail did not fall back');
$check(!str_contains(json_encode($prepared), 'Private title'), 'Restricted metadata leaked');
echo "Read-only resource visibility, identities, mixed ordering and Picker ACL OK\n";
}
