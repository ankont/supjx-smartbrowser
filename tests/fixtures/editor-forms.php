<?php
namespace Joomla\CMS\Language {
    class Text { public static function alt($text, $alt) { return $text; } }
}
namespace Joomla\CMS {
    class Factory {
        public static function getApplication() { return new class {
            public function getDocument() { return new class {
                public function getWebAssetManager() { return new class { public function useStyle($name) {} }; }
            }; }
        }; }
    }
}
namespace {
    define('_JEXEC', 1);
    $joomla = getenv('SMARTBROWSER_TEST_JOOMLA_ROOT');
    function radios($kind, $id) {
        global $joomla;
        $displayData = [
            'id'=>$id, 'name'=>$id, 'label'=>$kind, 'value'=>'0',
            'class'=>in_array($kind, ['switcher', 'plain']) ? '' : 'btn-group btn-group-yesno',
            'required'=>true, 'readonly'=>false, 'disabled'=>false, 'autofocus'=>false,
            'onchange'=>'', 'dataAttribute'=>'',
            'options'=>[(object)['value'=>'0','text'=>'Hide'], (object)['value'=>'1','text'=>'Show']],
        ];
        $renderer = new class { public function escape($value) { return htmlspecialchars($value); } };
        (function () use ($displayData, $kind, $joomla) {
            extract($displayData);
            include $joomla . '/layouts/joomla/form/field/' . ($kind === 'legacy' ? 'radiobasic.php' : 'radio/' . ($kind === 'plain' ? 'buttons' : $kind) . '.php');
        })->call($renderer);
    }
?>
<!doctype html><html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="/joomla/media/templates/administrator/atum/css/template.min.css">
<link rel="stylesheet" href="/joomla/media/system/css/fields/switcher.css">
<link rel="stylesheet" href="/joomla/media/system/css/fields/calendar.css">
<link rel="stylesheet" href="/package/component/media/css/smartbrowser.css">
<link rel="stylesheet" href="/package/component/media/css/editor.css">
<script src="/joomla/media/system/js/core.js"></script>
<script src="/joomla/media/system/js/fields/calendar-locales/date/gregorian/date-helper.js"></script>
<script src="/joomla/media/system/js/fields/calendar.js" defer></script>
<script src="/joomla/media/system/js/showon.js" defer></script>
<script src="/package/component/media/js/editor-forms.js" defer></script>
<style>
.com-smartbrowser-editor { margin: 20px; }
.controls { margin-left: 220px; }
.control-group { margin-bottom: 20px; }
form { overflow: auto; height: 650px; }
.options-form { padding: 16px; }
.calendar-row { margin-top: 150px; margin-left: auto; width: 240px; }
</style>
<section id="outside"><label for="outside-select">Native outside host</label><select id="outside-select" class="form-select inputbox"><option>No</option><option>Yes</option></select><?php radios('buttons', 'outside-buttons'); ?></section>
<main class="com-smartbrowser-editor is-aligned-editor">
<form id="adminForm"><fieldset class="options-form">
<?php foreach (['legacy', 'buttons', 'plain', 'switcher'] as $kind) : ?>
<div class="control-group"><div class="control-label"><?php echo $kind; ?></div><div class="controls"><?php radios($kind, $kind); ?><div class="form-text">Help text below control</div></div></div>
<?php endforeach; ?>
<div class="control-group"><div class="control-label"><label for="native-select">Featured</label></div><div class="controls"><select id="native-select" name="featured" class="form-select inputbox" required><option value="0">No</option><option value="1">Yes</option></select><small class="form-text">Select help</small></div></div>
<div class="control-group"><div class="control-label"><label for="old-select">Legacy select</label></div><div class="controls"><select id="old-select" name="old" class="custom-select"><option>No</option><option>Yes</option></select><small class="form-text">Select help</small></div></div>
<div class="control-group" data-showon='[{"field":"buttons","values":["1"],"sign":"=","op":""}]'><div class="control-label">Dependent</div><div class="controls"><input name="dependent" class="form-control"></div></div>
<div class="calendar-row"><div class="field-calendar"><div class="input-group"><input id="date" name="date" class="form-control" value="2026-11-05 12:00:00" data-alt-value="2026-11-05 12:00:00"><button type="button" data-inputfield="date" data-date-format="%Y-%m-%d %H:%M:%S" data-show-time="1" data-show-others="1" data-week-numbers="1" data-firstday="1" data-time24="24">Calendar</button></div></div></div>
<div style="height:400px"></div><button type="submit">Submit</button>
</fieldset></form></main></html>
<?php }
