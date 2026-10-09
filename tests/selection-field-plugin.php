<?php
namespace Joomla\CMS\Form {
    class Form {}
    class FormHelper { public static $prefixes = []; public static function addFieldPrefix($prefix) { self::$prefixes[] = $prefix; } }
}
namespace Joomla\Event { interface SubscriberInterface {} }
namespace Joomla\Component\Fields\Administrator\Plugin {
    class FieldsPlugin {
        public $prepared = false;
        public function onCustomFieldsGetTypes() { return [['type' => 'smartbrowserpicker'], ['type' => 'smartbrowser']]; }
        public function onContentPrepareForm(\Joomla\CMS\Form\Form $form, $data) { $this->prepared = true; }
        public function onCustomFieldsPrepareDom($field, \DOMElement $parent, \Joomla\CMS\Form\Form $form) {
            $node = $parent->appendChild(new \DOMElement('field'));
            $node->setAttribute('multiple', 'true'); $node->setAttribute('disabled', 'true');
            return $node;
        }
    }
}
namespace {
define('_JEXEC', 1);
require __DIR__ . '/../package/plugins/fields/smartbrowserpicker/src/Extension/Smartbrowserpicker.php';
$plugin = new \SuperSoft\Plugin\Fields\Smartbrowserpicker\Extension\Smartbrowserpicker();
if ($plugin->onCustomFieldsGetTypes() !== [['type' => 'smartbrowser']]) throw new \RuntimeException('Only the canonical smartbrowser type should be exposed');
$form = new \Joomla\CMS\Form\Form();
$plugin->onContentPrepareForm($form, (object) ['type' => 'smartbrowser']);
if (!$plugin->prepared) throw new \RuntimeException('Native parameter preparation not invoked');
$document = new \DOMDocument(); $parent = $document->appendChild(new \DOMElement('fieldset'));
$field = (object) ['id' => 12, 'fieldparams' => new class { public function get($key, $default) { return '1'; } }];
$node = $plugin->onCustomFieldsPrepareDom($field, $parent, $form);
if ($node->getAttribute('type') !== 'Smartbrowserpicker' || $node->getAttribute('sbmultiple') !== '1' || $node->hasAttribute('multiple') || $node->getAttribute('disabled') !== 'true') throw new \RuntimeException('Field DOM/ACL contract changed');
if (\Joomla\CMS\Form\FormHelper::$prefixes !== array_fill(0, 2, 'SuperSoft\\Component\\Smartbrowser\\Administrator\\Field')) throw new \RuntimeException('Namespace not registered through Joomla FormHelper');
echo "Field plugin creation and DOM lifecycle register namespaces through FormHelper, preserving native parameters and ACL OK\n";
}
