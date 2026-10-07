<?php
namespace Joomla\CMS\HTML {
    final class HTMLHelper { public static function _(...$args): string { return ''; } }
}
namespace Joomla\CMS {
    final class Factory {
        public static function getApplication(): object {
            return new class {
                public function getInput(): object { return new class { public function getBool($key): bool { return false; } }; }
                public function getIdentity(): object { return new class { public function authorise(...$args): bool { return false; } }; }
            };
        }
    }
}
namespace Joomla\CMS\Component {
    final class ComponentHelper {
        public static function getParams($name): object { return new class { public function get($key, $default = null) { return $key === 'show_urls_images_frontend' ? 1 : 0; } }; }
    }
}
namespace Joomla\CMS\Language {
    final class Multilanguage { public static function isEnabled(): bool { return false; } }
    final class Text { public static function _($key): string { return $key; } }
}
namespace Joomla\CMS\Router {
    final class Route { public static function _($url, $x = null): string { return $url; } }
}
namespace {
    define('_JEXEC', 1);
    function check(bool $condition, string $message): void { if (!$condition) throw new \RuntimeException($message); }
    final class TestImageField {
        public int $renders = 0;
        public static array $assets = [];
        public function __construct(public string $name, public string $group, public string $value, public bool $hidden = false) {}
        public function renderField(): string {
            $this->renders++;
            self::$assets[$this->name] = true;
            return '<input type="' . ($this->hidden ? 'hidden' : 'text') . '" name="jform[' . $this->group . '][' . $this->name . ']" value="' . htmlspecialchars($this->value, ENT_QUOTES) . '">';
        }
    }
    $intro = new TestImageField('image_intro', 'images', 'intro.png');
    $full = new TestImageField('image_fulltext', 'images', 'full.png');
    $extraIntro = new TestImageField('extra_intro', 'images', '{"x":12}');
    $extraFull = new TestImageField('extra_full', 'plugin', 'saved full value', true);
    $form = new class($intro, $full, $extraIntro, $extraFull) {
        public array $sets;
        public function __construct(...$fields) { $this->sets = ['image-intro' => [$fields[0], $fields[2]], 'image-full' => [$fields[1], $fields[3]]]; }
        public function getField($name, $group = null) { foreach ($this->sets as $fields) foreach ($fields as $field) if ($field->name === $name && $field->group === $group) return $field; return null; }
        public function getFieldset($name): array { return $this->sets[$name] ?? []; }
        public function getFieldsets(): array { return array_map(fn($name) => (object) ['name' => $name], array_keys($this->sets)); }
        public function getInput(...$args): string { return ''; }
        public function renderControlFields(): string { return ''; }
    };
    $view = new class($form) {
        public bool $editorComplete = false;
        public string $editorError = '', $resourceType = 'article';
        public int $resourceId = 0;
        public function __construct(public object $editorForm) {}
        public function escape($value): string { return htmlspecialchars($value, ENT_QUOTES); }
        public function render(): string { ob_start(); include __DIR__ . '/../package/component/site/tmpl/editor/modal.php'; return ob_get_clean(); }
    };
    $html = $view->render();
    foreach ([$intro, $full, $extraIntro, $extraFull] as $field) {
        check($field->renders === 1, $field->name . ' must render exactly once');
        check(isset(TestImageField::$assets[$field->name]), 'Field renderer must be invoked for asset registration');
        check(str_contains($html, htmlspecialchars($field->value, ENT_QUOTES)), 'Bound value must reach the input');
    }
    check(strpos($html, '][extra_intro]') > strpos($html, '][image_intro]'), 'Intro extension must follow native fields');
    check(strpos($html, '][extra_full]') > strpos($html, '][image_fulltext]'), 'Full extension must follow native fields');
    check(preg_match('/COM_CONTENT_FIELD_INTRO_LABEL<\/legend>(?:(?!<\/fieldset>).)*extra_intro/s', $html) === 1, 'Intro extension must remain in its original image fieldset');
    check(preg_match('/COM_CONTENT_FIELD_FULL_LABEL<\/legend>(?:(?!<\/fieldset>).)*extra_full/s', $html) === 1, 'Full extension must remain in its original image fieldset');
    echo "Image fieldset extensions, bound values, renderer asset hooks and duplicate protection OK\n";
}
