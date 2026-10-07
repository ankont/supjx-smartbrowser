<?php
namespace Joomla\CMS\Plugin {
    class CMSPlugin { public object $app; protected function getApplication(): object { return $this->app; } }
}
namespace Joomla\Event { interface SubscriberInterface {} }
namespace Joomla\CMS\Uri { final class Uri { public static function isInternal($url): bool { return str_starts_with($url, '/administrator/'); } } }
namespace {
    define('_JEXEC', 1);
    require __DIR__ . '/../package/plugins/system/smartbrowserintegration/src/Extension/Smartbrowserintegration.php';
    $input = new class {
        public array $values = []; public string $method = 'GET'; public object $post;
        public function __construct() { $this->post = new class { public array $values = []; public function getString($key) { return $this->values[$key] ?? ''; } }; }
        public function getCmd($key, $default = '') { return $this->values[$key] ?? $default; }
        public function getMethod(): string { return $this->method; }
    };
    $app = new class($input) {
        public array $state = []; public ?string $redirected = null;
        public function __construct(public object $input) {}
        public function isClient($client): bool { return $client === 'administrator'; }
        public function getInput(): object { return $this->input; }
        public function setUserState($key, $value): void { $this->state[$key] = $value; }
        public function getUserState($key) { return $this->state[$key] ?? null; }
        public function redirect($url): void { $this->redirected = $url; }
    };
    $plugin = new \SuperSoft\Plugin\System\Smartbrowserintegration\Extension\Smartbrowserintegration(); $plugin->app = $app;
    $return = '/administrator/index.php?option=com_smartbrowser&view=browser&adapter=menus&node=menu:mainmenu';
    foreach (['item.apply', 'item.save2copy', 'item.save', 'item.cancel'] as $task) {
        $input->method = 'POST'; $input->values = ['option' => 'com_menus', 'task' => $task];
        $input->post->values = ['sbReturn' => base64_encode($return)]; $plugin->returnFromMenuEditor();
        $input->method = 'GET'; $input->values = ['option' => 'com_menus', 'view' => 'item']; $plugin->returnFromMenuEditor();
        if ($app->getUserState('com_smartbrowser.menu_editor_return') !== $return) throw new \RuntimeException('Editor return lost during apply/error form reload');
        $input->values = ['option' => 'com_menus', 'view' => 'items']; $plugin->returnFromMenuEditor();
        if ($app->redirected !== $return || $app->getUserState('com_smartbrowser.menu_editor_return') !== null) throw new \RuntimeException('Native list return not consumed');
    }
    $app->redirected = null; $input->method = 'POST'; $input->values = ['option' => 'com_menus', 'task' => 'item.save'];
    $input->post->values = ['sbReturn' => base64_encode('https://evil.test/?option=com_smartbrowser&view=browser')]; $plugin->returnFromMenuEditor();
    if ($app->getUserState('com_smartbrowser.menu_editor_return') !== null) throw new \RuntimeException('External redirect accepted');
    echo "Menu editor apply/copy/save/cancel, reload and guarded returns OK\n";
}
