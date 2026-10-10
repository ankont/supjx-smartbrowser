<?php
define('_JEXEC', 1);
require_once __DIR__ . '/../package/component/admin/src/Support/ResourceDescriptor.php';
require __DIR__ . '/../package/component/admin/src/Support/CollectionResources.php';
require __DIR__ . '/../package/component/admin/src/Support/SelectionFieldValue.php';
require __DIR__ . '/../package/component/admin/src/Support/SelectionFieldSupport.php';
use SuperSoft\Component\Smartbrowser\Administrator\Support\SelectionFieldValue as Value;
use SuperSoft\Component\Smartbrowser\Administrator\Support\SelectionFieldSupport as Support;
function check($condition, $message) { if (!$condition) throw new RuntimeException($message); }
function fails(callable $callback) { try { $callback(); } catch (Throwable $error) { return; } throw new RuntimeException('Expected rejection'); }
$config = Support::configuration(['adapter' => 'media', 'multiple' => '1', 'selection_profile' => '{"visual.thumbnailOverride":{}}']);
check($config['editorDisplay'] === 'collection' && $config['ordering'], 'Multiple Auto');
check(Support::configuration(['adapter' => 'articles'])['editorDisplay'] === 'compact', 'Single Auto');
check(Support::configuration(['editor_display' => 'collection'])['editorDisplay'] === 'collection', 'Explicit single Collection');
check(Support::configuration([])['anchorSuggestions'] === 'none', 'Anchor suggestions default');
foreach (['none', 'anchors', 'all'] as $mode) check(Support::configuration(['anchor_suggestions' => $mode])['anchorSuggestions'] === $mode, 'Anchor suggestions configuration');
fails(fn () => Support::configuration(['anchor_suggestions' => 'invalid']));
check(Support::configuration([])['phoneCountryPrefix'] === '', 'No country default');
check(Support::configuration(['phone_country_prefix'=>'+30'])['phoneCountryPrefix'] === '+30', 'Phone country configuration');
fails(fn () => Support::configuration(['phone_country_prefix'=>'30']));
fails(fn () => Support::configuration(['selection_profile' => '[]']));
fails(fn () => Support::configuration(['allowed_resource_types' => 'image,<script>']));
fails(fn () => Support::configuration(['adapter' => '../media']));
$raw = json_encode(['version' => 1, 'adapter' => 'media', 'selection' => [['adapter' => 'media', 'id' => 'local-files:/book.pdf', 'title' => 'Not stored']],
    'usage' => ['local-files:/book.pdf' => ['visual.thumbnailOverride' => ['adapter' => 'media', 'id' => 'local-images:/cover.png']]], 'layout' => 'not stored']);
$decoded = Value::decode($raw, 'media', false);
check($decoded['items'][0]['selection']['id'] === 'local-files:/book.pdf' && !isset($decoded['items'][0]['selection']['title']) && !isset($decoded['layout']), 'No presentation data');
check(Value::decode(Value::encode($decoded)) === $decoded, 'Round trip');
check(Value::encode(Value::decode('')) === '', 'Clear');
fails(fn () => Value::decode('corrupt'));
fails(fn () => Value::decode(str_repeat('x', 262145)));
fails(fn () => Value::decode($raw, 'articles'));
fails(fn () => Value::decode(json_encode(['version' => 2, 'selection' => [], 'usage' => []])));
$mixed = ['version' => 1, 'items' => [
    ['selection' => ['adapter' => 'articles', 'id' => 'article:1'], 'usage' => []],
    ['selection' => ['adapter' => 'categories', 'id' => 'category:1'], 'usage' => []],
]];
check(Value::decode(Value::encode($mixed), ['articles', 'categories']) === $mixed, 'Mixed field round trip');
fails(fn () => Value::decode(Value::encode($mixed), ['articles', 'categories'], true, true));
fails(fn () => Value::decode(Value::encode($mixed), ['articles'], true));
fails(fn () => Value::decode(Value::encode($mixed), ['articles', 'categories'], false));
check(Support::configuration(['homogeneous' => '0'])['homogeneous'] === false, 'Mixed field constraint');
$calls = [];
$prepared = Support::prepare($raw, $config, function ($reference, $options) use (&$calls) {
    $calls[] = $reference;
    if ($reference['id'] === 'local-images:/cover.png') return ['id' => $reference['id'], 'type' => 'image', 'image' => 'cover.png'];
    return ['id' => $reference['id'], 'title' => '<safe title>', 'type' => 'document', 'image' => 'default.png',
        'selectionCapabilities' => [['key' => 'visual.thumbnailOverride', 'type' => 'resource', 'visualRole' => 'thumbnail', 'picker' => ['adapter' => 'media', 'allowedResourceTypes' => ['image']]]]];
});
check($prepared['items'][0]['selection']['id'] === 'local-files:/book.pdf' && $prepared['items'][0]['effectiveThumbnail'] === 'cover.png', 'Override does not replace identity');
check(count($calls) === 2, 'Reuse resolver for references');
$missing = Support::prepare($raw, $config, fn () => throw new RuntimeException('Denied', 403));
check($missing['items'][0]['unavailable'] && $missing['items'][0]['resource']['title'] === '' && $missing['items'][0]['effectiveThumbnail'] === null, 'Denied reference never exposes resolved data');
check($missing['items'][0]['effectiveIcon'] === null, 'Denied icon must stay unavailable');
$visualConfig = Support::configuration(['allowed_adapters'=>['articles'], 'selection_profile'=>'{"visual.iconOverride":{},"visual.thumbnailOverride":{}}']);
$visualRaw = '{"version":1,"items":[{"selection":{"adapter":"articles","id":"article:42"},"usage":{"visual.iconOverride":"fas fa-book"}}]}';
$visual = Support::prepare($visualRaw, $visualConfig, static fn ($ref) => ['id'=>$ref['id'],'icon'=>'fas fa-newspaper','image'=>'natural.jpg',
    'metadata'=>['id'=>42,'alias'=>'public','customAdapterProperty'=>['nested'=>true]]]);
check($visual['items'][0]['effectiveIcon'] === 'fas fa-book' && $visual['items'][0]['effectiveThumbnail'] === 'natural.jpg', 'Independent effective visuals');
check($visual['items'][0]['resource']['icon'] === 'fas fa-newspaper' && $visual['items'][0]['resource']['metadata']['customAdapterProperty']['nested'], 'Native icon/adapter metadata retained');
check(in_array('visual.thumbnailOverride',array_column($visual['items'][0]['resource']['selectionCapabilities'],'key'),true), 'Non-Media generic capability missing');
check(Support::prepare('broken', $config)['invalid'], 'Corrupt prepared value');
$preparedMixed = Support::prepare(Value::encode($mixed), Support::configuration(['allowed_adapters' => ['articles', 'categories'], 'multiple' => '1', 'homogeneous' => '0']), fn ($reference) => ['id' => $reference['id'], 'title' => $reference['adapter'], 'kind' => 'item', 'type' => 'article']);
check(array_column($preparedMixed['items'], 'selection') === array_column($mixed['items'], 'selection') && $preparedMixed['items'][1]['resource']['title'] === 'categories', 'Mixed prepared values remain ordered and adapter-scoped');
$field = (object) ['smartbrowser' => $prepared];
ob_start(); require __DIR__ . '/../package/plugins/fields/smartbrowserpicker/tmpl/smartbrowser.php'; $output = ob_get_clean();
check($output === '&lt;safe title&gt;', 'Safe fallback output');
echo "Field serialization, configuration, per-resource usage, prepared overrides, unavailable states and safe output OK\n";
