<?php
defined('_JEXEC') or die;

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Associations;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Layout\LayoutHelper;

$extension = $input->getCmd('extension', 'com_content');
$asset = $this->resourceId > 0 ? $extension . '.category.' . $this->resourceId : $extension;
$ignored = ['jmetadata', 'item_associations'];
$component = \Joomla\CMS\Factory::getApplication()->bootComponent(explode('.', $extension)[0]);
if (!$component instanceof \Joomla\CMS\Workflow\WorkflowServiceInterface
    || !$component->isWorkflowActive($component->getCategoryWorkflowContext(explode('.', $extension)[1] ?? null))) {
    $ignored[] = 'workflow';
}
$layoutData = new class ($form, $ignored) {
    public $fieldset;
    public $showOptions;
    private $form;
    private array $ignored;
    public function __construct($form, array $ignored) { $this->form = $form; $this->ignored = $ignored; }
    public function getForm() { return $this->form; }
    public function get($name, $default = null) {
        $values = ['useCoreUI' => true, 'tab_name' => 'smartbrowserEditorTabs', 'ignore_fieldsets' => $this->ignored];
        return $values[$name] ?? $this->{$name} ?? $default;
    }
};
$originalOption = $input->getCmd('option');
$input->set('option', 'com_categories');
try {
    echo LayoutHelper::render('joomla.edit.title_alias', $layoutData);
    echo '<div class="main-card">';
    echo HTMLHelper::_('uitab.startTabSet', 'smartbrowserEditorTabs', ['active' => 'smartbrowser-main', 'recall' => false, 'breakpoint' => 768]);
    echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-main', Text::_('JCATEGORY'));
    echo '<div class="row smartbrowser-editor-tab"><div class="col-lg-9"><fieldset class="options-form"><legend>' . Text::_('JGLOBAL_DESCRIPTION') . '</legend>';
    echo $form->getInput('description');
    echo '</fieldset></div><div class="col-lg-3"><fieldset class="options-form"><legend>' . Text::_('COM_SMARTBROWSER_CONTENT_SETTINGS') . '</legend>';
    echo LayoutHelper::render('joomla.edit.global', $layoutData);
    echo '</fieldset></div></div>';
    echo HTMLHelper::_('uitab.endTab');
    echo LayoutHelper::render('joomla.edit.params', $layoutData);
    echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-publishing', Text::_('JGLOBAL_FIELDSET_PUBLISHING'));
    echo '<div class="row"><div class="col-lg-6"><fieldset class="options-form"><legend>' . Text::_('JGLOBAL_FIELDSET_PUBLISHING') . '</legend>';
    echo LayoutHelper::render('joomla.edit.publishingdata', $layoutData);
    echo '</fieldset></div><div class="col-lg-6"><fieldset class="options-form"><legend>' . Text::_('JGLOBAL_FIELDSET_METADATA_OPTIONS') . '</legend>';
    echo LayoutHelper::render('joomla.edit.metadata', $layoutData);
    echo '</fieldset></div></div>';
    echo HTMLHelper::_('uitab.endTab');
    if (Associations::isEnabled() && $form->getFieldset('item_associations')) {
        echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'associations', Text::_('JGLOBAL_FIELDSET_ASSOCIATIONS'));
        echo '<fieldset class="options-form"><legend>' . Text::_('JGLOBAL_FIELDSET_ASSOCIATIONS') . '</legend>' . $form->renderFieldset('item_associations') . '</fieldset>';
        echo HTMLHelper::_('uitab.endTab');
    }
    if (\Joomla\CMS\Factory::getApplication()->getIdentity()->authorise('core.admin', $asset) && $form->getField('rules')) {
        echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-permissions', Text::_('COM_CATEGORIES_FIELDSET_RULES'));
        echo '<fieldset class="options-form"><legend>' . Text::_('COM_CATEGORIES_FIELDSET_RULES') . '</legend>' . $form->getInput('rules') . '</fieldset>';
        echo HTMLHelper::_('uitab.endTab');
    }
    echo HTMLHelper::_('uitab.endTabSet');
    echo '</div>';
} finally {
    $input->set('option', $originalOption);
}
