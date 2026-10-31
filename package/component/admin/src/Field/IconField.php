<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Field;

use Joomla\CMS\Factory;
use Joomla\CMS\Form\Field\TextField;
use Joomla\CMS\Language\Text;

defined('_JEXEC') or die;

final class IconField extends TextField
{
    protected $type = 'Icon';

    protected function getInput(): string
    {
        $assets = Factory::getApplication()->getDocument()->getWebAssetManager();
        $assets->getRegistry()->addExtensionRegistryFile('com_smartbrowser');
        $assets->useStyle('com_smartbrowser.app')->useStyle('fontawesome')->useScript('com_smartbrowser.icon-settings');
        Text::script('COM_SMARTBROWSER_ICON_INVALID');
        $default = (string) ($this->element['default'] ?: 'fas fa-ban');
        $saved = $this->value;
        $this->hint = $default;
        if ($this->value === $default) $this->value = '';
        $input = parent::getInput();
        $value = trim((string) $this->value);
        $this->value = $saved;
        $escape = static fn ($text) => htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
        if (!preg_match('/^(?:fas|far|fab|fa-solid|fa-regular|fa-brands) fa-[a-z0-9-]+$/D', $value)) $value = $default;
        return '<div class="sb-icon-row sb-icon-field" data-sb-icon-field data-default="' . $escape($default) . '"><span data-icon-preview class="' . $escape($value) . '" aria-hidden="true"></span>' . $input
            . '<button type="button" class="btn btn-outline-secondary" data-single-icon-reset title="' . $escape(Text::_('COM_SMARTBROWSER_ICON_RESET')) . '"><span class="fas fa-undo" aria-hidden="true"></span></button></div>';
    }
}
