<?php
namespace Joomla\Component\Content\Administrator\Model {
    class ArticlesModel {
        public array $state = [];
        public function getState($key) { return $this->state[$key] ?? null; }
        protected function getStoreId($id = '') { return $id; }
        public function getDatabase() { return new class { public function quoteName($name) { return $name; } }; }
        protected function getListQuery() {
            return new class {
                public array $order = ['old'];
                public string $where = 'native-access-policy';
                public array $states = [];
                public function whereIn($field, $values) { $this->states = [$field, $values]; return $this; }
                public function clear($type) { $this->order = []; return $this; }
                public function order($order) { $this->order[] = $order; return $this; }
            };
        }
    }
}
namespace {
    define('_JEXEC', 1);
    require __DIR__ . '/../package/component/admin/src/Support/ResourcePagination.php';
    require __DIR__ . '/../package/component/admin/src/Support/ResourceListing.php';
    require __DIR__ . '/../package/component/admin/src/Model/PagedArticlesModel.php';
    use SuperSoft\Component\Smartbrowser\Administrator\Support\ResourcePagination;
    function check($value) { if (!$value) throw new \RuntimeException('Pagination regression'); }
    foreach ([[0, 0, 0, 0], [50, 103, 50, 50], [500, 103, 100, 3], [50, 50, 0, 50]] as [$offset, $total, $expectedOffset, $returned]) {
        $p = new ResourcePagination($offset, 50); $p->count($total);
        check($p->offset === $expectedOffset);
        check(min($p->limit, $p->total - $p->offset) === $returned);
        check($p->descriptor()['hasMore'] === ($expectedOffset + 50 < $total));
    }
    $p = new ResourcePagination(0, 10); $p->prefix = 13; $p->count(22);
    check($p->itemLimit() === 0 && count($p->nodes(range(1, 13))) === 10);
    $p->offset = 10;
    check($p->itemLimit() === 7 && $p->itemOffset() === 0 && count($p->nodes(range(1, 13))) === 3);
    $p->offset = 20;
    check($p->itemLimit() === 10 && $p->itemOffset() === 7);
    foreach ([0, -1] as $limit) {
        try { new ResourcePagination(0, $limit); throw new \LogicException('Invalid size accepted'); }
        catch (\InvalidArgumentException) {}
    }
    $custom = new ResourcePagination(0, 237); $custom->count(1000);
    check($custom->limit === 237 && $custom->descriptor()['hasMore']);
    $model = new \SuperSoft\Component\Smartbrowser\Administrator\Model\PagedArticlesModel;
    $model->state = ['smartbrowser.sort' => 'title', 'list.direction' => 'DESC'];
    $method = new \ReflectionMethod($model, 'getListQuery');
    $query = $method->invoke($model);
    check($query->order === ['a.title DESC', 'a.id ASC'] && $query->where === 'native-access-policy');
    $model->state['smartbrowser.sort'] = 'ordering';
    check($method->invoke($model)->order === ['c.lft DESC', 'a.ordering DESC', 'a.id ASC']);
    $model->state['list.start'] = 7;
    check($model->getStart() === 7);
    $model->state['smartbrowser.featured'] = true;
    check($method->invoke($model)->order === ['fp.ordering DESC', 'a.id ASC']);
    $model->state['smartbrowser.states'] = [1, 0, 2];
    check($method->invoke($model)->states === ['a.state', [1, 0, 2]]);
    unset($model->state['smartbrowser.sort']);
    check($method->invoke($model)->order === ['old']);
    $store = new \ReflectionMethod($model, 'getStoreId');
    $firstStore = $store->invoke($model);
    $model->state['smartbrowser.states'] = [1];
    check($store->invoke($model) !== $firstStore);
    $resource = static fn ($id, $kind) => ['id' => $id, 'title' => $id, 'kind' => $kind, 'metadata' => []];
    $result = ['nodes' => [$resource('n1', 'node'), $resource('n2', 'node')],
        'items' => [$resource('i1', 'item')],
        'contextItems' => [array_merge($resource('c1', 'item'), ['selectable' => false]), array_merge($resource('c2', 'item'), ['selectable' => false])]];
    $seen = [];
    foreach ([0, 2, 4] as $offset) {
        $page = new ResourcePagination($offset, 2);
        $response = \SuperSoft\Component\Smartbrowser\Administrator\Support\ResourceListing::page($result, [], $page);
        check($response['pagination']['total'] === 5 && count($response['navigationNodes']) === 2);
        foreach (['nodes', 'items', 'contextItems'] as $group) foreach ($response[$group] as $row) {
            $seen[] = $row['id']; if ($group === 'contextItems') check(!$row['selectable']);
        }
    }
    check($seen === ['n1', 'n2', 'i1', 'c1', 'c2']);
    // Natural folder order is independent of dates and must survive page slicing.
    $folders = [$resource('category:30', 'node'), $resource('category:2', 'node'), $resource('category:14', 'node')];
    $folders[0]['metadata']['modified'] = '2020-01-01';
    $folders[1]['metadata']['modified'] = '2025-01-01';
    $folders[2]['metadata']['modified'] = '2023-01-01';
    $orderedIds = [];
    foreach ([0, 2] as $offset) {
        $batch = \SuperSoft\Component\Smartbrowser\Administrator\Support\ResourceListing::page(['nodes' => $folders], ['sortBy' => ''], new ResourcePagination($offset, 2));
        array_push($orderedIds, ...array_column($batch['nodes'], 'id'));
    }
    check($orderedIds === array_column($folders, 'id'));
    $flat = \SuperSoft\Component\Smartbrowser\Administrator\Support\ResourceListing::page($result, ['flatListing' => true], new ResourcePagination(0, 2));
    check($flat['navigationNodes'] === []);
    $p = new ResourcePagination(2, 2);
    $context = \SuperSoft\Component\Smartbrowser\Administrator\Support\ResourceListing::contextPage(['nodes' => $result['nodes'], 'items' => []], [], $p, static function ($page) use ($result) { $page->count(2); return array_slice($result['contextItems'], $page->itemOffset(), $page->itemLimit()); });
    check($context['pagination']['total'] === 4 && !$context['nodes'] && count($context['contextItems']) === 2);
    echo "pagination OK\n";
}
