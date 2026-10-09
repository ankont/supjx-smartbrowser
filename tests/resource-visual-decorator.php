<?php

define('_JEXEC', 1);
require_once __DIR__ . '/../package/component/admin/src/Support/ResourceDescriptor.php';
require __DIR__ . '/../package/component/admin/src/Support/ResourceVisualDecorator.php';
require __DIR__ . '/../package/component/admin/src/Support/VisualOptions.php';

use SuperSoft\Component\Smartbrowser\Administrator\Support\ResourceVisualDecorator;
use SuperSoft\Component\Smartbrowser\Administrator\Support\VisualOptions;

$resource = [
    'id' => 'category:7', 'kind' => 'node', 'icon' => 'fas fa-folder', 'image' => null,
    'statusPresentation' => ['icon' => 'fas fa-check', 'tone' => 'success'],
    'capabilities' => ['edit' => false],
    'overlays' => [['id' => 'status', 'icon' => 'fas fa-check', 'action' => 'unpublish']],
];
$response = ['nodes' => [$resource], 'breadcrumb' => [['id' => 'category:7', 'title' => 'Example']]];
$decorations = ['category:7' => [
    'image' => 'https://example.test/category.png', 'badgeIcon' => 'fas fa-book', 'imagePresentation' => 'base-corner',
    'capabilities' => ['edit' => true], 'statusPresentation' => ['tone' => 'danger'],
    'badges' => [
        ['id' => 'chronoview', 'icon' => 'fas fa-clock', 'label' => 'Scheduled', 'tone' => 'info', 'action' => 'delete'],
        ['id' => 'status', 'icon' => 'fas fa-trash', 'label' => 'Wrong'],
        ['id' => 'unsafe', 'image' => 'javascript:alert(1)', 'label' => 'Wrong'],
    ],
]];

$result = ResourceVisualDecorator::apply($response, $decorations);
$node = $result['nodes'][0];
if ($node['image'] !== 'https://example.test/category.png' || $node['badgeIcon'] !== 'fas fa-book') throw new RuntimeException('Visual decoration missing');
if (isset($node['imagePresentation'])) throw new RuntimeException('Plugin configured presentation');
if ($node['capabilities'] !== ['edit' => false] || $node['statusPresentation']['tone'] !== 'success') throw new RuntimeException('Protected state changed');
if (count($node['overlays']) !== 2 || isset($node['overlays'][1]['action']) || $node['overlays'][1]['id'] !== 'chronoview') throw new RuntimeException('Badges were not isolated');
if ($result['breadcrumb'][0]['badgeIcon'] !== 'fas fa-book') throw new RuntimeException('Breadcrumb decoration missing');
if (ResourceVisualDecorator::apply(['items' => [['id' => 'article:2']]], ['article:2' => ['image' => 'data:image/svg+xml,bad']])['items'][0] !== ['id' => 'article:2']) throw new RuntimeException('Unsafe image was accepted');
if (ResourceVisualDecorator::apply(['items' => [['id' => 'article:2']]], ['article:2' => ['imagePresentation' => 'arbitrary']])['items'][0] !== ['id' => 'article:2']) throw new RuntimeException('Unknown image presentation was accepted');
$decorated = ResourceVisualDecorator::apply(['items' => [$resource]], ['category:7' => ['baseMode' => 'hidden', 'visualPresentation' => 'badge-only', 'imageBackground' => 'checkerboard']])['items'][0];
if ($decorated !== $resource) throw new RuntimeException('Plugin changed component-owned presentation');
$params = new class {
    public array $values = ['visual_global' => ['nodes' => ['base' => ['style' => 'center-large']], 'items' => ['base' => ['style' => 'hidden']]]];
    public function get(string $key, mixed $default): mixed { return $this->values[$key] ?? $default; }
};
$global = VisualOptions::forAdapter('articles', $params);
if (($global['nodes']['base']['style'] !== 'center' || $global['nodes']['base']['size'] !== 'large') || $global['items']['base']['style'] !== 'hidden') throw new RuntimeException('Independent global profiles missing');
$params->values['visual_articles'] = ['nodes' => ['custom' => true, 'base' => ['style' => 'corner-large']], 'items' => ['custom' => false, 'base' => ['style' => 'badge']]];
$override = VisualOptions::forAdapter('flat-articles', $params);
if (($override['nodes']['base']['style'] !== 'corner' || $override['nodes']['base']['size'] !== 'large') || $override['items'] !== $global['items']) throw new RuntimeException('Independent flat override failed');
if (VisualOptions::forAdapter('featured-articles', $params) !== $global) throw new RuntimeException('Adapter override leaked');
$params->values['visual_articles']['nodes']['custom'] = false;
if (VisualOptions::forAdapter('articles', $params) !== $global) throw new RuntimeException('Disabled override applied');
if (VisualOptions::decode('not json') !== []) throw new RuntimeException('Malformed value accepted');
$legacy = VisualOptions::normalize(['baseMode' => 'behind', 'imageMode' => 'center', 'identityMode' => 'badge']);
$perMode = VisualOptions::normalize(['base' => ['style' => 'corner', 'sizes' => ['center' => 'medium', 'corner' => 'small', 'badge' => 'max']], 'image' => ['style' => 'center', 'sizes' => ['center' => 'max']]]);
if ($perMode['base']['size'] !== 'small' || $perMode['base']['sizes']['center'] !== 'medium' || $perMode['image']['size'] !== 'max') throw new RuntimeException('Per-mode sizes were combined');
if (VisualOptions::normalize($perMode) !== $perMode) throw new RuntimeException('Per-mode sizes not stable');
$migratedSizes = VisualOptions::normalize(['base' => ['style' => 'corner', 'size' => 'large']]);
if ($migratedSizes['base']['sizes']['corner'] !== 'large' || $migratedSizes['base']['sizes']['center'] !== 'medium') throw new RuntimeException('Legacy size overwrote inactive modes');
foreach (VisualOptions::SIZES as $size) {
    $sized = VisualOptions::normalize(['identity' => ['style' => 'badge', 'size' => $size]]);
    if ($sized['identity']['size'] !== $size || VisualOptions::normalize($sized) !== $sized) throw new RuntimeException('Badge size missing or unstable');
}
if ($legacy['base']['style'] !== 'corner' || $legacy['base']['size'] !== 'large' || $legacy['image']['style'] !== 'center' || $legacy['image']['size'] !== 'large') throw new RuntimeException('Legacy settings not migrated');
foreach (VisualOptions::STYLES as $base) {
    foreach (VisualOptions::STYLES as $identity) {
        foreach (VisualOptions::STYLES as $image) {
            $s = VisualOptions::normalize(['base' => ['style' => $base, 'anchor' => 'identity'], 'identity' => ['style' => $identity, 'anchor' => 'image'], 'image' => ['style' => $image, 'anchor' => 'base'], 'order' => ['image', 'image', [], 'unsafe']]);
            if (VisualOptions::normalize($s) !== $s) throw new RuntimeException('Normalization not stable');
            if ($s['order'] !== ['image', 'base', 'identity']) throw new RuntimeException('Invalid layer order');
        }
    }
}
$config = simplexml_load_file(__DIR__ . '/../package/component/admin/config.xml');
$fields = $config->xpath('//field[@type="visualappearance"]');
if (count($fields) !== 9) throw new RuntimeException('Missing appearance configuration');
foreach (['en-GB', 'el-GR'] as $language) {
    $strings = parse_ini_file(__DIR__ . '/../package/component/admin/language/' . $language . '/com_smartbrowser.ini', false, INI_SCANNER_RAW);
    foreach ($fields as $field) {
        if (!isset($strings[(string) $field['label']])) throw new RuntimeException('Missing appearance label');
    }
    foreach (['SIZE', 'SMALL', 'MEDIUM', 'LARGE', 'MAX', 'BASE', 'BASE_DESC', 'IDENTITY', 'IDENTITY_DESC', 'IMAGE', 'IMAGE_DESC', 'HIDDEN', 'CENTER', 'BEHIND', 'BADGE', 'CORNER', 'POSITION', 'TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_RIGHT', 'BACKGROUND', 'AUTO', 'TRANSPARENT', 'CHECKERBOARD', 'CUSTOM', 'INHERITED', 'PREVIEW', 'EXAMPLE', 'GLOBAL'] as $key) {
        if (!isset($strings['COM_SMARTBROWSER_VISUAL_' . $key])) throw new RuntimeException('Missing translated appearance control');
    }
}
$ruleProfile = VisualOptions::normalize(['rules' => [['asset' => 'image', 'style' => 'center', 'size' => 'max'], ['asset' => 'base', 'style' => 'center', 'size' => 'medium'], ['asset' => 'unsafe']]]);
if (count($ruleProfile['rules']) !== 2 || VisualOptions::normalize($ruleProfile) !== $ruleProfile) throw new RuntimeException('Ordered rules normalization unstable');
if (VisualOptions::normalize(['rules' => []]) !== ['rules' => []]) throw new RuntimeException('Empty composition not preserved');
$params = new class($ruleProfile) {
    public function __construct(private array $profile) {}
    public function get($key, $default = null) {
        return match ($key) {
            'visual_global' => ['nodes' => $this->profile, 'items' => $this->profile],
            'visual_categories' => ['nodes' => ['custom' => true, 'rules' => []]],
            default => $default,
        };
    }
};
$adapterRules = VisualOptions::forAdapter('flat-categories', $params);
if ($adapterRules['nodes'] !== ['rules' => []] || $adapterRules['items'] !== $ruleProfile) throw new RuntimeException('Rules overrides must replace, not merge inherited lists');
echo "Resource visual decoration and appearance settings OK\n";
