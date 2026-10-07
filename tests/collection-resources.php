<?php
namespace Joomla\CMS\Language { class Text { public static function _($key) { return $key; } } }
namespace {
define('_JEXEC', 1);
require __DIR__ . '/../package/component/admin/src/Adapter/ResourceAdapterInterface.php';
require __DIR__ . '/../package/component/admin/src/Support/CollectionResources.php';
require __DIR__ . '/../package/component/admin/src/Support/OrderingSteps.php';
use SuperSoft\Component\Smartbrowser\Administrator\Support\CollectionResources;
use SuperSoft\Component\Smartbrowser\Administrator\Support\OrderingSteps;
use SuperSoft\Component\Smartbrowser\Administrator\Adapter\ResourceAdapterInterface;
if (CollectionResources::identifiers('articles', [12, '45', 'article:12']) !== ['article:12', 'article:45']) throw new \RuntimeException('Identifier normalization failed');
if (CollectionResources::identifiers('media', ['local-images:/a.png']) !== ['local-images:/a.png']) throw new \RuntimeException('Media identity changed');
$adapter = new class implements ResourceAdapterInterface {
    public function getId(): string { return 'articles'; }
    public function getRoots(): array { return []; }
    public function getResources(string $nodeId, array $options = []): array { throw new \RuntimeException('Collection must not browse'); }
    public function getResource(string $id, array $options = []): array {
        if ($id === 'article:2') throw new \RuntimeException('Missing', 404);
        if ($id === 'article:4') throw new \RuntimeException('Database failure', 500);
        return ['id' => $id, 'title' => 'Private title', 'metadata' => ['accessId' => $id === 'article:3' ? 9 : 1]];
    }
    public function getBreadcrumb(string $nodeId): array { return []; }
    public function getActions(array $selection = []): array { return []; }
    public function executeAction(string $action, array $selection, array $payload = []): mixed { throw new \RuntimeException('Collection must not mutate resources'); }
};
$identity = new class { public function authorise($permission) { return false; } public function getAuthorisedViewLevels() { return [1]; } };
$resources = CollectionResources::resolve($adapter, ['article:1', 'article:2', 'article:3'], $identity, true);
if (array_column($resources, 'id') !== ['article:1', 'article:2', 'article:3']) throw new \RuntimeException('Reference order lost');
if (empty($resources[1]['unavailable']) || empty($resources[2]['unavailable']) || $resources[2]['title'] === 'Private title') throw new \RuntimeException('Unavailable resources leaked data');
try { CollectionResources::resolve($adapter, ['article:4'], $identity, true); throw new \RuntimeException('System failures must surface'); } catch (\RuntimeException $error) { if ($error->getCode() !== 500) throw $error; }
foreach ([[['a','b','c','d'], ['b','c'], 'up', ['b','c','a','d']], [['a','b','c','d'], ['b','c'], 'down', ['a','d','b','c']], [['a','b'], ['a'], 'up', ['a','b']]] as [$ids, $selected, $direction, $expected]) {
    if (OrderingSteps::orderedIds($ids, $selected, $direction) !== $expected) throw new \RuntimeException('Collection ordering changed semantics');
}
echo "Collection resolution, access and ordering OK\n";
}
