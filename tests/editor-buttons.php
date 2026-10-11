<?php
namespace Joomla\Event { interface SubscriberInterface {} final class Priority { const LOW = -2; } }
namespace Joomla\CMS\Plugin { class CMSPlugin { public static $app; protected function getApplication() { return self::$app; } } }
namespace Joomla\CMS\Component { final class ComponentHelper { public static array $params = []; public static function getParams($name) { return new class { public function get($key, $default = null) { return ComponentHelper::$params[$key] ?? $default; } }; } } }
namespace Joomla\CMS\Uri { final class Uri { public static function root() { return 'https://site.test/'; } } }
namespace Joomla\CMS\Session { final class Session { public static function getFormToken() { return 'token'; } } }
namespace Joomla\CMS\Log { final class Log { const ERROR = 1; public static function add(...$args) { throw new \RuntimeException($args[0]); } } }
namespace {
    define('_JEXEC', 1);
    require __DIR__ . '/../package/component/admin/src/Support/IntegrationOptions.php';
    require __DIR__ . '/../package/plugins/system/smartbrowserintegration/src/Extension/Smartbrowserintegration.php';
    $assets = new class {
        public array $used = [];
        public function getRegistry() { return $this; }
        public function addExtensionRegistryFile($name) {}
        public function useStyle($name) { return $this; }
        public function useScript($name) { $this->used[] = $name; return $this; }
    };
    $document = new class($assets) {
        public function __construct(public $assets) {}
        public function getWebAssetManager() { return $this->assets; }
        public function addScriptOptions(...$args) {}
    };
    \Joomla\CMS\Plugin\CMSPlugin::$app = new class($document) {
        public function __construct(public $document) {}
        public function getDocument() { return $this->document; }
        public function isClient($name) { return $name === 'administrator'; }
    };
    $button = fn ($name) => new class($name) {
        public string $action = 'native';
        public function __construct(public string $name) {}
        public function getButtonName() { return $this->name; }
        public function set($key, $value) { $this->$key = $value; }
    };
    $media = $button('image'); $article = $button('article'); $menu = $button('menu'); $other = $button('readmore');
    $registry = new class([$media, $article, $menu, $other]) { public function __construct(public array $buttons) {} public function getAll() { return $this->buttons; } };
    $event = new class($registry) { public function __construct(public $registry) {} public function getButtonsRegistry() { return $this->registry; } };
    $plugin = new \SuperSoft\Plugin\System\Smartbrowserintegration\Extension\Smartbrowserintegration();
    $plugin->replaceEditorButtons($event);
    if ($assets->used || $media->action !== 'native') throw new \RuntimeException('Disabled integration changed native buttons');
    \Joomla\CMS\Component\ComponentHelper::$params = ['replace_editor_media' => 1, 'replace_editor_articles' => 1];
    $plugin->replaceEditorButtons($event);
    if ($media->action !== 'smartbrowser-media' || $article->action !== 'smartbrowser-article' || $other->action !== 'native') throw new \RuntimeException('Wrong button replacement');
    foreach ([$media, $article, $menu] as $native) $native->action = 'native';
    \Joomla\CMS\Component\ComponentHelper::$params = ['replace_editor_media'=>1, 'replace_editor_articles'=>1, 'replace_editor_menus'=>1];
    $plugin->replaceEditorButtons($event);
    if ($media->action !== 'smartbrowser-media' || $article->action !== 'smartbrowser-article' || $menu->action !== 'smartbrowser-menu') throw new \RuntimeException('Independent editor toggles failed');
    foreach ([$media, $article, $menu] as $native) $native->action = 'native';
    \Joomla\CMS\Component\ComponentHelper::$params = ['replace_media'=>1, 'replace_articles'=>1, 'replace_menus'=>1, 'replace_editor_media'=>0, 'replace_editor_articles'=>0, 'replace_editor_menus'=>0];
    $plugin->replaceEditorButtons($event);
    if ($media->action !== 'native' || $article->action !== 'native' || $menu->action !== 'native') throw new \RuntimeException('Editor exclusions failed');
    \Joomla\CMS\Component\ComponentHelper::$params = ['replace_all'=>1];
    $plugin->replaceEditorButtons($event);
    if ($menu->action !== 'smartbrowser-menu' || $article->action !== 'smartbrowser-article' || $media->action !== 'smartbrowser-media') throw new \RuntimeException('Replace all failed');
    $registry->buttons = [];
    $plugin->replaceEditorButtons($event);
    if ($registry->buttons) throw new \RuntimeException('Created unauthorised button');
    echo "Editor button integration gates, native ACL visibility and unrelated buttons OK\n";
}
