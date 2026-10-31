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
$administrator = Factory::getApplication()->isClient('administrator');
$popupExitLabel = $input->getCmd('tmpl') === 'component' && !$input->getBool('sbpage');
$helpUrl = null;
$articleSaveMenu = $administrator && $this->resourceType === 'article' && !$input->getBool('sbpage');
if ($articleSaveMenu) HTMLHelper::_('bootstrap.dropdown', '.sb-editor-save-toggle');
if ($administrator && !$input->getBool('sbpage') && class_exists(\Joomla\CMS\Help\Help::class)) {
    $helpKey = match ($this->resourceType) {
        'article' => 'Articles:_Edit', 'category' => 'Articles:_Edit_Category', 'tag' => 'Tags:_New_or_Edit',
        'menu-item' => 'Menus:_New_Item', 'user' => 'Users:_Edit_Profile', default => null,
    };
    if ($helpKey) $helpUrl = \Joomla\CMS\Help\Help::createUrl($helpKey);
}
$native = match ($this->resourceType) {
    'article' => 'com_content&task=article.edit',
    'category' => 'com_categories&task=category.edit&extension=com_content',
    'tag' => 'com_tags&task=tag.edit', 'menu-item' => 'com_menus&task=item.edit',
    'user' => 'com_users&task=user.edit', default => null,
};
$nativeUrl = $native && ($administrator || $this->resourceType === 'article')
    ? Route::_('index.php?option=' . ($this->resourceId > 0 ? $native : str_replace('.edit', '.add', $native)) . '&id=' . $this->resourceId . '&sbNative=1'
        . ($this->resourceType === 'article' ? '&catid=' . (int) $form->getValue('catid') : '')
        . (!$input->getBool('sbpage') ? '&tmpl=component&layout=modal' : ''), false) : null;
if (!$administrator && $this->resourceType === 'article' && $this->resourceId > 0) {
    $nativeReturn = $input->getString('sbReturn', '');
    $returnUrl = strlen($nativeReturn) <= 4096 ? base64_decode($nativeReturn, true) : false;
    if (!$returnUrl || !\Joomla\CMS\Uri\Uri::isInternal($returnUrl)) {
        $nativeReturn = base64_encode(\SuperSoft\Component\Smartbrowser\Administrator\Support\SiteArticleEditorRoute::link(
            Factory::getApplication(), $this->resourceId, (int) $form->getValue('catid'), (string) $form->getValue('language', null, '*')
        ));
    }
    $nativeUrl = \SuperSoft\Component\Smartbrowser\Administrator\Support\SiteArticleEditorRoute::link(
        Factory::getApplication(), $this->resourceId, (int) $form->getValue('catid'), (string) $form->getValue('language', null, '*'),
        array_replace(['task' => 'article.edit', 'a_id' => $this->resourceId, 'sbNative' => 1, 'return' => $nativeReturn],
            !$input->getBool('sbpage') ? ['tmpl' => 'component'] : [])
    );
}
$contextualArticle = !$administrator && $this->resourceType === 'article' && $input->getBool('sbEditor');
if ($nativeUrl) {
    $encodedReturn = $input->getString('sbReturn', '');
    $origin = strlen($encodedReturn) <= 4096 ? base64_decode($encodedReturn, true) : false;
    if ($origin && \Joomla\CMS\Uri\Uri::isInternal($origin)) {
        $nativeUrl .= (str_contains($nativeUrl, '?') ? '&' : '?') . 'sbReturn=' . rawurlencode($encodedReturn);
    }
}
$editorLink = static function (string $url) use ($contextualArticle, $form, $input): string {
    if (!$contextualArticle) return Route::_($url, false);
    parse_str((string) parse_url($url, PHP_URL_QUERY), $query);
    unset($query['option'], $query['view'], $query['id'], $query['Itemid']);
    return \SuperSoft\Component\Smartbrowser\Administrator\Support\SiteArticleEditorRoute::editor(
        Factory::getApplication(), $input->getInt('id'), (int) $form->getValue('catid'), (string) $form->getValue('language', null, '*'), $query
    );
};
$renderedFields = [];
$renderField = static function (string $name, ?string $group = null) use ($form, &$renderedFields): string {
    $field = $form->getField($name, $group);
    if (!$field) return '';
    $key = ($group ?? '') . '.' . $field->name;
    if (isset($renderedFields[$key])) return '';
    $renderedFields[$key] = true;
    return $field->renderField();
};
$articlePublishingFields = $this->resourceType === 'article'
    ? ['featured', 'publish_up', 'publish_down', 'featured_up', 'featured_down', 'created', 'created_by', 'created_by_alias', 'modified', 'modified_by', 'version', 'hits'] : [];
$fieldsetFields = static function (string $name) use ($form, &$renderedFields, $articlePublishingFields): array {
    $result = [];
    foreach ($form->getFieldset($name) as $field) {
        if (empty($field->group) && in_array($field->fieldname ?? $field->name, $articlePublishingFields, true)) continue;
        $key = ($field->group ?? '') . '.' . $field->name;
        if (isset($renderedFields[$key])) continue;
        $renderedFields[$key] = true;
        $result[] = $field;
    }
    return $result;
};
$hasFieldset = static fn (string $name): bool => count($form->getFieldset($name)) > 0;
$cancelUrl = $editorLink('index.php?option=com_smartbrowser&task=editor.cancel&type=' . rawurlencode($this->resourceType));
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
$claimed = ['options', 'basic', 'jmetadata', 'item_associations', 'workflow', 'user_details', 'request', 'aliasoptions', 'image-intro', 'image-full', 'linka', 'linkb', 'linkc'];
$contentParams = ComponentHelper::getParams('com_content');
$showPublishing = $administrator || (int) $contentParams->get('show_publishing_options', 1) === 1;
$showImages = $administrator || (int) $contentParams->get('show_urls_images_frontend', 0) === 1;
$historyComponent = match ($this->resourceType) { 'tag' => 'com_tags', 'menu-item' => 'com_menus', 'user' => 'com_users', default => 'com_content' };
$saveHistory = (int) ComponentHelper::getParams($historyComponent)->get('save_history', 0) === 1;
$showHistoryTools = in_array($this->resourceType, ['article', 'category', 'tag'], true) && $this->resourceId > 0;
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
<div class="com-smartbrowser-editor container-fluid py-3 is-aligned-editor<?php echo $input->getBool('sbpage') ? ' is-page' : ''; ?><?php echo $administrator && $input->getBool('sbpage') && $this->resourceType === 'article' ? ' is-admin-article-page' : ''; ?><?php echo $administrator && $input->getBool('sbpage') && $this->resourceType === 'category' ? ' is-admin-category-page' : ''; ?><?php echo $administrator && $input->getBool('sbpage') && in_array($this->resourceType, ['tag', 'menu-item', 'user'], true) ? ' is-admin-resource-page' : ''; ?>" data-resource-type="<?php echo $this->escape($this->resourceType); ?>">
    <div class="smartbrowser-editor-busy" role="status" aria-live="polite" hidden><span class="spinner-border" aria-hidden="true"></span><span><?php echo Text::_('COM_SMARTBROWSER_WORKING'); ?></span></div>
    <?php if ($this->editorError !== '') : ?><div class="alert alert-danger smartbrowser-editor-error" role="alert"><?php echo nl2br($this->escape($this->editorError)); ?></div><?php endif; ?>
    <form action="<?php echo $editorLink('index.php?option=com_smartbrowser&task=editor.save'); ?>" method="post" enctype="multipart/form-data" id="adminForm" class="form-validate form-vertical" data-reload-url="<?php echo $this->escape($editorLink('index.php?option=com_smartbrowser&task=editor.reload')); ?>" data-browser-url="<?php echo $this->escape(Route::_('index.php?option=com_smartbrowser&view=browser&tmpl=component&Itemid=0', false)); ?>" data-editor-url="<?php echo $this->escape(Route::_('index.php?option=com_smartbrowser&view=editor&layout=modal&tmpl=component&Itemid=0', false)); ?>"<?php if ($menuItemType !== '') : ?> data-menu-item-type="<?php echo $this->escape($menuItemType); ?>"<?php endif; ?><?php if ($menuItemTypeTitleKey !== null) : ?> data-menu-item-type-title="<?php echo $this->escape(Text::_($menuItemTypeTitleKey)); ?>"<?php endif; ?>>
        <div class="smartbrowser-editor-actions d-flex gap-2 mb-3">
            <?php if ($articleSaveMenu) : ?><div class="btn-group"><?php endif; ?>
            <button type="submit" name="editorAction" value="save" class="btn btn-primary"><span class="fas fa-save" aria-hidden="true"></span> <?php echo Text::_('COM_SMARTBROWSER_SAVE_CLOSE'); ?></button>
            <?php if ($articleSaveMenu) : ?>
                <button type="button" class="btn btn-primary dropdown-toggle dropdown-toggle-split sb-editor-save-toggle" data-bs-toggle="dropdown" aria-expanded="false" aria-label="<?php echo Text::_('JSAVE'); ?>"></button>
                <ul class="dropdown-menu"><li><button type="submit" name="editorAction" value="apply" class="dropdown-item"><?php echo Text::_('JAPPLY'); ?></button></li><?php if (Factory::getApplication()->getIdentity()->authorise('core.create', 'com_content')) : ?><li><button type="submit" name="editorAction" value="save2new" class="dropdown-item"><?php echo Text::_('JTOOLBAR_SAVE_AND_NEW'); ?></button></li><?php endif; ?></ul>
                </div>
            <?php endif; ?>
            <button type="submit" name="editorAction" value="apply" class="btn btn-outline-primary"><span class="fas fa-check" aria-hidden="true"></span> <?php echo Text::_('JAPPLY'); ?></button>
            <?php if ($administrator && $this->resourceType === 'article') : ?><button type="submit" name="editorAction" value="save2new" class="btn btn-outline-primary" hidden><?php echo Text::_('JTOOLBAR_SAVE_AND_NEW'); ?></button><?php endif; ?>
            <?php if ($showArticleTools) : ?>
                <button type="submit" name="editorAction" value="copy" class="btn btn-outline-primary"><span class="fas fa-copy" aria-hidden="true"></span> <?php echo Text::_('COM_SMARTBROWSER_SAVE_AS_COPY'); ?></button>
            <?php endif; ?>
            <button type="button" class="btn btn-danger" onclick="this.form.elements.task.value='editor.cancel'; this.form.action=<?php echo htmlspecialchars(json_encode($cancelUrl), ENT_QUOTES, 'UTF-8'); ?>; this.form.submit();"><span class="fas fa-times" aria-hidden="true"></span> <span<?php if ($popupExitLabel) : ?> data-sb-editor-exit-label data-dirty-label="<?php echo $this->escape(Text::_('JCANCEL')); ?>"<?php endif; ?>><?php echo Text::_($popupExitLabel ? 'JCLOSE' : 'JCANCEL'); ?></span></button>
            <?php if ($showHistoryTools && $saveHistory && ComponentHelper::isEnabled('com_contenthistory')) : ?>
                <span class="smartbrowser-editor-versions"><?php echo $form->getInput('contenthistory'); ?></span>
            <?php endif; ?>
            <?php if ($nativeUrl || $helpUrl) : ?><div class="d-flex gap-2 ms-auto smartbrowser-editor-tools"><?php if ($helpUrl) : ?><a class="btn btn-outline-secondary" href="<?php echo $this->escape($helpUrl); ?>" target="_blank" rel="noopener noreferrer"><span class="fas fa-question-circle" aria-hidden="true"></span> <?php echo Text::_('JHELP'); ?></a><?php endif; ?><?php if ($nativeUrl) : ?><a class="btn btn-outline-secondary smartbrowser-editor-native" href="<?php echo $this->escape($nativeUrl); ?>" title="Joomla" aria-label="Joomla"><span class="fab fa-joomla" aria-hidden="true"></span></a><?php endif; ?></div><?php endif; ?>
        </div>
        <div class="smartbrowser-editor-content">
        <?php if ($administrator && $this->resourceType === 'article') : ?>
            <?php require __DIR__ . '/article-admin.php'; ?>
        <?php elseif ($this->resourceType === 'article') : ?>
            <?php require __DIR__ . '/article-site.php'; ?>
        <?php elseif ($this->resourceType === 'category') : ?>
            <?php require __DIR__ . '/category-admin.php'; ?>
        <?php else : ?>
            <?php require __DIR__ . '/resource-native.php'; ?>
        <?php endif; ?>
        </div>
        <?php echo $form->renderControlFields(); ?>
        <input type="hidden" name="task" value="editor.save">
        <?php if ($this->resourceType === 'category') echo $form->getInput('extension'); ?>
        <input type="hidden" name="type" value="<?php echo $this->escape($this->resourceType); ?>">
        <input type="hidden" name="id" value="<?php echo $this->resourceId; ?>">
        <input type="hidden" name="sbReturn" value="<?php echo $this->escape($input->getString('sbReturn')); ?>">
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
    form.elements.task.value = 'editor.setMenuType';
    form.action = <?php echo json_encode(Route::_('index.php?option=com_smartbrowser&task=editor.setMenuType', false)); ?>;
    form.submit();
});
</script>
<?php endif; ?>
