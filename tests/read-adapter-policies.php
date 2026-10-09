<?php
namespace Joomla\CMS\Application { interface CMSApplicationInterface {} }
namespace Joomla\CMS\Language { class Text { public static function _($key) { return $key; } } }
namespace Joomla\CMS\Router { class Route { public static function link($client, $url) { return $url; } } }
namespace Joomla\CMS\Uri { class Uri { public static function root() { return 'https://site.example/'; } } }
namespace Joomla\Database { interface DatabaseInterface {} }
namespace Joomla\CMS {
    class Factory {
        public static object $app;
        public static object $db;
        public static function getApplication() { return self::$app; }
        public static function getContainer() { return new class { public function get($class) { return Factory::$db; } }; }
    }
}
namespace Joomla\CMS\Http {
    class HttpFactory {
        public static int $code = 200;
        public static string $type = 'image/png';
        public static string $length = '7';
        public static string $bytes = 'fixture';
        public static int $requests = 0;
        public static function getHttp($options) {
            if ($options !== ['follow_location'=>false]) throw new \RuntimeException('Unsafe redirect policy');
            return new class {
                public function head($url, $headers, $timeout) {
                    if ($headers || $timeout !== 3) throw new \RuntimeException('Credentials or unbounded timeout');
                    return (object) ['code'=>HttpFactory::$code, 'headers'=>['Content-Type'=>HttpFactory::$type, 'Content-Length'=>HttpFactory::$length]];
                }
            };
        }
    }
}
namespace Joomla\Plugin\Filesystem\Local\Adapter {
    class LocalAdapter {
        public function getUrl($path) { return 'https://site.example/' . ltrim($path, '/'); }
    }
}
namespace Joomla\Component\Media\Administrator\Model {
    class MediaModel {}
    class ApiModel {
        public static object $provider;
        public static bool $missing = false;
        public function getAdapter($name) { return self::$provider; }
        public function getFile($adapter, $path, $options) {
            if (self::$missing) throw new \RuntimeException('Not found', 404);
            return (object) ['type'=>'file', 'name'=>basename($path), 'path'=>$adapter . ':' . $path,
                'mime_type'=>'image/png', 'size'=>7, 'content'=>'PRIVATE CONTENT', 'private'=>'PRIVATE', 'width'=>1,'height'=>1];
        }
    }
}
namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter {
    function fopen($url, $mode, $include, $context) {
        \Joomla\CMS\Http\HttpFactory::$requests++;
        if (!str_starts_with($url,'https://127.0.0.1:443/')) throw new \RuntimeException('Unpinned HTTP destination');
        $options=stream_context_get_options($context)['http'];
        if ($options['method']!=='GET' || $options['follow_location']!==0 || str_contains($options['header'],'Cookie')) throw new \RuntimeException('Unsafe public probe');
        $stream=\fopen('php://temp','w+b'); fwrite($stream,\Joomla\CMS\Http\HttpFactory::$bytes); rewind($stream); return $stream;
    }
    function stream_get_meta_data($stream) {
        return ['timed_out'=>false,'wrapper_data'=>['HTTP/1.1 '.\Joomla\CMS\Http\HttpFactory::$code.' Response',
            'Content-Type: '.\Joomla\CMS\Http\HttpFactory::$type]];
    }
}
namespace {
define('_JEXEC', 1);
require_once __DIR__ . '/../package/component/admin/src/Support/ResourceDescriptor.php';
define('JPATH_ADMINISTRATOR', __DIR__);
$_SERVER['SERVER_ADDR']='127.0.0.1'; $_SERVER['SERVER_PORT']='443';
$temp = sys_get_temp_dir() . '/sb-read-' . bin2hex(random_bytes(5));
mkdir($temp);
// Uri::root() maps to the parent test directory, as on a normal web filesystem.
define('JPATH_ROOT', dirname($temp));
file_put_contents($temp . '/public.png', 'fixture');
$base = __DIR__ . '/../package/component/admin/src/';
foreach (['Adapter/ResourceAdapterInterface.php','Adapter/BrowseRootAwareInterface.php','Adapter/ContextResourceProviderInterface.php',
    'Adapter/ReadableResourceAdapterInterface.php','Adapter/StoredSelectionReadableAdapterInterface.php','Adapter/ReadVisibility.php',
    'Adapter/MediaReadVisibility.php','Adapter/MediaAdapter.php','Adapter/MenuAdapter.php','Adapter/ContentAdapter.php',
    'Adapter/TagAdapter.php','Adapter/UsersAdapter.php','Support/MediaSelectionCapabilities.php','Support/CollectionResources.php',
    'Support/SelectionFieldValue.php','Support/StoredSelectionReadContext.php','Adapter/AdapterRegistry.php','Support/ReadOnlyResources.php'] as $file) require $base . $file;
$identity = new class {
    public int $id = 0;
    public bool $guest = true;
    public array $levels = [1];
    public function authorise(...$args) { return false; }
    public function getAuthorisedViewLevels() { return $this->levels; }
};
$tags = [1=>(object)['id'=>1,'published'=>1,'access'=>1,'parent_id'=>0,'title'=>'ROOT','alias'=>'root'],
    2=>(object)['id'=>2,'published'=>1,'access'=>1,'parent_id'=>1,'title'=>'Public tag','alias'=>'public']];
$menu = new class($identity) {
    public array $items = [];
    public function __construct(private object $identity) {}
    public function getItems($attribute, $id, $first) {
        $item = $this->items[$id] ?? null;
        if (!$item || $item->published !== 1 || !in_array($item->access, $this->identity->levels)
            || ($item->publish_up ?? '') === 'future' || ($item->publish_down ?? '') === 'past') return null;
        return $item;
    }
};
$app = new class($identity, $menu, $tags) implements \Joomla\CMS\Application\CMSApplicationInterface {
    public array $tags;
    private object $input;
    public function __construct(private object $identity, private object $menu, array $tags) {
        $this->tags = $tags;
        $this->input = new class { public function getString($key, $default='') { return $default; } public function set($key,$value) {} };
    }
    public function getIdentity() { return $this->identity; }
    public function getMenu($client) { if ($client !== 'site') throw new \RuntimeException('Wrong menu'); return $this->menu; }
    public function getInput() { return $this->input; }
    public function getLanguage() { return new class { public function load(...$args) {} }; }
    public function bootComponent($component) {
        return new class($this) {
            public function __construct(private object $app) {}
            public function getMVCFactory() { return $this; }
            public function createTable($name,$client) {
                return new class($this->app) {
                    public int $id=0, $published=0, $access=0, $parent_id=0;
                    public string $title='', $alias='';
                    public function __construct(private object $app) {}
                    public function load($id) { if (!isset($this->app->tags[$id])) return false; foreach ((array)$this->app->tags[$id] as $key=>$value) $this->$key=$value; return true; }
                    public function getRootId() { return 1; }
                    public function getPath($id) { $path=[]; while ($id && isset($this->app->tags[$id])) { array_unshift($path,$this->app->tags[$id]); $id=$this->app->tags[$id]->parent_id; } return $path; }
                };
            }
        };
    }
};
\Joomla\CMS\Factory::$app = $app;
$check = static function ($condition, $message) { if (!$condition) throw new \RuntimeException($message); };
$denied = static function ($callback) use ($identity) {
    $identity->id++; // Separate reader/cache scope for each independent denied case.
    try { $callback(); } catch (\Throwable $error) { if (in_array($error->getCode(), [403,404])) return; throw $error; }
    throw new \RuntimeException('Expected unavailable');
};
try {
    \Joomla\Component\Media\Administrator\Model\ApiModel::$provider = new \Joomla\Plugin\Filesystem\Local\Adapter\LocalAdapter();
    $media = new \SuperSoft\Component\Smartbrowser\Administrator\Adapter\MediaAdapter($app);
    // Match the actual local provider's returned URL to the existing on-disk file.
    $mediaPath = '/' . basename($temp) . '/public.png';
    $resource = $media->getReadableResource('local-images:' . $mediaPath);
    $check($resource['type'] === 'image' && isset($resource['metadata']['url']), 'Public guest media failed');
    $check(!isset($resource['metadata']['content']) && !$resource['capabilities'], 'Media private metadata leaked');
    $requests=\Joomla\CMS\Http\HttpFactory::$requests;
    $media->getReadableResource('local-images:'.$mediaPath);
    $check(\Joomla\CMS\Http\HttpFactory::$requests===$requests,'Repeated preparation did not reuse request cache');
    $_SERVER['SERVER_PORT']='9443'; $denied(fn () => $media->getReadableResource('local-images:'.$mediaPath));
    $check(\Joomla\CMS\Http\HttpFactory::$requests===$requests,'Untrusted port was contacted');
    $_SERVER['SERVER_PORT']='443';
    foreach ([403,302,404] as $code) { \Joomla\CMS\Http\HttpFactory::$code=$code; $denied(fn () => $media->getReadableResource('local-images:' . $mediaPath)); }
    \Joomla\CMS\Http\HttpFactory::$code=200;
    \Joomla\CMS\Http\HttpFactory::$type='text/html'; $denied(fn () => $media->getReadableResource('local-images:' . $mediaPath));
    \Joomla\CMS\Http\HttpFactory::$type='image/png';
    \Joomla\CMS\Http\HttpFactory::$bytes='denied!'; $denied(fn () => $media->getReadableResource('local-images:' . $mediaPath));
    \Joomla\CMS\Http\HttpFactory::$bytes='fixture';
    \Joomla\Component\Media\Administrator\Model\ApiModel::$provider = new class { public function getUrl($path) { return 'https://site.example/private.png'; } };
    $denied(fn () => $media->getReadableResource('remote-images:' . $mediaPath));
    \Joomla\Component\Media\Administrator\Model\ApiModel::$missing=true;
    $denied(fn () => $media->getReadableResource('local-images:' . $mediaPath));
    $tagReader = new \SuperSoft\Component\Smartbrowser\Administrator\Adapter\TagAdapter($app);
    $tag = $tagReader->getReadableResource('tag:2');
    $check($tag['title'] === 'Public tag' && str_contains($tag['metadata']['url'], 'com_tags'), 'Public guest tag failed');
    $app->tags[2]->access=9; $denied(fn () => $tagReader->getReadableResource('tag:2'));
    $identity->levels=[1,9]; $check($tagReader->getReadableResource('tag:2')['title'] === 'Public tag', 'Tag special access failed');
    $identity->levels=[1]; $app->tags[2]->access=1; $app->tags[2]->published=0;
    $denied(fn () => $tagReader->getReadableResource('tag:2'));
    $app->tags[2]->published=1; $app->tags[2]->parent_id=3;
    $app->tags[3]=(object)['id'=>3,'published'=>1,'access'=>9,'parent_id'=>1,'title'=>'Private parent','alias'=>'private'];
    $denied(fn () => $tagReader->getReadableResource('tag:2'));
    $menu->items[2]=(object)['id'=>2,'published'=>1,'access'=>1,'parent_id'=>1,'title'=>'Public menu','type'=>'url','link'=>'https://example.org/'];
    $menus = new \SuperSoft\Component\Smartbrowser\Administrator\Adapter\MenuAdapter($app);
    $check($menus->getReadableResource('menu-item:2')['metadata']['url'] === 'https://example.org/', 'Guest menu failed');
    foreach (['publish_up'=>'future','publish_down'=>'past','access'=>9,'published'=>0] as $key=>$value) {
        $old=$menu->items[2]->$key ?? null; $menu->items[2]->$key=$value;
        $denied(fn () => $menus->getReadableResource('menu-item:2')); $menu->items[2]->$key=$old;
    }
    $menu->items[2]->parent_id=3; $menu->items[3]=(object)['id'=>3,'published'=>1,'access'=>9,'parent_id'=>1];
    $denied(fn () => $menus->getReadableResource('menu-item:2'));
    $menu->items[2]->parent_id=1; $menu->items[2]->type='component'; $menu->items[2]->link='index.php?option=com_private&secret=PASSWORD';
    $safe = $menus->getReadableResource('menu-item:2');
    $check($safe['metadata']['url'] === null && !str_contains(json_encode($safe),'PASSWORD'), 'Unknown menu destination leaked');
    $menu->items[4]=new class {
        public int $id=4, $published=1, $access=1, $parent_id=1, $target=3;
        public string $title='Public alias', $type='alias';
        public function getParams() { return new class($this->target) { public function __construct(private int $target) {} public function get($key,$default) { return $this->target; } }; }
    };
    $denied(fn () => $menus->getReadableResource('menu-item:4'));
    $menu->items[4]->target=4; $denied(fn () => $menus->getReadableResource('menu-item:4'));
    $users = new \SuperSoft\Component\Smartbrowser\Administrator\Adapter\UsersAdapter($app);
    $denied(fn () => $users->getReadableResource('user:42'));
    $denied(fn () => $users->getReadableResource('user-group:2'));
    \Joomla\Component\Media\Administrator\Model\ApiModel::$missing=false;
    \Joomla\Component\Media\Administrator\Model\ApiModel::$provider=new \Joomla\Plugin\Filesystem\Local\Adapter\LocalAdapter();
    $app->tags[2]->parent_id=1;
    $menu->items[2]->type='url'; $menu->items[2]->link='https://example.org/';
    $registry=new \SuperSoft\Component\Smartbrowser\Administrator\Adapter\AdapterRegistry($app);
    $entries=\SuperSoft\Component\Smartbrowser\Administrator\Support\CollectionResources::entries([
        ['adapter'=>'media','id'=>'local-images:'.$mediaPath],['adapter'=>'menus','id'=>'menu-item:2'],
        ['adapter'=>'tags','id'=>'tag:2'],['adapter'=>'users','id'=>'user:42'],['adapter'=>'menus','id'=>'menu-item:3'],
    ]);
    $resolved=\SuperSoft\Component\Smartbrowser\Administrator\Support\CollectionResources::resolveEntries($entries,
        fn ($adapter,$ids) => ['resources'=>\SuperSoft\Component\Smartbrowser\Administrator\Support\ReadOnlyResources::resolve($registry,$adapter,$ids)]);
    $check(count($resolved)===5 && empty($resolved[0]['unavailable']) && empty($resolved[1]['unavailable']) && empty($resolved[2]['unavailable'])
        && $resolved[3]['unavailable'] && $resolved[4]['unavailable'],'Mixed adapter visibility/order failed');
    foreach (['media','tags','menus','users'] as $adapter) $denied(fn () => $registry->get($adapter));
    echo "Media, menu and tag guest visibility and safe generic user lookup OK\n";
} finally { unlink($temp . '/public.png'); rmdir($temp); }
}
