<?php
defined('_JEXEC') or die;

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Layout\LayoutHelper;
use Joomla\CMS\Language\Associations;
use Joomla\Registry\Registry;

$app = \Joomla\CMS\Factory::getApplication();
$params = clone $contentParams;
$params->merge(new Registry((array) $form->getValue('attribs', null, [])));
$canAdmin = $app->getIdentity()->authorise('core.admin', 'com_content');
$assoc = Associations::isEnabled();
$ignored = ['jmetadata', 'item_associations', 'image-intro', 'image-full', 'linka', 'linkb', 'linkc'];
if (!$assoc || !$params->get('show_article_options', 1)) $ignored[] = 'associations';
if (!$params->get('show_article_options', 1)) {
    $ignored = array_merge($ignored, ['attribs', 'basic', 'category', 'author', 'date', 'other']);
}
$layoutData = new class ($form, $ignored) {
    public $fieldset;
    public $showOptions;
    private $form;
    private array $values;
    public function __construct($form, array $ignored) {
        $this->form = $form;
        $this->values = ['useCoreUI' => true, 'tab_name' => 'smartbrowserEditorTabs',
            'ignore_fieldsets' => $ignored, 'configFieldsets' => ['editorConfig'],
            'hiddenFieldsets' => ['basic-limited']];
    }
    public function getForm() { return $this->form; }
    public function get($name, $default = null) { return $this->values[$name] ?? $this->{$name} ?? $default; }
};

// Native fields and layouts derive their component parameters from the input option.
$originalOption = $input->getCmd('option');
$input->set('option', 'com_content');
try {
    echo LayoutHelper::render('joomla.edit.title_alias', $layoutData);
    echo '<div class="main-card">';
    echo HTMLHelper::_('uitab.startTabSet', 'smartbrowserEditorTabs', ['active' => 'smartbrowser-main', 'recall' => false, 'breakpoint' => 768]);
    echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-main', Text::_('COM_CONTENT_ARTICLE_CONTENT'));
    ?>
    <div class="row smartbrowser-editor-tab">
        <div class="col-lg-9"><fieldset class="options-form"><legend><?php echo Text::_('COM_CONTENT_FIELD_ARTICLETEXT_LABEL'); ?></legend><?php echo $form->getInput('articletext'); ?></fieldset></div>
        <div class="col-lg-3"><fieldset class="options-form"><legend><?php echo Text::_('COM_SMARTBROWSER_CONTENT_SETTINGS'); ?></legend><?php echo LayoutHelper::render('joomla.edit.global', $layoutData); ?></fieldset></div>
    </div>
    <?php
    echo HTMLHelper::_('uitab.endTab');
    if ($params->get('show_urls_images_backend', 1)) {
        echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-images-links', Text::_('COM_CONTENT_IMAGES_AND_URLS'));
        require __DIR__ . '/article-media.php';
        echo HTMLHelper::_('uitab.endTab');
    }
    echo LayoutHelper::render('joomla.edit.params', $layoutData);
    echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-publishing', Text::_('COM_CONTENT_PUBLISHING'));
    echo '<div class="row smartbrowser-editor-tab"><div class="col-lg-6"><fieldset class="options-form"><legend>' . Text::_('COM_CONTENT_PUBLISHING') . '</legend>';
    echo LayoutHelper::render('joomla.edit.publishingdata', $layoutData);
    echo '</fieldset></div><div class="col-lg-6"><fieldset class="options-form"><legend>' . Text::_('COM_CONTENT_METADATA') . '</legend>';
    echo LayoutHelper::render('joomla.edit.metadata', $layoutData);
    echo '</fieldset></div></div>';
    echo HTMLHelper::_('uitab.endTab');
    if ($assoc && $form->getFieldset('item_associations')) {
        echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'associations', Text::_('JGLOBAL_FIELDSET_ASSOCIATIONS'));
        echo '<fieldset class="options-form"><legend>' . Text::_('JGLOBAL_FIELDSET_ASSOCIATIONS') . '</legend>' . $form->renderFieldset('item_associations') . '</fieldset>';
        echo HTMLHelper::_('uitab.endTab');
    }
    if ($canAdmin && $params->get('show_configure_edit_options', 1)) {
        echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-editor-config', Text::_('COM_CONTENT_SLIDER_EDITOR_CONFIG'));
        echo '<fieldset class="options-form"><legend>' . Text::_('COM_CONTENT_SLIDER_EDITOR_CONFIG') . '</legend>' . $form->renderFieldset('editorConfig') . '</fieldset>';
        echo HTMLHelper::_('uitab.endTab');
    }
    if ($canAdmin && $params->get('show_permissions', 1) && $form->getField('rules')) {
        echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-permissions', Text::_('COM_CONTENT_FIELDSET_RULES'));
        echo '<fieldset class="options-form"><legend>' . Text::_('COM_CONTENT_FIELDSET_RULES') . '</legend>' . $form->getInput('rules') . '</fieldset>';
        echo HTMLHelper::_('uitab.endTab');
    }
    echo HTMLHelper::_('uitab.endTabSet');
    echo '</div>';
} finally {
    $input->set('option', $originalOption);
}
