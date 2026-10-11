<?php
namespace Joomla\CMS\Uri { class Uri { public static function root() { return 'https://example.test/'; } } }
namespace Joomla\Plugin\Filesystem\Local\Adapter { class LocalAdapter { public function getUrl($path) { return 'https://example.test/images' . $path; } } }
namespace Joomla\Component\Media\Administrator\Model {
    class MediaModel { public function getProviders() { return [(object) ['name'=>'local', 'adapterNames'=>['images']]]; } }
    class ApiModel { public function getAdapter($name) { return new \Joomla\Plugin\Filesystem\Local\Adapter\LocalAdapter(); } }
}
namespace {
    define('_JEXEC', 1);
    require __DIR__ . '/../package/component/admin/src/Support/ArticleMediaSelection.php';
    require __DIR__ . '/../package/component/admin/src/Support/DirectLinkUri.php';
    require __DIR__ . '/../package/component/admin/src/Support/CollectionResources.php';
    use SuperSoft\Component\Smartbrowser\Administrator\Support\ArticleMediaSelection as Bridge;
    $check = static function ($condition, $message) { if (!$condition) throw new \RuntimeException($message); };
    $check(Bridge::imageReference('images/a.jpg') === ['adapter'=>'media','id'=>'local-images:/a.jpg'], 'Configured local root mapping');
    $check(Bridge::imageReference('images/a.jpg#joomlaImage://local-images/a.jpg?width=10')['id'] === 'local-images:/a.jpg', 'Native image marker');
    $check(Bridge::imageReference('https://evil.test/a.jpg') === null, 'External image guessed as local');
    $check(Bridge::imageReference('images/../private/a.jpg') === null, 'Traversal accepted');
    $urls = ['urla'=>'', 'urlatext'=>'orphan', 'targeta'=>'3', 'urlb'=>'/second', 'urlbtext'=>'Second', 'targetb'=>'1', 'urlc'=>'0', 'urlctext'=>'Zero', 'targetc'=>'', 'extension'=>'keep'];
    $ordered = Bridge::orderedLinks($urls);
    $check($urls['urla'] === '' && $ordered['urla'] === '/second' && $ordered['urlatext'] === 'Second' && $ordered['targeta'] === '1', 'Ordered native slot mapping');
    $check($ordered['urlb'] === '0' && $ordered['urlc'] === '' && $ordered['extension'] === 'keep', 'Empty compaction lost metadata or valid URL');
    $form = new class($urls) { public function __construct(private array $urls) {} public function getValue($name, $group, $default) { return $this->urls[$name] ?? $default; } };
    $entry = Bridge::linkEntry($form, 'b');
    $check($entry['usage'] === ['link.text'=>'Second', 'link.target'=>'1'], 'Native usage mapping');
    $check(Bridge::linkEntry($form, 'a') === null, 'Empty native slot became a resource');
    $class = \SuperSoft\Component\Smartbrowser\Administrator\Support\CollectionResources::class;
    $entries = array_map(static fn($n) => ['selection'=>['adapter'=>'direct-links','id'=>'uri:' . rtrim(strtr(base64_encode('/' . $n), '+/', '-_'), '=')]], range(1, 4));
    try { $class::entries($entries, ['maxSelections'=>3]); throw new \RuntimeException('Limit ignored'); }
    catch (\InvalidArgumentException $error) { $check($error->getCode() === 400, 'Wrong limit error'); }
    $check(count($class::entries(array_slice($entries, 0, 3), ['maxSelections'=>3])) === 3, 'Valid three rejected');
    echo "Article native media bridge and bounded collections OK\n";
}
