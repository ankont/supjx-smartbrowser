<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Field;

use Joomla\CMS\Factory;
use Joomla\CMS\Form\FormField;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Uri\Uri;
use Joomla\Database\DatabaseInterface;
use Joomla\Registry\Registry;
use SuperSoft\Component\Smartbrowser\Administrator\Support\CollectionViewSupport;
use SuperSoft\Component\Smartbrowser\Administrator\Support\SelectionFieldSupport;
use SuperSoft\Component\Smartbrowser\Administrator\Support\SelectionFieldValue;

defined('_JEXEC') or die;

final class SmartbrowserpickerField extends FormField
{
    protected $type = 'Smartbrowserpicker';

    private function configuration(): array
    {
        $params = [];
        foreach ($this->element->attributes() as $name => $value) $params[$name] = (string) $value;
        $params['multiple'] = $params['sbmultiple'] ?? '0';
        return SelectionFieldSupport::configuration($params);
    }

    protected function getInput(): string
    {
        $app = Factory::getApplication();
        $app->getLanguage()->load('plg_fields_smartbrowserpicker', JPATH_ADMINISTRATOR, null, true);
        $escape = static fn ($value) => htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
        $disabled = $this->disabled || $this->readonly;
        $input = '<input type="hidden" data-sb-value id="' . $escape($this->id) . '" name="' . $escape($this->name) . '" value="' . $escape(is_string($this->value) ? $this->value : '') . '"' . ($this->disabled ? ' disabled' : '') . '>';
        try {
            $config = $this->configuration();
            $config += CollectionViewSupport::prepare($app->getDocument());
            $config['pickerUrl'] = Uri::base() . 'index.php?option=com_smartbrowser&view=browser';
            $config['readOnly'] = $disabled;
            $assets = $app->getDocument()->getWebAssetManager();
            $assets->useScript('com_smartbrowser.selection-field');
            foreach (['INVALID', 'EDIT', 'SELECT', 'CLEAR'] as $key) Text::script('PLG_FIELDS_SMARTBROWSERPICKER_' . $key);
            $html = '<div class="sb-selection-field" data-sb-field="' . $escape(json_encode($config, JSON_THROW_ON_ERROR)) . '">' . $input;
            $html .= '<div data-sb-collection></div><p class="text-danger" data-sb-error role="alert" hidden></p>';
            return $html . '</div>';
        } catch (\Throwable $error) {
            return $input . '<p class="text-danger" role="alert">' . Text::_('PLG_FIELDS_SMARTBROWSERPICKER_INVALID') . '</p>';
        }
    }

    public function filter($value, $group = null, ?Registry $input = null)
    {
        try {
            $config = $this->configuration();
            $decoded = SelectionFieldValue::decode($value, $config['allowedAdapters'], $config['multiple'], $config['homogeneous']);
            $prepared = SelectionFieldSupport::prepare($value, $config, null, false);
            foreach ($prepared['items'] as $index => $item) $decoded['items'][$index]['usage'] = SelectionFieldSupport::usageValues($item['resource'], $item['usage'], $config);
            return SelectionFieldValue::encode($decoded);
        }
        catch (\Throwable $error) { return $value; } // Validation must report corrupt data, not silently clear it.
    }

    public function validate($value, $group = null, ?Registry $input = null)
    {
        try {
            $config = $this->configuration();
            $decoded = SelectionFieldValue::decode($value, $config['allowedAdapters'], $config['multiple'], $config['homogeneous']);
            if (!$decoded['items']) return $this->required ? new \RuntimeException(Text::_('PLG_FIELDS_SMARTBROWSERPICKER_REQUIRED')) : true;
            $prepared = SelectionFieldSupport::prepare($value, $config, null, false);
            $existing = $this->existingReferences();
            foreach ($prepared['items'] as $item) {
                $resource = $item['resource'];
                if ($item['unavailable']) {
                    if (!in_array(\SuperSoft\Component\Smartbrowser\Administrator\Support\CollectionResources::key($item['selection']), $existing, true)) throw new \InvalidArgumentException('Unavailable reference.');
                    continue;
                }
                if (($resource['selectable'] ?? true) === false || ($config['selectionTarget'] !== 'both' && ($resource['kind'] ?? '') !== $config['selectionTarget'])
                    || ($config['allowedResourceTypes'] && !in_array($resource['type'] ?? '', $config['allowedResourceTypes'], true))) throw new \InvalidArgumentException('Resource constraint failed.');
                SelectionFieldSupport::usageValues($resource, $item['usage'], $config);
            }
            return true;
        } catch (\Throwable $error) { return new \RuntimeException(Text::_('PLG_FIELDS_SMARTBROWSERPICKER_INVALID')); }
    }

    private function existingReferences(): array
    {
        $fieldId = (int) $this->element['sbfieldid'];
        $itemId = (int) $this->form->getValue('id');
        if (!$fieldId || !$itemId) return [];
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true)->select($db->quoteName('value'))->from($db->quoteName('#__fields_values'))
            ->where($db->quoteName('field_id') . ' = ' . $fieldId)->where($db->quoteName('item_id') . ' = ' . $db->quote((string) $itemId));
        try { return array_map(static fn ($entry) => \SuperSoft\Component\Smartbrowser\Administrator\Support\CollectionResources::key($entry['selection']), SelectionFieldValue::decode($db->setQuery($query)->loadResult())['items']); }
        catch (\Throwable $error) { return []; }
    }
}
