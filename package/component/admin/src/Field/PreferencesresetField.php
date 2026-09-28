<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Field;

use Joomla\CMS\Factory;
use Joomla\CMS\Form\FormField;
use Joomla\CMS\Language\Text;

defined('_JEXEC') or die;

final class PreferencesresetField extends FormField
{
    protected $type = 'Preferencesreset';

    protected function getInput(): string
    {
        $assets = Factory::getApplication()->getDocument()->getWebAssetManager();
        if (!$assets->assetExists('script', 'com_smartbrowser.preferences-reset')) {
            $assets->registerScript('com_smartbrowser.preferences-reset', 'com_smartbrowser/preferences-reset.js', [], ['defer' => true]);
        }
        $assets->useScript('com_smartbrowser.preferences-reset');

        $id = htmlspecialchars($this->id, ENT_QUOTES, 'UTF-8');
        $name = htmlspecialchars($this->name, ENT_QUOTES, 'UTF-8');
        $value = htmlspecialchars((string) $this->value, ENT_QUOTES, 'UTF-8');
        $button = htmlspecialchars(Text::_('COM_SMARTBROWSER_RESET_PREFERENCES_BUTTON'), ENT_QUOTES, 'UTF-8');
        $pending = htmlspecialchars(Text::_('COM_SMARTBROWSER_RESET_PREFERENCES_PENDING'), ENT_QUOTES, 'UTF-8');

        return '<input type="hidden" id="' . $id . '" name="' . $name . '" value="' . $value . '">'
            . '<button type="button" class="btn btn-outline-danger" data-sb-reset-preferences="' . $id . '">' . $button . '</button>'
            . '<span class="ms-2" data-sb-reset-pending="' . $id . '" hidden>' . $pending . '</span>';
    }
}
