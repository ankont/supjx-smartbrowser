<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter;

use Joomla\CMS\Application\CMSApplicationInterface;
use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Uri\Uri;
use Joomla\Component\Menus\Administrator\Helper\MenusHelper;
use Joomla\Database\DatabaseInterface;
use SuperSoft\Component\Smartbrowser\Administrator\Menu\Resolver\MenuItemResolverRegistry;
use SuperSoft\Component\Smartbrowser\Administrator\Support\EditorRoute;
use SuperSoft\Component\Smartbrowser\Administrator\Support\BatchRunner;
use SuperSoft\Component\Smartbrowser\Administrator\Support\OrderingService;

defined('_JEXEC') or die;

final class MenuAdapter implements ResourceAdapterInterface, BrowseRootAwareInterface, ContextResourceProviderInterface, ReadableResourceAdapterInterface
{
    private ?string $browseRoot = null;
    private ?array $menus = null;
    private ?array $items = null;
    private ?MenuItemResolverRegistry $resolvers = null;
    private ?array $menuTypeLabels = null;
    private ?array $accessLevels = null;
    private ?array $languages = null;
    private ?array $components = null;

    public function __construct(private readonly CMSApplicationInterface $app)
    {
        $app->getLanguage()->load('com_smartbrowser', JPATH_ADMINISTRATOR, null, true);
        $app->getLanguage()->load('com_menus', JPATH_ADMINISTRATOR, null, true);
    }

    public function getId(): string { return 'menus'; }

    public function getRoots(): array
    {
        if ($this->browseRoot) {
            if (str_starts_with($this->browseRoot, 'menu:')) {
                return [$this->normalizeMenu($this->menu(substr($this->browseRoot, 5)))];
            }
            return [[...$this->normalizeItem($this->item($this->itemId($this->browseRoot))), 'type' => 'root', 'parentId' => null, 'visible' => true]];
        }

        return array_values(array_map(fn (object $menu): array => $this->normalizeMenu($menu), $this->menus()));
    }

    public function getResources(string $nodeId, array $options = []): array
    {
        $this->assertBrowseScope([$nodeId]);
        $parentId = str_starts_with($nodeId, 'menu-item:') ? $this->itemId($nodeId) : 1;
        $menuType = str_starts_with($nodeId, 'menu:') ? substr($nodeId, 5) : $this->item($parentId)->menutype;
        $filters = $options['filters'] ?? [];
        $stateFilter = (string) ($options['filters']['state'] ?? 'active');
        $search = mb_strtolower(trim((string) ($options['search'] ?? '')));
        $children = [];

        foreach ($this->items() as $item) {
            if ((string) $item->menutype !== $menuType || (int) $item->parent_id !== $parentId || !$this->canView($item)) continue;
            if (($filters['menu'] ?? '') !== '' && (string) $item->menutype !== (string) $filters['menu']) continue;
            if (($filters['access'] ?? '') !== '' && (int) $item->access !== (int) $filters['access']) continue;
            if (($filters['language'] ?? '') !== '' && (string) $item->language !== (string) $filters['language']) continue;
            if (($filters['component'] ?? '') !== '' && (int) $item->component_id !== (int) $filters['component']) continue;
            if (!$this->matchesState((int) $item->published, $stateFilter)) continue;
            if ($search !== '' && !str_contains(mb_strtolower((string) $item->title), $search)
                && !str_contains(mb_strtolower((string) $item->alias), $search)) continue;
            $children[] = $this->normalizeItem($item);
        }

        $children = $this->sortResources($children, (string) ($options['sortBy'] ?? ''), (string) ($options['sortDirection'] ?? 'asc'));
        return [
            'nodeId' => $nodeId,
            'nodes' => $children,
            'items' => [],
            'breadcrumb' => $this->getBreadcrumb($nodeId),
            'actions' => $this->getActions([]),
            'presentation' => $this->presentation(),
            'currentResource' => str_starts_with($nodeId, 'menu-item:')
                ? $this->normalizeItem($this->item($parentId))
                : $this->normalizeMenu($this->menu($menuType)),
        ];
    }

    public function getContextResources(string $nodeId, array $options = []): array
    {
        if (empty($options['showContextResources']) || !str_starts_with($nodeId, 'menu-item:')) return [];
        $result = $this->resolverRegistry()->resolve($this->item($this->itemId($nodeId)));
        return array_values($result['resources'] ?? []);
    }

    public function getResource(string $resourceId, array $options = []): array
    {
        if (str_starts_with($resourceId, 'menu-item:')) {
            $this->assertBrowseScope([$resourceId]);
            return $this->normalizeItem($this->item($this->itemId($resourceId)));
        }
        if (str_starts_with($resourceId, 'menu:')) {
            $this->assertBrowseScope([$resourceId]);
            return $this->normalizeMenu($this->menu(substr($resourceId, 5)));
        }
        if (str_starts_with($resourceId, 'article:')) return $this->content()->getResource($resourceId, $options);
        foreach ($this->items() as $item) {
            if (!in_array($resourceId, ['menu-link:' . $item->id, 'menu-target:' . $item->id], true)) continue;
            foreach (($this->resolverRegistry()->resolve($item)['resources'] ?? []) as $resource) {
                if (($resource['id'] ?? '') === $resourceId) return $resource;
            }
        }
        throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
    }

    public function getReadableResource(string $resourceId): array
    {
        if (!preg_match('/^menu-item:([1-9][0-9]*)$/D', $resourceId, $matches)) throw new \RuntimeException('Not readable', 403);
        $menu = $this->app->getMenu('site');
        $item = $this->readableSiteItem($menu, (int) $matches[1]);
        $url = $this->readableSiteUrl($menu, $item, []);
        return ['id' => $resourceId, 'title' => (string) $item->title, 'subtitle' => null, 'parentId' => null,
            'kind' => 'node', 'type' => 'menu-item', 'icon' => 'fas fa-diagram-predecessor', 'image' => null,
            'status' => 1, 'capabilities' => [], 'overlays' => [],
            'metadata' => ['id' => (int) $item->id, 'url' => $url, 'alias' => $item->alias ?? '', 'language' => $item->language ?? '*',
                'accessId' => (int) $item->access, 'state' => 1, 'menuItemKind' => (string) $item->type,
                'parent' => (int) $item->parent_id > 1 ? (string) $this->readableSiteItem($menu, (int) $item->parent_id)->title : '']];
    }

    private function readableSiteItem(object $menu, int $id): object
    {
        // SiteMenu loads only enabled frontend items within their publication window.
        $item = $menu->getItems('id', $id, true);
        if (!$item) throw new \RuntimeException('Unavailable', 404);
        $cursor = $item; $seen = [];
        while ($cursor && (int) $cursor->id > 1) {
            if (isset($seen[$cursor->id]) || !in_array((int) $cursor->access, $this->app->getIdentity()->getAuthorisedViewLevels(), true)) throw new \RuntimeException('Not readable', 403);
            $seen[$cursor->id] = true;
            if ((int) $cursor->parent_id <= 1) break;
            $cursor = $menu->getItems('id', (int) $cursor->parent_id, true);
            if (!$cursor) throw new \RuntimeException('Parent unavailable', 403);
        }
        return $item;
    }

    private function readableSiteUrl(object $menu, object $item, array $seen): ?string
    {
        if (isset($seen[$item->id])) throw new \RuntimeException('Invalid alias chain', 403);
        $seen[$item->id] = true;
        if ($item->type === 'alias') {
            $target = $this->readableSiteItem($menu, (int) $item->getParams()->get('aliasoptions', 0));
            return $this->readableSiteUrl($menu, $target, $seen);
        }
        if (in_array($item->type, ['heading', 'separator'], true)) return null;
        if ($item->type === 'url') {
            $parts = parse_url((string) $item->link);
            return is_array($parts) && in_array(strtolower($parts['scheme'] ?? ''), ['http', 'https'], true)
                && !isset($parts['user']) && !isset($parts['pass']) && !preg_match('/[\x00-\x20<>"\x27]/', (string) $item->link) ? (string) $item->link : null;
        }
        parse_str((string) parse_url((string) $item->link, PHP_URL_QUERY), $query);
        $reference = match ($query['option'] ?? '') {
            'com_content' => match ($query['view'] ?? '') {
                'article' => ['articles', 'article:' . (int) ($query['id'] ?? 0)],
                'category' => ['categories', 'category:' . (int) ($query['id'] ?? 0)],
                default => null,
            },
            'com_tags' => ($query['view'] ?? '') === 'tag' && is_scalar($query['id'] ?? null) ? ['tags', 'tag:' . (int) $query['id']] : null,
            default => null,
        };
        if (!$reference) return null; // No verified destination policy for arbitrary components.
        (new AdapterRegistry($this->app))->getReadable($reference[0])->getReadableResource($reference[1]);
        return \Joomla\CMS\Router\Route::link('site', 'index.php?Itemid=' . (int) $item->id, false);
    }

    public function getBreadcrumb(string $nodeId): array
    {
        $this->assertBrowseScope([$nodeId]);
        if (str_starts_with($nodeId, 'menu:')) {
            $menu = $this->menu(substr($nodeId, 5));
            return [['id' => 'menu:' . $menu->menutype, 'title' => (string) $menu->title, 'kind' => 'node', 'type' => 'menu', 'icon' => 'fas fa-diagram-predecessor', 'visible' => true]];
        }

        $chain = [];
        $item = $this->item($this->itemId($nodeId));
        while ((int) $item->id > 1) {
            array_unshift($chain, [...$this->normalizeItem($item), 'visible' => true]);
            if ($this->browseRoot === 'menu-item:' . $item->id) break;
            if ((int) $item->parent_id <= 1) {
                array_unshift($chain, ['id' => 'menu:' . $item->menutype, 'title' => (string) $this->menu((string) $item->menutype)->title, 'kind' => 'node', 'type' => 'menu', 'icon' => 'fas fa-diagram-predecessor', 'visible' => true]);
                break;
            }
            $item = $this->item((int) $item->parent_id);
        }
        return $chain;
    }

    public function getActions(array $selection = []): array
    {
        return [
            [...$this->action('createChild', 'COM_SMARTBROWSER_CREATE_CHILD_MENU_ITEM', 'fas fa-plus', 'node', true, false, false, false, true), 'creationRole' => 'item'],
            $this->action('edit', 'JACTION_EDIT', 'fas fa-edit', 'resource', false, true, true),
            $this->action('openLink', 'COM_SMARTBROWSER_OPEN_LINK', 'fas fa-external-link-alt', 'resource', false, true, true),
            $this->action('copyLink', 'COM_SMARTBROWSER_COPY_LINK', 'fas fa-copy', 'resource', false, true, true),
            $this->action('publish', 'JTOOLBAR_PUBLISH', 'fas fa-check', 'node', false, true, false, false, false, 'publication'),
            $this->action('unpublish', 'COM_SMARTBROWSER_ACTION_UNPUBLISH', 'fas fa-times', 'node', false, true, false, false, false, 'publication'),
            $this->action('trash', 'COM_SMARTBROWSER_ACTION_TRASH', 'fas fa-trash', 'node', false, true),
        ];
    }

    public function executeAction(string $action, array $selection, array $payload = []): mixed
    {
        if ($action === 'reorder') return (new OrderingService($this->app))->move($this, $selection, (string) ($payload['direction'] ?? ''), ['menu-item']);
        if ($action === 'batch') return (new BatchRunner($this->app))->run($this, 'menus', $selection, $payload);
        if ($action === 'createChild') {
            $nodeId = (string) ($payload['nodeId'] ?? '');
            $parentId = str_starts_with($nodeId, 'menu-item:') ? $this->itemId($nodeId) : 1;
            $menuType = str_starts_with($nodeId, 'menu:') ? substr($nodeId, 5) : (string) $this->item($parentId)->menutype;
            if (!$this->canCreate($menuType)) throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
            return $this->editorResponse('index.php?option=com_menus&task=item.add&menutype=' . rawurlencode($menuType) . '&parent_id=' . $parentId);
        }

        if (in_array($action, ['publish', 'unpublish', 'trash'], true)) {
            if ($selection === []) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
            $ids = [];
            foreach ($selection as $selectedId) {
                if (!str_starts_with((string) $selectedId, 'menu-item:')) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
                $resource = $this->getResource((string) $selectedId);
                if (empty($resource['capabilities'][$action])) throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
                $id = $this->itemId((string) $selectedId);
                $item = $this->item($id);
                if ($action !== 'publish' && !empty($item->home) && (string) $item->language === '*') {
                    throw new \RuntimeException(Text::_('COM_SMARTBROWSER_ERROR_MENU_DEFAULT_HOME'), 400);
                }
                $ids[] = $id;
            }
            $model = $this->menuModel('Item');
            if (!$model->publish($ids, match ($action) { 'publish' => 1, 'unpublish' => 0, 'trash' => -2 })) {
                throw new \RuntimeException($model->getError() ?: Text::_('JERROR_AN_ERROR_HAS_OCCURRED'), 500);
            }
            return ['updated' => array_values($selection)];
        }

        $resourceId = $this->requireOne($selection);
        if ($action === 'edit' && str_starts_with($resourceId, 'article:')) {
            return $this->content()->executeAction('edit', [$resourceId]);
        }
        if (in_array($action, ['openLink', 'copyLink'], true)) {
            $resource = $this->getResource($resourceId);
            if (empty($resource['capabilities'][$action]) || empty($resource['metadata']['url'])) throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
            return ['command' => $action === 'openLink' ? 'openUrl' : 'copyText', 'url' => $resource['metadata']['url'], 'text' => $resource['metadata']['url']];
        }
        if (!str_starts_with($resourceId, 'menu-item:')) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        $resource = $this->getResource($resourceId);
        if (empty($resource['capabilities'][$action])) throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
        $id = $this->itemId($resourceId);
        if ($action === 'edit') return $this->editorResponse('index.php?option=com_menus&task=item.edit&id=' . $id);
        throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_UNKNOWN_ACTION'), 400);
    }

    public function configureBrowseRoot(?string $browseRoot): void
    {
        $this->browseRoot = $browseRoot !== null && $browseRoot !== '' ? $browseRoot : null;
        if (!$this->browseRoot) return;
        if (str_starts_with($this->browseRoot, 'menu:') && substr($this->browseRoot, 5) !== '') {
            $this->menu(substr($this->browseRoot, 5));
            return;
        }
        if (!str_starts_with($this->browseRoot, 'menu-item:') || $this->itemId($this->browseRoot) < 1) {
            throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        }
        $this->item($this->itemId($this->browseRoot));
    }

    public function getBrowseRoot(): ?string { return $this->browseRoot; }

    public function getInitialNode(?string $candidate = null): string
    {
        $fallback = $this->browseRoot ?: ($this->getRoots()[0]['id'] ?? '');
        if (!$candidate) return $fallback;
        try { $this->assertBrowseScope([$candidate]); return $candidate; } catch (\Throwable) { return $fallback; }
    }

    public function assertBrowseScope(array $resourceIds): void
    {
        if (!$this->browseRoot) return;
        if (str_starts_with($this->browseRoot, 'menu:')) {
            $menuType = substr($this->browseRoot, 5);
            foreach ($resourceIds as $resourceId) {
                $resourceId = (string) $resourceId;
                if ($resourceId === '' || str_starts_with($resourceId, 'article:') || str_starts_with($resourceId, 'menu-link:') || str_starts_with($resourceId, 'menu-target:')) continue;
                if ($resourceId === $this->browseRoot) continue;
                if (!str_starts_with($resourceId, 'menu-item:') || (string) $this->item($this->itemId($resourceId))->menutype !== $menuType) {
                    throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
                }
            }
            return;
        }
        $root = $this->item($this->itemId($this->browseRoot));
        foreach ($resourceIds as $resourceId) {
            $resourceId = (string) $resourceId;
            if ($resourceId === '' || str_starts_with($resourceId, 'article:') || str_starts_with($resourceId, 'menu-link:') || str_starts_with($resourceId, 'menu-target:')) continue;
            if (!str_starts_with($resourceId, 'menu-item:')) throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
            $item = $this->item($this->itemId($resourceId));
            if ((string) $item->menutype !== (string) $root->menutype || (int) $item->lft < (int) $root->lft || (int) $item->rgt > (int) $root->rgt) {
                throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
            }
        }
    }

    private function normalizeMenu(object $menu): array
    {
        $id = 'menu:' . $menu->menutype;
        return [
            'id' => $id, 'title' => (string) $menu->title, 'subtitle' => (string) $menu->menutype,
            'parentId' => null, 'kind' => 'node', 'type' => 'menu', 'icon' => 'fas fa-diagram-predecessor', 'image' => null,
            'visible' => true, 'selectable' => false, 'navigable' => true, 'hasChildren' => $this->hasChildren(1, (string) $menu->menutype),
            'capabilities' => ['open' => true, 'createChild' => $this->canCreate((string) $menu->menutype)],
            'metadata' => ['menu' => (string) $menu->title, 'menutype' => (string) $menu->menutype, 'description' => (string) ($menu->description ?? '')],
        ];
    }

    private function normalizeItem(object $item): array
    {
        $state = (int) $item->published;
        $params = json_decode((string) $item->params, true) ?: [];
        $aliasTarget = (string) $item->type === 'alias' ? (int) ($params['aliasoptions'] ?? 0) : 0;
        $menuImage = (string) ($params['menu_image'] ?? '');
        if ($menuImage !== '') {
            $menuImage = (string) (HTMLHelper::_('cleanImageURL', $menuImage)->url ?? '');
            if ($menuImage !== '' && !preg_match('#^(?:[a-z][a-z0-9+.-]*:)?//#i', $menuImage) && !str_starts_with($menuImage, 'data:')) {
                $menuImage = Uri::root() . ltrim($menuImage, '/');
            }
        }
        $overlays = [$this->statusOverlay($state)];
        $homeLabel = !empty($item->home) ? Text::_((string) $item->language === '*' ? 'COM_SMARTBROWSER_HOME_ALL_LANGUAGES' : 'COM_SMARTBROWSER_HOME_LANGUAGE') : '';
        if ($homeLabel !== '') $overlays[] = [
            'id' => 'home', 'icon' => 'fas fa-home',
            'image' => $this->languageImage((string) $item->language),
            'label' => $homeLabel, 'tone' => 'info',
        ];
        if ($aliasTarget) $overlays[] = ['id' => 'shortcut', 'icon' => 'fas fa-external-link-alt', 'label' => Text::_('COM_SMARTBROWSER_MENU_ITEM_ALIAS'), 'tone' => 'info'];
        if ((int) ($item->checked_out ?? 0) > 0) $overlays[] = ['id' => 'checkedOut', 'icon' => 'fas fa-lock', 'label' => Text::_('COM_SMARTBROWSER_CHECKED_OUT'), 'tone' => 'warning'];
        $typeLabel = $this->typeLabel($item);
        $isStatic = in_array((string) $item->type, ['separator', 'heading'], true);
        $hasChildren = $this->hasChildren((int) $item->id, (string) $item->menutype);
        $navigable = !$isStatic || ((string) $item->type === 'heading' && $hasChildren);
        $icon = match ((string) $item->type) {
            'separator' => 'fas fa-minus',
            'heading' => $navigable ? 'fas fa-diagram-predecessor' : 'fas fa-list',
            default => 'fas fa-diagram-predecessor',
        };
        $capabilities = $this->itemCapabilities($item);
        if ($isStatic) {
            $capabilities['open'] = false;
            $capabilities['createChild'] = false;
        }
        return [
            'id' => 'menu-item:' . $item->id, 'title' => (string) $item->title, 'subtitle' => $typeLabel,
            'parentId' => $this->browseRoot === 'menu-item:' . $item->id ? null : ((int) $item->parent_id > 1 ? 'menu-item:' . $item->parent_id : 'menu:' . $item->menutype),
            'kind' => 'node', 'type' => 'menu-item', 'icon' => $icon, 'image' => $menuImage ?: null,
              'badgeIcon' => trim((string) ($params['menu_icon_css'] ?? '')),
            'status' => $state, 'statusPresentation' => $this->statusPresentation($state), 'overlays' => $overlays,
            'selectable' => true, 'bulkSelectable' => true, 'focusable' => true, 'actionable' => true,
            'navigable' => $navigable, 'hasChildren' => $navigable && $hasChildren,
            'capabilities' => $capabilities,
            'metadata' => [
                'id' => (int) $item->id, 'alias' => (string) $item->alias, 'menu' => (string) $this->menu((string) $item->menutype)->title,
                'homeLabel' => $homeLabel,
                'menutype' => (string) $item->menutype, 'parent' => (int) $item->parent_id > 1 ? (string) $this->item((int) $item->parent_id)->title : '',
                'menuItemType' => $typeLabel, 'menuItemKind' => (string) $item->type, 'state' => $state, 'stateLabel' => $this->stateLabel($state),
                'menuIcon' => trim((string) ($params['menu_icon_css'] ?? '')),
                'menuItemSummary' => $typeLabel,
                'access' => $this->accessLevels()[(int) $item->access] ?? (string) $item->access,
                'accessId' => (int) $item->access, 'language' => (string) $item->language,
                'languageImage' => $this->languageImage((string) $item->language),
                'componentId' => (int) $item->component_id, 'ordering' => (int) $item->ordering,
                'link' => (string) $item->link, 'aliasOf' => $aliasTarget ?: null,
            ],
        ];
    }

    private function itemCapabilities(object $item): array
    {
        $asset = 'com_menus.menu.' . (int) $this->menu((string) $item->menutype)->id;
        $identity = $this->app->getIdentity();
        $state = (int) $item->published;
        return [
            'open' => true, 'edit' => $identity->authorise('core.edit', $asset), 'reorder' => $identity->authorise('core.edit.state', $asset),
            'publish' => $state !== 1 && $identity->authorise('core.edit.state', $asset),
            'unpublish' => $state === 1 && $identity->authorise('core.edit.state', $asset),
            'createChild' => $identity->authorise('core.create', $asset),
            'trash' => $state !== -2 && $identity->authorise('core.edit.state', $asset),
        ];
    }

    private function presentation(): array
    {
        return [
            'orderingField' => 'ordering',
            'sortFields' => [
                ['id' => 'title', 'label' => 'COM_SMARTBROWSER_NAME'], ['id' => 'alias', 'label' => 'COM_SMARTBROWSER_ALIAS_LABEL'],
                ['id' => 'state', 'label' => 'JSTATUS'], ['id' => 'ordering', 'label' => 'JGRID_HEADING_ORDERING'],
                ['id' => 'language', 'label' => 'JFIELD_LANGUAGE_LABEL'], ['id' => 'id', 'label' => 'JGLOBAL_FIELD_ID_LABEL'],
            ],
            'columns' => [
                ['id' => 'title', 'label' => 'COM_SMARTBROWSER_NAME', 'source' => 'title'],
                ['id' => 'alias', 'label' => 'COM_SMARTBROWSER_ALIAS_LABEL', 'source' => 'metadata.alias'],
                ['id' => 'menuItemType', 'label' => 'COM_SMARTBROWSER_MENU_ITEM_TYPE', 'source' => 'metadata.menuItemType'],
                ['id' => 'status', 'label' => 'JSTATUS', 'source' => 'metadata.stateLabel', 'format' => 'status', 'overlays' => true, 'sortField' => 'state'],
                ['id' => 'access', 'label' => 'JFIELD_ACCESS_LABEL', 'source' => 'metadata.access'],
                ['id' => 'language', 'label' => 'JFIELD_LANGUAGE_LABEL', 'source' => 'metadata.language', 'format' => 'language', 'headerIcon' => 'fas fa-globe'],
                ['id' => 'id', 'label' => 'JGLOBAL_FIELD_ID_LABEL', 'source' => 'metadata.id'],
            ],
            'gridFields' => [['source' => 'metadata.menuItemSummary']],
            'batchOptions' => [
                'menu' => array_map(static fn (object $menu): array => [
                    'value' => (string) $menu->menutype,
                    'label' => (string) $menu->title,
                ], $this->menus()),
                'menuParent' => array_values(array_map(static fn (object $item): array => [
                    'value' => (string) $item->id,
                    'menu' => (string) $item->menutype,
                    'label' => str_repeat('- ', max(0, (int) $item->level - 1)) . (string) $item->title,
                ], array_filter($this->items(), fn (object $item): bool => in_array((int) $item->published, [0, 1], true) && $this->canView($item)))),
            ],
            'infoFields' => [
                ['label' => 'COM_SMARTBROWSER_ALIAS_LABEL', 'source' => 'metadata.alias'], ['label' => 'COM_SMARTBROWSER_MENU', 'source' => 'metadata.menu'],
                ['label' => 'COM_SMARTBROWSER_PARENT', 'source' => 'metadata.parent'], ['label' => 'COM_SMARTBROWSER_MENU_ITEM_TYPE', 'source' => 'metadata.menuItemType'],
                ['label' => 'COM_SMARTBROWSER_HOME_PAGE', 'source' => 'metadata.homeLabel', 'icon' => 'fas fa-home'],
                ['label' => 'JSTATUS', 'source' => 'metadata.stateLabel'], ['label' => 'JFIELD_ACCESS_LABEL', 'source' => 'metadata.access'],
                ['label' => 'JFIELD_LANGUAGE_LABEL', 'source' => 'metadata.language'], ['label' => 'COM_SMARTBROWSER_URL', 'source' => 'metadata.url'],
                ['label' => 'JGLOBAL_FIELD_ID_LABEL', 'source' => 'metadata.id'],
            ],
            'filters' => [[
                'id' => 'state', 'label' => 'COM_SMARTBROWSER_FILTER_STATE', 'type' => 'select', 'default' => 'active',
                'options' => [
                    ['value' => 'active', 'label' => 'COM_SMARTBROWSER_SELECT_STATUS'], ['value' => 'published', 'label' => 'COM_SMARTBROWSER_FILTER_PUBLISHED'],
                    ['value' => 'unpublished', 'label' => 'COM_SMARTBROWSER_FILTER_UNPUBLISHED'], ['value' => 'trashed', 'label' => 'COM_SMARTBROWSER_FILTER_TRASHED'], ['value' => 'all', 'label' => 'COM_SMARTBROWSER_FILTER_ALL'],
                ],
            ], [
                'id' => 'menu', 'label' => 'COM_SMARTBROWSER_MENU', 'type' => 'select', 'default' => '',
                'options' => array_merge([['value' => '', 'label' => 'COM_SMARTBROWSER_SELECT_MENU']], array_map(
                    static fn (object $menu): array => ['value' => (string) $menu->menutype, 'label' => (string) $menu->title],
                    $this->scopedMenus()
                )),
            ], [
                'id' => 'access', 'label' => 'JFIELD_ACCESS_LABEL', 'type' => 'select', 'default' => '',
                'options' => $this->selectOptions($this->accessLevels(), 'COM_SMARTBROWSER_SELECT_ACCESS'),
            ], [
                'id' => 'language', 'label' => 'JFIELD_LANGUAGE_LABEL', 'type' => 'select', 'default' => '',
                'options' => $this->languageOptions(),
            ], [
                'id' => 'component', 'label' => 'COM_SMARTBROWSER_COMPONENT', 'type' => 'select', 'default' => '',
                'options' => $this->selectOptions($this->components(), 'COM_SMARTBROWSER_SELECT_COMPONENT'),
            ]],
        ];
    }

    public function getCollectionPresentation(array $resources = []): array { return $this->presentation(); }

    private function selectOptions(array $values, string $placeholder): array
    {
        $options = [['value' => '', 'label' => $placeholder]];
        foreach ($values as $value => $label) $options[] = ['value' => (string) $value, 'label' => $label];
        return $options;
    }

    private function accessLevels(): array
    {
        if ($this->accessLevels !== null) return $this->accessLevels;
        $db = $this->db();
        $query = $db->getQuery(true)->select($db->quoteName(['id', 'title']))
            ->from($db->quoteName('#__viewlevels'))->order($db->quoteName('title'));
        $levels = [];
        foreach ($db->setQuery($query)->loadObjectList() as $level) $levels[(int) $level->id] = Text::_((string) $level->title);
        return $this->accessLevels = $levels;
    }

    private function languages(): array
    {
        if ($this->languages !== null) return $this->languages;
        $db = $this->db();
        $query = $db->getQuery(true)->select($db->quoteName(['lang_code', 'title', 'image']))
            ->from($db->quoteName('#__languages'))->order($db->quoteName('title'));
        $languages = [];
        foreach ($db->setQuery($query)->loadObjectList() as $language) $languages[(string) $language->lang_code] = $language;
        return $this->languages = $languages;
    }

    private function languageOptions(): array
    {
        $options = [['value' => '', 'label' => 'COM_SMARTBROWSER_SELECT_LANGUAGE'], ['value' => '*', 'label' => 'JALL']];
        foreach ($this->languages() as $code => $language) $options[] = ['value' => $code, 'label' => (string) $language->title];
        return $options;
    }

    private function languageImage(string $code): ?string
    {
        $image = (string) ($this->languages()[$code]->image ?? '');
        return $image === '' ? null : Uri::root() . 'media/mod_languages/images/' . rawurlencode($image) . '.gif';
    }

    private function components(): array
    {
        if ($this->components !== null) return $this->components;
        $db = $this->db();
        $query = $db->getQuery(true)->select($db->quoteName(['extension_id', 'name']))
            ->from($db->quoteName('#__extensions'))->where($db->quoteName('type') . ' = ' . $db->quote('component'))
            ->order($db->quoteName('name'));
        $components = [];
        foreach ($db->setQuery($query)->loadObjectList() as $component) {
            $components[(int) $component->extension_id] = Text::_((string) $component->name);
        }
        return $this->components = $components;
    }

    private function menus(): array
    {
        if ($this->menus !== null) return $this->menus;
        $db = $this->db();
        $query = $db->getQuery(true)->select(['id', 'menutype', 'title', 'description'])->from($db->quoteName('#__menu_types'))->where($db->quoteName('client_id') . ' = 0')->order([$db->quoteName('ordering') . ' ASC', $db->quoteName('id') . ' ASC']);
        return $this->menus = array_values($db->setQuery($query)->loadObjectList() ?: []);
    }

    private function scopedMenus(): array
    {
        if (!$this->browseRoot) return $this->menus();
        if (str_starts_with($this->browseRoot, 'menu:')) return [$this->menu(substr($this->browseRoot, 5))];
        return [$this->menu((string) $this->item($this->itemId($this->browseRoot))->menutype)];
    }

    private function items(): array
    {
        if ($this->items !== null) return $this->items;
        $db = $this->db();
        $query = $db->getQuery(true)->select('*')->from($db->quoteName('#__menu'))->where($db->quoteName('client_id') . ' = 0')->where($db->quoteName('id') . ' > 1')->order([$db->quoteName('menutype') . ' ASC', $db->quoteName('lft') . ' ASC']);
        return $this->items = array_values($db->setQuery($query)->loadObjectList() ?: []);
    }

    private function menu(string $menuType): object
    {
        foreach ($this->menus() as $menu) if ((string) $menu->menutype === $menuType) return $menu;
        throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 404);
    }

    private function item(int $id): object
    {
        foreach ($this->items() as $item) if ((int) $item->id === $id && $this->canView($item)) return $item;
        throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 404);
    }

    private function hasChildren(int $parentId, string $menuType): bool
    {
        foreach ($this->items() as $item) if ((int) $item->parent_id === $parentId && (string) $item->menutype === $menuType && $this->canView($item)) return true;
        return false;
    }

    private function typeLabel(object $item): string
    {
        if ((string) $item->type !== 'component') {
            $key = match ((string) $item->type) {
                'alias' => 'COM_MENUS_TYPE_ALIAS',
                'url' => 'COM_MENUS_TYPE_EXTERNAL_URL',
                'separator' => 'COM_MENUS_TYPE_SEPARATOR',
                'heading' => 'COM_MENUS_TYPE_HEADING',
                'container' => 'COM_MENUS_TYPE_CONTAINER',
                default => null,
            };
            return $key ? Text::_($key) : (string) $item->type;
        }

        $key = MenusHelper::getLinkKey((string) $item->link);
        if ($this->menuTypeLabels === null) {
            $model = $this->menuModel('Menutypes');
            $model->setState('client_id', 0);
            $this->menuTypeLabels = [];
            foreach ($model->getTypeOptions() ?: [] as $group => $options) {
                foreach ($options as $option) {
                    if (!isset($option->request)) continue;
                    $this->menuTypeLabels[MenusHelper::getLinkKey($option->request)] = Text::_($group) . ' » ' . Text::_($option->title);
                }
            }
        }
        if (isset($this->menuTypeLabels[$key])) return $this->menuTypeLabels[$key];

        parse_str((string) parse_url((string) $item->link, PHP_URL_QUERY), $query);
        return implode(' / ', array_values(array_filter([$query['option'] ?? '', $query['view'] ?? '', $query['layout'] ?? ''])));
    }

    private function canView(object $item): bool { return in_array((int) $item->access, $this->app->getIdentity()->getAuthorisedViewLevels(), true); }
    private function canCreate(string $menuType): bool { return $this->app->getIdentity()->authorise('core.create', 'com_menus.menu.' . (int) $this->menu($menuType)->id); }
    private function matchesState(int $state, string $filter): bool { return match ($filter) { 'published' => $state === 1, 'unpublished' => $state === 0, 'trashed' => $state === -2, 'all' => true, default => in_array($state, [0, 1], true) }; }
    private function itemId(string $id): int { return str_starts_with($id, 'menu-item:') ? (int) substr($id, 10) : 0; }
    private function content(): FlatArticleAdapter { return new FlatArticleAdapter($this->app); }
    private function resolverRegistry(): MenuItemResolverRegistry { return $this->resolvers ??= new MenuItemResolverRegistry($this->app, fn (int $id): object => $this->item($id)); }
    private function menuModel(string $name): object { return $this->app->bootComponent('com_menus')->getMVCFactory()->createModel($name, 'Administrator', ['ignore_request' => true]); }
    private function db(): DatabaseInterface { return Factory::getContainer()->get(DatabaseInterface::class); }
    private function requireOne(array $selection): string { if (count($selection) !== 1) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_SINGLE_SELECTION_REQUIRED'), 400); return (string) reset($selection); }
    private function editorResponse(string $url): array { return ['command' => 'openEditor', 'url' => EditorRoute::link($this->app, $url)]; }
    private function action(string $id, string $label, string $icon, string $scope, bool $primary = false, bool $requiresSelection = false, bool $single = false, bool $itemsOnly = false, bool $currentNode = false, ?string $exclusiveGroup = null): array { return compact('id', 'label', 'icon', 'scope', 'primary', 'requiresSelection', 'single', 'itemsOnly', 'currentNode', 'exclusiveGroup'); }
    private function stateLabel(int $state): string { return match ($state) { 1 => Text::_('JPUBLISHED'), 0 => Text::_('JUNPUBLISHED'), -2 => Text::_('COM_SMARTBROWSER_STATE_TRASHED'), default => (string) $state }; }
    private function statusPresentation(int $state): array { return match ($state) { 1 => ['icon' => 'fas fa-check', 'label' => Text::_('JPUBLISHED'), 'tone' => 'success'], 0 => ['icon' => 'fas fa-times', 'label' => Text::_('JUNPUBLISHED'), 'tone' => 'muted'], -2 => ['icon' => 'fas fa-trash', 'label' => Text::_('COM_SMARTBROWSER_STATE_TRASHED'), 'tone' => 'danger'], default => ['icon' => 'fas fa-question-circle', 'label' => (string) $state, 'tone' => 'neutral'] }; }
    private function statusOverlay(int $state): array { return ['id' => 'status', ...$this->statusPresentation($state), 'action' => match ($state) { 1 => 'unpublish', 0 => 'publish', default => null }]; }
    private function sortResources(array $resources, string $field, string $direction): array
    {
        if ($field === '') return $resources;
        usort($resources, static function (array $a, array $b) use ($field, $direction): int {
            $left = $field === 'title' ? $a['title'] : ($a['metadata'][$field] ?? '');
            $right = $field === 'title' ? $b['title'] : ($b['metadata'][$field] ?? '');
            $result = is_string($left) && is_string($right) ? strnatcasecmp($left, $right) : $left <=> $right;
            return $direction === 'desc' ? -$result : $result;
        });
        return $resources;
    }
}
