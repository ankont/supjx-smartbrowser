<?php
namespace Joomla\CMS\Language {
    class Language {
        private array $strings = [];
        public function __construct(string $tag) {}
        public function load(string $extension, string $path): void {
            $this->strings += ['JSAVE' => 'Administrator Save', 'JFEATURE' => 'Feature', 'JUNFEATURE' => 'Unfeature'];
        }
        public function _(string $key): string { return $this->strings[$key] ?? $key; }
    }
    class Text {
        public static function _(string $key): string { return \Joomla\CMS\Factory::$app->getLanguage()->_($key); }
        public static function script(string $key): void { \Joomla\CMS\Factory::$app->getDocument()->addScriptOptions('joomla.jtext', [$key => self::_($key)]); }
    }
}
namespace Joomla\CMS {
    class Factory { public static object $app; public static function getApplication(): object { return self::$app; } }
}
namespace {
    define('_JEXEC', 1); define('JPATH_ADMINISTRATOR', '/administrator');
    $language = new class {
        public function getTag(): string { return 'en-GB'; }
        public function hasKey(string $key): bool { return $key === 'JSAVE'; }
        public function _(string $key): string { return $key === 'JSAVE' ? 'Frontend Save' : $key; }
    };
    $document = new class {
        public array $strings = [];
        public function addScriptOptions(string $name, array $values): void { $this->strings = array_replace($this->strings, $values); }
    };
    \Joomla\CMS\Factory::$app = new class($language, $document) {
        public function __construct(private object $language, private object $document) {}
        public function getLanguage(): object { return $this->language; }
        public function getDocument(): object { return $this->document; }
    };
    require __DIR__ . '/../package/component/admin/src/Support/BrowserLanguage.php';
    foreach (['JSAVE', 'JFEATURE', 'JUNFEATURE'] as $key) \SuperSoft\Component\Smartbrowser\Administrator\Support\BrowserLanguage::script($key);
    if ($document->strings !== ['JSAVE' => 'Frontend Save', 'JFEATURE' => 'Feature', 'JUNFEATURE' => 'Unfeature']) throw new \RuntimeException('Frontend strings were overwritten or fallback was not exported.');
    if ($language->_('JSAVE') !== 'Frontend Save' || $language->hasKey('JFEATURE')) throw new \RuntimeException('Host language mutated.');
    echo "Browser language fallback OK\n";
}
