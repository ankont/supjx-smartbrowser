<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Field;

use Joomla\CMS\Form\Field\HiddenField;
use SuperSoft\Component\Smartbrowser\Administrator\Support\IntegrationOptions;

defined('_JEXEC') or die;

final class SmarttageditoravailableField extends HiddenField
{
    protected $type = 'Smarttageditoravailable';

    protected function getInput()
    {
        $this->value = IntegrationOptions::smartTagFrontendEditor() ? '1' : '0';
        return parent::getInput();
    }
}
