<?php
namespace Joomla\CMS\Language { class Text { public static function _($key) { return $key; } } }
namespace Joomla\CMS\Router { class Route { public static function _($url, $escape = true) { return $url; } } }
namespace Joomla\CMS\Session { class Session { public static bool $valid = true; public static function checkToken() { return self::$valid; } } }
namespace Joomla\CMS\MVC\Controller {
    class BaseController {
        public string $redirect = '';
        public function __construct(protected object $app, protected object $input) {}
        protected function setRedirect($url) { $this->redirect = $url; }
    }
}
namespace SuperSoft\Component\Smartbrowser\Site\Service {
    class FrontendEditorService {
        public static ?\Throwable $error = null;
        public function __construct($app) {}
        public function reloadArticle($id, $data) { if (self::$error) throw self::$error; }
    }
}
namespace {
    define('_JEXEC', 1);
    require __DIR__ . '/../package/component/site/src/Controller/EditorController.php';
    $data = ['title'=>'Unsaved title', 'created'=>'invalid input', 'com_fields'=>['sources'=>'preserved']];
    $input = new class($data) {
        public object $post;
        public function __construct($data) { $this->post = new class($data) { public function __construct(private array $data) {} public function get(...$args) { return $this->data; } }; }
        public function getCmd($key) { return $key === 'type' ? 'article' : ''; }
        public function getInt($key) { return 401; }
        public function getBool($key) { return false; }
        public function getString($key) { return ''; }
    };
    $app = new class { public array $states = []; public function isClient($client) { return $client === 'site'; } public function setUserState($key, $value) { $this->states[$key] = $value; } };
    $service = \SuperSoft\Component\Smartbrowser\Site\Service\FrontendEditorService::class;
    $controllerClass = \SuperSoft\Component\Smartbrowser\Site\Controller\EditorController::class;
    $controller = new $controllerClass($app, $input);
    $controller->reload();
    if (!str_contains($controller->redirect, 'view=editor') || str_contains($controller->redirect, 'done=1')) throw new \RuntimeException('Successful reload closed the editor');
    $service::$error = new \Exception('Invalid created date');
    $controller->reload();
    $failure = $app->states['com_smartbrowser.editor.failure'];
    if ($failure['data'] !== $data || $failure['message'] !== 'Invalid created date' || str_contains($controller->redirect, 'done=1')) throw new \RuntimeException('Reload error lost input or closed the editor');
    $service::$error = new \RuntimeException('Forbidden', 403);
    try { $controller->reload(); throw new \LogicException('Forbidden reload accepted'); }
    catch (\RuntimeException $error) { if ($error->getCode() !== 403) throw $error; }
    \Joomla\CMS\Session\Session::$valid = false;
    $service::$error = null;
    try { $controller->reload(); throw new \LogicException('Invalid token accepted'); }
    catch (\RuntimeException $error) { if ($error->getCode() !== 403) throw $error; }
    echo "Category reload keeps the editor open, preserves failed input and enforces token/access checks OK\n";
}
