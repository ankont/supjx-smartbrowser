<?php
define('_JEXEC', 1);
require __DIR__ . '/fixtures/output-joomla.php';
require __DIR__ . '/../package/component/admin/src/Support/SelectionOutputRenderer.php';
use Joomla\CMS\Factory;
use Joomla\CMS\Layout\FileLayout;
use SuperSoft\Component\Smartbrowser\Administrator\Support\SelectionOutputRenderer as Output;

function check($condition, $message) { if (!$condition) throw new RuntimeException($message); }
function selected($adapter, $type, $kind = 'item', $image = null, $url = null, $usage = []) {
    return ['selection' => ['adapter' => $adapter, 'id' => $type . ':1'], 'usage' => $usage, 'unavailable' => false,
        'resource' => ['id' => $type . ':1', 'kind' => $kind, 'type' => $type, 'title' => 'Τίτλος <safe>', 'metadata' => ['url' => $url]],
        'effectiveThumbnail' => $image, 'displayedName' => 'Τίτλος <safe>'];
}
$dispatcher = new class {
    public $provider = null; public int $calls = 0;
    public function dispatch($name, $event) {
        check($name === 'onSmartBrowserPrepareImagePresentation', 'Wrong event'); $this->calls++;
        if ($this->provider) ($this->provider)($event);
    }
};
Factory::$app = new class($dispatcher) {
    public function __construct(private object $dispatcher) {}
    public function getDispatcher() { return $this->dispatcher; }
    public function getDocument() { return $this; }
    public function getWebAssetManager() { return $this; }
    public function useStyle($id) { check($id === 'fontawesome', 'Unexpected output asset'); return $this; }
};
foreach ([['articles','article','item'], ['featured-articles','article','item'], ['categories','category','node'], ['tags','tag','node'],
    ['articles-by-tag','article','item'], ['menus','menu-item','node'], ['menus','menu','node'], ['users','user','item'], ['users','user-group','node'],
    ['media','folder','node'], ['media','image','item'], ['media','document','item'], ['media','audio','item'], ['media','video','item'],
    ['direct-links','uri','item'], ['flat-articles','article','item'], ['flat-media','document','item'], ['flat-categories','category','node'],
    ['flat-tags','tag','node'], ['flat-menus','menu-item','node'], ['flat-users','user','item'], ['flat-articles-by-tag','article','item']] as [$adapter,$type,$kind]) {
    $output = Output::render(selected($adapter,$type,$kind,null,'/public-page?x=1&y=2'));
    check(str_contains($output, 'href="/public-page?x=1&amp;y=2"') && str_contains($output, '&lt;safe&gt;'), 'Generic adapter output: ' . $adapter);
    check(!str_contains($output, 'resource-lightweight') && !str_contains($output, '<script'), 'Picker leaked into output');
}
$user = selected('users','user'); $user['resource']['metadata'] = ['email'=>'private@example.org', 'username'=>'private-login'];
$userOutput = Output::render($user);
check(!str_contains($userOutput, '<a') && !str_contains($userOutput, 'private'), 'Private user data leaked');
$menu = selected('menus','menu-item','node',null,'/menu'); $menu['resource']['badgeIcon'] = 'fas fa-book';
check(str_contains(Output::render($menu), 'fas fa-book'), 'Native menu link icon ignored');
foreach (['javascript:alert(1)', 'java&#x73;cript:alert(1)', 'data:text/html,bad', "https://site/\nheader", 'vbscript:bad'] as $url) {
    check(Output::safeUrl($url) === null && !str_contains(Output::render(selected('menus','menu-item','node',null,$url)), '<a'), 'Unsafe URL accepted');
}
check(Output::safeUrl('mailto:public@example.org') !== null && Output::safeUrl('mailto:public@example.org', true) === null, 'URI kind policy');
$mail = selected('direct-links','uri','item',null,'mailto:public@example.org',['link.text'=>'Contact','link.target'=>'1']);
check(str_contains(Output::render($mail), 'target="_blank" rel="noopener noreferrer">Contact</a>'), 'Link usage lost');
$image = selected('media','image','item','images/a.jpg#joomlaImage://local-images/a.jpg?width=800&ext=opaque',null,
    ['media.alt'=>'Alt " & <text>', 'media.caption'=>'Caption <safe>', 'ext.example.data'=>['opaque'=>true]]);
$original = $image;
$dispatcher->provider = function ($event) {
    $context = $event->getArgument('context'); $node = $event->getArgument('imageElement');
    check($context['isReadOnly'] === true && $context['purpose'] === 'output', 'Output context policy');
    check($context['usage']['ext.example.data']['opaque'] && str_contains($context['imageAddress'], '#joomlaImage://'), 'Provider data lost');
    $node->setAttribute('style', 'aspect-ratio: 4 / 3; object-fit: cover');
};
$before = $dispatcher->calls; $html = Output::render($image);
check($dispatcher->calls === $before + 1 && str_contains($html, 'aspect-ratio: 4 / 3') && str_contains($html, 'data-sb-image-presentation="server"'), 'PHP provider not applied');
$parsed = new DOMDocument(); $parsed->loadHTML($html, LIBXML_NOERROR | LIBXML_NOWARNING);
check(str_contains($html, '<figcaption class="caption">Caption &lt;safe&gt;</figcaption>') && $parsed->getElementsByTagName('img')->item(0)->getAttribute('alt') === $image['usage']['media.alt'], 'Native image escaping/caption');
check($image === $original && !str_contains($html, 'ext.example.data'), 'Rendering mutated storage or exposed JSON');
check(Output::present($html,$image) === $html && $dispatcher->calls === $before + 1, 'Provider applied twice');
$decorative = $image; $decorative['usage']['media.decorative'] = true;
$dispatcher->provider = null;
check(str_contains(Output::render($decorative), 'alt=""'), 'Decorative alt not respected');
$changed = $image; $changed['usage']['ext.address'] = 'images/changed.jpg#joomlaImage://local-images/a.jpg?opaque=1';
check(str_contains(Output::render($changed), 'src="images/changed.jpg"'), 'Image address override ignored');
$icon = $image; $icon['visualPresentation'] = 'icon'; $icon['effectiveIcon'] = 'fas fa-book';
$before = $dispatcher->calls;
check(str_contains(Output::render($icon), 'fas fa-book') && !str_contains(Output::render($icon), '<img') && $dispatcher->calls === $before, 'Explicit icon presentation ignored');
$ambiguous = '<img data-sb-primary-image="1" src="a.jpg"><img data-sb-primary-image="1" src="b.jpg">';
check(Output::present($ambiguous,$image) === $ambiguous && $dispatcher->calls === $before, 'Ambiguous primary image was guessed');
$failed = Output::render($image); $dispatcher->provider = function ($event) { $event->getArgument('imageElement')->setAttribute('style','bad'); throw new RuntimeException('Provider failure'); };
$fallback = Output::render($image);
check(!str_contains($fallback,'style="bad"') && str_contains($fallback, 'data-sb-image-presentation="server"'), 'Failed provider did not roll back');
$dispatcher->provider = null;
FileLayout::$overrides['smartbrowser.resource'] = fn ($data) => '<figure class="site-frame"><img data-sb-primary-image="1" src="images/custom.jpg"><b class="site-pin">Pin</b></figure>';
$dispatcher->provider = fn ($event) => $event->getArgument('imageElement')->setAttribute('style','filter: grayscale(1)');
$custom = Output::render($image, ['purpose'=>'preview']);
check(str_contains($custom, 'site-pin') && str_contains($custom,'site-frame') && str_contains($custom, 'grayscale'), 'Override composition or hook lost');
FileLayout::$overrides = []; $dispatcher->provider = null;
$denied = $image; $denied['resource']['unavailable'] = true; $before = $dispatcher->calls;
check(Output::render($denied) === '' && Output::present('<img data-sb-primary-image="1" src="secret.jpg">',$denied) === '' && $dispatcher->calls === $before, 'Unavailable resource rendered');
check(Output::renderSelection(['invalid'=>true,'items'=>[$image]]) === '' && Output::renderSelection(['items'=>[]]) === '', 'Invalid/empty selection output');
$collection = Output::renderSelection(['items'=>[$user,$image,$denied]]);
check(substr_count($collection,'<li>') === 2 && strpos($collection, 'Τίτλος') < strpos($collection, '<img'), 'Collection ordering/availability');
$field = (object) ['smartbrowser'=>['items'=>[$image]]]; ob_start(); require __DIR__ . '/../package/plugins/fields/smartbrowserpicker/tmpl/smartbrowser.php'; $fieldOutput = ob_get_clean();
check(str_contains($fieldOutput, '<img') && !str_contains($fieldOutput, 'ext.example.data'), 'Field plugin did not use shared output');
echo "Selection output adapters, native markup, overrides, provider context, once-only presentation, rollback, escaping and privacy OK\n";
