<?php
namespace Joomla\Event { interface SubscriberInterface {} }
namespace Joomla\CMS\Plugin { class CMSPlugin { public object $app; protected function getApplication() { return $this->app; } } }
namespace Joomla\CMS\Toolbar\Button { class HelpButton {} class InlinehelpButton {} }
namespace {
    define('_JEXEC', 1);
    require __DIR__ . '/../package/plugins/system/smartbrowserintegration/src/Extension/Smartbrowserintegration.php';
    require __DIR__ . '/../package/component/admin/src/Support/IconOptions.php';
    $toolbar = new class {
        public array $items = [];
        public function getItems() { return $this->items; }
        public function setItems($items) { $this->items = $items; }
    };
    $input = new class {
        public array $values = ['option'=>'com_config', 'component'=>'com_smartbrowser'];
        public function getCmd($key) { return $this->values[$key] ?? ''; }
    };
    $document = new class($toolbar) {
        public function __construct(private object $toolbar) {}
        public function getToolbar() { return $this->toolbar; }
    };
    $plugin = new \SuperSoft\Plugin\System\Smartbrowserintegration\Extension\Smartbrowserintegration();
    $plugin->app = new class($input, $document) {
        public bool $admin = true;
        public function __construct(private object $input, private object $document) {}
        public function isClient($client) { return $this->admin && $client === 'administrator'; }
        public function getInput() { return $this->input; }
        public function getDocument() { return $this->document; }
    };
    $help = new \Joomla\CMS\Toolbar\Button\HelpButton();
    $inline = new \Joomla\CMS\Toolbar\Button\InlinehelpButton();
    $save = new \stdClass();
    foreach (['com_content', 'com_smartbrowser'] as $component) {
        $input->values['component'] = $component;
        $toolbar->items = [$save, $help, $inline];
        $plugin->prepareOptionsToolbar();
        $expected = $component === 'com_smartbrowser' ? [$save, $inline] : [$save, $help, $inline];
        if ($toolbar->items !== $expected) throw new \RuntimeException('Wrong options toolbar scope');
    }
    $plugin->app->admin = false;
    $toolbar->items = [$help]; $plugin->prepareOptionsToolbar();
    if ($toolbar->items !== [$help]) throw new \RuntimeException('Frontend toolbar changed');
    $class = \SuperSoft\Component\Smartbrowser\Administrator\Support\IconOptions::class;
    $articleIcons = ['articles'=>['item'=>'fas fa-heart', 'featured'=>'fas fa-flag']];
    if ($class::forAdapter('flat-articles', $articleIcons)['item'] !== 'fas fa-heart'
        || $class::forAdapter('featured-articles', $articleIcons)['adapter'] !== 'fas fa-flag'
        || $class::resource(['kind'=>'item', 'icon'=>'fas fa-newspaper'], 'featured-articles', $articleIcons)['icon'] !== 'fas fa-heart') {
        throw new \RuntimeException('Shared article icon settings not applied');
    }
    $config = simplexml_load_file(__DIR__ . '/../package/component/admin/config.xml');
    $names = array_map(static fn($set) => (string) $set['name'], iterator_to_array($config->fieldset, false));
    if ($names !== ['visuals', 'icons', 'context', 'resource_editors', 'integration', 'permissions']) throw new \RuntimeException('Wrong settings tab order');
    $labels = array_map(static fn($set) => (string) $set['label'], iterator_to_array($config->fieldset, false));
    if ($labels !== ['COM_SMARTBROWSER_TAB_RESOURCES', 'COM_SMARTBROWSER_OPTIONS_ICONS', 'COM_SMARTBROWSER_TAB_BROWSERS', 'COM_SMARTBROWSER_TAB_EDITORS', 'COM_SMARTBROWSER_OPTIONS_INTEGRATION', 'JCONFIG_PERMISSIONS_LABEL']) throw new \RuntimeException('Wrong settings tab labels');
    if (count($config->xpath('//fieldset[@name="context"]//field[starts-with(@name,"editor_")]'))
        || count($config->xpath('//fieldset[@name="editor_open_behavior"]/field')) !== 2
        || (string) $config->xpath('//fieldset[@name="icon_settings"]')[0]['label'] !== 'COM_SMARTBROWSER_OPTIONS_ICON_APPEARANCE') throw new \RuntimeException('Wrong editor opening or icon group placement');
    if (count($config->xpath('//field[@name="editor_admin"]')) !== 1
        || !count($config->xpath('//fieldset[@name="editor_open_behavior"]/field[@name="editor_admin"]'))
        || !count($config->xpath('//fieldset[@name="integration_general"]/field[@name="replace_all"]'))) {
        throw new \RuntimeException('Settings are not in rendered leaf fieldsets');
    }
    foreach (['web', 'mail', 'tel', 'fragment', 'joomla'] as $type) {
        $default = $class::DEFAULTS['direct-links'][$type];
        foreach (['node', 'item'] as $kind) {
            $resource = ['kind'=>$kind, 'icon'=>$default, 'metadata'=>['uriType'=>$type]];
            $result = $class::resource($resource, 'direct-links', ['direct-links'=>[$type=>'fas fa-star']]);
            if ($result['icon'] !== 'fas fa-star') throw new \RuntimeException('URI icon override missing');
            if ($kind === 'node' && ($result['openIcon'] !== 'fas fa-star' || $result['closedIcon'] !== 'fas fa-star')) throw new \RuntimeException('URI node icons differ');
            $resource['icon'] = 'fas fa-heart';
            if ($class::resource($resource, 'direct-links', [])['icon'] !== 'fas fa-heart') throw new \RuntimeException('Custom resource icon replaced');
        }
    }
    echo "Scoped options toolbar and per-type Direct Links icons OK\n";
}
