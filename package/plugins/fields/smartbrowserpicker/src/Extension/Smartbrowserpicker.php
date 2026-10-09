<?php
namespace SuperSoft\Plugin\Fields\Smartbrowserpicker\Extension;

use Joomla\CMS\Form\Form;
use Joomla\CMS\Form\FormHelper;
use Joomla\Component\Fields\Administrator\Plugin\FieldsPlugin;
use Joomla\Event\SubscriberInterface;
use SuperSoft\Component\Smartbrowser\Administrator\Support\SelectionFieldSupport;
use SuperSoft\Component\Smartbrowser\Administrator\Support\StoredSelectionReadContext;

defined('_JEXEC') or die;

final class Smartbrowserpicker extends FieldsPlugin implements SubscriberInterface
{
    public function onCustomFieldsGetTypes()
    {
        return array_values(array_filter(parent::onCustomFieldsGetTypes(), static fn ($type) => $type['type'] === 'smartbrowser'));
    }

    public function onContentPrepareForm(Form $form, $data)
    {
        FormHelper::addFieldPrefix('SuperSoft\\Component\\Smartbrowser\\Administrator\\Field');
        return parent::onContentPrepareForm($form, $data);
    }

    public function onCustomFieldsPrepareDom($field, \DOMElement $parent, Form $form)
    {
        $node = parent::onCustomFieldsPrepareDom($field, $parent, $form);
        if (!$node) return null;
        FormHelper::addFieldPrefix('SuperSoft\\Component\\Smartbrowser\\Administrator\\Field');
        $node->setAttribute('type', 'Smartbrowserpicker');
        $node->setAttribute('sbfieldid', (string) $field->id);
        // Multiple resources are stored as one versioned value, not Joomla list values.
        $node->setAttribute('sbmultiple', (string) $field->fieldparams->get('multiple', '0'));
        $node->removeAttribute('multiple');
        return $node;
    }

    public function onCustomFieldsPrepareField($context, $item, $field)
    {
        if (!$this->isTypeSupported($field->type)) return '';
        try {
            $config = SelectionFieldSupport::configuration($field->fieldparams->toArray());
            $readContext = StoredSelectionReadContext::forField($context, $item, $field);
            $field->smartbrowser = SelectionFieldSupport::prepare($field->rawvalue ?? $field->value, $config, null, null, $readContext);
        } catch (\Throwable $error) {
            $field->smartbrowser = ['version' => 1, 'items' => [], 'invalid' => true];
        }
        return parent::onCustomFieldsPrepareField($context, $item, $field);
    }
}
