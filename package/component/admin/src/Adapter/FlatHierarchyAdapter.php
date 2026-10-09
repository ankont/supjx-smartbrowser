<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter;

use Joomla\CMS\Language\Text;
use Joomla\CMS\Factory;

defined('_JEXEC') or die;

final class FlatHierarchyAdapter implements ResourceAdapterInterface, BrowseRootAwareInterface, StoredSelectionReadableAdapterInterface
{
    private const SOURCES = ['tags', 'articles-by-tag', 'menus', 'users', 'media'];
    private ?string $browseRoot = null;
    private ?string $scope = null;

    public function __construct(private readonly ResourceAdapterInterface $source)
    {
        if (!in_array($source->getId(), self::SOURCES, true) || !$source instanceof BrowseRootAwareInterface) {
            throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        }
    }

    public function getId(): string { return 'flat-' . $this->source->getId(); }

    private function rootId(): string { return $this->getId() . ':root'; }

    public function getFlatRootNode(): string
    {
        return $this->browseRoot ?: (string) ($this->source->getBreadcrumb((string) $this->scope)[0]['id'] ?? $this->scope);
    }

    public function configureBrowseRoot(?string $browseRoot): void
    {
        $this->browseRoot = $browseRoot;
        $this->source->configureBrowseRoot($browseRoot);
    }

    public function configureScope(?string $scope): void
    {
        $roots = $this->source->getRoots();
        $this->scope = $scope ?: ($this->browseRoot ?: ($roots[0]['id'] ?? null));
        if (!$this->scope) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        $this->source->assertBrowseScope([$this->scope]);
        $this->scopeResource();
    }

    private function scopeResource(): array
    {
        foreach ($this->source->getRoots() as $root) {
            if ($root['id'] === $this->scope) return $root;
        }
        $resource = $this->source->getResource((string) $this->scope);
        if (($resource['kind'] ?? 'node') !== 'node') {
            throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        }
        return $resource;
    }

    public function getBrowseRoot(): ?string { return $this->browseRoot; }
    public function getInitialNode(?string $candidate = null): string { return $this->rootId(); }

    public function assertBrowseScope(array $resourceIds): void
    {
        $this->source->assertBrowseScope(array_values(array_filter($resourceIds, fn ($id) => $id !== $this->rootId())));
    }

    public function getRoots(): array
    {
        $scope = $this->scopeResource();
        $title = $scope['title'];
        if (!$this->browseRoot && $this->scope === $this->getFlatRootNode()) {
            $title = match ($this->source->getId()) {
                'tags' => Text::_('COM_SMARTBROWSER_ALL_TAGS'),
                'articles-by-tag' => Text::_('COM_SMARTBROWSER_ALL_TAGGED_ARTICLES'),
                'users' => Text::_('COM_SMARTBROWSER_ALL_USERS'),
                default => $title,
            };
        }
        return [[
            'id' => $this->rootId(), 'title' => $title, 'type' => 'root',
            'kind' => 'node', 'icon' => $scope['icon'] ?? 'fas fa-folder',
            'visible' => false, 'selectable' => false, 'navigable' => true,
            'hasChildren' => false, 'capabilities' => $scope['capabilities'] ?? [], 'metadata' => [],
        ]];
    }

    public function getResources(string $nodeId, array $options = []): array
    {
        if ($nodeId !== $this->rootId()) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        $showNodes = in_array($this->source->getId(), ['tags', 'menus', 'media'], true);
        $showItems = in_array($this->source->getId(), ['articles-by-tag', 'users', 'media'], true);
        $nodes = $items = $visited = [];
        $scopeTitle = $this->scopeResource()['title'];
        $queue = [[$this->scope, $scopeTitle, 0, true, null, null]];
        $paths = [$this->scope => [$this->scope]];
        $pathTitles = [$this->scope => array_values(array_map(
            static fn (array $crumb): string => (string) $crumb['title'],
            $this->source->getBreadcrumb($this->scope)
        ))];
        $depths = [$this->scope => 0];
        $nodeOptions = [['value' => '', 'label' => $this->selectNodeLabel()]];
        $maxLevels = FlatLevels::limit($options);
        $traversalOptions = $options;
        $traversalOptions['search'] = '';
        $traversalOptions['filters']['state'] = 'all';
        if ($this->source->getId() === 'menus') {
            foreach (['menu', 'access', 'language', 'component'] as $filter) unset($traversalOptions['filters'][$filter]);
        }
        if ($this->source->getId() === 'tags') {
            foreach (['access', 'language'] as $filter) unset($traversalOptions['filters'][$filter]);
        }
        if ($this->source->getId() === 'media') $traversalOptions['filters'] = [];
        $traversalOptions['sortBy'] = 'ordering';
        $traversalOptions['sortDirection'] = 'asc';
        while ($queue) {
            [$parentId, $parentTitle, $level, $traverse, $nodeResource, $parentTitleForNode] = array_pop($queue);
            if ($nodeResource !== null) {
                $nodeOptions[] = ['value' => $parentId, 'label' => str_repeat('- ', $level - 1) . $parentTitle];
                $nodeResource['metadata']['parent'] = $parentTitleForNode;
                $nodeResource['metadata']['location'] = $parentTitleForNode;
                $nodeResource['metadata']['locationPath'] = implode(' / ', array_slice($pathTitles[$parentId], 0, -1));
                $nodeResource['navigable'] = false;
                $nodes[$parentId] = $nodeResource;
            }
            if (!$traverse) continue;
            if (isset($visited[$parentId])) continue;
            $visited[$parentId] = true;
            $page = $this->source->getResources($parentId, $traversalOptions);
            $children = $page['nodes'] ?? [];
            usort($children, static function (array $left, array $right): int {
                $a = $left['metadata']['ordering'] ?? null;
                $b = $right['metadata']['ordering'] ?? null;
                return $a !== null && $b !== null ? (int) $a <=> (int) $b : 0;
            });
            $next = [];
            foreach ($children as $node) {
                $id = (string) $node['id'];
                $depths[$id] = $level + 1;
                $paths[$id] = [...$paths[$parentId], $id];
                $pathTitles[$id] = [...$pathTitles[$parentId], (string) $node['title']];
                $next[] = [$id, $node['title'], $level + 1, !empty($node['hasChildren']) || $showItems, $node, $parentTitle];
            }
            foreach (array_reverse($next) as $entry) $queue[] = $entry;
            if ($showItems) foreach ($page['items'] ?? [] as $item) {
                $item['metadata']['parent'] = $parentTitle;
                $item['metadata']['location'] = $parentTitle;
                $item['metadata']['locationPath'] = implode(' / ', $pathTitles[$parentId]);
                $items[$item['id']] = ['resource' => $item, 'parent' => $parentId];
            }
        }
        $selectedNode = (string) ($options['filters']['node'] ?? '');
        if ($selectedNode === '' || !isset($paths[$selectedNode])) $selectedNode = $this->scope;
        $selectedDepth = $depths[$selectedNode];
        $visibleNodes = [];
        if ($showNodes) foreach ($nodes as $id => $node) {
            if (!in_array($selectedNode, $paths[$id], true)) continue;
            $level = $depths[$id] - $selectedDepth + ($selectedNode === $this->scope ? 0 : 1);
            if ($maxLevels && $level > $maxLevels) continue;
            if ($this->matches($node, $options)) $visibleNodes[] = $node;
        }
        $visibleItems = [];
        if ($showItems) foreach ($items as $entry) {
            $parentId = $entry['parent'];
            if (!in_array($selectedNode, $paths[$parentId], true)) continue;
            $level = $depths[$parentId] - $selectedDepth + 1;
            if ($maxLevels && $level > $maxLevels) continue;
            if ($this->matches($entry['resource'], $options)) $visibleItems[] = $entry['resource'];
        }
        $presentation = $this->source->getResources($this->scope, ['filters' => []])['presentation'];
        if ($this->source->getId() === 'media') {
            $resources = array_column($items, 'resource');
            foreach ($presentation['filters'] as &$filter) {
                if ($filter['id'] === 'mime') $filter['options'] = MediaAdapter::facetOptions($resources, 'mimeType', 'COM_SMARTBROWSER_SELECT_MIME_TYPE');
                if ($filter['id'] === 'extension') $filter['options'] = MediaAdapter::facetOptions($resources, 'extension', 'COM_SMARTBROWSER_SELECT_EXTENSION');
            }
            unset($filter);
        }
        $presentation['filters'][] = [
            'id' => 'node', 'label' => $this->nodeFilterLabel(), 'type' => 'select', 'default' => '', 'options' => $nodeOptions,
        ];
        $presentation['filters'][] = FlatLevels::filter();
        $presentation['columns'] = array_values(array_filter($presentation['columns'], static fn (array $column): bool => !in_array($column['id'], ['menu', 'parent'], true)));
        array_splice($presentation['columns'], 1, 0, [[
            'id' => 'location', 'label' => 'COM_SMARTBROWSER_LOCATION', 'source' => 'metadata.location', 'headerIcon' => 'fas fa-folder-open',
        ]]);
        $presentation['sortFields'][] = ['id' => 'location', 'label' => 'COM_SMARTBROWSER_LOCATION'];
        return [
            'nodeId' => $nodeId, 'nodes' => $visibleNodes, 'items' => $visibleItems,
            'breadcrumb' => $this->getBreadcrumb($nodeId), 'actions' => $this->getActions([]),
            'presentation' => $presentation, 'currentResource' => $this->getRoots()[0],
        ];
    }

    private function nodeFilterLabel(): string
    {
        return match ($this->source->getId()) {
            'tags', 'articles-by-tag' => 'JTAG',
            'users' => 'COM_SMARTBROWSER_USER_GROUP',
            'menus' => 'COM_SMARTBROWSER_MENU',
            'media' => 'COM_SMARTBROWSER_FOLDER',
        };
    }

    private function selectNodeLabel(): string
    {
        return match ($this->source->getId()) {
            'tags', 'articles-by-tag' => 'COM_SMARTBROWSER_SELECT_TAG',
            'users' => 'COM_SMARTBROWSER_SELECT_USER_GROUP',
            'menus' => 'COM_SMARTBROWSER_SELECT_MENU',
            'media' => 'COM_SMARTBROWSER_SELECT_FOLDER',
        };
    }

    private function matches(array $resource, array $options): bool
    {
        $search = mb_strtolower(trim((string) ($options['search'] ?? '')));
        $searchable = implode(' ', [
            (string) ($resource['title'] ?? ''), (string) ($resource['metadata']['alias'] ?? ''),
            (string) ($resource['metadata']['username'] ?? ''), (string) ($resource['metadata']['email'] ?? ''),
        ]);
        if ($search !== '' && !str_contains(mb_strtolower($searchable), $search)) return false;
        if ($this->source->getId() === 'menus') {
            $filters = $options['filters'] ?? [];
            foreach (['menu' => 'menutype', 'access' => 'accessId', 'language' => 'language', 'component' => 'componentId'] as $filter => $field) {
                if (($filters[$filter] ?? '') !== '' && (string) ($resource['metadata'][$field] ?? '') !== (string) $filters[$filter]) return false;
            }
        }
        if ($this->source->getId() === 'tags') {
            $filters = $options['filters'] ?? [];
            foreach (['access', 'language'] as $filter) {
                if (($filters[$filter] ?? '') !== '' && (string) ($resource['metadata'][$filter] ?? '') !== (string) $filters[$filter]) return false;
            }
        }
        if ($this->source->getId() === 'media'
            && !MediaAdapter::matchesFilters($resource, $options['filters'] ?? [], (string) Factory::getApplication()->get('offset', 'UTC'))) return false;
        $state = (string) ($options['filters']['state'] ?? 'active');
        $value = $resource['status'] ?? null;
        return $value === null || match ($state) {
            'published' => (int) $value === 1,
            'unpublished' => (int) $value === 0,
            'enabled' => (int) $value === 1,
            'blocked' => (int) $value === 0,
            'trashed' => (int) $value === -2,
            'archived' => (int) $value === 2,
            'all' => true,
            default => in_array((int) $value, [0, 1], true),
        };
    }

    public function getResource(string $resourceId, array $options = []): array
    {
        if ($resourceId === $this->rootId()) return $this->getRoots()[0];
        return $this->source->getResource($resourceId, $options);
    }

    public function getReadableResource(string $resourceId): array
    {
        if (!$this->source instanceof ReadableResourceAdapterInterface) throw new \RuntimeException('No safe read policy', 403);
        return $this->source->getReadableResource($resourceId);
    }

    public function getStoredReadableResource(string $resourceId, \SuperSoft\Component\Smartbrowser\Administrator\Support\StoredSelectionReadContext $context): array
    {
        // Scoped user references cannot be retyped to bypass their stored adapter identity.
        if ($this->source instanceof StoredSelectionReadableAdapterInterface) throw new \RuntimeException('No stored wrapper policy', 403);
        return $this->getReadableResource($resourceId);
    }

    public function getBreadcrumb(string $nodeId): array
    {
        return [['id' => $this->rootId(), 'title' => $this->getRoots()[0]['title'],
            'kind' => 'node', 'type' => 'root', 'icon' => $this->getRoots()[0]['icon'], 'visible' => true]];
    }

    public function getActions(array $selection = []): array { return $this->source->getActions($selection); }

    public function getCollectionPresentation(array $resources = []): array { return $this->source->getCollectionPresentation($resources); }

    public function executeAction(string $action, array $selection, array $payload = []): mixed
    {
        if (($payload['nodeId'] ?? '') === $this->rootId()) $payload['nodeId'] = $this->scope;
        return $this->source->executeAction($action, $selection, $payload);
    }
}
