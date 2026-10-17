<?php
namespace Joomla\CMS {
    final class Factory { public static object $app; public static function getApplication() { return self::$app; } }
}
namespace Joomla\CMS\Log {
    final class Log { const WARNING = 4; public static array $messages = []; public static function add($message, $level, $category) { self::$messages[] = $message; } }
}
namespace Joomla\CMS\Plugin {
    final class PluginHelper { public static array $imports = []; public static function importPlugin($group, $plugin, $autocreate, $dispatcher) { self::$imports[] = $group; } }
}
namespace Joomla\Event {
    final class Event {
        public function __construct(private string $name, private array $arguments) {}
        public function getName() { return $this->name; }
        public function getArgument($key) { return $this->arguments[$key] ?? null; }
    }
}
namespace Joomla\CMS\Layout {
    final class FileLayout {
        public static array $overrides = [];
        public function __construct(private string $id, $base, array $options) {
            if ($base !== null || $options !== ['component' => 'com_smartbrowser', 'client' => 0]) throw new \RuntimeException('Joomla override search disabled');
        }
        public function render($displayData) {
            if (isset(self::$overrides[$this->id])) return (self::$overrides[$this->id])($displayData);
            if ($this->id !== 'smartbrowser.resource') throw new \RuntimeException('Unknown layout');
            ob_start(); require __DIR__ . '/../../package/component/site/layouts/smartbrowser/resource.php'; return ob_get_clean();
        }
    }
    final class LayoutHelper {
        public static function render($id, array $data) {
            if ($id !== 'joomla.html.image') throw new \RuntimeException('Native image layout not used');
            $data['src'] = explode('#joomlaImage://', $data['src'])[0];
            $data['src'] = htmlspecialchars($data['src'], ENT_QUOTES, 'UTF-8');
            $data['alt'] = htmlspecialchars($data['alt'], ENT_QUOTES, 'UTF-8');
            $html = '<img'; foreach ($data as $key => $value) $html .= ' ' . $key . '="' . $value . '"'; return $html . '>';
        }
    }
}
