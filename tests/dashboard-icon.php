<?php
namespace Joomla\Event { interface SubscriberInterface {} }
namespace Joomla\CMS\Component {
    class ComponentHelper {
        public static bool $show = true;
        public static function getParams($component) { return new class { public function get($key, $default = null) { return ComponentHelper::$show; } }; }
    }
}
namespace Joomla\CMS\Plugin {
    class CMSPlugin { public object $app; protected function getApplication() { return $this->app; } }
}
namespace Joomla\Module\Quickicon\Administrator\Event {
    class QuickIconsEvent {
        public array $arguments = ['result'=>[['existing']]];
        public function __construct(public string $context) {}
        public function getContext() { return $this->context; }
        public function getArgument($key, $default = null) { return $this->arguments[$key] ?? $default; }
        public function setArgument($key, $value) { $this->arguments[$key] = $value; }
    }
}
namespace {
    define('_JEXEC', 1);
    require __DIR__ . '/../package/plugins/system/smartbrowserintegration/src/Extension/Smartbrowserintegration.php';
    $app = new class {
        public bool $administrator = true;
        public object $user;
        public function __construct() {
            $this->user = new class {
                public bool $allowed = true;
                public function authorise($action, $asset) { return $this->allowed && $action === 'core.manage' && $asset === 'com_smartbrowser'; }
            };
        }
        public function isClient($client) { return $client === 'administrator' && $this->administrator; }
        public function getIdentity() { return $this->user; }
    };
    $plugin = new \SuperSoft\Plugin\System\Smartbrowserintegration\Extension\Smartbrowserintegration();
    $plugin->app = $app;
    foreach ([[true,true,'mod_quickicon',true,true], [true,false,'mod_quickicon',true,false],
        [false,true,'mod_quickicon',true,false], [true,true,'update_quickicon',true,false],
        [true,true,'mod_quickicon',false,false]] as [$admin,$allowed,$context,$show,$expected]) {
        \Joomla\CMS\Component\ComponentHelper::$show = $show;
        $app->administrator = $admin; $app->user->allowed = $allowed;
        $event = new \Joomla\Module\Quickicon\Administrator\Event\QuickIconsEvent($context);
        $plugin->dashboardIcon($event);
        $result = $event->getArgument('result');
        if ($result[0] !== ['existing'] || count($result) !== ($expected ? 2 : 1)) throw new \RuntimeException('Quickicon context/access/result boundary');
        if ($expected && ($result[1][0]['text'] !== 'SmartBrowser' || $result[1][0]['group'] !== 'MOD_QUICKICON'
            || $result[1][0]['link'] !== 'index.php?option=com_smartbrowser&view=dashboard')) throw new \RuntimeException('Wrong dashboard shortcut');
    }
    echo "Dashboard shortcut context and ACL OK\n";
}
