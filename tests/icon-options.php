<?php
define('_JEXEC', 1);
require __DIR__ . '/../package/component/admin/src/Support/IconOptions.php';
use SuperSoft\Component\Smartbrowser\Administrator\Support\IconOptions;
$saved = IconOptions::normalize(['articles' => ['adapter' => 'fa-book', 'node' => 'fas fa-cube', 'open' => 'fas fa-cubes', 'item' => 'far fa-newspaper'], 'media' => ['pdf' => 'fas fa-book'], 'menus' => ['node' => '<script>', 'item' => []], 'unknown' => ['node' => 'fas fa-bug']]);
if (isset($saved['menus']) || isset($saved['unknown']) || $saved['articles']['adapter'] !== 'fas fa-book') throw new RuntimeException('Icon validation failed');
if (IconOptions::normalize($saved) !== $saved) throw new RuntimeException('Icon options are not stable');
$node = IconOptions::resource(['kind' => 'node', 'icon' => 'fas fa-box'], 'articles', $saved);
if ($node['icon'] !== 'fas fa-cube' || $node['openIcon'] !== 'fas fa-cubes') throw new RuntimeException('Node overrides failed');
$item = IconOptions::resource(['kind' => 'item', 'icon' => 'fas fa-newspaper'], 'articles', $saved);
if ($item['icon'] !== 'far fa-newspaper') throw new RuntimeException('Item override failed');
$special = ['kind' => 'node', 'icon' => 'fas fa-minus', 'badgeIcon' => 'fas fa-home'];
if (IconOptions::resource($special, 'menus', $saved) !== $special) throw new RuntimeException('Special or identity icon changed');
$custom = ['kind' => 'node', 'icon' => 'fas fa-school'];
if (IconOptions::resource($custom, 'articles', $saved) !== $custom) throw new RuntimeException('External icon changed');
if (IconOptions::resource(['kind' => 'item', 'icon' => 'fas fa-file-pdf'], 'media', $saved)['icon'] !== 'fas fa-book') throw new RuntimeException('Media type override failed');
if (IconOptions::forAdapter('articles', [])['adapter'] !== 'fas fa-book-open') throw new RuntimeException('Default fallback failed');
$menus = IconOptions::normalize(['menus' => ['heading' => 'fas fa-heading', 'heading_node' => 'fas fa-box', 'heading_open' => 'fas fa-box-open', 'separator' => 'fas fa-grip-lines']]);
foreach (['fas fa-list' => 'fas fa-heading', 'fas fa-minus' => 'fas fa-grip-lines'] as $native => $expected) {
    $result = IconOptions::resource(['kind' => 'node', 'type' => 'menu-item', 'icon' => $native, 'badgeIcon' => 'fas fa-home'], 'menus', $menus);
    if ($result['icon'] !== $expected || $result['badgeIcon'] !== 'fas fa-home') throw new RuntimeException('Menu heading/separator override failed');
}
$heading = IconOptions::resource(['kind' => 'node', 'type' => 'menu-item', 'icon' => 'fas fa-diagram-predecessor', 'metadata' => ['menuItemKind' => 'heading']], 'menus', $menus);
if ($heading['icon'] !== 'fas fa-box' || $heading['openIcon'] !== 'fas fa-box-open') throw new RuntimeException('Open heading override failed');
$ordinary = IconOptions::resource(['kind' => 'node', 'type' => 'menu-item', 'icon' => 'fas fa-diagram-predecessor', 'metadata' => ['menuItemKind' => 'component']], 'menus', $menus);
if ($ordinary['icon'] !== 'fas fa-diagram-predecessor' || $ordinary['openIcon'] !== 'fas fa-diagram-successor') throw new RuntimeException('Heading override affected ordinary menu item');
if (IconOptions::resource(['kind' => 'node', 'type' => 'menu-item', 'icon' => 'fas fa-school'], 'menus', $menus)['icon'] !== 'fas fa-school') throw new RuntimeException('Custom menu icon changed');
echo "Icon defaults, validation, media types and external/special identity preservation OK\n";
