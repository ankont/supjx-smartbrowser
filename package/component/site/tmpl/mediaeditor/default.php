<?php
defined('_JEXEC') or die;

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Layout\LayoutHelper;
use Joomla\CMS\Uri\Uri;

$fieldSets = $this->form->getFieldsets();
?>
<form id="media-form" class="media-form" onsubmit="return false">
    <?php // The host owns the responsive tab bar; keep native accordion headings disabled. ?>
    <?php echo HTMLHelper::_('uitab.startTabSet', 'myTab', ['active' => 'attrib-' . reset($fieldSets)->name, 'breakpoint' => 1]); ?>
    <?php echo LayoutHelper::render('joomla.edit.params', $this); ?>
    <div id="media-manager-edit-container" class="media-manager-edit"></div>
    <?php echo HTMLHelper::_('uitab.endTabSet'); ?>
</form>
<script type="module" src="<?php echo Uri::root(true); ?>/media/com_smartbrowser/js/media-image-editor.js"></script>
