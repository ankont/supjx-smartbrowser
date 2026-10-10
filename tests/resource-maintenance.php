<?php
namespace Joomla\CMS\Application { interface CMSApplicationInterface {} }
namespace Joomla\CMS\Language { class Text { public static function _($key) { return $key; } } }
namespace {
define('_JEXEC', 1);
define('JPATH_ADMINISTRATOR', __DIR__);
$base = __DIR__ . '/../package/component/admin/src/';
foreach (['Adapter/ResourceAdapterInterface.php', 'Adapter/BrowseRootAwareInterface.php', 'Adapter/ReadableResourceAdapterInterface.php',
    'Adapter/ContentAdapter.php', 'Support/ZipEntries.php', 'Support/OrderingSteps.php'] as $file) require $base . $file;
use SuperSoft\Component\Smartbrowser\Administrator\Adapter\ContentAdapter;
use SuperSoft\Component\Smartbrowser\Administrator\Support\ZipEntries;
use SuperSoft\Component\Smartbrowser\Administrator\Support\OrderingSteps;
function check($condition) { if (!$condition) throw new \RuntimeException('Regression failed'); }
$app = new class implements \Joomla\CMS\Application\CMSApplicationInterface {
    public function getLanguage() { return new class { public function load(...$args) {} }; }
};
$adapter = new class($app) extends ContentAdapter {
    public array $resources = []; public array $deleted = [];
    public function getId(): string { return 'articles'; }
    public function getResources(string $nodeId, array $options = []): array { return []; }
    public function getActions(array $selection = []): array { return []; }
    public function getCollectionPresentation(array $resources = []): array { return []; }
    public function executeAction(string $action, array $selection, array $payload = []): mixed { return $this->deleteTrashed($selection); }
    public function getResource(string $id, array $options = []): array { return $this->resources[$id]; }
    protected function contentModel(string $name): object { return $this->model(); }
    protected function categoryModel(): object { return $this->model(); }
    protected function tagModel(): object { return $this->model(); }
    private function model(): object { return new class($this) {
        public function __construct(private object $owner) {}
        public function delete($ids) { $this->owner->deleted[] = $ids; return true; }
    }; }
};
$adapter->resources = ['article:1'=>['status'=>-2,'capabilities'=>['delete'=>true]], 'category:2'=>['status'=>-2,'capabilities'=>['delete'=>true]]];
check($adapter->executeAction('delete', ['article:1','category:2'])['deleted'] === ['article:1','category:2']);
check($adapter->deleted === [[1],[2]]);
foreach ([['status'=>1,'capabilities'=>['delete'=>true]], ['status'=>-2,'capabilities'=>['delete'=>false]]] as $restricted) {
    $adapter->resources['article:3'] = $restricted; $adapter->deleted = [];
    try { $adapter->executeAction('delete', ['article:1','article:3']); throw new \LogicException('Unauthorized deletion accepted'); }
    catch (\RuntimeException $error) { check($error->getCode() === 403 && !$adapter->deleted); }
}
$entry = static fn ($name, $size = 10, $compressed = 10) => ['name'=>$name,'size'=>$size,'comp_size'=>$compressed];
check(count(ZipEntries::validate([$entry('folder/'), $entry('folder/photo.jpg')])) === 2);
foreach ([[$entry('../escape.jpg')], [$entry('/absolute.jpg')], [$entry('a\\b.jpg')], [$entry('.htaccess')],
    [$entry('script.php')], [$entry('C:evil.jpg')], [$entry('%2e%2e/escape.jpg')],
    [$entry('a.jpg'), $entry('A.jpg')], [$entry('a'), $entry('a/photo.jpg')],
    [$entry('bomb.jpg', 1000000, 1)], [array_merge($entry('link.jpg'), ['symlink'=>true])]] as $unsafe) {
    try { ZipEntries::validate($unsafe); throw new \LogicException('Unsafe ZIP accepted'); }
    catch (\InvalidArgumentException $error) { check(in_array($error->getCode(), [400,413], true)); }
}
echo "Trashed-only native deletion ACL and ZIP path/expansion validation OK\n";
foreach ([[1,2,3,4,5], [2,3,4,1,5]] as $siblings) {
    $selected = [4,2];
    $expected = $siblings; $index = 0;
    foreach ($expected as &$id) if (in_array($id, $selected, true)) $id = $selected[$index++];
    unset($id);
    foreach (OrderingSteps::sortPlan($siblings, $selected) as $move) {
        $position = array_search($move['id'], $siblings, true); $next = $position + $move['step'];
        [$siblings[$position],$siblings[$next]] = [$siblings[$next],$siblings[$position]];
    }
    check($siblings === $expected);
}
echo "Native ordering move plans preserve unrelated sibling slots\n";
}
