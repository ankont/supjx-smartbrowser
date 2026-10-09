<?php
namespace Joomla\CMS\Application {
    interface CMSApplicationInterface { public function getDispatcher(); }
}
namespace Joomla\CMS\Plugin {
    final class PluginHelper {
        public static array $imports = [];
        public static function importPlugin($group, $plugin, $autocreate, $dispatcher): void {
            self::$imports[] = [$group, $dispatcher];
        }
    }
}
namespace Joomla\Event {
    final class Event {
        public function __construct(private string $name, private array $arguments) {}
        public function getName(): string { return $this->name; }
        public function getArgument(string $key) { return $this->arguments[$key] ?? null; }
        public function setArgument(string $key, $value): void { $this->arguments[$key] = $value; }
        public function getArguments(): array { return $this->arguments; }
    }
}
namespace {
    define('_JEXEC', 1);
require_once __DIR__ . '/../package/component/admin/src/Support/ResourceDescriptor.php';
    require __DIR__ . '/../package/component/admin/src/Support/ResourceVisualDecorator.php';
    use SuperSoft\Component\Smartbrowser\Administrator\Support\ResourceVisualDecorator;
    use Joomla\CMS\Plugin\PluginHelper;

    foreach (['site', 'administrator'] as $client) {
        $dispatcher = new class {
            public $provider = null;
            public function dispatch($name, $event): void {
                if ($name !== 'onSmartVisualsDecorateResources') throw new \RuntimeException('Wrong event');
                if (array_keys($event->getArguments()) !== ['resources', 'decorations']) throw new \RuntimeException('Wrong arguments');
                if ($this->provider) ($this->provider)($event);
            }
        };
        $app = new class($dispatcher, $client) implements \Joomla\CMS\Application\CMSApplicationInterface {
            public function __construct(private $dispatcher, private string $client) {}
            public function getDispatcher() { return $this->dispatcher; }
            public function isClient($client): bool { return $client === $this->client; }
        };
        $native = ['id' => 'article:123', 'image' => 'images/native.jpg', 'icon' => 'fas fa-file', 'capabilities' => ['edit' => false]];
        $fallback = ['id' => 'category:45', 'image' => null, 'icon' => 'fas fa-folder'];
        $response = ['items' => [$native], 'nodes' => [$fallback]];
        $decorator = new ResourceVisualDecorator($app);
        $complete = ['items' => [\SuperSoft\Component\Smartbrowser\Administrator\Support\ResourceDescriptor::complete($native)],
            'nodes' => [\SuperSoft\Component\Smartbrowser\Administrator\Support\ResourceDescriptor::complete($fallback)]];
        if ($decorator->decorate($response, 'articles') !== $complete) throw new \RuntimeException('No provider changed native visuals');
        $dispatcher->provider = static function ($event): void {
            $decorations = $event->getArgument('decorations');
            foreach ($event->getArgument('resources') as $resource) {
                if ($resource['id'] === 'article:123' && $resource['image'] !== 'images/native.jpg') throw new \RuntimeException('Native image missing before dispatch');
                if (empty($resource['image'])) $decorations[$resource['id']]['image'] = 'images/fallback.jpg';
                $decorations[$resource['id']]['badgeIcon'] = 'fas fa-book';
            }
            $event->setArgument('decorations', $decorations);
        };
        $result = $decorator->decorate($response, 'articles');
        if ($result['items'][0]['image'] !== $native['image'] || $result['nodes'][0]['image'] !== 'images/fallback.jpg') throw new \RuntimeException('Fallback semantics changed');
        if ($result['items'][0]['badgeIcon'] !== 'fas fa-book' || $result['items'][0]['capabilities'] !== $native['capabilities']) throw new \RuntimeException('Decoration merge changed');
        $dispatcher->provider = static fn($event) => $event->setArgument('decorations', ['article:123' => ['image' => 'images/override.jpg']]);
        if ($decorator->decorate($response, 'articles')['items'][0]['image'] !== 'images/override.jpg') throw new \RuntimeException('Override precedence changed');
        if (PluginHelper::$imports[array_key_last(PluginHelper::$imports)] !== ['smartvisuals', $dispatcher]) throw new \RuntimeException('Wrong plugin group/dispatcher');
    }
    echo "SmartVisuals native data, dispatch, fallback and merge OK\n";
}
