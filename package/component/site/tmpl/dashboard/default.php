<?php defined('_JEXEC') or die; ?>
<?php if ($this->browserMode) : ?>
    <div id="smartbrowser-app" class="smartbrowser" aria-live="polite"></div>
<?php else : ?>
    <div class="smartbrowser-dashboard">
        <h1><?php echo \Joomla\CMS\Language\Text::_('COM_SMARTBROWSER_DASHBOARD'); ?></h1>
        <div class="smartbrowser-dashboard-grid">
            <?php foreach ($this->items as $item) : ?>
                <a class="smartbrowser-dashboard-item" href="<?php echo htmlspecialchars($item['url'], ENT_QUOTES, 'UTF-8'); ?>">
                    <span class="<?php echo htmlspecialchars($item['icon'], ENT_QUOTES, 'UTF-8'); ?>" aria-hidden="true"></span>
                    <strong><?php echo htmlspecialchars($item['label'], ENT_QUOTES, 'UTF-8'); ?></strong>
                    <span><?php echo htmlspecialchars($item['description'], ENT_QUOTES, 'UTF-8'); ?></span>
                </a>
            <?php endforeach; ?>
        </div>
    </div>
<?php endif; ?>
