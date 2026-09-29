<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Field;

use Joomla\CMS\Factory;
use Joomla\CMS\Form\Field\NumberField;

defined('_JEXEC') or die;

final class GridwidthField extends NumberField
{
    protected $type = 'Gridwidth';

    protected function getInput(): string
    {
        $assets = Factory::getApplication()->getDocument()->getWebAssetManager();
        if (!$assets->assetExists('style', 'com_smartbrowser.grid-width-preview')) {
            $assets->registerStyle('com_smartbrowser.grid-width-preview', 'com_smartbrowser/grid-width-preview.css');
        }
        if (!$assets->assetExists('script', 'com_smartbrowser.grid-width-preview')) {
            $assets->registerScript('com_smartbrowser.grid-width-preview', 'com_smartbrowser/grid-width-preview.js', [], ['defer' => true]);
        }
        $assets->useStyle('com_smartbrowser.grid-width-preview')->useScript('com_smartbrowser.grid-width-preview');

        return '<div class="sb-grid-width-control" data-sb-grid-width>'
            . '<div class="sb-grid-width-input">' . parent::getInput() . '<span aria-hidden="true">px</span></div>'
            . '<div class="sb-grid-width-preview" aria-hidden="true"><span class="sb-grid-width-preview-tile"><span class="icon-folder"></span></span></div>'
            . '</div>';
    }
}
