<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Field;

use Joomla\CMS\Form\Field\ListField;
use Joomla\CMS\Language\Text;
use SuperSoft\Component\Smartbrowser\Administrator\Support\SelectionOutputRenderer;

defined('_JEXEC') or die;

final class UnavailablevisibilityField extends ListField
{
    protected $type = 'Unavailablevisibility';

    protected function getOptions()
    {
        $options = parent::getOptions();
        foreach ($options as $option) {
            if ((string) $option->value === '') $option->text = Text::sprintf('JGLOBAL_USE_GLOBAL_VALUE', Text::_(SelectionOutputRenderer::showUnavailable() ? 'JSHOW' : 'JHIDE'));
        }
        return $options;
    }
}
