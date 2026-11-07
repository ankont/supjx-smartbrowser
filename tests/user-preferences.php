<?php
define('_JEXEC', 1);
require __DIR__ . '/../package/component/admin/src/Support/UserViewPreferences.php';
use SuperSoft\Component\Smartbrowser\Administrator\Support\UserViewPreferences as Preferences;
Preferences::validate(['custom.caller.selection.single-layout' => '{"listOpen":false}', 'smartbrowser.editorMaximized' => 'true']);
Preferences::validate(['supjx.smartbrowser.personal' => '{"editorMode":"modal","pickerNodeScope":"adapter"}']);
Preferences::validate(['supjx.smartbrowser.personal' => '{"contextItemsByAdapter":{"categories":"show","tags":"inherit","menus":"hide"}}']);
Preferences::validate(['supjx.smartbrowser.personal' => '{"integration":"smartbrowser"}']);
$params = new class {
    public array $values = ['context_categories_admin' => 1, 'context_tags_admin' => 0, 'editor_admin' => 'page', 'replace_media_field' => 1];
    public function get($name, $default = null) { return $this->values[$name] ?? $default; }
    public function toArray() { return $this->values; }
};
if (Preferences::globalDefaults($params, false) !== ['editorMode' => 'page', 'contextItems' => 'mixed', 'contextItemsByAdapter' => ['categories' => 'show', 'tags' => 'hide', 'menus' => 'hide'], 'integration' => 'partial']) throw new RuntimeException('Incorrect global preference summary');
if (Preferences::globalDefaults($params, false, 'flat-categories')['contextItems'] !== 'show') throw new RuntimeException('Incorrect adapter global context');
$params->values['replace_all'] = 1;
if (Preferences::globalDefaults($params, true)['integration'] !== 'enabled') throw new RuntimeException('Incorrect global integration summary');
foreach ([['bad key' => 'x'], ['__proto__' => 'x'], ['valid' => ['not' => 'a string']], ['valid' => str_repeat('x', 32769)]] as $changes) {
    try { Preferences::validate($changes); throw new RuntimeException('Invalid preference accepted'); }
    catch (InvalidArgumentException $expected) {}
}
foreach (['{"permissions":"all"}', '{"editorMode":"unsupported"}', 'null', '{"contextItemsByAdapter":{"articles":"show"}}', '{"contextItemsByAdapter":{"menus":"invalid"}}'] as $value) {
    try { Preferences::validate(['supjx.smartbrowser.personal' => $value]); throw new RuntimeException('Invalid personal preference accepted'); }
    catch (InvalidArgumentException $expected) {}
}
$controller = file_get_contents(__DIR__ . '/../package/component/admin/src/Controller/ApiController.php');
if (!str_contains($controller, 'Session::checkToken(\'json\')') || !str_contains($controller, 'UserViewPreferences::save((int) $this->app->getIdentity()->id')) throw new RuntimeException('Preference endpoint does not bind the actor to its session');
echo "User preference validation and authenticated-actor binding OK\n";
