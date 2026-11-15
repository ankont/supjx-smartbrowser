import base64,json,subprocess
from pathlib import Path
root=Path('package/component/admin/src')
classes={'SuperSoft\\Component\\Smartbrowser\\Administrator\\'+str(f.relative_to(root))[:-4].replace('\\','/').replace('/','\\'):base64.b64encode(f.read_bytes()).decode() for f in root.rglob('*.php')}
php=r"""<?php
$_SERVER['HTTP_HOST']='localhost';$_SERVER['REQUEST_URI']='/index.php';$_SERVER['REQUEST_METHOD']='GET';
define('_JEXEC',1);define('JPATH_BASE','/var/www/html');
require JPATH_BASE.'/includes/defines.php';require JPATH_BASE.'/includes/framework.php';
$c=Joomla\CMS\Factory::getContainer();$c->alias('session.web','session.web.site')->alias('session','session.web.site')->alias(Joomla\Session\SessionInterface::class,'session.web.site');
$app=$c->get(Joomla\CMS\Application\SiteApplication::class);Joomla\CMS\Factory::$application=$app;
$app->createExtensionNamespaceMap();$app->loadLanguage();$db=$c->get(Joomla\Database\DatabaseInterface::class);
$id=$db->setQuery('SELECT user_id FROM #__user_usergroup_map WHERE group_id=8 LIMIT 1')->loadResult();
$app->loadIdentity($c->get(Joomla\CMS\User\UserFactoryInterface::class)->loadUserById($id));
$map=json_decode(base64_decode('MAP'),true);spl_autoload_register(static function($class)use($map){if(isset($map[$class]))eval(substr(base64_decode($map[$class]),5));},true,true);
$app->bootComponent('com_smartbrowser');
function listing($a,$node,$options,$page=null){
 if($page && in_array($a->getId(),['articles','flat-articles','featured-articles','articles-by-tag','users']))$options['pagination']=$page;
 $r=$a->getResources($node,$options);
 $listingOptions=$options; if(empty($options['explicitSort']))$listingOptions['sortBy']='';
 $context=$a instanceof SuperSoft\Component\Smartbrowser\Administrator\Adapter\ContextResourceProviderInterface;
 if($page && $context && in_array($a->getId(),['categories','tags']))$r=SuperSoft\Component\Smartbrowser\Administrator\Support\ResourceListing::contextPage($r,$listingOptions,$page,fn($p)=>$a->getContextResources($node,$options+['pagination'=>$p]));
 else $r['contextItems']=$context?$a->getContextResources($node,$options):[];
 if($page && !isset($r['pagination']))$r=SuperSoft\Component\Smartbrowser\Administrator\Support\ResourceListing::page($r,$listingOptions+['flatListing'=>str_starts_with($a->getId(),'flat-')],$page);
 return $r;
}
function ids($r){return array_map(fn($r)=>$r['id'],array_merge(!empty($r['presentation']['navigationOnlyNodes'])?[]:$r['nodes'],$r['items'],$r['contextItems']??[]));}
$reg=new SuperSoft\Component\Smartbrowser\Administrator\Adapter\AdapterRegistry($app);
foreach(['articles','flat-articles','featured-articles','categories','flat-categories','tags','flat-tags','articles-by-tag','menus','flat-menus','users','flat-users','media','flat-media','direct-links'] as $name){
 $a=$reg->get($name);$node=$a->getRoots()[0]['id'];
 if(in_array($name,['articles','categories','tags','articles-by-tag','users'])){
  $first=$a->getResources($node,['filters'=>['state'=>'active'],'navigationOnly'=>true]);
  if(!empty($first['nodes']))$node=$first['nodes'][0]['id'];
 }
 if($name==='flat-media'){
  $media=$reg->get('media');$dirs=$media->getResources($media->getRoots()[0]['id'],['navigationOnly'=>true]);
  foreach($dirs['nodes'] as $dir)if(strtolower($dir['title'])==='banners'){$a=$reg->get('flat-media',null,$dir['id']);$node=$a->getRoots()[0]['id'];break;}
 }
 if(in_array($name,['articles','categories'])){$cat=$db->setQuery('SELECT catid FROM #__content WHERE state IN (0,1,2) GROUP BY catid ORDER BY COUNT(*) DESC LIMIT 1')->loadResult();if($cat)$node='category:'.$cat;}
 if(in_array($name,['tags','articles-by-tag'])){$tag=$db->setQuery("SELECT tag_id FROM #__contentitem_tag_map WHERE type_alias='com_content.article' GROUP BY tag_id ORDER BY COUNT(*) DESC LIMIT 1")->loadResult();if($tag)$node='tag:'.$tag;}
 $options=['sortBy'=>'','explicitSort'=>false,'sortDirection'=>'desc','showContextResources'=>true,'filters'=>['state'=>'active']];
 if($name==='direct-links')for($n=0;$n<9;$n++)$options['selection'][]=['selection'=>SuperSoft\Component\Smartbrowser\Administrator\Support\DirectLinkUri::reference('web','https://example.test/page-'.$n),'usage'=>[]];
 $full=listing($a,$node,$options);$expected=ids($full);$total=count($expected);
 $size=in_array($name,['users','flat-users','media','flat-media'])?1:7;
 foreach(array_unique([0,$size,$total?intdiv($total-1,$size)*$size:0]) as $offset){
  $page=new SuperSoft\Component\Smartbrowser\Administrator\Support\ResourcePagination($offset,$size);
  $r=listing($a,$node,$options,$page);
  if($r['pagination']['total']!==$total || count(ids($r))>$size)throw new RuntimeException($name.' count/limit mismatch: '.json_encode([$r['pagination'],$total]));
  if(ids($r)!==array_slice($expected,$page->offset,$size))throw new RuntimeException($name.' ORDER mismatch: '.json_encode([ids($r),array_slice($expected,$page->offset,$size)]));
 }
 echo $name.': '.$total.' matches, first/middle/last OK'.PHP_EOL;flush();
}
""".replace('MAP',base64.b64encode(json.dumps(classes).encode()).decode())
for name in ['catichisi-local-web-1','ionidios-local-web-1']:
 print(name,flush=True)
 result=subprocess.run(['docker','exec','-i',name,'php'],input=php,text=True,capture_output=True,encoding='utf-8',timeout=240)
 print(result.stdout[-5000:],result.stderr[-1000:],flush=True)
 if 'Warning:' in result.stdout or 'Warning:' in result.stderr:raise SystemExit('PHP warning detected')
 if result.returncode:raise SystemExit(result.returncode)
