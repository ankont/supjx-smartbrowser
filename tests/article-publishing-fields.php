<?php
namespace Joomla\CMS\Application { interface CMSApplicationInterface {} }
namespace Joomla\CMS\Form { class Form { public static function addFormPath($path) {} public static function addFieldPath($path) {} } }
namespace Joomla\CMS\Language {
    class Text { public static function _($key) { return $key; } }
    class Multilanguage { public static function isEnabled() { return false; } }
}
namespace Joomla\CMS\HTML { class HTMLHelper { public static function _(...$args) { return ''; } } }
namespace Joomla\CMS\Router { class Route { public static function _($url, ...$args) { return $url; } } }
namespace Joomla\CMS\Component { class ComponentHelper { public static function getParams($name) { return new class { public function get($key, $default = null) { return 0; } }; } } }
namespace Joomla\CMS { class Factory { public static object $app; public static function getApplication() { return self::$app; } } }
namespace {
define('_JEXEC', 1);
define('JPATH_ADMINISTRATOR', __DIR__ . '/fixtures/publishing-native');
define('JPATH_SITE', __DIR__ . '/fixtures');
require __DIR__ . '/../package/component/site/src/Service/FrontendEditorService.php';
use SuperSoft\Component\Smartbrowser\Site\Service\FrontendEditorService;
function check($condition, $message) { if (!$condition) throw new \RuntimeException($message); }
class PublishingForm {
    public array $fields = [], $values = [], $renders = [];
    public function __construct(array $values) {
        $this->values = $values;
        $this->setField(new \SimpleXMLElement('<field name="created" type="calendar" filter="unset" />'));
        foreach (['featured','publish_up','publish_down','featured_up','featured_down'] as $name) {
            $this->setField(new \SimpleXMLElement('<field name="'.$name.'" type="calendar" disabled="true" filter="unset" />'));
        }
    }
    public function getValue($name, $group = null, $default = null) { return $this->values[$name] ?? $default; }
    public function setValue($name, $group, $value) { $this->values[$name] = $value; }
    public function bind($values) { $this->values = array_replace($this->values, $values); }
    public function setField($field) { $this->fields[(string) $field['name']] = $field; }
    public function setFieldAttribute($name, $attribute, $value) { if (isset($this->fields[$name])) $this->fields[$name][$attribute] = $value; }
    public function getField($name, $group = null) {
        if ($group !== null || !isset($this->fields[$name])) return null;
        return new class($this, $name) {
            public string $group = '', $fieldname;
            public function __construct(private PublishingForm $form, public string $name) { $this->fieldname = $name; }
            public function renderField() {
                $this->form->renders[$this->name] = ($this->form->renders[$this->name] ?? 0) + 1;
                return '<label>'.(string) $this->form->fields[$this->name]['label'].'</label><input name="'.$this->name.'" value="'.htmlspecialchars((string) ($this->form->values[$this->name] ?? ''), ENT_QUOTES).'">';
            }
        };
    }
    public function getFieldsets() { return [(object) ['name'=>'audit','label'=>'Audit']]; }
    public function getFieldset($name) { return $name === 'audit' ? array_map(fn ($name) => $this->getField($name), array_keys($this->fields)) : []; }
    public function getInput(...$args) { return ''; }
    public function renderControlFields() { return ''; }
}
class PublishingModel {
    public PublishingForm $form; public array $saved = [];
    public array $record = ['id'=>3,'created'=>'2026-02-14 01:26:26','created_by'=>7,'created_by_alias'=>'',
        'modified'=>'2026-10-05 21:21:33','modified_by'=>9,'version'=>13,'hits'=>132,'images'=>[],'urls'=>[]];
    public function getForm($data = [], $load = true) { return $this->form = new PublishingForm($load ? array_replace($this->record, ['created'=>'2026-02-15 01:26:26']) : $data); }
    public function getItem($id) { return (object) $this->record; }
    public function validate($form, $data) {
        foreach ($form->fields as $name => $field) if ((string) $field['filter'] === 'unset') unset($data[$name]);
        return $data;
    }
    public function save($data) { $this->saved = $data; return true; }
    public function getName() { return 'form'; }
    public function getState($key, $default = null) { return 3; }
}
class PublishingApp implements \Joomla\CMS\Application\CMSApplicationInterface {
    public PublishingModel $model; public object $input, $user;
    public function __construct(bool $manageUsers) {
        $this->model = new PublishingModel();
        $this->input = new class {
            public function getMethod() { return 'GET'; } public function getBool($key) { return false; }
            public function getInt($key, $default = 0) { return $default; } public function getString($key, $default = '') { return $default; }
            public function set(...$args) {}
        };
        $this->user = new class($manageUsers) {
            public int $id = 90;
            public function __construct(private bool $manage) {}
            public function authorise($action, $asset) { return $action === 'core.manage' && $asset === 'com_users' ? $this->manage : $action !== 'core.edit.state'; }
        };
    }
    public function getInput() { return $this->input; } public function getIdentity() { return $this->user; }
    public function getUserState($key, $default = null) { return $default; }
    public function getLanguage() { return new class { public function load(...$args) {} public function getTag() { return 'el-GR'; } }; }
    public function bootComponent($name) { return new class($this->model) {
        public function __construct(private object $model) {}
        public function getMVCFactory() { return new class($this->model) {
            public function __construct(private object $model) {} public function createModel(...$args) { return $this->model; }
        }; }
    }; }
}
foreach ([false, true] as $manage) {
    $app = new PublishingApp($manage); \Joomla\CMS\Factory::$app = $app;
    $service = new FrontendEditorService($app); $form = $service->getForm('article', 3);
    check((string) $form->fields['created']['label'] === 'COM_CONTENT_FIELD_CREATED_LABEL', 'Created label absent');
    check((string) $form->fields['created']['filter'] === 'user_utc' && (string) $form->fields['created']['disabled'] !== 'true', 'Created is not native editable calendar');
    check($form->values['created'] === '2026-02-15 01:26:26', 'Previous created-date correction overwritten');
    check((string) $form->fields['created_by']['type'] === 'user', 'Creator does not use native user field');
    check(((string) $form->fields['created_by']['filter'] === 'unset') === !$manage, 'Creator ACL differs from native');
    foreach (['modified','modified_by','version','hits'] as $name) {
        check((string) $form->fields[$name]['readonly'] === 'true' && (string) $form->fields[$name]['filter'] === 'unset', 'Audit field writable');
        check($form->values[$name] === $app->model->record[$name], 'Stored audit data missing');
    }
    check((string) $form->fields['publish_up']['disabled'] === 'true', 'Publishing ACL relaxed');
    $view = new class($form) {
        public bool $editorComplete = false; public string $resourceType = 'article', $editorError = ''; public int $resourceId = 3;
        public function __construct(public object $editorForm) {}
        public function escape($value) { return htmlspecialchars($value, ENT_QUOTES); }
        public function render() { ob_start(); include __DIR__.'/../package/component/site/tmpl/editor/modal.php'; return ob_get_clean(); }
    };
    $html = $view->render();
    foreach (['publish_up','publish_down','featured_up','featured_down','created','created_by','created_by_alias','modified','modified_by','version','hits'] as $name) {
        check(($form->renders[$name] ?? 0) === 1, 'Publishing field missing/duplicated with presentation settings hidden: '.$name);
    }
    check(strpos($html, 'name="publish_up"') < strpos($html, 'name="featured_up"'), 'Native publishing order changed');
    $service->save('article', 3, ['title'=>'Saved', 'created'=>'2026-02-16 01:26:26', 'created_by'=>42,
        'modified'=>'forged', 'modified_by'=>42, 'version'=>999, 'hits'=>999]);
    check($app->model->saved['created'] === '2026-02-16 01:26:26', 'Created edit dropped during save');
    check(isset($app->model->saved['created_by']) === $manage, 'Creator ACL not enforced on save');
    foreach (['modified','modified_by','version','hits'] as $name) check(!isset($app->model->saved[$name]), 'Client audit metadata accepted: '.$name);
}
echo "Publishing fields, native definitions, read-only audit values, author ACL, save/reload data and presentation independence OK\n";
}
