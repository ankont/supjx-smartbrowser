<?php
namespace Joomla\Registry { class Registry {} }
namespace Joomla\Database { interface DatabaseInterface {} }
namespace Joomla\CMS\Form { class FormField { protected $type; public $element, $value = '', $id = 'jform_com_fields_picker', $name = 'jform[com_fields][picker]', $disabled = false, $readonly = false, $required = false, $form; } }
namespace Joomla\CMS\Language { class Text { public static function _($key) { return $key; } public static function script($key) {} } }
namespace Joomla\CMS\Uri { class Uri { public static function base() { return 'https://example.test/'; } } }
namespace Joomla\CMS { class Factory { public static $app; public static function getApplication() { return self::$app; } } }
namespace SuperSoft\Component\Smartbrowser\Administrator\Support {
    class ResourceVisualDecorator { public function __construct($app) {} public function decorate($data, $adapter) { return $data; } }
    class CollectionViewSupport { public static function prepare($document) { return ['apiBaseUrl' => 'https://example.test/index.php', 'csrfToken' => 'token', 'application' => \Joomla\CMS\Factory::$app->client]; } }
}
namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter {
    class AdapterRegistry {
        public function __construct($app) {}
        public function get($adapter, $root) {
            if ($adapter !== 'media') throw new \RuntimeException('Denied', 403);
            return new class implements ResourceAdapterInterface {
                public function getId(): string { return 'media'; } public function getRoots(): array { return []; }
                public function getResources(string $nodeId, array $options = []): array { return []; }
                public function getResource(string $id, array $options = []): array {
                    if (str_contains($id, 'missing')) throw new \RuntimeException('Missing', 404);
                    return ['id' => $id, 'title' => 'Resolved', 'type' => 'image', 'kind' => 'item', 'selectable' => true,
                        'selectionCapabilities' => [['key' => 'example.label', 'type' => 'string', 'default' => '', 'validation' => ['maxLength' => 20]]]];
                }
                public function getBreadcrumb(string $nodeId): array { return []; } public function getActions(array $selection = []): array { return []; }
                public function executeAction(string $action, array $selection, array $payload = []): mixed { return null; }
            };
        }
    }
}
namespace {
define('_JEXEC', 1); define('JPATH_ADMINISTRATOR', __DIR__);
require __DIR__ . '/../package/component/admin/src/Adapter/ResourceAdapterInterface.php';
foreach (['ResourceDescriptor', 'CollectionResources', 'SelectionUsageValidation', 'SelectionFieldValue', 'SelectionFieldSupport'] as $class) require __DIR__ . '/../package/component/admin/src/Support/' . $class . '.php';
require __DIR__ . '/../package/component/admin/src/Field/SmartbrowserpickerField.php';
use SuperSoft\Component\Smartbrowser\Administrator\Field\SmartbrowserpickerField;
$assets = new class { public $scripts = []; public function useScript($name) { $this->scripts[] = $name; return $this; } };
\Joomla\CMS\Factory::$app = new class($assets) {
    public $client = 'administrator'; public function __construct(public $assets) {}
    public function isClient($client) { return $this->client === $client; }
    public function getLanguage() { return new class { public function load(...$args) {} }; }
    public function getDocument() { return new class($this->assets) { public function __construct(public $assets) {} public function getWebAssetManager() { return $this->assets; } }; }
    public function getIdentity() { return new class { public function authorise(...$args) { return true; } public function getAuthorisedViewLevels() { return [1]; } }; }
};
$inputMethod = new ReflectionMethod(SmartbrowserpickerField::class, 'getInput');
$stored = json_encode(['version' => 1, 'items' => [['selection' => ['adapter' => 'media', 'id' => 'local:/image.png'], 'usage' => ['example.label' => 'Saved']]]]);
foreach (['administrator', 'site'] as $client) {
    \Joomla\CMS\Factory::$app->client = $client;
    $field = new SmartbrowserpickerField();
    $field->element = new SimpleXMLElement('<field allowed_adapters="media" sbmultiple="0" sbfieldid="0" selection_profile="{&quot;example.label&quot;:{}}"/>');
    $field->form = new class { public function getValue($name) { return 0; } };
    $field->value = $stored;
    $html = $inputMethod->invoke($field);
    if (!str_contains($html, 'name="jform[com_fields][picker]"') || !str_contains($html, 'data-sb-collection') || str_contains($html, 'Resolved')) throw new RuntimeException('Field must bind raw value and delegate resource rendering');
    $saved = $field->filter($stored);
    if ($field->validate($saved) !== true || $field->filter($saved) !== $saved) throw new RuntimeException('Save/reload/filter cycle failed');
    if ($field->validate('corrupt') === true || $field->validate(str_replace('image.png', 'missing.png', $stored)) === true || $field->validate(str_replace('Saved', str_repeat('x', 21), $stored)) === true) throw new RuntimeException('Invalid/unavailable/usage constraint bypass');
    $field->required = true;
    if ($field->validate('') === true) throw new RuntimeException('Required field bypass');
    $field->required = false;
    if ($field->filter('') !== '' || $field->validate('') !== true) throw new RuntimeException('Cleared field failed');
    $field->disabled = true;
    $html = $inputMethod->invoke($field);
    if (!str_contains($html, ' disabled') || str_contains($html, 'data-sb-select')) throw new RuntimeException('Disabled/native edit ACL not respected');
}
if (!in_array('com_smartbrowser.selection-field', $assets->scripts, true)) throw new RuntimeException('Field assets not requested');
echo "Administrator/frontend field binding, save/reload, required/empty/corrupt/usage validation and disabled controls OK\n";
}
