<?php
define('_JEXEC', 1);
require __DIR__ . '/../package/component/admin/src/Support/VisualRulesUpgrade.php';
use SuperSoft\Component\Smartbrowser\Administrator\Support\VisualRulesUpgrade;
$rules = [
    ['asset' => 'image', 'style' => 'center', 'z' => 2],
    ['asset' => 'base', 'style' => 'center', 'z' => 1],
    ['asset' => 'base', 'style' => 'corner', 'z' => 0],
    ['asset' => 'identity', 'style' => 'badge', 'z' => 2],
];
$params = ['unrelated' => 'keep', 'visual_global' => json_encode(['nodes' => ['rules' => $rules], 'items' => ['rules' => []]]), 'visual_media' => ['nodes' => ['custom' => true, 'rules' => $rules]], 'visual_users' => ['items' => ['custom' => false]]];
$result = VisualRulesUpgrade::params($params);
$global = json_decode($result['visual_global'], true);
if (array_column($global['nodes']['rules'], 'priority') !== [4, 1, 2, 3]) throw new RuntimeException('Selection priorities or stable paint-order migration failed');
foreach ($global['nodes']['rules'] as $rule) if (isset($rule['z'])) throw new RuntimeException('Old layer survived');
if ($global['items']['rules'] !== [] || $result['visual_media']['nodes']['custom'] !== true || $result['unrelated'] !== 'keep' || $result['visual_users'] !== $params['visual_users']) throw new RuntimeException('Unrelated options or overrides changed');
if (VisualRulesUpgrade::params($result) !== $result) throw new RuntimeException('Upgrade is not idempotent');
echo "Visual upgrade preserves priorities, stable paint order, overrides and empty settings OK\n";
