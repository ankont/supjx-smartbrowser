<?php
defined('_JEXEC') or die;

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;

echo '<div class="row title-alias form-vertical mb-3"><div class="col-md-6">' . $renderField('title') . '</div><div class="col-md-6">' . $renderField('alias') . '</div></div>';
echo '<div class="main-card">';
echo HTMLHelper::_('uitab.startTabSet', 'smartbrowserEditorTabs', ['active' => 'smartbrowser-main', 'recall' => false, 'breakpoint' => 768]);
echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-main', Text::_('COM_CONTENT_ARTICLE_CONTENT'));
echo '<div class="row"><div class="col-lg-9"><fieldset class="options-form"><legend>' . Text::_('COM_CONTENT_FIELD_ARTICLETEXT_LABEL') . '</legend>';
echo $form->getInput('articletext') . $renderField('captcha');
echo '</fieldset></div><div class="col-lg-3"><fieldset class="options-form"><legend>' . Text::_('COM_SMARTBROWSER_CONTENT_SETTINGS') . '</legend>';
foreach (['transition', 'state', 'catid', 'featured', 'access', 'tags', 'note'] as $name) echo $renderField($name);
if ($saveHistory) echo $renderField('version_note');
if (!$multilingual) $form->setFieldAttribute('language', 'type', 'hidden');
echo $renderField('language');
echo '</fieldset></div></div>' . HTMLHelper::_('uitab.endTab');
if ($showImages && ($form->getField('image_intro', 'images') || $form->getField('urla', 'urls'))) {
    echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-images-links', Text::_('COM_CONTENT_IMAGES_AND_URLS'));
    require __DIR__ . '/article-media.php';
    echo HTMLHelper::_('uitab.endTab');
}
foreach ($allFieldsets as $fieldset) {
    if (in_array($fieldset->name, $claimed, true) || !empty($fieldset->repeat)) continue;
    $fields = $fieldsetFields($fieldset->name);
    if (!$fields) continue;
    $label = Text::_($fieldset->label ?: 'JDETAILS');
    echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-' . preg_replace('/[^a-z0-9_-]/i', '-', $fieldset->name), $label);
    echo '<fieldset class="options-form"><legend>' . $label . '</legend>';
    foreach ($fields as $field) echo $field->renderField();
    echo '</fieldset>' . HTMLHelper::_('uitab.endTab');
}
echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-publishing-options', Text::_('COM_CONTENT_PUBLISHING'));
echo '<div class="row"><div class="col-lg-6"><fieldset class="options-form"><legend>' . Text::_('COM_CONTENT_PUBLISHING') . '</legend>';
foreach (['publish_up', 'publish_down', 'featured_up', 'featured_down', 'created', 'created_by', 'created_by_alias', 'modified', 'modified_by', 'version', 'hits'] as $name) echo $renderField($name);
echo '</fieldset></div>';
if ($showPublishing) {
    echo '<div class="col-lg-6"><fieldset class="options-form"><legend>' . Text::_('COM_CONTENT_METADATA') . '</legend>';
    echo $renderField('metadesc') . $renderField('metakey');
    foreach ($fieldsetFields('jmetadata') as $field) echo $field->renderField();
    echo '</fieldset></div>';
}
echo '</div>' . HTMLHelper::_('uitab.endTab');
echo HTMLHelper::_('uitab.endTabSet') . '</div>';
