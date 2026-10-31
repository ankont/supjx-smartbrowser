<?php
defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Layout\LayoutHelper;

$escape = static fn ($value) => htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$resource = $displayData['resource'];
if (!empty($displayData['unavailable'])) echo '<div class="smartbrowser-resource-unavailable">';
$url = $displayData['url'];
$title = $escape($displayData['title']);
$link = static function (string $label) use ($displayData, $url, $escape): string {
    if (!$url) return $label;
    $target = $displayData['target'] ? ' target="_blank" rel="noopener noreferrer"' : '';
    return '<a href="' . $escape($url) . '"' . $target . '>' . $label . '</a>';
};
$image = $displayData['image'];
if ($image) {
    if ($image['class'] === '') unset($image['class']);
    else $image['class'] = $escape($image['class']);
    $html = LayoutHelper::render('joomla.html.image', $image);
    if (($resource['type'] ?? '') !== 'image') $html = $link($html);
    if ($displayData['caption'] !== '' || !empty($displayData['figureClass']) || ($resource['type'] ?? '') !== 'image') {
        echo '<figure class="' . $escape(trim('item-image ' . ($displayData['figureClass'] ?? ''))) . '">' . $html;
        if ($displayData['caption'] !== '') echo '<figcaption class="caption">' . $escape($displayData['caption']) . '</figcaption>';
        echo '</figure>';
    } else echo $html;
}
if ($displayData['icon']) {
    Factory::getApplication()->getDocument()->getWebAssetManager()->useStyle('fontawesome');
    echo '<span class="' . $escape($displayData['icon']) . '" aria-hidden="true"></span> ';
}
if (!$image || ($resource['type'] ?? '') !== 'image') echo $link($title);
if (!empty($displayData['unavailable'])) echo '</div>';
