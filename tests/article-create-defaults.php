<?php
namespace Joomla\CMS\Application { interface CMSApplicationInterface {} }
namespace Joomla\CMS\Language { final class Text { public static function _($key) { return $key; } } }
namespace Joomla\CMS\Form {
    class Form { public static function addFormPath($path) {} public static function addFieldPath($path) {} }
}
namespace {
    define('_JEXEC', 1); define('JPATH_SITE', '/site'); define('JPATH_ADMINISTRATOR', '/admin');
    require __DIR__ . '/../package/component/site/src/Service/FrontendEditorService.php';
    use SuperSoft\Component\Smartbrowser\Site\Service\FrontendEditorService;
    final class DefaultsForm {
        public array $values = [];
        public function getValue($name, $group = null, $default = null) { return $this->values[$name] ?? $default; }
        public function setValue($name, $group, $value) { $this->values[$name] = $value; }
        public function setFieldAttribute(...$args) {}
        public function getField($name) { return (object) ['options' => [(object) ['value' => '*'], (object) ['value' => 'en-GB']]]; }
        public function bind($data) { $this->values = array_replace($this->values, $data); }
    }
    final class DefaultsModel {
        public DefaultsForm $form; public int $saves = 0; public array $validated = []; public bool $invalid = false;
        public function __construct() { $this->form = new DefaultsForm(); }
        public function getForm(...$args) { return $this->form; }
        public function getItem($id) { return (object) ['id' => $id, 'images' => [], 'urls' => []]; }
        public function validate($form, $data) { $this->validated = $data; return $this->invalid ? false : $data; }
        public function save($data) { $this->saves++; return true; }
        public function getName() { return 'article'; }
        public function getState($key, $default = null) { return 123; }
        public function getErrors() { return ['Native validation failed']; }
    }
    final class DefaultsApp implements \Joomla\CMS\Application\CMSApplicationInterface {
        public object $input, $user; public array $state = []; public DefaultsModel $model;
        public function __construct(array $payload) {
            $this->model = new DefaultsModel();
            $this->input = new class($payload) {
                public string $method = 'GET';
                public function __construct(public array $values) {}
                public function getMethod() { return $this->method; }
                public function getString($key, $default = null) { return array_key_exists($key, $this->values) ? (string) $this->values[$key] : $default; }
                public function getInt($key, $default = 0) { return (int) ($this->values[$key] ?? $default); }
                public function getBool($key) { return (bool) ($this->values[$key] ?? false); }
                public function set($key, $value) { $this->values[$key] = $value; }
            };
            $this->user = new class {
                public bool $allowed = true; public array $checks = [];
                public function authorise($action, $asset) { $this->checks[] = [$action, $asset]; return $this->allowed; }
            };
        }
        public function getInput() { return $this->input; }
        public function getIdentity() { return $this->user; }
        public function getUserState($key, $default = null) { return $this->state[$key] ?? $default; }
        public function setUserState($key, $value) { $this->state[$key] = $value; }
        public function getLanguage() { return new class { public function getTag() { return 'en-GB'; } public function load(...$args) {} }; }
        public function bootComponent($name) {
            return new class($this->model) {
                public function __construct(public object $model) {}
                public function getMVCFactory() { return new class($this->model) { public function __construct(public object $model) {} public function createModel(...$args) { return $this->model; } }; }
            };
        }
    }
    function check($condition, $message) { if (!$condition) throw new RuntimeException($message); }
    function app($defaults): DefaultsApp { return new DefaultsApp(['catid' => 32, 'sbCreateDefaults' => json_encode($defaults)]); }
    function rejected(DefaultsApp $app, $code): void {
        try { (new FrontendEditorService($app))->getForm('article', 0); } catch (Throwable $error) { check($error->getCode() === $code, $error->getMessage()); return; }
        throw new RuntimeException('Payload/ACL was not rejected');
    }
    $defaults = ['title' => 'Prayer', 'alias' => 'prayer_12', 'catid' => 32, 'language' => '*'];
    $app = app($defaults); $service = new FrontendEditorService($app); $form = $service->getForm('article', 0);
    check(FrontendEditorService::supportsArticleCreateDefaults(), 'Missing capability');
    check($form->values === $defaults, 'Defaults were not bound');
    check($app->model->saves === 0, 'Opening defaults saved automatically');
    foreach ([[], ['catid' => 32], ['catid' => 32, 'sbCreateDefaults' => '']] as $input) {
        $normal = new DefaultsApp($input);
        $normalForm = (new FrontendEditorService($normal))->getForm('article', 0);
        check($normalForm === $normal->model->form && $normalForm->values === [], 'Normal creation entered defaults handling');
        check($normal->model->saves === 0, 'Normal creation saved automatically');
    }
    $payloadCategory = app($defaults); unset($payloadCategory->input->values['catid']);
    (new FrontendEditorService($payloadCategory))->getForm('article', 0);
    check($payloadCategory->input->getInt('catid') === 32, 'Payload category was not used by native ACL');
    $post = app($defaults); $post->input->method = 'POST';
    (new FrontendEditorService($post))->getForm('article', 0);
    check($post->model->form->values === [], 'Defaults applied on POST');
    $unicode = app(array_replace($defaults, ['title' => str_repeat("\u{03A0}", 255)]));
    (new FrontendEditorService($unicode))->getForm('article', 0);
    check(strlen($unicode->model->form->values['title']) === 510, 'Unicode title limit used bytes instead of characters');
    rejected(app(array_replace($defaults, ['title' => str_repeat("\u{03A0}", 256)])), 400);
    foreach ($app->user->checks as [$action, $asset]) check($action === 'core.create' && $asset === 'com_content.category.32', 'ACL category mismatch');
    $denied = app($defaults); $denied->user->allowed = false; rejected($denied, 403);
    foreach ([['catid' => 33], ['catid' => '32'], ['catid' => true], ['title' => []], ['alias' => str_repeat('x', 256)], ['title' => str_repeat('x', 256)], ['language' => 'invalid'], ['state' => 1], ['access' => 1]] as $invalid) rejected(app(array_replace($defaults, $invalid)), 400);
    rejected(app(array_replace($defaults, ['language' => 'fr-FR'])), 400);
    foreach (['{broken', '[]', 'null', str_repeat('x', 4097)] as $json) { $bad = app($defaults); $bad->input->values['sbCreateDefaults'] = $json; rejected($bad, 400); }
    $existing = app($defaults); $existing->input->values['sbCreateDefaults'] = '{broken'; $existing->model->form->values = ['id' => 7, 'title' => 'Existing'];
    (new FrontendEditorService($existing))->getForm('article', 7); check($existing->model->form->values['title'] === 'Existing', 'Existing article overwritten');
    $prior = app($defaults); $prior->state['com_content.edit.article.data'] = ['title' => 'Draft', 'catid' => 45]; $prior->model->form->bind($prior->state['com_content.edit.article.data']);
    (new FrontendEditorService($prior))->getForm('article', 0); check($prior->model->form->values['title'] === 'Draft', 'Draft overwritten');
    $failed = app($defaults); $failed->input->values['sbCreateDefaults'] = '{broken'; $failed->state['com_smartbrowser.editor.failure'] = ['type' => 'article', 'id' => 0, 'data' => ['title' => 'User correction', 'catid' => 45, 'alias' => 'corrected']];
    $restored = (new FrontendEditorService($failed))->getForm('article', 0); $restored->bind($failed->state['com_smartbrowser.editor.failure']['data']);
    check($restored->values['title'] === 'User correction' && $failed->input->getInt('catid') === 45, 'Failure data/ACL context lost');
    $seeded = app($defaults); $seeded->model->form->values = ['title' => 'Plugin draft']; (new FrontendEditorService($seeded))->getForm('article', 0); check($seeded->model->form->values === ['title' => 'Plugin draft'], 'Populated form overwritten');
    $app->input->method = 'POST'; $app->model->invalid = true;
    try { $service->save('article', 0, ['title' => 'Invalid', 'catid' => 45, 'language' => '*']); throw new RuntimeException('Validation bypassed'); } catch (RuntimeException $error) { check($error->getCode() === 400, 'Wrong validation error'); }
    check($app->model->saves === 0 && $app->model->validated['title'] === 'Invalid', 'Native validation/save changed');
    echo "Article defaults, strict ACL, invalid payloads, existing/draft/failure data and native validation OK\n";
}
