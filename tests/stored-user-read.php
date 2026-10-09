<?php
namespace Joomla\CMS\Application { interface CMSApplicationInterface {} }
namespace Joomla\CMS\Language { class Text { public static function _($key) { return $key; } } }
namespace Joomla\Database { interface DatabaseInterface {} }
namespace Joomla\CMS {
    class Factory {
        public static object $app;
        public static object $db;
        public static function getApplication() { return self::$app; }
        public static function getContainer() { return new class { public function get($class) { return Factory::$db; } }; }
    }
}
namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter {
    // Isolate host visibility from Joomla models; exercise the real stored-field context and user adapter.
    class AdapterRegistry {
        public static object $userReader;
        public static object $host;
        public function __construct(private object $app) {}
        public function getReadable($id, $root=null) {
            if ($id === 'users') return self::$userReader;
            return new class($this->app) {
                public function __construct(private object $app) {}
                public function getReadableResource($id) {
                    if ($id !== 'article:10') throw new \RuntimeException('Missing host',404);
                    ReadVisibility::assertPublished(AdapterRegistry::$host, $this->app->getIdentity(), 'state');
                    return ['id'=>$id,'title'=>'Readable host'];
                }
            };
        }
    }
}
namespace {
define('_JEXEC',1);
require_once __DIR__ . '/../package/component/admin/src/Support/ResourceDescriptor.php'; define('JPATH_ADMINISTRATOR',__DIR__);
$base=__DIR__.'/../package/component/admin/src/';
foreach (['Adapter/ResourceAdapterInterface.php','Adapter/BrowseRootAwareInterface.php','Adapter/ReadableResourceAdapterInterface.php',
    'Adapter/StoredSelectionReadableAdapterInterface.php','Adapter/ReadVisibility.php','Adapter/UsersAdapter.php',
    'Support/CollectionResources.php','Support/SelectionFieldValue.php','Support/StoredSelectionReadContext.php','Support/ReadOnlyResources.php'] as $file) require $base.$file;
use SuperSoft\Component\Smartbrowser\Administrator\Adapter\AdapterRegistry;
use SuperSoft\Component\Smartbrowser\Administrator\Support\StoredSelectionReadContext;
use SuperSoft\Component\Smartbrowser\Administrator\Support\ReadOnlyResources;
$raw='{"version":1,"items":[{"selection":{"adapter":"users","id":"user:42"},"usage":{}}]}';
$identity=new class {
    public int $id=0; public bool $guest=true; public array $levels=[1];
    public function getAuthorisedViewLevels() { return $this->levels; }
};
$app=new class($identity) implements \Joomla\CMS\Application\CMSApplicationInterface {
    public function __construct(private object $identity) {}
    public function getIdentity() { return $this->identity; }
    public function getLanguage() { return new class { public function load(...$args) {} }; }
};
$db=new class($raw) implements \Joomla\Database\DatabaseInterface {
    public object $stored; public array $where=[]; private string $table=''; private int $userId=0;
    public function __construct($raw) { $this->stored=(object)['context'=>'com_content.article','type'=>'smartbrowser','state'=>1,'access'=>1,'group_id'=>0,'group_state'=>1,'group_access'=>1,'value'=>$raw]; }
    public function getQuery($new) { $this->where=[]; return $this; }
    public function select($columns) { return $this; }
    public function from($table) { $this->table=$table; return $this; }
    public function join(...$args) { return $this; }
    public function where($condition) { $this->where[]=$condition; return $this; }
    public function quoteName($name,$alias=null) { return $name.($alias?' '.$alias:''); }
    public function quote($value) { return "'".$value."'"; }
    public function bind($key,$value) { $this->userId=$value; return $this; }
    public function setQuery($query) { return $this; }
    public function loadObject() {
        if ($this->table === '#__users') return $this->userId===42 ? (object)['id'=>42,'name'=>'Display Name','username'=>'SECRET LOGIN','email'=>'SECRET EMAIL','block'=>1,'activation'=>'SECRET TOKEN'] : null;
        return $this->stored;
    }
};
\Joomla\CMS\Factory::$app=$app; \Joomla\CMS\Factory::$db=$db;
AdapterRegistry::$host=(object)['state'=>1,'access'=>1];
AdapterRegistry::$userReader=new \SuperSoft\Component\Smartbrowser\Administrator\Adapter\UsersAdapter($app);
$registry=new AdapterRegistry($app);
$field=(object)['id'=>5,'rawvalue'=>$raw]; $item=(object)['id'=>10];
$check=static function($value,$message) { if (!$value) throw new \RuntimeException($message); };
$context=StoredSelectionReadContext::forField('com_content.article',$item,$field);
$check($context !== null,'Visible stored host rejected');
$check(in_array('f.id = 5',$db->where,true) && in_array("v.item_id = '10'",$db->where,true),'Stored field/item not scoped');
$resource=ReadOnlyResources::resolve($registry,'users',['user:42'],null,$context)[0];
$check($resource['title']==='Display Name' && $resource['id']==='user:42','Stored user name failed');
$check(!str_contains(json_encode($resource),'SECRET') && array_keys($resource['metadata'])===['id'],'Account metadata leaked');
$check(ReadOnlyResources::resolve($registry,'users',['user:42'])[0]['unavailable'],'Generic user lookup opened');
foreach (['user:43','user-group:2'] as $id) $check(ReadOnlyResources::resolve($registry,'users',[$id],null,$context)[0]['unavailable'],'Unstored reference opened');
$identity->id=7; $check(ReadOnlyResources::resolve($registry,'users',['user:42'],null,$context)[0]['unavailable'],'Context reused across identities');
$identity->id=0; $identity->levels=[1,9];
$check(ReadOnlyResources::resolve($registry,'users',['user:42'],null,$context)[0]['unavailable'],'Context reused across view levels');
$identity->levels=[1];
foreach ([['access',9],['state',0]] as [$key,$value]) {
    $old=$db->stored->$key; $db->stored->$key=$value;
    $check(StoredSelectionReadContext::forField('com_content.article',$item,$field)===null,'Hidden field context accepted');
    $db->stored->$key=$old;
}
$db->stored->group_id=3; $db->stored->group_access=9;
$check(StoredSelectionReadContext::forField('com_content.article',$item,$field)===null,'Restricted group accepted');
$db->stored->group_id=0;
AdapterRegistry::$host->access=9;
$check(StoredSelectionReadContext::forField('com_content.article',$item,$field)===null,'Private host accepted');
AdapterRegistry::$host->access=1; AdapterRegistry::$host->state=0;
$check(StoredSelectionReadContext::forField('com_content.article',$item,$field)===null,'Unpublished host accepted');
AdapterRegistry::$host->state=1;
$field->rawvalue='{"version":1,"items":[]}';
$check(StoredSelectionReadContext::forField('com_content.article',$item,$field)===null,'Unstored payload accepted');
$check(StoredSelectionReadContext::forField('com_users.user',$item,$field)===null,'Unverified host component opened');
echo "Stored visible user names, exact references, host/field ACL and identity isolation OK\n";
}
