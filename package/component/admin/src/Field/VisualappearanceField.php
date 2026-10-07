<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Field;

use Joomla\CMS\Factory;
use Joomla\CMS\Form\FormField;
use Joomla\CMS\Language\Text;
use SuperSoft\Component\Smartbrowser\Administrator\Support\VisualOptions;

defined('_JEXEC') or die;

final class VisualappearanceField extends FormField
{
    protected $type = 'Visualappearance';

    protected function getInput(): string
    {
        $assets = Factory::getApplication()->getDocument()->getWebAssetManager();
        $assets->getRegistry()->addRegistryFile('media/com_smartbrowser/joomla.asset.json');
        $assets->useStyle('com_smartbrowser.visual-settings')->useStyle('com_smartbrowser.app')
            ->useScript('com_smartbrowser.visual-settings')->useStyle('fontawesome');
        $labels = [];
        foreach (['BASE', 'BASE_DESC', 'IDENTITY', 'IDENTITY_DESC', 'IMAGE', 'IMAGE_DESC', 'SIZES', 'PLACEMENTS', 'SIZE', 'SMALL', 'MEDIUM', 'LARGE', 'MAX', 'CORNER', 'HIDDEN', 'CENTER', 'CENTER_SMALL', 'CENTER_LARGE', 'CENTER_MAX', 'CORNER_SMALL', 'CORNER_MEDIUM', 'CORNER_LARGE', 'CORNER_MAX', 'BADGE', 'POSITION', 'ANCHOR', 'UP', 'DOWN', 'NODES', 'ITEMS', 'TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_RIGHT', 'BACKGROUND', 'AUTO', 'TRANSPARENT', 'CHECKERBOARD', 'CUSTOM', 'INHERITED', 'PREVIEW', 'EXAMPLE', 'GLOBAL'] as $label) {
            $labels[strtolower($label)] = Text::_('COM_SMARTBROWSER_VISUAL_' . $label);
        }
        $labels['adapter_title'] = Text::sprintf('COM_SMARTBROWSER_VISUAL_CUSTOM_ADAPTER', Text::_((string) $this->element['label']));
        foreach (['ASSET', 'ADD', 'REMOVE', 'EMPTY', 'ITEM', 'Z_INDEX'] as $label) $labels[strtolower($label)] = Text::_('COM_SMARTBROWSER_VISUAL_' . $label);
        $data = ['id' => $this->id, 'adapter' => (string) $this->element['adapter'], 'value' => VisualOptions::decode($this->value), 'labels' => $labels];
        $escape = static fn(string $value): string => htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
        return '<div class="sb-visual-settings" data-sb-visual-settings="' . $escape(json_encode($data, JSON_THROW_ON_ERROR)) . '"></div>'
            . '<input type="hidden" id="' . $escape($this->id) . '" name="' . $escape($this->name) . '" value="' . $escape(json_encode($data['value'], JSON_THROW_ON_ERROR)) . '">';
    }
}
