<?php
define('_JEXEC', 1);
require __DIR__ . '/fixtures/output-joomla.php';
require __DIR__ . '/../package/component/admin/src/Support/SelectionOutputRenderer.php';
require __DIR__ . '/../package/component/admin/src/Field/UnavailablevisibilityField.php';
use Joomla\CMS\Factory;
use Joomla\CMS\Layout\FileLayout;
use SuperSoft\Component\Smartbrowser\Administrator\Support\SelectionOutputRenderer as Output;

function check($condition, $message) { if (!$condition) throw new RuntimeException($message); }
foreach ([0, 1] as $global) {
    \Joomla\CMS\Component\ComponentHelper::$showUnavailable = $global;
    foreach ([null, '', -1, '-1'] as $inherit) check(Output::showUnavailable($inherit) === (bool) $global, 'Global visibility not inherited');
    foreach ([true, 1, '1'] as $show) check(Output::showUnavailable($show), 'Explicit Show ignored');
    foreach ([false, 0, '0'] as $hide) check(!Output::showUnavailable($hide), 'Explicit Hide ignored');
    $options = (new ReflectionMethod(\SuperSoft\Component\Smartbrowser\Administrator\Field\UnavailablevisibilityField::class, 'getOptions'))->invoke(new \SuperSoft\Component\Smartbrowser\Administrator\Field\UnavailablevisibilityField());
    check($options[0]->text === 'Use Global (' . ($global ? 'JSHOW' : 'JHIDE') . ')', 'Global option did not display effective value');
}
\Joomla\CMS\Component\ComponentHelper::$showUnavailable = 0;
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
$classes = $image;
$classes['usage']['media.class'] = 'image-frame';
$classes['usage']['media.figureClass'] = 'figure-frame';
$classHtml = Output::render($classes);
check(str_contains($classHtml, '<figure class="item-image figure-frame">') && str_contains($classHtml, 'class="image-frame"'), 'Image and figure classes must remain distinct in output');
$classes['usage']['media.caption'] = '';
check(str_contains(Output::render($classes), '<figure class="item-image figure-frame">'), 'Figure class must work without a caption');
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
$notice = Output::render($denied, ['showUnavailable' => true]);
check(str_contains($notice, 'COM_SMARTBROWSER_SELECTION_UNAVAILABLE') && !str_contains($notice, 'secret') && !str_contains($notice, $denied['resource']['id']) && !str_contains($notice, '<img'), 'Unavailable placeholder leaked resource data');
$trashed = $image; $trashed['resource']['metadata']['state'] = -2;
check(Output::render($trashed) === '' && Output::render($trashed, ['showUnavailable' => true]) === $notice, 'Trashed resource did not use unavailable policy');
check(str_contains($notice, 'fas fa-ban'), 'Default unavailable icon missing');
$private = $denied;
$private['usage'] = ['ext.address'=>'https://private.example/secret', 'media.caption'=>'Private caption'];
$private['resource']['metadata'] = ['url'=>'https://private.example/secret'];
$originalPrivate = serialize($private);
\Joomla\CMS\Component\ComponentHelper::$placeholder = [
    'selection_unavailable_image_enabled'=>1, 'selection_unavailable_image'=>'images/unavailable.png',
    'selection_unavailable_text'=>'Missing <script>bad</script>', 'selection_unavailable_icon'=>'fa-ban',
];
$before = $dispatcher->calls;
$placeholder = Output::render($private, ['showUnavailable'=>true]);
check(str_contains($placeholder, 'images/unavailable.png') && str_contains($placeholder, 'Missing &lt;script&gt;bad&lt;/script&gt;') && str_contains($placeholder, 'fas fa-ban'), 'Placeholder configuration not rendered');
check(!str_contains($placeholder, '<a') && !str_contains($placeholder, 'private.example') && !str_contains($placeholder, 'Private caption') && $dispatcher->calls === $before + 1, 'Unavailable placeholder leaked data or skipped image presentation');
check(serialize($private) === $originalPrivate, 'Unavailable rendering mutated the selection');
$private['effectiveThumbnailResource'] = ['id'=>'private-image', 'metadata'=>['secret'=>'private']];
$private['effectiveImageAddress'] = 'https://private.example/image.jpg';
$originalPrivate = serialize($private);
$dispatcher->provider = static function ($event) {
    $context = $event->getArgument('context');
    check($context['unavailable'] === true && $context['isReadOnly'] === true, 'Placeholder policy flags missing');
    check($context['selection'] === null && $context['usage'] === [] && $context['resource']['metadata'] === [], 'Placeholder provider received original reference/Usage/metadata');
    check($context['resource']['id'] === 'unavailable' && $context['resolvedImage'] === $context['resource'], 'Placeholder provider received original resolved image');
    check($context['imageAddress'] === 'images/unavailable.png' && $context['imageUrl'] === 'images/unavailable.png', 'Placeholder provider received an original/unsafe image');
    $event->getArgument('imageElement')->setAttribute('style', 'filter: grayscale(1)');
};
$before = $dispatcher->calls;
$presentedPlaceholder = Output::render($private, ['showUnavailable'=>true, 'purpose'=>'preview']);
check(str_contains($presentedPlaceholder, 'grayscale') && $dispatcher->calls === $before + 1, 'Placeholder provider effect missing');
check(Output::present($presentedPlaceholder, $private, ['showUnavailable'=>true]) === $presentedPlaceholder && $dispatcher->calls === $before + 1, 'Placeholder provider applied twice');
check(serialize($private) === $originalPrivate, 'Placeholder provider mutated stored data');
$fragment = '<figure class="site-frame"><img data-sb-primary-image="1" src="images/unavailable.png"><b class="site-pin">Pin</b></figure>';
$customPlaceholder = Output::present($fragment, $private, ['showUnavailable'=>true]);
check(str_contains($customPlaceholder, 'site-pin') && str_contains($customPlaceholder, 'grayscale'), 'Consumer placeholder presentation lost composition');
$trashed['effectiveThumbnailResource'] = ['id'=>'private-image'];
check(str_contains(Output::present($fragment, $trashed, ['showUnavailable'=>true]), 'grayscale'), 'Trashed selection was not neutralised for presentation');
$before = $dispatcher->calls;
check(Output::present($fragment, $private, ['showUnavailable'=>false]) === '' && $dispatcher->calls === $before, 'Hidden placeholder invoked provider');
$ambiguousPlaceholder = $fragment . '<img data-sb-primary-image="1" src="images/unavailable.png">';
check(Output::present($ambiguousPlaceholder, $private, ['showUnavailable'=>true]) === $ambiguousPlaceholder && $dispatcher->calls === $before, 'Ambiguous placeholder image was guessed');
$dispatcher->provider = static function ($event) { $event->getArgument('imageElement')->setAttribute('style', 'bad'); throw new RuntimeException('Provider failed'); };
$rolledBack = Output::present($fragment, $private, ['showUnavailable'=>true]);
check(!str_contains($rolledBack, 'style="bad"') && str_contains($rolledBack, 'site-pin') && str_contains($rolledBack, 'data-sb-image-presentation="server"'), 'Placeholder rollback failed');
$dispatcher->provider = null;
FileLayout::$overrides['smartbrowser.resource'] = static function ($data) {
    check($data['unavailable'] && $data['selected']['selection'] === null && $data['usage'] === [] && $data['resource']['metadata'] === [] && $data['resource']['id'] === 'unavailable', 'Override received original unavailable identity or metadata');
    return '<div class="site-placeholder">' . htmlspecialchars($data['title'], ENT_QUOTES, 'UTF-8') . '</div>';
};
check(str_contains(Output::render($private, ['showUnavailable'=>true]), 'site-placeholder'), 'Unavailable output bypassed the Joomla layout override');
FileLayout::$overrides = [];
\Joomla\CMS\Component\ComponentHelper::$placeholder['selection_unavailable_image'] = 'javascript:bad';
\Joomla\CMS\Component\ComponentHelper::$placeholder['selection_unavailable_icon'] = 'bad" onclick="bad';
$safe = Output::render($private, ['showUnavailable'=>true]);
check(!str_contains($safe, '<img') && !str_contains($safe, 'onclick'), 'Unsafe placeholder image or icon accepted');
$before = $dispatcher->calls;
check(Output::present('<div>No image</div>', $private, ['showUnavailable'=>true]) === '<div>No image</div>' && $dispatcher->calls === $before, 'Imageless placeholder invoked providers or lost its frame');
\Joomla\CMS\Component\ComponentHelper::$placeholder = ['selection_unavailable_icon_enabled'=>0];
check(!str_contains(Output::render($private, ['showUnavailable'=>true]), 'fa-ban'), 'Disabled placeholder icon rendered');
\Joomla\CMS\Component\ComponentHelper::$placeholder = [];
check(Output::renderSelection(['invalid'=>true,'items'=>[$image]]) === '' && Output::renderSelection(['items'=>[]]) === '', 'Invalid/empty selection output');
$collection = Output::renderSelection(['items'=>[$user,$image,$denied]]);
check(substr_count($collection,'<li>') === 2 && strpos($collection, 'Τίτλος') < strpos($collection, '<img'), 'Collection ordering/availability');
$field = (object) ['smartbrowser'=>['items'=>[$image]]]; ob_start(); require __DIR__ . '/../package/plugins/fields/smartbrowserpicker/tmpl/smartbrowser.php'; $fieldOutput = ob_get_clean();
check(str_contains($fieldOutput, '<img') && !str_contains($fieldOutput, 'ext.example.data'), 'Field plugin did not use shared output');
foreach ([0, 1] as $global) {
    \Joomla\CMS\Component\ComponentHelper::$showUnavailable = $global;
    foreach (['', '0', '1'] as $policy) {
        $field = (object) ['smartbrowser'=>['items'=>[$denied]], 'fieldparams'=>new class($policy) {
            public function __construct(private string $value) {}
            public function get($key, $default = null) { return $this->value; }
        }];
        ob_start(); require __DIR__ . '/../package/plugins/fields/smartbrowserpicker/tmpl/smartbrowser.php'; $rendered = ob_get_clean();
        check(($rendered !== '') === Output::showUnavailable($policy), 'Custom-field override did not reach renderer');
    }
}
\Joomla\CMS\Component\ComponentHelper::$showUnavailable = 0;
echo "Selection output adapters, native markup, overrides, provider context, once-only presentation, rollback, escaping and privacy OK\n";
