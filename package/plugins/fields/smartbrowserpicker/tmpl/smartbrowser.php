<?php
defined('_JEXEC') or die;

use SuperSoft\Component\Smartbrowser\Administrator\Support\SelectionOutputRenderer;

echo SelectionOutputRenderer::renderSelection($field->smartbrowser ?? ['items' => []], [
    'showUnavailable' => ($field->fieldparams ?? null)?->get('show_unavailable', ''),
]);
