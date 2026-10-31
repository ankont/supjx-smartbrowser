<?php
namespace Joomla\CMS\Component {
    final class ComponentHelper {
        public static mixed $states = [0, 2];
        public static array $flags = [];
        public static function getParams($component) {
            return new class { public function get($key, $default) { return $key === 'default_resource_states' ? ComponentHelper::$states : (ComponentHelper::$flags[$key] ?? $default); } };
        }
    }
}
namespace {
    define('_JEXEC', 1);
    require __DIR__ . '/../package/component/admin/src/Support/BrowserDefaults.php';
    foreach ([[[0, 2], [1, 0, 2]], [[], [1]], ['0,2,-2', [1, 0, 2]], [[-2, 1, 2, 2], [1, 2]]] as [$input, $expected]) {
        \Joomla\CMS\Component\ComponentHelper::$states = $input;
        if (\SuperSoft\Component\Smartbrowser\Administrator\Support\BrowserDefaults::states() !== $expected) throw new \RuntimeException('Invalid default publication states');
    }
    echo "Default browsing states preserve published and exclude trashed OK\n";
    \Joomla\CMS\Component\ComponentHelper::$flags = ['default_unpublished'=>0, 'default_archived'=>1];
    if (\SuperSoft\Component\Smartbrowser\Administrator\Support\BrowserDefaults::states() !== [1, 2]) throw new \RuntimeException('Native switches did not override legacy states');
}
