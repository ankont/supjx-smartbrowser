<?php
defined('_JEXEC') or die;

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;

$wa = $this->getDocument()->getWebAssetManager();
$wa->useScript('modal-content-select');
?>
<div class="container-fluid py-3">
<?php echo HTMLHelper::_('bootstrap.startAccordion', 'smartbrowserMenuTypes', ['active' => 'slide1']); ?>
<?php $index = 0; foreach ($this->types as $name => $items) : ?>
    <?php echo HTMLHelper::_('bootstrap.addSlide', 'smartbrowserMenuTypes', $name, 'smartbrowserMenuType' . $index++); ?>
    <div class="list-group">
    <?php foreach ($items as $title => $item) :
        $selection = ['id' => $this->recordId, 'title' => $item->type ?? $item->title, 'request' => $item->request];
        $encoded = base64_encode(json_encode($selection));
    ?>
        <a href="#" class="choose_type list-group-item list-group-item-action"
           data-content-select data-content-type="com_menus.menutype"
           data-message-type="joomla:content-select-menutype"
           data-item-id="<?php echo (int) $this->recordId; ?>"
           data-type="<?php echo $this->escape($item->type ?? $item->title); ?>"
           data-request="<?php echo $item->request ? $this->escape(json_encode($item->request)) : ''; ?>"
           data-encoded="<?php echo $this->escape($encoded); ?>">
            <div class="pe-2"><?php echo $title; ?></div>
            <small class="text-muted"><?php echo Text::_($item->description); ?></small>
        </a>
    <?php endforeach; ?>
    </div>
    <?php echo HTMLHelper::_('bootstrap.endSlide'); ?>
<?php endforeach; ?>
<?php echo HTMLHelper::_('bootstrap.endAccordion'); ?>
</div>
