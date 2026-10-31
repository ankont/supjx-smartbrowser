<?php
namespace Joomla\CMS\MVC\View { class HtmlView { public function getDocument() { return (object) []; } } }
namespace Joomla\Event { class Priority { public const LOW = -100; } }
namespace Joomla\CMS\Component { class ComponentHelper { public static object $params; public static function getParams($name) { return self::$params; } } }
namespace Joomla\CMS { class Factory { public static object $app; public static function getApplication() { return self::$app; } } }
namespace {
    define('_JEXEC', 1); define('JPATH_SITE', '/site');
    require __DIR__ . '/../package/component/site/src/View/Preview/HtmlView.php';
    $params = new class { public array $values = ['access-edit' => true]; public function set($key, $value) { $this->values[$key] = $value; } };
    \Joomla\CMS\Component\ComponentHelper::$params = $params;
    $app = new class {
        public bool $fail = false;
        public object $input, $dispatcher;
        public function __construct() {
            $this->input = new class { public array $values = ['option'=>'com_smartbrowser','view'=>'preview','id'=>43]; public function getString($key) { return $this->values[$key] ?? ''; } public function getCmd($key) { return $this->values[$key] ?? ''; } public function getInt($key) { return (int) ($this->values[$key] ?? 0); } public function set($key,$value) { $this->values[$key]=$value; } };
            $this->dispatcher = new class { public array $listeners = []; public function addListener($name,$fn,$priority) { $this->listeners[]=$fn; } public function removeListener($name,$fn) { $this->listeners=array_values(array_filter($this->listeners,fn($listener)=>$listener!==$fn)); } };
        }
        public function getInput() { return $this->input; }
        public function getIdentity() { return (object) ['id'=>0, 'guest'=>true]; }
        public function getDispatcher() { return $this->dispatcher; }
        public function getLanguage() { return new class { public function load(...$args) {} }; }
        public function bootComponent($name) { return $this; }
        public function getMVCFactory() { return $this; }
        public function createModel(...$args) { return new class { public array $state=[]; public function setState($key,$value) { $this->state[$key]=$value; } }; }
        public function createView($name,$client,$type,$config) {
            if ($name!=='Article' || $client!=='Site' || $config['option']!=='com_content' || $config['base_path']!=='/site/components/com_content') throw new \RuntimeException('Native view and template overrides not selected');
            return new class($this) {
                public object $model;
                public function __construct(private object $app) {}
                public function setModel($model,$default) { $this->model=$model; }
                public function setDocument($doc) {}
                public function display() {
                    $item=(object)['params'=>$this->model->state['params']];
                    $event=new class($item) { public function __construct(private object $item) {} public function getArgument($key) { return match($key) { 'context'=>'com_content.article','subject'=>$this->item,'params'=>$this->item->params }; } };
                    foreach($this->app->dispatcher->listeners as $listener) $listener($event);
                    if($item->params->values['access-edit']!==false) throw new \RuntimeException('Edit controls enabled');
                    if($this->app->fail) throw new \RuntimeException('Native render failure');
                    echo '<article>Native output</article>';
                }
            };
        }
    };
    \Joomla\CMS\Factory::$app=$app;
    $view=new \SuperSoft\Component\Smartbrowser\Site\View\Preview\HtmlView();
    ob_start(); $view->display(); $html=ob_get_clean();
    if($html!=='<article>Native output</article>' || $app->dispatcher->listeners || $params->values['access-edit']!==true || $app->input->values['option']!=='com_smartbrowser') throw new \RuntimeException('Preview mutated global context');
    $app->fail=true;
    try { $view->display(); } catch (\RuntimeException $error) { if($error->getMessage()!=='Native render failure') throw $error; }
    if($app->dispatcher->listeners || $app->input->values['view']!=='preview') throw new \RuntimeException('Preview failure did not clean up');
    echo "Native preview controls, parameter isolation and cleanup OK\n";
}
