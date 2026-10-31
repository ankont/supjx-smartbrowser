<?php
define('_JEXEC', 1);
$base = __DIR__ . '/../package/component/admin/src/Support/';
foreach (['DirectLinkUri', 'ResourceDescriptor', 'SelectionOutputRenderer', 'SelectionAddress', 'CollectionResources', 'SelectionFieldValue', 'SelectionFieldSupport', 'ArticleLinkPresentation', 'ArticleMediaSelection'] as $file) require $base . $file . '.php';
use SuperSoft\Component\Smartbrowser\Administrator\Support\SelectionAddress as Address;
use SuperSoft\Component\Smartbrowser\Administrator\Support\ArticleLinkPresentation as Links;
function check($value, $message) { if (!$value) throw new RuntimeException($message); }
$raw = $argv[1];
$entry = Address::decode($raw);
check($entry['selection'] === ['adapter' => 'articles', 'id' => 'article:43'], 'Article identity lost');
check($entry['usage']['visual.thumbnailOverride'] === ['adapter' => 'media', 'id' => 'local-images:/cover.jpg'], 'Thumbnail identity lost');
check(str_contains($entry['usage']['ext.selectionAddress']['compounds']['visual.thumbnailOverride'], 'flag=one&flag=two'), 'Compound parameters lost');
check($entry['usage']['article.displayedName'] === 'Temporary title', 'Displayed name lost');
check(Address::parse('https://example.org/page#section') === null, 'Ordinary anchor was interpreted');
check(Address::parse('https://example.org/page#otherExtension://value') === null, 'Unknown format was stripped');
Address::registerProperty(['key' => 'ext.example.data', 'type' => 'object', 'address' => ['name' => 'example', 'codec' => 'example']]);
Address::registerCodec('example', static fn ($parts) => ['value' => ['value' => $parts[0][1]]]);
check(Address::decode($raw)['usage']['ext.example.data']['value'] === 'opaque', 'Registered PHP codec was not called');
$original = json_encode(['urla' => $raw, 'urlatext' => 'Native title', 'targeta' => '1', 'urlb' => '/page#section', 'urlc' => 'mailto:author@example.org']);
$article = (object) ['urls' => $original];
$calls = 0;
$resolver = static function ($reference) use (&$calls) {
    $calls++;
    return ['id' => $reference['id'], 'title' => 'Resolved title', 'kind' => 'item', 'type' => $reference['adapter'] === 'media' ? 'image' : 'article', 'image' => '/cover.jpg', 'metadata' => ['publicUrl' => '/article.html']];
};
Links::prepare($article, $resolver);
$urls = json_decode($article->urls, true);
check($urls['urla'] === 'https://example.org/article.html#section', 'Bare URL lost its real fragment');
check($urls['urlb'] === '/page#section' && $urls['urlc'] === 'mailto:author@example.org', 'Ordinary links changed');
check($article->smartbrowserLinks['a']['address'] === $raw && $article->smartbrowserLinks['a']['selected']['effectiveThumbnailResource']['id'] === 'local-images:/cover.jpg', 'Template context not resolved');
check($article->smartbrowserLinks['a']['selected']['usage']['link.text'] === 'Native title', 'Native link text must remain authoritative');
$count = $calls; Links::prepare($article, $resolver); check($calls === $count, 'Presentation resolved twice');
check(str_contains($original, '#joomlaItem:'), 'Stored data mutated');
$form = new class($raw) { public function __construct(private string $raw) {} public function getValue($name, $group, $default) { return $name === 'urla' ? $this->raw : ($name === 'urlatext' ? 'Native title' : '1'); } };
$reopened = \SuperSoft\Component\Smartbrowser\Administrator\Support\ArticleMediaSelection::linkEntry($form, 'a');
check($reopened['selection'] === $entry['selection'] && $reopened['usage']['link.text'] === 'Native title', 'Reopen did not restore native text and typed reference');
foreach (['/safe#joomlaItem://article/43?titleOverride=a&titleOverride=b', '/safe#joomlaFile://local-files/../secret', 'javascript:alert(1)#joomlaItem://article/43'] as $invalid) {
    try { Address::decode($invalid); throw new RuntimeException('Invalid address accepted'); } catch (InvalidArgumentException $expected) {}
}
echo "Native article address storage, template context, codecs and safe URL presentation OK\n";
