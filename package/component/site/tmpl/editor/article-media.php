<?php
defined('_JEXEC') or die;

use Joomla\CMS\Component\ComponentHelper;
use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Uri\Uri;
use SuperSoft\Component\Smartbrowser\Administrator\Support\ArticleMediaSelection;
use SuperSoft\Component\Smartbrowser\Administrator\Support\CollectionViewSupport;

$document = Factory::getApplication()->getDocument();
$baseConfig = CollectionViewSupport::prepare($document);
$assets = $document->getWebAssetManager();
$assets->useScript('com_smartbrowser.picker');
$assets->registerScript('com_smartbrowser.article-media', 'com_smartbrowser/article-media.js', [], ['type' => 'module'], ['core', 'com_smartbrowser.picker']);
$assets->useScript('com_smartbrowser.article-media');
Factory::getApplication()->getLanguage()->load('plg_fields_smartbrowserpicker', JPATH_ADMINISTRATOR, null, true);
foreach (['INVALID', 'EDIT', 'SELECT', 'CLEAR'] as $key) Text::script('PLG_FIELDS_SMARTBROWSERPICKER_' . $key);
$escape = static fn ($value) => htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
$picker = static function (array $entries, array $mapping, bool $multiple) use ($escape, $baseConfig, $form): void {
    $media = $mapping['group'] === 'images';
    $config = [...$baseConfig, 'pickerUrl' => Uri::base() . 'index.php?option=com_smartbrowser&view=browser',
        'adapter' => $media ? 'media' : 'direct-links', 'allowedAdapters' => [$media ? 'media' : 'direct-links'],
        'allowedResourceTypes' => [$media ? 'image' : 'uri'], 'selectionTarget' => 'item', 'homogeneous' => true,
        'multiple' => $multiple, 'maxSelections' => $multiple ? 3 : 1, 'ordering' => $multiple, 'editorDisplay' => 'compact',
        'selectionProfile' => array_fill_keys($media ? ['media.alt', 'media.decorative', 'media.caption', 'media.class'] : ['link.text', 'link.target'], (object) []),
        'anchorSuggestions' => 'anchors', 'preserveUsageOnReplace' => true];
    if (!$multiple) {
        $defaults = $media ? ArticleMediaSelection::imageUsage($form, $mapping['role']) : [
            'link.text' => (string) $form->getValue('url' . $mapping['slots'][0] . 'text', 'urls', ''),
            'link.target' => (string) $form->getValue('target' . $mapping['slots'][0], 'urls', '')];
        foreach ($defaults as $key => $value) $config['selectionProfile'][$key] = ['default' => $value];
    }
    echo '<div class="sb-selection-field" data-sb-article-media="' . $escape(json_encode($mapping, JSON_THROW_ON_ERROR)) . '" data-sb-field="' . $escape(json_encode($config, JSON_THROW_ON_ERROR)) . '">';
    echo '<input type="hidden" data-sb-value value="' . $escape(json_encode(['version' => 1, 'items' => $entries], JSON_THROW_ON_ERROR)) . '">';
    echo '<div data-sb-collection></div><p class="text-danger" data-sb-error role="alert" hidden></p></div>';
};
?>
<div class="smartbrowser-editor-media-grid smartbrowser-editor-tab">
    <div class="smartbrowser-editor-image-row">
    <?php foreach (['intro' => ['image_intro', 'COM_CONTENT_FIELD_INTRO_LABEL', 'image-intro'], 'fulltext' => ['image_fulltext', 'COM_CONTENT_FIELD_FULL_LABEL', 'image-full']] as $role => [$prefix, $label, $fieldset]) : ?>
        <fieldset class="options-form" data-sb-native-media>
            <legend><?php echo Text::_($label); ?></legend>
            <?php
            foreach ([$prefix, $prefix . '_alt', $prefix . '_alt_empty', $prefix . '_caption', 'float_' . $role] as $name) echo $renderField($name, 'images');
            foreach ($fieldsetFields($fieldset) as $field) echo $field->renderField();
            ?>
        </fieldset>
    <?php endforeach; ?>
    </div>
    <?php
    $list = ComponentHelper::getParams('com_smartbrowser')->get('article_links_layout', 'slots') === 'list';
    $entries = []; $representable = true;
    try { foreach (['a', 'b', 'c'] as $slot) { $entry = ArticleMediaSelection::linkEntry($form, $slot); if ($entry) $entries[] = $entry; } }
    catch (\Throwable $error) { $representable = false; }
    // A collection cannot represent duplicate destinations without losing native slots.
    if (count(array_unique(array_column(array_column($entries, 'selection'), 'id'))) !== count($entries)) $representable = false;
    $list = $list && $representable;
    ?>
    <div class="smartbrowser-editor-link-row<?php echo $list ? ' is-link-collection' : ''; ?>">
    <?php if ($list) : ?><input type="hidden" name="jform[sb_links_list]" value="1"><fieldset class="options-form" data-sb-native-media><legend><?php echo Text::_('COM_SMARTBROWSER_ARTICLE_LINKS'); ?></legend><?php endif; ?>
    <?php foreach (['a', 'b', 'c'] as $slot) : ?>
        <?php if (!$list) : ?><fieldset class="options-form" data-sb-native-media><legend><?php echo Text::_('COM_CONTENT_FIELD_URL' . strtoupper($slot) . '_LABEL'); ?></legend><?php endif; ?>
        <?php
        foreach (['url' . $slot, 'url' . $slot . 'text', 'target' . $slot] as $name) echo $renderField($name, 'urls');
        foreach ($fieldsetFields('link' . $slot) as $field) echo $field->renderField();
        if (!$list) {
            try { $entry = ArticleMediaSelection::linkEntry($form, $slot); $picker($entry ? [$entry] : [], ['group' => 'urls', 'slots' => [$slot]], false); }
            catch (\Throwable $error) { /* Preserve native legacy URLs unchanged. */ }
        }
        ?>
        <?php if (!$list) : ?></fieldset><?php endif; ?>
    <?php endforeach; ?>
    <?php if ($list) : ?><?php $picker($entries, ['group' => 'urls', 'slots' => ['a', 'b', 'c']], true); ?></fieldset><?php endif; ?>
    </div>
</div>
