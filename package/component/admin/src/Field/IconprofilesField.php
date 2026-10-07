<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Field;
use Joomla\CMS\Factory;
use Joomla\CMS\Form\FormField;
use Joomla\CMS\Language\Text;
use SuperSoft\Component\Smartbrowser\Administrator\Support\IconOptions;
defined('_JEXEC') or die;

final class IconprofilesField extends FormField
{
    protected $type = 'Iconprofiles';
    protected function getInput(): string
    {
        $assets = Factory::getApplication()->getDocument()->getWebAssetManager();
        $assets->getRegistry()->addExtensionRegistryFile('com_smartbrowser');
        $assets->useStyle('com_smartbrowser.app')->useScript('com_smartbrowser.icon-settings');
        $saved = IconOptions::normalize($this->value);
        Text::script('COM_SMARTBROWSER_ICON_INVALID');
        $escape = static fn($value) => htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
        $html = '<div class="sb-icon-settings"><input data-icon-value type="hidden" id="' . $escape($this->id) . '" name="' . $escape($this->name) . '" value="' . $escape(json_encode($saved, JSON_THROW_ON_ERROR)) . '">';
        foreach (IconOptions::DEFAULTS as $adapter => $roles) {
            $title = Text::_('COM_SMARTBROWSER_ADAPTER_' . strtoupper(str_replace('-', '_', $adapter)));
            $html .= '<details class="sb-icon-adapter"><summary>' . $escape($title) . '</summary><div class="sb-icon-fields">';
            foreach ($roles as $role => $default) {
                $value = $saved[$adapter][$role] ?? '';
                $label = Text::_('COM_SMARTBROWSER_ICON_' . strtoupper($role));
                $id = $this->id . '-' . $adapter . '-' . $role;
                $html .= '<div class="sb-icon-row"><label for="' . $escape($id) . '">' . $escape($label) . '</label><span data-icon-preview class="' . $escape($value ?: $default) . '" aria-hidden="true"></span><input id="' . $escape($id) . '" type="text" data-adapter="' . $escape($adapter) . '" data-role="' . $escape($role) . '" data-default="' . $escape($default) . '" value="' . $escape($value) . '" placeholder="' . $escape($default) . '" aria-label="' . $escape($title . ': ' . $label) . '"><button type="button" class="btn btn-outline-secondary" data-icon-reset title="' . $escape(Text::_('COM_SMARTBROWSER_ICON_RESET')) . '" aria-label="' . $escape(Text::_('COM_SMARTBROWSER_ICON_RESET') . ': ' . $label) . '"><span class="fas fa-undo" aria-hidden="true"></span></button></div>';
            }
            $html .= '</div></details>';
        }
        return $html . '</div>';
    }
}
