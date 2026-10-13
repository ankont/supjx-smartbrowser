<?php
define('_JEXEC', 1);
require __DIR__ . '/../package/component/admin/src/Support/SelectionFieldSupport.php';
use SuperSoft\Component\Smartbrowser\Administrator\Support\SelectionFieldSupport;
$defaults = SelectionFieldSupport::configuration([]);
if ($defaults['informationPanelHorizontalPosition'] !== 'right' || $defaults['informationPanelVerticalPosition'] !== 'top') throw new RuntimeException('Unexpected axis defaults');
$axes = SelectionFieldSupport::configuration(['information_panel_horizontal_position' => 'left', 'information_panel_vertical_position' => 'bottom']);
if ($axes['informationPanelHorizontalPosition'] !== 'left' || $axes['informationPanelVerticalPosition'] !== 'bottom') throw new RuntimeException('Independent axes lost');
if ($defaults['selectionUseData'] !== 'readonly' || $defaults['informationPanelPosition'] !== 'auto' || !$defaults['showLabel'] || $defaults['fullWidth']) throw new RuntimeException('Unexpected presentation defaults');
foreach (['auto', 'top', 'bottom', 'left', 'right'] as $position) {
    foreach (['hidden', 'readonly', 'editable'] as $mode) {
        $config = SelectionFieldSupport::configuration(['information_panel_position' => $position, 'selection_use_data' => $mode, 'show_label' => '0', 'full_width' => '1']);
        if ($config['informationPanelPosition'] !== $position || $config['selectionUseData'] !== $mode || $config['showLabel'] || !$config['fullWidth']) throw new RuntimeException('Presentation configuration not retained');
    }
}
$labelledWide = SelectionFieldSupport::configuration(['show_label' => '1', 'full_width' => '1']);
$unlabelledNormal = SelectionFieldSupport::configuration(['show_label' => '0', 'full_width' => '0']);
if (!$labelledWide['showLabel'] || !$labelledWide['fullWidth'] || $unlabelledNormal['showLabel'] || $unlabelledNormal['fullWidth']) throw new RuntimeException('Label and width must be independent');
foreach ([['information_panel_position' => 'overlay'], ['selection_use_data' => 'unsafe'], ['information_panel_horizontal_position' => 'top'], ['information_panel_vertical_position' => 'left']] as $invalid) {
    try { SelectionFieldSupport::configuration($invalid); }
    catch (InvalidArgumentException $error) { continue; }
    throw new RuntimeException('Invalid presentation setting accepted');
}
echo "Presentation defaults, modes, positions and independent label/full-width options OK\n";
