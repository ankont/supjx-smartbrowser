<?php
defined('_JEXEC') or die;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Factory;
use Joomla\CMS\Component\ComponentHelper;
use Joomla\CMS\Language\Multilanguage;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Router\Route;
if ($this->editorComplete) {
    if (Factory::getApplication()->getInput()->getBool('sbpage')) : ?>
        <script>
        const returnUrl = window.sessionStorage.getItem('supjx.smartbrowser.editorReturn');
        window.sessionStorage.removeItem('supjx.smartbrowser.editorReturn');
        window.location.replace(returnUrl || <?php echo json_encode(Route::_('index.php?option=com_smartbrowser&view=browser', false)); ?>);
        </script>
    <?php endif;
    return;
}

$form = $this->editorForm;
$input = Factory::getApplication()->getInput();
$renderedFields = [];
$renderField = static function (string $name, ?string $group = null) use ($form, &$renderedFields): string {
    $field = $form->getField($name, $group);
    if (!$field) return '';
    $key = ($group ?? '') . '.' . $field->name;
    if (isset($renderedFields[$key])) return '';
    $renderedFields[$key] = true;
    return $field->renderField();
};
$fieldsetFields = static function (string $name) use ($form, &$renderedFields): array {
    $result = [];
    foreach ($form->getFieldset($name) as $field) {
        $key = ($field->group ?? '') . '.' . $field->name;
        if (isset($renderedFields[$key])) continue;
        $renderedFields[$key] = true;
        $result[] = $field;
    }
    return $result;
};
$hasFieldset = static fn (string $name): bool => count($form->getFieldset($name)) > 0;
$cancelUrl = Route::_('index.php?option=com_smartbrowser&task=editor.cancel&type=' . rawurlencode($this->resourceType), false);
$renderMenuTypeField = static function () use ($renderField): string {
    $html = $renderField('type');
    $siteUrl = htmlspecialchars(Route::_('index.php?option=com_smartbrowser&view=menutypes&tmpl=component', false), ENT_QUOTES, 'UTF-8');
    return str_replace(
        [
            'index.php?option=com_menus&amp;view=menutypes',
            'index.php?option=com_menus&view=menutypes',
            '/component/menus/?view=menutypes',
            'component/menus/?view=menutypes',
        ],
        [$siteUrl, $siteUrl, $siteUrl, ltrim($siteUrl, '/')],
        $html
    );
};
$allFieldsets = $form->getFieldsets();
$claimed = ['options', 'basic', 'jmetadata', 'item_associations', 'workflow', 'user_details', 'request', 'aliasoptions', 'image-intro', 'image-full'];
$contentParams = ComponentHelper::getParams('com_content');
$showPublishing = (int) $contentParams->get('show_publishing_options', 1) === 1;
$showImages = (int) $contentParams->get('show_urls_images_frontend', 0) === 1;
$saveHistory = (int) $contentParams->get('save_history', 0) === 1;
$showArticleTools = $this->resourceType === 'article' && $this->resourceId > 0;
$multilingual = Multilanguage::isEnabled();
$menuItemType = $this->resourceType === 'menu-item' ? $this->menuItemType : '';
$menuItemTypeTitleKey = match ($menuItemType) {
    'heading' => 'COM_MENUS_TYPE_HEADING',
    'url' => 'COM_MENUS_TYPE_EXTERNAL_URL',
    'separator' => 'COM_MENUS_TYPE_SEPARATOR',
    'alias' => 'COM_MENUS_TYPE_ALIAS',
    'container' => 'COM_MENUS_TYPE_CONTAINER',
    default => null,
};
?>
<div class="com-smartbrowser-editor container-fluid py-3<?php echo $input->getBool('sbpage') ? ' is-page' : ''; ?>" data-resource-type="<?php echo $this->escape($this->resourceType); ?>">
    <div class="smartbrowser-editor-busy" role="status" aria-live="polite" hidden><span class="spinner-border" aria-hidden="true"></span><span><?php echo Text::_('COM_SMARTBROWSER_WORKING'); ?></span></div>
    <?php if ($this->editorError !== '') : ?><div class="alert alert-danger smartbrowser-editor-error" role="alert"><?php echo nl2br($this->escape($this->editorError)); ?></div><?php endif; ?>
    <form action="<?php echo Route::_('index.php?option=com_smartbrowser&task=editor.save'); ?>" method="post" enctype="multipart/form-data" id="adminForm" class="form-validate form-vertical" data-browser-url="<?php echo $this->escape(Route::_('index.php?option=com_smartbrowser&view=browser&tmpl=component&Itemid=0', false)); ?>" data-editor-url="<?php echo $this->escape(Route::_('index.php?option=com_smartbrowser&view=editor&layout=modal&tmpl=component&Itemid=0', false)); ?>"<?php if ($menuItemType !== '') : ?> data-menu-item-type="<?php echo $this->escape($menuItemType); ?>"<?php endif; ?><?php if ($menuItemTypeTitleKey !== null) : ?> data-menu-item-type-title="<?php echo $this->escape(Text::_($menuItemTypeTitleKey)); ?>"<?php endif; ?>>
        <div class="smartbrowser-editor-actions d-flex gap-2 mb-3">
            <button type="submit" name="editorAction" value="save" class="btn btn-primary"><span class="icon-save" aria-hidden="true"></span> <?php echo Text::_('JSAVE'); ?></button>
            <button type="submit" name="editorAction" value="apply" class="btn btn-outline-primary"><span class="icon-check" aria-hidden="true"></span> <?php echo Text::_('JAPPLY'); ?></button>
            <?php if ($showArticleTools) : ?>
                <button type="submit" name="editorAction" value="copy" class="btn btn-outline-primary"><span class="icon-copy" aria-hidden="true"></span> <?php echo Text::_('JSAVEASCOPY'); ?></button>
            <?php endif; ?>
            <button type="button" class="btn btn-danger" onclick="this.form.action=<?php echo htmlspecialchars(json_encode($cancelUrl), ENT_QUOTES, 'UTF-8'); ?>; this.form.submit();"><span class="icon-cancel" aria-hidden="true"></span> <?php echo Text::_('JCANCEL'); ?></button>
            <?php if ($showArticleTools && $saveHistory && ComponentHelper::isEnabled('com_contenthistory')) : ?>
                <span class="smartbrowser-editor-versions"><?php echo $form->getInput('contenthistory'); ?></span>
            <?php endif; ?>
        </div>
        <div class="main-card">
        <?php echo HTMLHelper::_('uitab.startTabSet', 'smartbrowserEditorTabs', ['active' => 'smartbrowser-main', 'recall' => false, 'breakpoint' => 768]); ?>
        <?php if ($this->resourceType === 'article') : ?>
            <?php echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-main', Text::_('COM_CONTENT_ARTICLE_CONTENT')); ?>
                <div class="smartbrowser-editor-tab">
                    <div class="smartbrowser-editor-title-alias">
                        <?php echo $renderField('title'); ?>
                        <?php echo $renderField('alias'); ?>
                    </div>
                    <?php echo $renderField('articletext'); ?>
                    <?php echo $renderField('captcha'); ?>
                </div>
            <?php echo HTMLHelper::_('uitab.endTab'); ?>

            <?php if ($showImages && ($form->getField('image_intro', 'images') || $form->getField('urla', 'urls'))) : ?>
                <?php echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-images-links', Text::_('COM_CONTENT_IMAGES_AND_URLS')); ?>
                <div class="smartbrowser-editor-media-grid smartbrowser-editor-tab">
                    <div class="smartbrowser-editor-image-row">
                        <fieldset class="options-form"><legend><?php echo Text::_('COM_CONTENT_FIELD_INTRO_LABEL'); ?></legend><?php foreach (['image_intro', 'image_intro_alt', 'image_intro_alt_empty', 'image_intro_caption', 'float_intro'] as $name) echo $renderField($name, 'images'); ?></fieldset>
                        <fieldset class="options-form"><legend><?php echo Text::_('COM_CONTENT_FIELD_FULL_LABEL'); ?></legend><?php foreach (['image_fulltext', 'image_fulltext_alt', 'image_fulltext_alt_empty', 'image_fulltext_caption', 'float_fulltext'] as $name) echo $renderField($name, 'images'); ?></fieldset>
                    </div>
                    <div class="smartbrowser-editor-link-row">
                        <?php foreach ([['a', 'COM_CONTENT_FIELD_URLA_LABEL'], ['b', 'COM_CONTENT_FIELD_URLB_LABEL'], ['c', 'COM_CONTENT_FIELD_URLC_LABEL']] as [$suffix, $label]) : ?>
                            <fieldset class="options-form"><legend><?php echo Text::_($label); ?></legend>
                                <?php echo $renderField('url' . $suffix, 'urls'); ?>
                                <?php echo $renderField('url' . $suffix . 'text', 'urls'); ?>
                                <div class="control-group"><div class="controls"><?php echo $form->getInput('target' . $suffix, 'urls'); ?></div></div>
                            </fieldset>
                        <?php endforeach; ?>
                    </div>
                </div>
                <?php echo HTMLHelper::_('uitab.endTab'); ?>
            <?php endif; ?>

            <?php foreach ($allFieldsets as $fieldset) : ?>
                <?php if (in_array($fieldset->name, $claimed, true) || !empty($fieldset->repeat) || !$hasFieldset($fieldset->name)) continue; ?>
                <?php $fields = $fieldsetFields($fieldset->name); if (!$fields) continue; ?>
                <?php echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-' . preg_replace('/[^a-z0-9_-]/i', '-', $fieldset->name), Text::_($fieldset->label ?: 'JDETAILS')); ?>
                <fieldset class="options-form smartbrowser-editor-tab"><legend><?php echo Text::_($fieldset->label ?: 'JDETAILS'); ?></legend><?php foreach ($fields as $field) echo $field->renderField(); ?></fieldset>
                <?php echo HTMLHelper::_('uitab.endTab'); ?>
            <?php endforeach; ?>

            <?php echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-publishing-options', Text::_('COM_CONTENT_PUBLISHING')); ?>
            <fieldset class="options-form smartbrowser-editor-tab">
                <?php foreach (['transition', 'state', 'catid', 'tags', 'note'] as $name) echo $renderField($name); ?>
                <?php if ($saveHistory) echo $renderField('version_note'); ?>
                <?php if ($showPublishing) echo $renderField('created_by_alias'); ?>
                <?php if (Factory::getApplication()->getIdentity()->authorise('core.edit.state', 'com_content.article.' . $this->resourceId)) : ?>
                    <?php echo $renderField('featured'); ?>
                    <?php if ($showPublishing) : ?>
                        <?php foreach (['featured_up', 'featured_down', 'publish_up', 'publish_down'] as $name) echo $renderField($name); ?>
                    <?php endif; ?>
                <?php endif; ?>
                <?php echo $renderField('access'); ?>
            </fieldset>
            <?php echo HTMLHelper::_('uitab.endTab'); ?>

            <?php if ($multilingual) : ?>
                <?php echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-language', Text::_('JFIELD_LANGUAGE_LABEL')); ?>
                <fieldset class="options-form smartbrowser-editor-tab"><?php echo $renderField('language'); ?></fieldset>
                <?php echo HTMLHelper::_('uitab.endTab'); ?>
            <?php else : ?>
                <?php echo $renderField('language'); ?>
            <?php endif; ?>

            <?php if ($showPublishing) : ?>
                <?php echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-metadata', Text::_('COM_CONTENT_METADATA')); ?>
                <fieldset class="options-form smartbrowser-editor-tab">
                    <?php echo $renderField('metadesc'); ?>
                    <?php echo $renderField('metakey'); ?>
                </fieldset>
                <?php echo HTMLHelper::_('uitab.endTab'); ?>
            <?php endif; ?>

        <?php elseif ($this->resourceType === 'category') : ?>
            <?php echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-main', Text::_('JCATEGORY')); ?>
                <div class="smartbrowser-editor-tab">
                    <div class="smartbrowser-editor-title-alias">
                        <?php echo $renderField('title'); ?>
                        <?php echo $renderField('alias'); ?>
                    </div>
                    <?php echo $renderField('description'); ?>
                </div>
            <?php echo HTMLHelper::_('uitab.endTab'); ?>

            <?php if ($hasFieldset('basic')) : ?>
                <?php echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-options', Text::_('JOPTIONS')); ?>
                <fieldset class="options-form smartbrowser-editor-tab"><?php foreach ($fieldsetFields('basic') as $field) echo $field->renderField(); ?></fieldset>
                <?php echo HTMLHelper::_('uitab.endTab'); ?>
            <?php endif; ?>

            <?php foreach ($allFieldsets as $fieldset) : ?>
                <?php if (in_array($fieldset->name, $claimed, true) || !empty($fieldset->repeat) || !$hasFieldset($fieldset->name)) continue; ?>
                <?php $fields = $fieldsetFields($fieldset->name); if (!$fields) continue; ?>
                <?php echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-' . preg_replace('/[^a-z0-9_-]/i', '-', $fieldset->name), Text::_($fieldset->label ?: 'JDETAILS')); ?>
                <fieldset class="options-form smartbrowser-editor-tab"><legend><?php echo Text::_($fieldset->label ?: 'JDETAILS'); ?></legend><?php foreach ($fields as $field) echo $field->renderField(); ?></fieldset>
                <?php echo HTMLHelper::_('uitab.endTab'); ?>
            <?php endforeach; ?>

            <?php echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-publishing', Text::_('JGLOBAL_FIELDSET_PUBLISHING')); ?>
            <fieldset class="options-form smartbrowser-editor-tab">
                <?php foreach (['parent_id', 'published', 'access', 'tags', 'note'] as $name) echo $renderField($name); ?>
                <?php if ($saveHistory) echo $renderField('version_note'); ?>
                <?php echo $renderField('created_time'); ?>
            </fieldset>
            <?php echo HTMLHelper::_('uitab.endTab'); ?>

            <?php if ($multilingual) : ?>
                <?php echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-language', Text::_('JFIELD_LANGUAGE_LABEL')); ?>
                <fieldset class="options-form smartbrowser-editor-tab"><?php echo $renderField('language'); ?></fieldset>
                <?php echo HTMLHelper::_('uitab.endTab'); ?>
            <?php else : ?>
                <?php $form->setFieldAttribute('language', 'type', 'hidden'); ?>
                <?php $form->setFieldAttribute('language', 'default', '*'); ?>
                <?php echo $renderField('language'); ?>
            <?php endif; ?>

            <?php if ($showPublishing) : ?>
                <?php echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-metadata', Text::_('COM_CONTENT_METADATA')); ?>
                <fieldset class="options-form smartbrowser-editor-tab">
                    <?php echo $renderField('metadesc'); ?>
                    <?php echo $renderField('metakey'); ?>
                    <?php foreach ($fieldsetFields('jmetadata') as $field) echo $field->renderField(); ?>
                </fieldset>
                <?php echo HTMLHelper::_('uitab.endTab'); ?>
            <?php endif; ?>

        <?php else : ?>
            <?php
            $mainLabel = match ($this->resourceType) {
                'tag' => 'COM_TAGS_FIELDSET_DETAILS', 'menu-item' => 'COM_MENUS_ITEM_DETAILS',
                'user' => 'COM_USERS_USER_ACCOUNT_DETAILS', default => 'JDETAILS',
            };
            echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-main', Text::_($mainLabel));
            ?>
            <?php if ($this->resourceType === 'tag') : ?>
                <div class="smartbrowser-editor-tab">
                    <div class="smartbrowser-editor-title-alias"><?php echo $renderField('title'); ?><?php echo $renderField('alias'); ?></div>
                    <?php echo $renderField('description'); ?>
                </div>
            <?php elseif ($this->resourceType === 'menu-item') : ?>
                <div class="smartbrowser-editor-tab">
                <div class="smartbrowser-editor-primary">
                    <div class="smartbrowser-editor-description">
                        <fieldset class="options-form smartbrowser-editor-subfieldset">
                            <legend><?php echo Text::_('COM_SMARTBROWSER_EDITOR_MENU_BASICS'); ?></legend>
                            <div class="smartbrowser-editor-title-alias"><?php echo $renderField('title'); ?><?php echo $renderField('alias'); ?></div>
                            <?php echo $renderMenuTypeField(); ?>
                        </fieldset>
                        <?php foreach (['request', 'aliasoptions'] as $name) : ?>
                            <?php $fields = $fieldsetFields($name); if (!$fields) continue; ?>
                            <fieldset class="options-form smartbrowser-editor-subfieldset<?php echo $name === 'request' ? ' smartbrowser-editor-menu-request' : ''; ?>"><legend><?php echo Text::_($allFieldsets[$name]->label ?: 'JDETAILS'); ?></legend><?php foreach ($fields as $field) echo $field->renderField(); ?></fieldset>
                        <?php endforeach; ?>
                        <fieldset class="options-form smartbrowser-editor-subfieldset smartbrowser-editor-menu-link">
                            <legend><?php echo Text::_('COM_SMARTBROWSER_EDITOR_MENU_LINK'); ?></legend>
                            <?php foreach (['link', 'browserNav', 'template_style_id'] as $name) echo $renderField($name); ?>
                            <div class="smartbrowser-editor-global-fields"><?php echo $renderField('menutype'); ?></div>
                        </fieldset>
                    </div>
                </div>
                </div>
            <?php else : ?>
                <fieldset class="options-form smartbrowser-editor-tab"><?php foreach ($fieldsetFields('user_details') as $field) echo $field->renderField(); ?></fieldset>
            <?php endif; ?>
            <?php echo HTMLHelper::_('uitab.endTab'); ?>

        <?php if ($this->resourceType === 'tag' && ($hasFieldset('options') || $hasFieldset('image-intro') || $hasFieldset('image-fulltext'))) : ?>
            <?php echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-options', Text::_('JOPTIONS')); ?>
            <div class="smartbrowser-editor-tab smartbrowser-editor-fieldsets">
                <?php foreach (['options'] as $name) : ?>
                    <?php $fields = $fieldsetFields($name); if (!$fields) continue; ?>
                    <fieldset class="options-form"><legend><?php echo Text::_($allFieldsets[$name]->label ?: 'JDETAILS'); ?></legend><?php foreach ($fields as $field) echo $field->renderField(); ?></fieldset>
                <?php endforeach; ?>
                <div class="smartbrowser-editor-image-row">
                    <?php foreach (['image-intro', 'image-fulltext'] as $name) : ?>
                        <?php $fields = $fieldsetFields($name); if (!$fields) continue; ?>
                        <fieldset class="options-form"><legend><?php echo Text::_($allFieldsets[$name]->label ?: 'JDETAILS'); ?></legend><?php foreach ($fields as $field) echo $field->renderField(); ?></fieldset>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php echo HTMLHelper::_('uitab.endTab'); ?>
        <?php elseif ($this->resourceType !== 'article' && $this->resourceType !== 'category' && $hasFieldset('basic')) : ?>
            <?php echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-options', Text::_('JOPTIONS')); ?>
            <fieldset class="options-form smartbrowser-editor-tab"><?php foreach ($fieldsetFields('basic') as $field) echo $field->renderField(); ?></fieldset>
            <?php echo HTMLHelper::_('uitab.endTab'); ?>
        <?php endif; ?>

        <?php if ($this->resourceType === 'tag') : ?>
            <?php echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-publishing', Text::_('JGLOBAL_FIELDSET_PUBLISHING')); ?>
            <div class="smartbrowser-editor-publishing-grid smartbrowser-editor-tab">
                <fieldset class="options-form"><legend><?php echo Text::_('JGLOBAL_FIELDSET_PUBLISHING'); ?></legend><?php foreach (['parent_id', 'published', 'access', 'language', 'tags', 'note', 'version_note', 'created_user_id', 'created_time', 'modified_user_id', 'modified_time', 'hits', 'id'] as $name) echo $renderField($name); ?></fieldset>
                <fieldset class="options-form"><legend><?php echo Text::_('JGLOBAL_FIELDSET_METADATA_OPTIONS'); ?></legend><?php foreach ($fieldsetFields('jmetadata') as $field) echo $field->renderField(); ?></fieldset>
            </div>
            <?php echo HTMLHelper::_('uitab.endTab'); ?>
        <?php endif; ?>

        <?php if ($this->resourceType === 'menu-item') : ?>
            <?php echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-publishing', Text::_('JGLOBAL_FIELDSET_PUBLISHING')); ?>
            <fieldset class="options-form smartbrowser-editor-tab"><?php foreach (['parent_id', 'menuordering', 'published', 'home', 'publish_up', 'publish_down', 'access', 'language', 'note'] as $name) echo $renderField($name); ?></fieldset>
            <?php echo HTMLHelper::_('uitab.endTab'); ?>
        <?php endif; ?>

        <?php if (!in_array($this->resourceType, ['article', 'category'], true) && $hasFieldset('item_associations')) : ?>
            <?php echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-associations', Text::_('JGLOBAL_FIELDSET_ASSOCIATIONS')); ?>
            <fieldset class="options-form smartbrowser-editor-tab"><?php foreach ($fieldsetFields('item_associations') as $field) echo $field->renderField(); ?></fieldset>
            <?php echo HTMLHelper::_('uitab.endTab'); ?>
        <?php endif; ?>

        <?php if ($this->resourceType !== 'category' && $form->getField('rules')) : ?>
            <?php echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-permissions', Text::_('JCONFIG_PERMISSIONS_LABEL')); ?>
            <fieldset class="options-form smartbrowser-editor-tab"><?php echo $renderField('rules'); ?></fieldset>
            <?php echo HTMLHelper::_('uitab.endTab'); ?>
        <?php endif; ?>

        <?php foreach (!in_array($this->resourceType, ['article', 'category'], true) ? $allFieldsets : [] as $fieldset) : ?>
            <?php if (in_array($fieldset->name, $claimed, true) || !$hasFieldset($fieldset->name)) continue; ?>
            <?php $fields = $fieldsetFields($fieldset->name); if (!$fields) continue; ?>
            <?php echo HTMLHelper::_('uitab.addTab', 'smartbrowserEditorTabs', 'smartbrowser-' . preg_replace('/[^a-z0-9_-]/i', '-', $fieldset->name), Text::_($fieldset->label ?: 'JDETAILS')); ?>
            <fieldset class="options-form smartbrowser-editor-tab"><legend><?php echo Text::_($fieldset->label ?: 'JDETAILS'); ?></legend><?php foreach ($fields as $field) echo $field->renderField(); ?></fieldset>
            <?php echo HTMLHelper::_('uitab.endTab'); ?>
        <?php endforeach; ?>

        <?php endif; ?>

        <?php echo HTMLHelper::_('uitab.endTabSet'); ?>
        </div>
        <?php echo $form->renderControlFields(); ?>
        <?php if ($this->resourceType === 'category') echo $form->getInput('extension'); ?>
        <input type="hidden" name="type" value="<?php echo $this->escape($this->resourceType); ?>">
        <input type="hidden" name="id" value="<?php echo $this->resourceId; ?>">
        <?php if ($input->getBool('sbpage')) : ?><input type="hidden" name="sbpage" value="1"><?php endif; ?>
        <?php if ($this->resourceType === 'menu-item') : ?>
            <input type="hidden" name="menuTypeSelection" value="">
            <input type="hidden" name="editorParentId" value="<?php echo $input->getInt('parent_id', 1); ?>">
            <input type="hidden" name="editorMenuType" value="<?php echo $this->escape($input->getCmd('menutype')); ?>">
        <?php endif; ?>
        <?php echo HTMLHelper::_('form.token'); ?>
    </form>
</div>
<?php if ($this->resourceType === 'menu-item') : ?>
<script>
window.addEventListener('message', function (event) {
    if (event.origin !== window.location.origin || event.data?.messageType !== 'joomla:content-select-menutype') return;
    const form = document.getElementById('adminForm');
    form.elements.menuTypeSelection.value = event.data.encoded || '';
    form.action = <?php echo json_encode(Route::_('index.php?option=com_smartbrowser&task=editor.setMenuType', false)); ?>;
    form.submit();
});
</script>
<?php endif; ?>
