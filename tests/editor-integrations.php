<?php
namespace Joomla\Event { interface SubscriberInterface {} }
namespace Joomla\CMS\Plugin { class CMSPlugin { public object $app; protected function getApplication() { return $this->app; } } }
namespace Joomla\CMS\Component { class ComponentHelper { public static array $values = []; public static function getParams($name) { return new class { public function get($key, $default = null) { return ComponentHelper::$values[$key] ?? $default; } }; } } }
namespace Joomla\CMS\Router { class Route { public static function _($url, ...$args) { return $url; } } }
namespace Joomla\CMS\Session { class Session { public static bool $valid = true; public static function checkToken(...$args) { return self::$valid; } } }
namespace Joomla\CMS\Uri { class Uri { public static function isInternal($url) { return str_starts_with($url, 'index.php?') || str_starts_with($url, '/site/'); } } }
namespace {
    define('_JEXEC', 1);
    require __DIR__ . '/../package/component/admin/src/Support/IntegrationOptions.php';
    require __DIR__ . '/../package/plugins/system/smartbrowserintegration/src/Extension/Smartbrowserintegration.php';
    $input = new class {
        public array $values = []; public string $method = 'GET';
        public function getCmd($key, $default = '') { return (string) ($this->values[$key] ?? $default); }
        public function getString($key, $default = '') { return $this->getCmd($key, $default); }
        public function getInt($key, $default = 0) { return (int) ($this->values[$key] ?? $default); }
        public function getBool($key) { return (bool) ($this->values[$key] ?? false); }
        public function get($key, $default = null, $filter = null) { return $this->values[$key] ?? $default; }
        public function getMethod() { return $this->method; }
        public function set($key, $value) { $this->values[$key] = $value; }
    };
    $app = new class($input) {
        public bool $site = false; public array $states = []; public ?string $redirect = null;
        public object $user;
        public function __construct(public object $input) { $this->user = (object) ['guest'=>false]; }
        public function getInput() { return $this->input; }
        public function isClient($name) { return $name === ($this->site ? 'site' : 'administrator'); }
        public function getIdentity() { return $this->user; }
        public function getUserState($key) { return $this->states[$key] ?? null; }
        public function setUserState($key, $value) { $this->states[$key] = $value; }
        public function redirect($url) { $this->redirect = $url; }
        public function close() {}
    };
    $plugin = new \SuperSoft\Plugin\System\Smartbrowserintegration\Extension\Smartbrowserintegration(); $plugin->app = $app;
    $check = static function ($value, $message) { if (!$value) throw new \RuntimeException($message); };
    foreach ([['com_content','article','article_admin'],['com_categories','category','category_admin'],['com_tags','tag','tag_admin'],['com_menus','item','menu_admin'],['com_users','user','user_admin']] as [$component,$task,$key]) {
        $input->values = ['option'=>$component,'task'=>$task.'.edit','id'=>42];
        $app->states=[]; $app->redirect=null;
        \Joomla\CMS\Component\ComponentHelper::$values=[];
        $plugin->replaceNativeEditor(); $check($app->redirect === null, 'Disabled editor replaced');
        \Joomla\CMS\Component\ComponentHelper::$values=['replace_editor_'.$key=>1];
        $plugin->replaceNativeEditor(); $check(str_contains($app->redirect ?? '', 'view=editor') && str_contains($app->redirect, 'id=42'), 'Admin editor not replaced');
        $input->values['sbNative']=1; $app->redirect=null; $plugin->replaceNativeEditor();
        unset($input->values['sbNative']); $plugin->replaceNativeEditor();
        $check($app->redirect === null, 'Fallback loop');
        $input->values=['option'=>$component,'view'=>'list']; $plugin->replaceNativeEditor();
        $check($app->getUserState('com_smartbrowser.editor.native') === null, 'Fallback scope not cleared');
    }
    $app->site=true; $app->states=[];
    $input->values=['option'=>'com_content','task'=>'article.edit','id'=>11,'a_id'=>42,'return'=>base64_encode('https://evil.test/')];
    \Joomla\CMS\Component\ComponentHelper::$values=['replace_editor_article_admin'=>1];
    $app->redirect=null; $plugin->replaceNativeEditor(); $check($app->redirect === null, 'Admin setting affected site');
    \Joomla\CMS\Component\ComponentHelper::$values=['replace_editor_article_site'=>1];
    $plugin->replaceNativeEditor(); parse_str(parse_url($app->redirect, PHP_URL_QUERY), $query);
    $check(base64_decode($query['sbReturn']) === 'index.php?option=com_content&view=article&id=42', 'Unsafe return accepted');
    $input->values = ['option' => 'com_content', 'task' => 'article.edit', 'id' => 9, 'a_id' => 156, 'tmpl' => 'component'];
    $app->states = []; $app->redirect = null;
    $plugin->replaceNativeEditor();
    parse_str(parse_url($app->redirect, PHP_URL_QUERY), $nativeEdit);
    $check((int) $nativeEdit['id'] === 156 && $nativeEdit['tmpl'] === 'component', 'Native frontend Edit lost a_id or popup layout');
    foreach ([['task'=>'article.add'], ['view'=>'form', 'layout'=>'edit']] as $entry) {
        $app->states=[]; $app->redirect=null;
        $input->values=array_merge(['option'=>'com_content','id'=>8,'catid'=>8,'Itemid'=>106], $entry);
        $plugin->replaceNativeEditor();
        parse_str(parse_url($app->redirect, PHP_URL_QUERY), $created);
        $check((int) $created['id'] === 0 && (int) $created['catid'] === 8, 'New article used routed category ID');
    }
    $input->values=['option'=>'com_content','view'=>'article','id'=>11,'a_id'=>69,'sbEditor'=>1,'Itemid'=>23];
    $app->redirect=null;
    $plugin->replaceNativeEditor();
    $check($input->values['option'] === 'com_smartbrowser' && $input->values['view'] === 'editor' && $input->values['id'] === 69 && $input->values['Itemid'] === 23, 'Article-context dispatch lost identity or menu');
    $check($app->redirect === null, 'Article context was redirected outside its menu');
    $input->values=['option'=>'com_content','task'=>'article.edit','id'=>11,'a_id'=>69,'sbNative'=>1];
    $plugin->replaceNativeEditor();
    $check($app->getUserState('com_smartbrowser.editor.native') === ['com_content',69], 'Native fallback used menu/category ID instead of a_id');
    $app->states=[];
    $input->values=['option'=>'com_content','task'=>'article.save','id'=>42]; $input->method='POST';
    $app->redirect=null; $plugin->replaceNativeEditor(); $check($app->redirect === null, 'Save was intercepted');
    $input->values=['option'=>'com_content','task'=>'article.edit','cid'=>[42]];
    \Joomla\CMS\Session\Session::$valid=false;
    $plugin->replaceNativeEditor(); $check($app->redirect === null, 'Invalid navigation token accepted');
    \Joomla\CMS\Session\Session::$valid=true;
    $plugin->replaceNativeEditor(); $check(str_contains($app->redirect ?? '', 'id=42'), 'POST edit selection not replaced');
    $input->method='GET'; $app->user->guest=true; $app->redirect=null;
    $plugin->replaceNativeEditor(); $check($app->redirect === null, 'Guest routed to editor');
    $app->site=false; $app->user->guest=false;
    $input->values=['option'=>'com_content','task'=>'article.add','sbNative'=>1];
    $plugin->replaceNativeEditor();
    $input->values=['option'=>'com_content','view'=>'article','id'=>99];
    $plugin->replaceNativeEditor();
    $check($app->redirect === null && $app->getUserState('com_smartbrowser.editor.native') === ['com_content',99], 'Native new-record Apply lost fallback');
    \Joomla\CMS\Component\ComponentHelper::$values=['replace_all'=>1];
    $check(\SuperSoft\Component\Smartbrowser\Administrator\Support\IntegrationOptions::enabled('replace_editor_menu_admin'), 'Replace all did not cover editors');
    foreach ([['com_content','article','articles'],['com_categories','category','categories'],['com_tags','tag','tags'],['com_menus','item','items'],['com_users','user','users']] as [$component,$prefix,$list]) {
        foreach (['save', 'cancel'] as $action) {
            $app->site=false; $app->states=[]; $app->redirect=null; $input->method='GET';
            $input->values=['option'=>$component, 'sbNative'=>1, 'sbReturn'=>base64_encode('/site/browser')];
            $plugin->returnFromNativeEditor();
            $input->method='POST'; $input->values=['option'=>$component, 'task'=>$prefix.'.apply'];
            $plugin->returnFromNativeEditor();
            $check(!$app->getUserState('com_smartbrowser.editor.native_return')['pending'], 'Apply marked editor complete');
            $input->values['task']=$prefix.'.'.$action;
            \Joomla\CMS\Session\Session::$valid=false;
            $plugin->returnFromNativeEditor();
            $check(!$app->getUserState('com_smartbrowser.editor.native_return')['pending'], 'Invalid token changed return state');
            \Joomla\CMS\Session\Session::$valid=true;
            $plugin->returnFromNativeEditor();
            $input->method='GET'; $input->values=['option'=>$component, 'view'=>$prefix];
            $plugin->returnFromNativeEditor(); $check($app->redirect === null, 'Validation/edit view returned prematurely');
            $input->values['view']=$list;
            $plugin->returnFromNativeEditor();
            $check($app->redirect === '/site/browser' && $app->getUserState('com_smartbrowser.editor.native_return') === null, 'Native completion lost original page');
        }
    }
    $app->states=[]; $input->values=['option'=>'com_content','sbNative'=>1,'sbReturn'=>base64_encode('https://evil.test/')];
    $plugin->returnFromNativeEditor();
    $check($app->getUserState('com_smartbrowser.editor.native_return') === null, 'External fallback return accepted');
    echo "Editor entry points, client settings, fallback, tokens and safe returns OK\n";
}
