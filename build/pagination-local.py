import base64,json,subprocess
from pathlib import Path
root=Path('package/component/admin/src')
files=['Adapter/ContentAdapter.php','Adapter/ArticleAdapter.php','Adapter/FlatArticleAdapter.php','Model/PagedArticlesModel.php','Support/ResourcePagination.php']
classes={'SuperSoft\\Component\\Smartbrowser\\Administrator\\'+f[:-4].replace('/','\\'):base64.b64encode((root/f).read_bytes()).decode() for f in files}
php="""<?php
$_SERVER['HTTP_HOST']='localhost'; $_SERVER['REQUEST_URI']='/index.php'; $_SERVER['REQUEST_METHOD']='GET';
define('_JEXEC',1); define('JPATH_BASE','/var/www/html');
require JPATH_BASE.'/includes/defines.php'; require JPATH_BASE.'/includes/framework.php';
$c=Joomla\\CMS\\Factory::getContainer();
$c->alias('session.web','session.web.site')->alias('session','session.web.site')->alias(Joomla\\Session\\SessionInterface::class,'session.web.site');
$app=$c->get(Joomla\\CMS\\Application\\SiteApplication::class); Joomla\\CMS\\Factory::$application=$app;
$app->createExtensionNamespaceMap(); $app->loadLanguage();
$db=$c->get(Joomla\\Database\\DatabaseInterface::class);
$id=$db->setQuery('SELECT user_id FROM #__user_usergroup_map WHERE group_id=8 LIMIT 1')->loadResult();
$app->loadIdentity($c->get(Joomla\\CMS\\User\\UserFactoryInterface::class)->loadUserById($id));
$map=json_decode(base64_decode('MAP'),true);
spl_autoload_register(static function($class)use($map){if(isset($map[$class]))eval(substr(base64_decode($map[$class]),5));},true,true);
$app->bootComponent('com_smartbrowser');
$a=new SuperSoft\\Component\\Smartbrowser\\Administrator\\Adapter\\FlatArticleAdapter($app);
$options=['filters'=>['state'=>'all'],'sortBy'=>'title','sortDirection'=>'asc'];
$all=$a->getResources('flat-articles:root',$options); $expected=count($all['items']);
$ids=[];
for($offset=0;$offset<max(1,$expected);$offset+=50){
 $p=new SuperSoft\\Component\\Smartbrowser\\Administrator\\Support\\ResourcePagination($offset,50);
 $r=$a->getResources('flat-articles:root',$options+['pagination'=>$p]);
 if($p->total!==$expected || count($r['items'])>50)throw new RuntimeException('Incorrect real total/limit');
 foreach($r['items'] as $row)$ids[]=$row['id'];
}
if(count(array_unique($ids))!==$expected || count($ids)!==$expected)throw new RuntimeException('Missing/duplicate rows');
$normal=new SuperSoft\Component\Smartbrowser\Administrator\Adapter\ArticleAdapter($app);
$root=$normal->getResources('content:root',$options);
foreach(array_slice($root['nodes'],0,3) as $node){
 $all=$normal->getResources($node['id'],$options);$expectedNodes=count($all['nodes']);$expectedItems=count($all['items']);$seen=[];
 for($start=0;$start<max(1,$expectedNodes+$expectedItems);$start+=10){
  $p=new SuperSoft\Component\Smartbrowser\Administrator\Support\ResourcePagination($start,10);
  $r=$normal->getResources($node['id'],$options+['pagination'=>$p]);
  if($p->total!==$expectedNodes+$expectedItems || count($r['nodes'])+count($r['items'])>10 || count($r['navigationNodes'])!==$expectedNodes)throw new RuntimeException('Mixed page count');
  foreach(array_merge($r['nodes'],$r['items']) as $row)$seen[]=$row['id'];
 }
 if(count(array_unique($seen))!==$expectedNodes+$expectedItems || count($seen)!==count(array_unique($seen)))throw new RuntimeException('Mixed page overlap');
}
echo 'Native Joomla SQL paging OK: '.$expected.' articles, '.ceil($expected/50).' pages'.PHP_EOL;
""".replace('MAP',base64.b64encode(json.dumps(classes).encode()).decode())
for name in ['catichisi-local-web-1','ionidios-local-web-1']:
 r=subprocess.run(['docker','exec','-i',name,'php'],input=php,text=True,capture_output=True,encoding='utf-8')
 print(name, r.returncode, r.stdout[-1800:],r.stderr[-600:])
 if r.returncode:raise SystemExit(r.returncode)
