<?php
define('_JEXEC', 1);
require __DIR__ . '/../package/component/admin/src/Support/CollectionResources.php';
require __DIR__ . '/../package/component/admin/src/Support/SelectionUsageValidation.php';
use SuperSoft\Component\Smartbrowser\Administrator\Support\SelectionUsageValidation as Usage;
function usageFails(callable $callback) { try { $callback(); } catch (InvalidArgumentException $error) { return; } throw new RuntimeException('Expected usage rejection'); }
$resource = ['selectionCapabilities' => [
    ['key' => 'example.label', 'type' => 'string', 'default' => 'Default', 'validation' => ['maxLength' => 12]],
    ['key' => 'example.decorative', 'type' => 'boolean', 'default' => false],
    ['key' => 'example.loading', 'type' => 'string', 'default' => 'auto', 'options' => [['value' => 'auto'], ['value' => 'lazy']]],
    ['key' => 'example.cover', 'type' => 'resource', 'default' => null, 'picker' => ['adapter' => 'media', 'allowedResourceTypes' => ['image']]],
]];
$profile = ['example.label' => ['required' => true, 'presentation' => 'hidden'], 'example.decorative' => [], 'example.loading' => [], 'example.cover' => []];
$resolve = fn ($reference) => ['id' => $reference['id'], 'type' => str_ends_with($reference['id'], '.png') ? 'image' : 'document'];
$defaults = Usage::values($resource, $profile, [], $resolve);
if ($defaults !== ['example.label' => 'Default', 'example.decorative' => false, 'example.loading' => 'auto', 'example.cover' => null]) throw new RuntimeException('Usage defaults lost');
foreach ([['example.decorative' => 'true'], ['example.loading' => 'invalid'], ['example.label' => str_repeat('x', 13)], ['example.unknown' => 'x'], ['example.label' => ''], ['example.cover' => ['adapter' => 'media', 'id' => 'local:/book.pdf']], ['example.cover' => ['adapter' => 'articles', 'id' => 'article:1']]] as $invalid) usageFails(fn () => Usage::values($resource, $profile, $invalid, $resolve));
$reference = ['adapter' => 'media', 'id' => 'local:/cover.png'];
$result = Usage::values($resource, $profile, ['example.cover' => [...$reference, 'title' => 'Do not store', 'image' => 'Do not store']], $resolve);
if ($result['example.cover'] !== $reference) throw new RuntimeException('Usage reference not normalized');
usageFails(fn () => Usage::values($resource, $profile, ['example.cover' => $reference], fn () => ['unavailable' => true]));
$resource['selectionCapabilities'][0] += ['disabledWhen' => ['key' => 'example.decorative', 'equals' => true], 'inactiveValue' => ''];
if (Usage::values($resource, $profile, ['example.decorative' => true], $resolve)['example.label'] !== '') throw new RuntimeException('Dependent alt/decorative rule lost');
echo "Server capability/profile validation, defaults, dependency, options and normalized resource ACL/type constraints OK\n";
