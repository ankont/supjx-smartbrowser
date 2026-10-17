<?php
define('_JEXEC', 1);
require __DIR__ . '/output-joomla.php';
require __DIR__ . '/../../package/component/admin/src/Support/SelectionOutputRenderer.php';
use Joomla\CMS\Factory;
use SuperSoft\Component\Smartbrowser\Administrator\Support\SelectionOutputRenderer as Output;
Factory::$app = new class {
    public function getDispatcher() { return new class {
        public function dispatch($name, $event) {
            $event->getArgument('imageElement')->setAttribute('style', 'width: 240px; height: auto; aspect-ratio: 16 / 9; object-fit: cover');
        }
    }; }
};
$items = [];
foreach ([['media','image','item',null], ['articles','article','item','/article'], ['categories','category','node','/category'],
    ['tags','tag','node','/tag'], ['menus','menu-item','node','/menu'], ['users','user','item',null], ['media','document','item','/files/document.pdf']] as [$adapter,$type,$kind,$url]) {
    $items[] = ['selection'=>['adapter'=>$adapter,'id'=>$type.':1'], 'usage'=>['media.alt'=>'Example image','media.caption'=>$type==='image'?'Image caption':''],
        'resource'=>['id'=>$type.':1','type'=>$type,'kind'=>$kind,'title'=>ucfirst($type),'metadata'=>['url'=>$url]],
        'displayedName'=>ucfirst($type), 'unavailable'=>false,
        'effectiveThumbnail'=>in_array($type,['image','article','category','tag','menu-item'],true)?'/resources/images/visual-example.svg':null];
}
echo '<!doctype html><html lang="en"><meta charset="utf-8"><title>Native field output</title><style>body{font:16px system-ui;margin:24px}ul{list-style:none;padding:0}li{margin-block:16px}figure{margin:0}figcaption{font-size:14px}</style><main>';
echo Output::renderSelection(['items'=>$items]);
echo '</main></html>';
