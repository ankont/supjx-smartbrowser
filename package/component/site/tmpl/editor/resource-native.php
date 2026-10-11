<?php
defined('_JEXEC') or die;

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Layout\LayoutHelper;

$type = $this->resourceType;
$component = ['tag' => 'com_tags', 'menu-item' => 'com_menus', 'user' => 'com_users'][$type];
$layoutData = new class ($form, $type) {
    public $fieldset;
    public $showOptions;
    private $form;
    private string $type;
    public function __construct($form, string $type) { $this->form = $form; $this->type = $type; }
    public function getForm() { return $this->form; }
    public function get($name, $default = null) {
        $values = ['useCoreUI' => true, 'tab_name' => 'smartbrowserEditorTabs',
            'ignore_fieldsets' => $this->type === 'user' ? ['user_details'] : ['jmetadata', 'item_associations', 'request', 'aliasoptions']];
        if ($name === 'fields' && $this->type === 'menu-item') return ['id', 'client_id', 'menutype', 'parent_id', 'menuordering', 'published', 'home', 'publish_up', 'publish_down', 'access', 'language', 'note'];
        return $values[$name] ?? $this->{$name} ?? $default;
    }
};
$originalOption = $input->getCmd('option');
$input->set('option', $component);
try {
    if ($type !== 'user') echo LayoutHelper::render('joomla.edit.title_alias', $layoutData);
    else echo '<h2 class="smartbrowser-editor-user-name">' . $this->escape($form->getValue('name', null, Text::_('COM_USERS_USER_NEW_USER_TITLE'))) . '</h2>';
    echo '<div class="main-card">';
    echo HTMLHelper::_('uitab.startTabSet', 'smartbrowserEditorTabs', ['active' => 'smartbrowser-main', 'recall' => false, 'breakpoint' => 768]);
    $label = ['tag' => 'COM_TAGS_FIELDSET_DETAILS', 'menu-item' => 'COM_MENUS_ITEM_DETAILS', 'user' => 'COM_USERS_USER_ACCOUNT_DETAILS'][$type];
    echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-main', Text::_($label));
    if ($type === 'user') {
        echo '<fieldset class="options-form"><legend>' . Text::_($label) . '</legend>' . $form->renderFieldset('user_details') . '</fieldset>';
    } else {
        echo '<div class="row"><div class="col-lg-9"><fieldset class="options-form"><legend>' . Text::_($type === 'tag' ? 'JGLOBAL_DESCRIPTION' : $label) . '</legend>';
        if ($type === 'tag') echo $form->getInput('description');
        else {
            echo $renderMenuTypeField();
            foreach (['request', 'aliasoptions'] as $name) {
                echo '<div class="smartbrowser-editor-menu-' . $name . '">';
                foreach ($fieldsetFields($name) as $field) echo $field->renderField();
                echo '</div>';
            }
            foreach (['link', 'browserNav', 'template_style_id'] as $name) echo $renderField($name);
            if ($menuItemType !== 'component') {
                $form->setFieldAttribute('home', 'type', 'hidden');
                $form->setFieldAttribute('publish_up', 'showon', '');
                $form->setFieldAttribute('publish_down', 'showon', '');
            }
        }
        echo '</fieldset></div><div class="col-lg-3"><fieldset class="options-form"><legend>' . Text::_('COM_SMARTBROWSER_CONTENT_SETTINGS') . '</legend>';
        echo LayoutHelper::render('joomla.edit.global', $layoutData);
        echo '</fieldset></div></div>';
    }
    echo HTMLHelper::_('uitab.endTab');
    if ($type === 'user') {
        echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-groups', Text::_('COM_USERS_ASSIGNED_GROUPS'));
        echo '<fieldset class="options-form"><legend>' . Text::_('COM_USERS_ASSIGNED_GROUPS') . '</legend>';
        $groups = $this->resourceId > 0 ? \Joomla\CMS\Factory::getContainer()->get(\Joomla\CMS\User\UserFactoryInterface::class)->loadUserById($this->resourceId)->groups : [];
        echo HTMLHelper::_('access.usergroups', 'jform[groups]', (array) $form->getValue('groups', null, $groups), true);
        echo '</fieldset>' . HTMLHelper::_('uitab.endTab');
    }
    echo LayoutHelper::render('joomla.edit.params', $layoutData);
    if ($type === 'tag') {
        echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-publishing', Text::_('JGLOBAL_FIELDSET_PUBLISHING'));
        echo '<div class="row"><div class="col-lg-6"><fieldset class="options-form"><legend>' . Text::_('JGLOBAL_FIELDSET_PUBLISHING') . '</legend>';
        echo LayoutHelper::render('joomla.edit.publishingdata', $layoutData);
        echo '</fieldset></div><div class="col-lg-6"><fieldset class="options-form"><legend>' . Text::_('JGLOBAL_FIELDSET_METADATA_OPTIONS') . '</legend>';
        echo LayoutHelper::render('joomla.edit.metadata', $layoutData);
        echo '</fieldset></div></div>' . HTMLHelper::_('uitab.endTab');
    }
    if ($type === 'menu-item' && $form->getFieldset('item_associations') && !(int) $form->getValue('client_id')) {
        echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'associations', Text::_('JGLOBAL_FIELDSET_ASSOCIATIONS'));
        echo '<fieldset id="fieldset-associations" class="options-form"><legend>' . Text::_('JGLOBAL_FIELDSET_ASSOCIATIONS') . '</legend>' . $form->renderFieldset('item_associations') . '</fieldset>';
        echo HTMLHelper::_('uitab.endTab');
    }
    echo HTMLHelper::_('uitab.endTabSet');
    echo '</div>';
} finally { $input->set('option', $originalOption); }
