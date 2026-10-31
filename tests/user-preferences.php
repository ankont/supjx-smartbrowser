<?php
define('_JEXEC', 1);
require __DIR__ . '/../package/component/admin/src/Support/UserViewPreferences.php';
use SuperSoft\Component\Smartbrowser\Administrator\Support\UserViewPreferences as Preferences;
Preferences::validate(['custom.caller.selection.single-layout' => '{"listOpen":false}', 'smartbrowser.editorMaximized' => 'true']);
foreach ([['bad key' => 'x'], ['__proto__' => 'x'], ['valid' => ['not' => 'a string']], ['valid' => str_repeat('x', 32769)]] as $changes) {
    try { Preferences::validate($changes); throw new RuntimeException('Invalid preference accepted'); }
    catch (InvalidArgumentException $expected) {}
}
$controller = file_get_contents(__DIR__ . '/../package/component/admin/src/Controller/ApiController.php');
if (!str_contains($controller, 'Session::checkToken(\'json\')') || !str_contains($controller, 'UserViewPreferences::save((int) $this->app->getIdentity()->id')) throw new RuntimeException('Preference endpoint does not bind the actor to its session');
echo "User preference validation and authenticated-actor binding OK\n";
