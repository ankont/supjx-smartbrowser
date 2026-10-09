<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter;

use Joomla\CMS\Application\CMSApplicationInterface;
use Joomla\CMS\Categories\CategoryNode;
use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Uri\Uri;
use Joomla\Database\DatabaseInterface;
use SuperSoft\Component\Smartbrowser\Administrator\Support\EditorRoute;
use SuperSoft\Component\Smartbrowser\Administrator\Support\SmartAuthorsAccess;
use SuperSoft\Component\Smartbrowser\Administrator\Model\SmartAuthorsArticleModel;

defined('_JEXEC') or die;

abstract class ContentAdapter implements ResourceAdapterInterface, BrowseRootAwareInterface, ReadableResourceAdapterInterface
{
    protected const ROOT_ID = 'content:root';
    protected ?string $browseRoot = null;
    private ?array $languageImages = null;
    private ?array $accessNames = null;

    public function __construct(protected readonly CMSApplicationInterface $app)
    {
        $app->getLanguage()->load('com_smartbrowser', JPATH_ADMINISTRATOR, null, true);
    }

    public function getRoots(): array
    {
        if ($this->browseRoot && $this->browseRootKind() === 'category' && $this->hasVisibleBrowseHierarchy()) {
            $resource = $this->normalizeCategory($this->getCategory($this->browseRootNumericId()));
            return [[...$resource, 'type' => 'root', 'parentId' => null, 'visible' => true]];
        }
        return [[
            'id' => static::ROOT_ID,
            'title' => Text::_('COM_SMARTBROWSER_CONTENT_ROOT'),
            'type' => 'root',
            'kind' => 'node',
            'icon' => 'fas fa-box-open',
            'visible' => false,
            'selectable' => false,
            'navigable' => true,
            'hasChildren' => true,
            'capabilities' => $this->categoryCapabilities(null),
            'metadata' => [],
        ]];
    }

    public function getResource(string $resourceId, array $options = []): array
    {
        $this->assertBrowseScope([$resourceId]);
        if (str_starts_with($resourceId, 'category:')) {
            return $this->normalizeCategory($this->getCategory((int) substr($resourceId, 9)));
        }
        if (!str_starts_with($resourceId, 'article:')) {
            throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        }

        $item = $this->contentModel('Article')->getItem((int) substr($resourceId, 8));
        if (!$item || empty($item->id)) {
            throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 404);
        }

        return $this->normalizeArticle($item);
    }

    public function getReadableResource(string $resourceId): array
    {
        $this->assertBrowseScope([$resourceId]);
        if (preg_match('/^article:([1-9][0-9]*)$/D', $resourceId, $matches)) {
            $article = $this->contentModel('Article')->getItem((int) $matches[1]);
            if (!$article || empty($article->id)) throw new \RuntimeException('Unavailable', 404);
            ReadVisibility::assertPublished($article, $this->app->getIdentity(), 'state');
            $this->assertReadableCategory((int) $article->catid);
            $resource = $this->normalizeArticle($article);
        } elseif (preg_match('/^category:([1-9][0-9]*)$/D', $resourceId, $matches)) {
            $resource = $this->normalizeCategory($this->assertReadableCategory((int) $matches[1]));
        } elseif (preg_match('/^tag:([1-9][0-9]*)$/D', $resourceId, $matches) && in_array($this->getId(), ['tags', 'articles-by-tag'], true)) {
            $tag = $this->getTag((int) $matches[1]);
            $cursor = $tag; $seen = [];
            while ((int) $cursor->id !== $this->tagRootId()) {
                if (isset($seen[$cursor->id])) throw new \RuntimeException('Invalid tag ancestry', 403);
                $seen[$cursor->id] = true;
                ReadVisibility::assertPublished($cursor, $this->app->getIdentity(), 'published');
                $cursor = $this->getTag((int) $cursor->parent_id);
            }
            // Avoid tree-wide metadata and authoring decorations in public descriptors.
            $resource = ['id' => $resourceId, 'title' => $this->title((string) $tag->title), 'subtitle' => null,
                'kind' => 'node', 'type' => 'tag', 'parentId' => null, 'icon' => 'fas fa-tag', 'image' => null,
                'status' => 1, 'metadata' => ['id' => (int) $tag->id, 'alias' => (string) $tag->alias,
                    'language' => $tag->language ?? '*', 'created' => $tag->created_time ?? null, 'modified' => $tag->modified_time ?? null,
                    'languageKey' => $this->languageKey((string) $tag->title),
                    'tagPaths' => implode(' / ', array_slice($this->tagPathTitles((int) $tag->id), 0, -1)),
                    'accessId' => (int) $tag->access, 'state' => (int) $tag->published,
                    'url' => \Joomla\CMS\Router\Route::link('site', 'index.php?option=com_tags&view=tag&id=' . (int) $tag->id, false)]];
        } else {
            throw new \RuntimeException('No safe read policy for reference.', 403);
        }
        $public = ReadVisibility::publicDescriptor($resource);
        if (isset($resource['metadata']['url'])) $public['metadata']['url'] = $resource['metadata']['url'];
        if (isset($resource['metadata']['tagPaths'])) $public['metadata']['tagPaths'] = $resource['metadata']['tagPaths'];
        return $public;
    }

    private function assertReadableCategory(int $id): CategoryNode
    {
        $category = $this->getCategory($id);
        $cursor = $category;
        while ($cursor && (int) $cursor->id > 1) {
            ReadVisibility::assertPublished($cursor, $this->app->getIdentity(), 'published');
            $cursor = $cursor->getParent();
        }
        return $category;
    }

    public function getBreadcrumb(string $nodeId): array
    {
        $this->assertBrowseScope([$nodeId]);
        $crumbs = [['id' => static::ROOT_ID, 'title' => Text::_('COM_SMARTBROWSER_CONTENT_ROOT'), 'kind' => 'node', 'type' => 'root', 'icon' => 'fas fa-box', 'visible' => false]];
        $categoryId = $this->categoryId($nodeId);
        if (!$categoryId) return $crumbs;

        foreach (array_keys($this->getCategory($categoryId)->getPath()) as $pathId) {
            $node = $this->getCategory((int) $pathId);
            if ((int) $node->id > 1) {
                if ($this->browseRoot && (int) $node->id === $this->browseRootNumericId()) $crumbs = [];
                $crumbs[] = ['id' => 'category:' . $node->id, 'title' => $this->title($node->title), 'kind' => 'node', 'type' => 'category', 'icon' => 'fas fa-box', 'visible' => true];
            }
        }
        return $crumbs;
    }

    public function getCollectionPresentation(array $resources = []): array
    {
        return $this->articlePresentation(false, false);
    }

    public function configureBrowseRoot(?string $browseRoot): void
    {
        $this->browseRoot = $browseRoot !== null && $browseRoot !== '' ? $browseRoot : null;
        if (!$this->browseRoot) return;
        $prefix = $this->browseRootKind() === 'tag' ? 'tag:' : 'category:';
        if (!str_starts_with($this->browseRoot, $prefix) || $this->browseRootNumericId() < 1) {
            throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        }
        $this->browseRootKind() === 'tag'
            ? $this->getTag($this->browseRootNumericId())
            : $this->getCategory($this->browseRootNumericId());
    }

    public function getBrowseRoot(): ?string { return $this->browseRoot; }

    public function getInitialNode(?string $candidate = null): string
    {
        if (!$this->hasVisibleBrowseHierarchy()) return static::ROOT_ID;
        $fallback = $this->browseRoot ?: static::ROOT_ID;
        if (!$candidate) return $fallback;
        try {
            $this->assertBrowseScope([$candidate]);
            return $candidate;
        } catch (\Throwable) {
            return $fallback;
        }
    }

    public function assertBrowseScope(array $resourceIds): void
    {
        if (!$this->browseRoot) return;
        foreach ($resourceIds as $resourceId) {
            $id = (string) $resourceId;
            if ($id === '' || (!$this->hasVisibleBrowseHierarchy() && $id === static::ROOT_ID)) continue;
            $inside = match (true) {
                str_starts_with($id, 'category:') => $this->browseRootKind() === 'category'
                    && $this->categoryWithinBrowseRoot((int) substr($id, 9)),
                str_starts_with($id, 'tag:') => $this->browseRootKind() === 'tag'
                    && $this->tagWithinBrowseRoot((int) substr($id, 4)),
                str_starts_with($id, 'article:') => $this->articleWithinBrowseRoot((int) substr($id, 8)),
                default => false,
            };
            if (!$inside) throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
        }
    }

    protected function getArticles(int $categoryId, array $options): array
    {
        return $this->queryArticles($options, $categoryId);
    }

    protected function getAllArticles(array $options): array
    {
        if ($this->browseRoot && $this->browseRootKind() === 'category') {
            $scopeIds = $this->categoryBrowseScopeIds();
            $selectedCategory = (int) ($options['filters']['category'] ?? 0);
            if ($selectedCategory > 0) {
                if (!in_array($selectedCategory, $scopeIds, true)) return [];
                $scopeIds = [$selectedCategory];
            }
            return $this->queryArticles($options, $scopeIds);
        }
        return $this->queryArticles($options);
    }

    protected function getArticlesByTag(int $tagId, array $options): array
    {
        $options['filters']['tag'] = (string) $tagId;

        return $this->queryArticles($options);
    }

    protected function contextualArticles(array $articles): array
    {
        return array_map(static function (array $article): array {
            return [
                ...$article,
                'role' => 'contextual',
                'focusable' => true,
                'selectable' => false,
                'bulkSelectable' => false,
                'actionable' => false,
                'navigable' => false,
                'activatable' => false,
                'interactiveOverlays' => false,
                'capabilities' => [],
            ];
        }, $articles);
    }

    /**
     * Content-domain API for adapters and resolvers which present Articles without
     * owning a second Article query or normalization implementation.
     */
    public function resolveArticles(array $options = [], int|array|null $categoryId = null): array
    {
        return $this->queryArticles($options, $categoryId);
    }

    public function resolveArticlesByTags(array $tagIds, array $options = [], bool $matchAll = false): array
    {
        $resources = [];
        $matches = [];
        foreach (array_values(array_unique(array_filter(array_map('intval', $tagIds)))) as $tagId) {
            foreach ($this->getArticlesByTag($tagId, $options) as $resource) {
                $resources[$resource['id']] = $resource;
                $matches[$resource['id']] = ($matches[$resource['id']] ?? 0) + 1;
            }
        }
        if ($matchAll && $tagIds !== []) {
            $required = count(array_unique(array_filter(array_map('intval', $tagIds))));
            $resources = array_filter($resources, static fn (string $id): bool => ($matches[$id] ?? 0) === $required, ARRAY_FILTER_USE_KEY);
        }
        return array_values($resources);
    }

    public function asContextualArticles(array $articles): array
    {
        return $this->contextualArticles($articles);
    }

    public function resolveCategoryScopeIds(int $categoryId, int $depth = 0): array
    {
        $root = $this->getCategory($categoryId);
        $ids = [$categoryId];
        if ($depth === 0) return $ids;

        foreach ($root->getChildren(true) as $category) {
            if ($depth < 0 || (int) $category->level <= (int) $root->level + $depth) {
                $ids[] = (int) $category->id;
            }
        }

        return array_values(array_unique($ids));
    }

    protected function tagRootResource(bool $managed = true): array
    {
        if ($this->browseRoot && $this->browseRootKind() === 'tag') {
            $resource = $this->normalizeTag($this->getTag($this->browseRootNumericId()), $this->tagTree(), $managed);
            return [...$resource, 'type' => 'root', 'parentId' => null, 'visible' => true];
        }
        return [
            'id' => static::ROOT_ID,
            'title' => Text::_('COM_SMARTBROWSER_TAGS_ROOT'),
            'type' => 'root', 'kind' => 'node', 'icon' => 'fas fa-tags',
            'visible' => false, 'selectable' => false, 'navigable' => true, 'hasChildren' => true,
            'capabilities' => $managed ? $this->tagCapabilities(null) : ['open' => true],
            'metadata' => [],
        ];
    }

    protected function getTagBreadcrumb(string $nodeId): array
    {
        $this->assertBrowseScope([$nodeId]);
        $crumbs = [['id' => static::ROOT_ID, 'title' => Text::_('COM_SMARTBROWSER_TAGS_ROOT'), 'kind' => 'node', 'type' => 'root', 'icon' => 'fas fa-tags', 'visible' => false]];
        $tagId = $this->tagId($nodeId);
        if (!$tagId) return $crumbs;

        foreach ($this->tagTable()->getPath($tagId) as $tag) {
            if ((int) $tag->id !== $this->tagRootId() && $this->canViewTag($tag)) {
                if ($this->browseRoot && (int) $tag->id === $this->browseRootNumericId()) $crumbs = [];
                $crumbs[] = ['id' => 'tag:' . $tag->id, 'title' => $this->title((string) $tag->title), 'kind' => 'node', 'type' => 'tag', 'icon' => 'fas fa-tag', 'visible' => true];
            }
        }
        return $crumbs;
    }

    protected function getTagChildren(string $nodeId, array $options = [], bool $managed = true): array
    {
        $this->assertBrowseScope([$nodeId]);
        $parentId = $this->tagId($nodeId) ?: $this->tagRootId();
        $tree = $this->tagTree();
        $stateFilter = (string) ($options['filters']['state'] ?? 'active');
        $access = (string) ($options['filters']['access'] ?? '');
        $language = (string) ($options['filters']['language'] ?? '');
        $search = mb_strtolower(trim((string) ($options['search'] ?? '')));
        $nodes = [];

        foreach ($tree as $tag) {
            if ((int) $tag->parent_id !== $parentId || !$this->canViewTag($tag)) continue;
            $matchesSearch = $search === ''
                || str_contains(mb_strtolower((string) $tag->title), $search)
                || str_contains(mb_strtolower((string) $tag->alias), $search);
            if ($matchesSearch && ($access === '' || (string) $tag->access === $access)
                && ($language === '' || (string) $tag->language === $language)
                && ($this->matchesState((int) $tag->published, $stateFilter) || $this->hasMatchingTagDescendant((int) $tag->id, $tree, $stateFilter))) {
                $nodes[] = $this->normalizeTag($tag, $tree, $managed);
            }
        }

        return $this->sortTagResources($nodes, (string) ($options['sortBy'] ?? ''), (string) ($options['sortDirection'] ?? 'asc'));
    }

    protected function normalizeTag(object $tag, array $tree, bool $managed = true): array
    {
        $id = (int) $tag->id;
        $state = (int) $tag->published;
        $languageKey = $this->languageKey((string) $tag->title);
        return [
            'id' => 'tag:' . $id, 'title' => $this->title((string) $tag->title), 'subtitle' => Text::_('JTAG'),
            'parentId' => $this->browseRoot === 'tag:' . $id ? null : ((int) $tag->parent_id === $this->tagRootId() ? static::ROOT_ID : 'tag:' . (int) $tag->parent_id),
            'kind' => 'node', 'type' => 'tag', 'icon' => 'fas fa-tag', 'image' => null,
            'status' => $state, 'statusPresentation' => $this->statusPresentation($state),
            'overlays' => [$this->statusOverlay($state)],
            'selectable' => $managed, 'navigable' => true, 'hasChildren' => $this->tagHasChildren($id, $tree),
            'capabilities' => $managed ? $this->tagCapabilities($id, $state) : ['open' => true],
            'metadata' => [
                'id' => $id, 'alias' => (string) ($tag->alias ?? ''), 'languageKey' => $languageKey,
                'tagPaths' => implode(' / ', array_slice($this->tagPathTitles($id), 0, -1)),
                'cardSummary' => $this->languageKeySummary($languageKey), 'state' => $state,
                'stateLabel' => $this->stateLabel($state), 'language' => $tag->language ?? '*',
                'languageImage' => $this->languageImageForCode((string) ($tag->language ?? '*')),
                'accessId' => (int) ($tag->access ?? 0),
                'access' => $this->accessName((int) ($tag->access ?? 0)), 'created' => $tag->created_time ?? null,
                'modified' => $tag->modified_time ?? null, 'ordering' => (int) ($tag->lft ?? 0),
            ],
        ];
    }

    protected function tagCapabilities(?int $id, ?int $state = null): array
    {
        $asset = $id ? 'com_tags.tag.' . $id : 'com_tags';
        $identity = $this->app->getIdentity();
        return [
            'preview' => $id !== null,
            'open' => true, 'edit' => $id !== null && $identity->authorise('core.edit', $asset),
            'reorder' => $id !== null && $identity->authorise('core.edit.state', $asset),
            'publish' => $id !== null && $state !== 1 && $identity->authorise('core.edit.state', $asset),
            'unpublish' => $id !== null && $state === 1 && $identity->authorise('core.edit.state', $asset),
            'archive' => $id !== null && in_array($state, [0, 1], true) && $identity->authorise('core.edit.state', $asset),
            'unarchive' => $id !== null && $state === 2 && $identity->authorise('core.edit.state', $asset),
            'createChild' => $identity->authorise('core.create', $asset),
            'newArticle' => $id !== null && $this->canCreateArticle(),
            'trash' => $id !== null && $identity->authorise('core.delete', $asset),
        ];
    }

    protected function getTag(int $id): object
    {
        $tag = $this->tagTable();
        if (!$id || !$tag->load($id) || !$this->canViewTag($tag)) throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
        return $tag;
    }

    protected function tagTree(): array { return array_values($this->tagTable()->getTree($this->tagRootId())); }
    protected function tagTable(): object { return $this->app->bootComponent('com_tags')->getMVCFactory()->createTable('Tag', 'Administrator'); }
    protected function tagModel(): object { return $this->app->bootComponent('com_tags')->getMVCFactory()->createModel('Tag', 'Administrator', ['ignore_request' => true]); }
    protected function tagRootId(): int { return (int) $this->tagTable()->getRootId(); }
    protected function tagId(string $id): int
    {
        if ($id === '' || $id === static::ROOT_ID) {
            if ($this->browseRoot && $this->hasVisibleBrowseHierarchy()) throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
            return 0;
        }
        if (!str_starts_with($id, 'tag:')) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        $tagId = (int) substr($id, 4);
        $this->assertBrowseScope([$id]);
        return $tagId;
    }

    protected function canViewTag(object $tag): bool { return in_array((int) $tag->access, $this->app->getIdentity()->getAuthorisedViewLevels(), true); }

    private function tagHasChildren(int $id, array $tree): bool
    {
        foreach ($tree as $tag) if ((int) $tag->parent_id === $id && $this->canViewTag($tag)) return true;
        return false;
    }

    private function hasMatchingTagDescendant(int $id, array $tree, string $filter): bool
    {
        foreach ($tree as $tag) {
            if ((int) $tag->parent_id !== $id || !$this->canViewTag($tag)) continue;
            if ($this->matchesState((int) $tag->published, $filter) || $this->hasMatchingTagDescendant((int) $tag->id, $tree, $filter)) return true;
        }
        return false;
    }

    private function sortTagResources(array $tags, string $field, string $direction): array
    {
        if ($field === '') return $tags;
        usort($tags, static function (array $left, array $right) use ($field, $direction): int {
            $a = $field === 'title' ? $left['title'] : ($left['metadata'][$field] ?? '');
            $b = $field === 'title' ? $right['title'] : ($right['metadata'][$field] ?? '');
            $result = is_string($a) && is_string($b) ? strnatcasecmp($a, $b) : $a <=> $b;
            return $direction === 'desc' ? -$result : $result;
        });
        return $tags;
    }

    private function queryArticles(array $options, int|array|null $categoryId = null): array
    {
        $model = $this->contentModel('Articles');
        $sortBy = (string) ($options['sortBy'] ?? '');
        $ordering = match ($sortBy) {
            'title' => 'a.title', 'alias' => 'a.alias', 'state' => 'a.state', 'author' => 'a.created_by',
            'created' => 'a.created', 'ordering' => 'a.ordering', 'language' => 'a.language', 'id' => 'a.id',
            default => 'a.modified',
        };
        $filters = $options['filters'] ?? [];
        $filteredCategoryId = $categoryId ?? (int) ($filters['category'] ?? 0);
        if ((is_array($filteredCategoryId) && $filteredCategoryId !== []) || (!is_array($filteredCategoryId) && $filteredCategoryId > 0)) {
            $model->setState('filter.category_id', $filteredCategoryId);
            $model->setState('filter.level', 1);
        }
        $model->setState('filter.search', trim((string) ($options['search'] ?? '')));
        $model->setState('filter.published', match ($options['stateFilter'] ?? 'active') {
            'published' => 1, 'unpublished' => 0, 'archived' => 2, 'trashed' => -2, 'all' => '*', default => '',
        });
        $model->setState('filter.featured', (string) ($filters['featured'] ?? ''));
        $model->setState('filter.access', (string) ($filters['access'] ?? ''));
        $model->setState('filter.language', (string) ($filters['language'] ?? ''));
        $model->setState('filter.author_id', (string) ($filters['author'] ?? ''));
        $model->setState('filter.tag', (string) ($filters['tag'] ?? ''));
        $model->setState('filter.checked_out', (string) ($filters['checkedOut'] ?? ''));
        if ($sortBy !== '') {
            $model->setState('list.ordering', $ordering);
            $model->setState('list.direction', strtoupper(($options['sortDirection'] ?? 'asc') === 'desc' ? 'DESC' : 'ASC'));
        }
        $model->setState('list.limit', 0);
        $items = $model->getItems();
        $tags = $this->articleTags(array_map(static fn (object $item): int => (int) $item->id, $items));
        return array_values(array_map(function (object $item) use ($tags): array {
            $resource = $this->normalizeArticle($item);
            $resource['metadata']['tagPaths'] = implode("\n", $tags[(int) $item->id] ?? []);
            return $resource;
        }, $items));
    }

    private function articleTags(array $articleIds): array
    {
        if (!$articleIds) return [];
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true)
            ->select([$db->quoteName('map.content_item_id', 'article_id'), $db->quoteName('tag.id', 'tag_id')])
            ->from($db->quoteName('#__contentitem_tag_map', 'map'))
            ->join('INNER', $db->quoteName('#__tags', 'tag') . ' ON ' . $db->quoteName('tag.id') . ' = ' . $db->quoteName('map.tag_id'))
            ->where($db->quoteName('map.type_alias') . ' = ' . $db->quote('com_content.article'))
            ->whereIn($db->quoteName('map.content_item_id'), array_values(array_unique($articleIds)))
            ->whereIn($db->quoteName('tag.access'), $this->app->getIdentity()->getAuthorisedViewLevels());
        $tags = [];
        $paths = [];
        foreach ($db->setQuery($query)->loadObjectList() as $tag) {
            $tagId = (int) $tag->tag_id;
            $paths[$tagId] ??= implode(' / ', $this->tagPathTitles($tagId));
            $tags[(int) $tag->article_id][] = $paths[$tagId];
        }
        return $tags;
    }

    protected function normalizeCategory(CategoryNode $category): array
    {
        $languageKey = $this->languageKey((string) $category->title);
        return [
            'id' => 'category:' . $category->id,
            'title' => $this->title($category->title),
            'subtitle' => Text::_('JCATEGORY'),
            'parentId' => $this->browseRoot === 'category:' . (int) $category->id ? null : ((int) $category->parent_id > 1 ? 'category:' . $category->parent_id : static::ROOT_ID),
            'kind' => 'node', 'type' => 'category', 'icon' => 'fas fa-box', 'image' => null,
            'status' => (int) $category->published,
            'statusPresentation' => $this->statusPresentation((int) $category->published),
            'overlays' => [$this->statusOverlay((int) $category->published)],
            'selectable' => true, 'navigable' => true, 'hasChildren' => $category->hasChildren(),
            'capabilities' => $this->categoryCapabilities((int) $category->id, (int) $category->published),
            'metadata' => [
                'id' => (int) $category->id, 'alias' => $category->alias,
                'categoryPath' => implode(' / ', array_slice($this->categoryPathTitles((int) $category->id), 0, -1)),
                'languageKey' => $languageKey,
                'cardSummary' => $this->languageKeySummary($languageKey),
                'state' => (int) $category->published,
                'stateLabel' => $this->stateLabel((int) $category->published),
                'language' => $category->language ?? '*', 'languageImage' => $this->languageImageForCode((string) ($category->language ?? '*')),
                'access' => $this->accessName((int) ($category->access ?? 0)),
                'modified' => $category->modified_time ?? null, 'created' => $category->created_time ?? null,
                'ordering' => (int) ($category->lft ?? 0),
            ],
        ];
    }

    protected function normalizeArticle(object $article): array
    {
        $id = (int) $article->id;
        $images = json_decode((string) ($article->images ?? '{}')) ?: new \stdClass();
        $storedImage = (string) ($images->image_intro ?? '') ?: (string) ($images->image_fulltext ?? '');
        $identity = $this->app->getIdentity();
        $canEdit = SmartAuthorsAccess::canEditArticle($this->app, $identity, $article);
        $canPublish = SmartAuthorsAccess::canChangeArticleState($this->app, $identity, $article, 1);
        $canUnpublish = SmartAuthorsAccess::canChangeArticleState($this->app, $identity, $article, 0);
        $canArchive = SmartAuthorsAccess::canChangeArticleState($this->app, $identity, $article, 2);
        $canTrash = SmartAuthorsAccess::canTrashArticle($this->app, $identity, $article);
        $canFeature = $identity->authorise('core.edit.state', 'com_content.article.' . $id);
        $state = (int) ($article->state ?? 0);
        $isFeatured = (bool) ($article->featured ?? false);
        $featuredUp = (string) ($article->featured_up ?? '');
        $featuredDown = (string) ($article->featured_down ?? '');
        $now = Factory::getDate()->toUnix();
        $featuredTiming = $isFeatured && $featuredUp !== '' && Factory::getDate($featuredUp, 'UTC')->toUnix() > $now ? 'pending' : '';
        if ($isFeatured && $featuredDown !== '' && Factory::getDate($featuredDown, 'UTC')->toUnix() < $now) $featuredTiming = 'expired';
        $statusPresentation = $this->statusPresentation($state);
        if ($state === 1) {
            $nullDate = Factory::getContainer()->get(DatabaseInterface::class)->getNullDate();
            $publishUp = (string) ($article->publish_up ?? '');
            $publishDown = (string) ($article->publish_down ?? '');
            $publicationTiming = $publishUp !== '' && $publishUp !== $nullDate && Factory::getDate($publishUp, 'UTC')->toUnix() > $now ? 'pending' : '';
            if ($publishDown !== '' && $publishDown !== $nullDate && Factory::getDate($publishDown, 'UTC')->toUnix() < $now) $publicationTiming = 'expired';
            if ($publicationTiming !== '') $statusPresentation = [
                'icon' => $publicationTiming === 'pending' ? 'fas fa-clock' : 'fas fa-calendar-times',
                'label' => Text::_('JLIB_HTML_PUBLISHED_' . strtoupper($publicationTiming) . '_ITEM'),
                'tone' => $publicationTiming,
            ];
        }
        $languageKey = $this->languageKey((string) $article->title);
        $categoryTitle = $this->title((string) ($article->category_title ?? ''));
        $cardSummary = $this->languageKeySummary($languageKey);
        $checkedOut = (int) ($article->checked_out ?? 0);
        $canCheckin = $checkedOut > 0 && (
            $checkedOut === (int) $identity->id
            || $identity->authorise('core.manage', 'com_checkin')
            || $canEdit
        );
        $statusOverlay = $this->statusOverlay($state);
        $statusOverlay = array_replace($statusOverlay, $statusPresentation);
        if ($state === -2) $statusOverlay['action'] = 'restore';
        $overlays = [$statusOverlay, [
            'id' => 'featured', 'icon' => $featuredTiming !== '' ? ($featuredTiming === 'pending' ? 'fas fa-clock' : 'fas fa-calendar-times') : ($isFeatured ? 'fas fa-star' : 'far fa-star'),
            'label' => Text::_($featuredTiming !== '' ? 'JLIB_HTML_FEATURED_' . strtoupper($featuredTiming) . '_ITEM' : ($isFeatured ? 'JFEATURED' : 'JUNFEATURED')),
            'tone' => $featuredTiming !== '' ? $featuredTiming : ($isFeatured ? 'warning' : 'muted'), 'action' => $isFeatured ? 'unfeature' : 'feature',
        ]];
        if ($checkedOut > 0) {
            $overlays[] = ['id' => 'checkedOut', 'icon' => 'fas fa-lock', 'label' => Text::sprintf('COM_SMARTBROWSER_CHECKED_OUT_BY', (string) ($article->editor ?? '')), 'tone' => 'warning', 'action' => 'checkin'];
        }

        return [
            'id' => 'article:' . $id, 'title' => $this->title((string) $article->title),
            'subtitle' => (string) ($article->alias ?? ''), 'parentId' => 'category:' . (int) $article->catid,
            'kind' => 'item', 'type' => 'article', 'icon' => 'fas fa-newspaper', 'image' => $this->imageUrl($storedImage),
            'status' => $state, 'statusPresentation' => $statusPresentation, 'overlays' => $overlays,
            'selectable' => true, 'navigable' => false, 'hasChildren' => false,
            'capabilities' => [
                'preview' => true,
                'edit' => $canEdit, 'reorder' => $canFeature, 'publish' => $canPublish && $state !== 1, 'unpublish' => $canUnpublish && $state === 1,
                'archive' => $canArchive && in_array($state, [0, 1], true),
                'unarchive' => $canUnpublish && $state === 2,
                'feature' => $canFeature && !$isFeatured, 'unfeature' => $canFeature && $isFeatured,
                'trash' => $canTrash && $state !== -2,
                'restore' => $state === -2 && ($canUnpublish || $canTrash),
                'checkin' => $canCheckin,
            ],
            'metadata' => [
                'id' => $id, 'alias' => $article->alias ?? '', 'languageKey' => $languageKey,
                'cardSummary' => $cardSummary,
                'cardSummaryWithCategory' => implode("\n", array_filter([
                    $cardSummary, $categoryTitle,
                ])),
                'category' => $categoryTitle,
                'categoryPath' => implode(' / ', $this->categoryPathTitles((int) $article->catid)),
                'state' => $state, 'stateLabel' => $statusPresentation['label'],
                'access' => $article->access_level ?? $article->access ?? '',
                'accessId' => (int) ($article->access ?? 0),
                'language' => $article->language_title ?? $article->language ?? '*',
                'languageImage' => $this->languageImage((string) ($article->language_image ?? '')),
                'author' => $article->author_name ?? $article->created_by_alias ?? '',
                'created' => $article->created ?? null, 'modified' => $article->modified ?? null,
                'featured' => $isFeatured, 'ordering' => (int) ($article->ordering ?? 0),
                'checkedOut' => (int) ($article->checked_out ?? 0), 'checkedOutBy' => (string) ($article->editor ?? ''),
            ],
        ];
    }

    protected function canCreateArticle(): bool
    {
        $identity = $this->app->getIdentity();
        if ($identity->authorise('core.create', 'com_content')) return true;
        $service = SmartAuthorsAccess::service($this->app);
        return $service !== null && $service->canCreateInAnyCategory((int) $identity->id);
    }

    protected function categoryCapabilities(?int $id, ?int $state = null): array
    {
        $asset = $id ? 'com_content.category.' . $id : 'com_content';
        $identity = $this->app->getIdentity();
        $canCreateArticle = $identity->authorise('core.create', $asset);
        if ($id !== null && !$canCreateArticle) {
            $service = SmartAuthorsAccess::service($this->app);
            $canCreateArticle = $service !== null && $service->canCreateArticle((int) $identity->id, $id);
        }
        return [
            'open' => true, 'edit' => $id !== null && $identity->authorise('core.edit', $asset),
            'reorder' => $id !== null && $identity->authorise('core.edit.state', $asset),
            'publish' => $id !== null && $state !== 1 && $identity->authorise('core.edit.state', $asset),
            'unpublish' => $id !== null && $state === 1 && $identity->authorise('core.edit.state', $asset),
            'archive' => $id !== null && in_array($state, [0, 1], true) && $identity->authorise('core.edit.state', $asset),
            'unarchive' => $id !== null && $state === 2 && $identity->authorise('core.edit.state', $asset),
            'createChild' => $identity->authorise('core.create', $asset),
            'newArticle' => $id !== null && $canCreateArticle,
            'trash' => $id !== null && $identity->authorise('core.delete', $asset),
        ];
    }

    protected function setState(array $selection, int $state): array
    {
        $groups = $this->splitSelection($selection);
        if ($groups['articles']) {
            foreach ($groups['articles'] as $id) {
                $resource = $this->getResource('article:' . $id);
                $action = match ($state) { -2 => 'trash', 1 => 'publish', 2 => 'archive', default => match ((int) ($resource['status'] ?? 0)) { 2 => 'unarchive', -2 => 'restore', default => 'unpublish' } };
                if (empty($resource['capabilities'][$action])) {
                    throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
                }
            }
            $factory = $this->app->bootComponent('com_content')->getMVCFactory();
            $model = new SmartAuthorsArticleModel(['ignore_request' => true, 'name' => 'Article', 'option' => 'com_content'], $factory);
            $this->assertModelResult($model, 'publish', [$groups['articles'], $state]);
        }
        if ($groups['categories']) {
            foreach ($groups['categories'] as $id) {
                $resource = $this->getResource('category:' . $id);
                $action = match ($state) { -2 => 'trash', 1 => 'publish', 2 => 'archive', default => (int) ($resource['status'] ?? 0) === 2 ? 'unarchive' : 'unpublish' };
                if (empty($resource['capabilities'][$action])) {
                    throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
                }
            }
            $this->assertModelResult($this->categoryModel(), 'publish', [$groups['categories'], $state]);
        }
        return ['updated' => array_values($selection)];
    }

    protected function setFeatured(array $selection, int $state): array
    {
        $ids = $this->splitSelection($selection)['articles'];
        if (!$ids) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        $this->assertModelResult($this->contentModel('Article'), 'featured', [$ids, $state]);
        return ['updated' => array_values($selection)];
    }

    protected function checkinArticles(array $selection): array
    {
        if (!$selection) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        $ids = [];
        foreach ($selection as $resourceId) {
            if (!str_starts_with((string) $resourceId, 'article:')) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
            $resource = $this->getResource((string) $resourceId);
            if (empty($resource['capabilities']['checkin'])) throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
            $ids[] = (int) substr((string) $resourceId, 8);
        }
        $model = $this->app->bootComponent('com_content')->getMVCFactory()->createModel('Form', 'Site', ['ignore_request' => true]);
        foreach ($ids as $id) $this->assertModelResult($model, 'checkin', [$id]);
        return ['updated' => array_values($selection)];
    }

    protected function contentPreview(string $id): array
    {
        $resource = $this->getResource($id);
        if (empty($resource['capabilities']['preview'])) throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
        $access = (int) ($resource['metadata']['accessId'] ?? 0);
        if ($access && !in_array($access, $this->app->getIdentity()->getAuthorisedViewLevels(), true)) throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
        $query = str_starts_with($id, 'article:')
            ? 'option=com_content&view=article&id=' . (int) substr($id, 8)
            : (str_starts_with($id, 'tag:') ? 'option=com_tags&view=tag&id=' . (int) substr($id, 4) : null);
        if ($query === null) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        return ['command' => 'previewUrl', 'url' => Uri::root() . 'index.php?' . $query . '&tmpl=component&Itemid=0', 'title' => $resource['title']];
    }

    protected function edit(string $id): array
    {
        if (str_starts_with($id, 'article:')) return $this->editorResponse('index.php?option=com_content&task=article.edit&id=' . (int) substr($id, 8));
        if (str_starts_with($id, 'category:')) return $this->editorResponse('index.php?option=com_categories&task=category.edit&id=' . (int) substr($id, 9) . '&extension=com_content');
        throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
    }

    protected function accessOptions(): array
    {
        $options = [['value' => '', 'label' => 'COM_SMARTBROWSER_SELECT_ACCESS']];
        foreach (HTMLHelper::_('access.assetgroups') as $group) $options[] = ['value' => (string) $group->value, 'label' => (string) $group->text];
        return $options;
    }

    private function accessName(int $id): string
    {
        if ($this->accessNames === null) {
            $this->accessNames = [];
            foreach (HTMLHelper::_('access.assetgroups') as $group) $this->accessNames[(int) $group->value] = (string) $group->text;
        }
        return $this->accessNames[$id] ?? (string) $id;
    }

    protected function languageOptions(): array
    {
        $options = [['value' => '', 'label' => 'COM_SMARTBROWSER_SELECT_LANGUAGE'], ['value' => '*', 'label' => 'JALL']];
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true)->select($db->quoteName(['lang_code', 'title']))
            ->from($db->quoteName('#__languages'))->order($db->quoteName('title'));
        foreach ($db->setQuery($query)->loadObjectList() as $language) {
            $options[] = ['value' => (string) $language->lang_code, 'label' => (string) $language->title];
        }
        return $options;
    }

    protected function categoryOptions(bool $batchDestination = false): array
    {
        $options = [['value' => '', 'label' => 'COM_SMARTBROWSER_SELECT_CATEGORY']];
        $root = $this->browseRoot && $this->browseRootKind() === 'category'
            ? $this->getCategory($this->browseRootNumericId())
            : $this->categoryRoot();
        $baseLevel = (int) ($root->level ?? 0);
        $categories = $root->getChildren(true);
        if ((int) $root->id > 1) array_unshift($categories, $root);
        foreach ($categories as $category) {
            if (!$this->canViewCategory($category)) continue;
            if ($batchDestination && !in_array((int) $category->published, [0, 1], true)) continue;
            $depth = max(0, (int) ($category->level ?? 1) - $baseLevel);
            $options[] = [
                'value' => (string) $category->id,
                'label' => str_repeat('- ', $depth) . $this->title((string) $category->title),
            ];
        }
        return $options;
    }

    protected function batchTagOptions(): array
    {
        return array_map(static fn ($option): array => [
            'value' => (string) $option->value,
            'label' => (string) $option->text,
        ], HTMLHelper::_('tag.tags', ['filter.published' => [1]]));
    }

    protected function categoryPathTitles(int $categoryId): array
    {
        $titles = [];
        if ($categoryId > 1) {
            foreach (array_keys($this->getCategory($categoryId)->getPath()) as $pathId) {
                if ((int) $pathId > 1) $titles[] = $this->title($this->getCategory((int) $pathId)->title);
            }
        }
        return $titles ?: [Text::_('COM_SMARTBROWSER_CONTENT_ROOT')];
    }

    private function tagPathTitles(int $tagId): array
    {
        return array_values(array_map(fn (object $tag): string => $this->title((string) $tag->title), array_filter(
            $this->tagTable()->getPath($tagId), fn (object $tag): bool => (int) $tag->id !== $this->tagRootId()
        )));
    }

    protected function modelOptions(string $component, string $modelName, string $value, string $label, string $placeholder = 'COM_SMARTBROWSER_FILTER_ANY'): array
    {
        $options = [['value' => '', 'label' => $placeholder]];
        try {
            $model = $this->app->bootComponent($component)->getMVCFactory()->createModel($modelName, 'Administrator', ['ignore_request' => true]);
            $model->setState('list.limit', 0);
            foreach ($model->getItems() as $item) {
                if (isset($item->{$value}, $item->{$label})) {
                    $text = (string) $item->{$label};
                    $options[] = ['value' => (string) $item->{$value}, 'label' => $component === 'com_tags' ? Text::_($text) : $text];
                }
            }
        } catch (\Throwable) {
        }
        return $options;
    }

    protected function categoryRoot(): CategoryNode { return $this->categories()->get('root'); }
    protected function contentModel(string $name): object { return $this->app->bootComponent('com_content')->getMVCFactory()->createModel($name, 'Administrator', ['ignore_request' => true]); }
    protected function categoryModel(): object
    {
        $this->app->getInput()->set('extension', 'com_content');
        return $this->app->bootComponent('com_categories')->getMVCFactory()->createModel('Category', 'Administrator', ['ignore_request' => true]);
    }
    protected function getCategory(int $id): CategoryNode
    {
        $category = $this->categories()->get($id);
        if (!$category || !$this->canViewCategory($category)) throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
        return $category;
    }
    protected function categories(): object { return $this->app->bootComponent('com_content')->getCategory(['access' => false, 'published' => [0, 1, 2, -2]]); }
    protected function canViewCategory(CategoryNode $category): bool { return in_array((int) $category->access, $this->app->getIdentity()->getAuthorisedViewLevels(), true); }
    protected function categoryId(string $id): int
    {
        if ($id === '' || $id === static::ROOT_ID) {
            if ($this->browseRoot && $this->hasVisibleBrowseHierarchy()) throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
            return 0;
        }
        if (!str_starts_with($id, 'category:')) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        $categoryId = (int) substr($id, 9);
        $this->assertBrowseScope([$id]);
        return $categoryId;
    }
    protected function action(string $id, string $label, string $icon, string $scope, bool $primary = false, bool $requiresSelection = false, bool $single = false, bool $itemsOnly = false, bool $currentNode = false, ?string $exclusiveGroup = null): array { return compact('id', 'label', 'icon', 'scope', 'primary', 'requiresSelection', 'single', 'itemsOnly', 'currentNode', 'exclusiveGroup'); }
    protected function requireOne(array $selection): string
    {
        if (count($selection) !== 1) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_SINGLE_SELECTION_REQUIRED'), 400);
        return (string) reset($selection);
    }
    protected function editorResponse(string $url): array { return ['command' => 'openEditor', 'url' => EditorRoute::link($this->app, $url)]; }
    protected function assertModelResult(object $model, string $method, array $arguments): void
    {
        if (!$model->{$method}(...$arguments)) throw new \RuntimeException($model->getError() ?: Text::_('JERROR_AN_ERROR_HAS_OCCURRED'), 500);
    }
    protected function stateLabel(int $state): string { return match ($state) { 1 => Text::_('JPUBLISHED'), 0 => Text::_('JUNPUBLISHED'), -2 => Text::_('COM_SMARTBROWSER_STATE_TRASHED'), 2 => Text::_('JARCHIVED'), default => (string) $state }; }
    protected function statusPresentation(int $state): array { return match ($state) { 1 => ['icon' => 'fas fa-check', 'label' => Text::_('JPUBLISHED'), 'tone' => 'success'], 0 => ['icon' => 'fas fa-times', 'label' => Text::_('JUNPUBLISHED'), 'tone' => 'muted'], 2 => ['icon' => 'fas fa-archive', 'label' => Text::_('JARCHIVED'), 'tone' => 'info'], -2 => ['icon' => 'fas fa-trash', 'label' => Text::_('COM_SMARTBROWSER_STATE_TRASHED'), 'tone' => 'danger'], default => ['icon' => 'fas fa-question-circle', 'label' => (string) $state, 'tone' => 'neutral'] }; }
    protected function statusOverlay(int $state): array { return ['id' => 'status', ...$this->statusPresentation($state), 'action' => match ($state) { 1 => 'unpublish', 0 => 'publish', 2 => 'unarchive', default => null }]; }
    protected function languageImage(string $image): ?string { return $image === '' ? null : Uri::root() . 'media/mod_languages/images/' . rawurlencode($image) . '.gif'; }

    protected function languageImageForCode(string $code): ?string
    {
        if ($code === '*') return null;
        if ($this->languageImages === null) {
            $db = Factory::getContainer()->get(DatabaseInterface::class);
            $query = $db->getQuery(true)->select($db->quoteName(['lang_code', 'image']))->from($db->quoteName('#__languages'));
            $this->languageImages = [];
            foreach ($db->setQuery($query)->loadObjectList() as $language) {
                $this->languageImages[(string) $language->lang_code] = (string) $language->image;
            }
        }
        return $this->languageImage($this->languageImages[$code] ?? '');
    }
    protected function title(string $title): string { return Text::_($title); }

    protected function languageKey(string $title): string
    {
        return Text::_($title) !== $title ? $title : '';
    }

    protected function languageKeySummary(string $languageKey): string
    {
        return $languageKey;
    }
    protected function imageUrl(string $image): ?string
    {
        if ($image === '') return null;
        $clean = HTMLHelper::_('cleanImageURL', $image);
        $url = (string) ($clean->url ?? $image);
        $fragment = strstr($image, '#joomlaImage://');
        if ($fragment !== false && !str_contains($url, '#')) $url .= $fragment;
        return preg_match('#^(?:https?:)?//#', $url) ? $url : Uri::root() . ltrim($url, '/');
    }
    protected function splitSelection(array $selection): array
    {
        $result = ['articles' => [], 'categories' => []];
        foreach ($selection as $id) {
            if (str_starts_with((string) $id, 'article:')) $result['articles'][] = (int) substr((string) $id, 8);
            if (str_starts_with((string) $id, 'category:')) $result['categories'][] = (int) substr((string) $id, 9);
        }
        return $result;
    }
    protected function browseRootKind(): string { return 'category'; }
    protected function hasVisibleBrowseHierarchy(): bool { return true; }
    protected function browseRootNumericId(): int { return (int) substr((string) $this->browseRoot, strpos((string) $this->browseRoot, ':') + 1); }
    protected function categoryBrowseScopeIds(): array
    {
        $root = $this->getCategory($this->browseRootNumericId());
        return array_values(array_unique(array_merge([(int) $root->id], array_map(
            static fn ($category) => (int) $category->id,
            array_filter($root->getChildren(true), fn ($category) => $this->canViewCategory($category))
        ))));
    }
    protected function categoryWithinBrowseRoot(int $id): bool
    {
        if ($id < 1) return false;
        return in_array($id, $this->categoryBrowseScopeIds(), true);
    }
    protected function tagBrowseScopeIds(): array
    {
        $rootId = $this->browseRootNumericId();
        $ids = [$rootId];
        foreach ($this->tagTree() as $tag) {
            if ((int) $tag->id === $rootId || !$this->canViewTag($tag)) continue;
            $pathIds = array_map(static fn ($node) => (int) $node->id, $this->tagTable()->getPath((int) $tag->id));
            if (in_array($rootId, $pathIds, true)) $ids[] = (int) $tag->id;
        }
        return array_values(array_unique($ids));
    }
    protected function tagWithinBrowseRoot(int $id): bool
    {
        return $id > 0 && in_array($id, $this->tagBrowseScopeIds(), true);
    }
    protected function articleWithinBrowseRoot(int $id): bool
    {
        $article = $this->contentModel('Article')->getItem($id);
        if (!$article || empty($article->id)) return false;
        if ($this->browseRootKind() === 'category') return $this->categoryWithinBrowseRoot((int) $article->catid);

        foreach ($this->tagBrowseScopeIds() as $tagId) {
            foreach ($this->getArticlesByTag($tagId, ['stateFilter' => 'all', 'filters' => []]) as $candidate) {
                if ($candidate['id'] === 'article:' . $id) return true;
            }
        }
        return false;
    }
    protected function matchesState(int $state, string $filter): bool { return match ($filter) { 'published' => $state === 1, 'unpublished' => $state === 0, 'archived' => $state === 2, 'trashed' => $state === -2, 'all' => true, default => in_array($state, [0, 1], true) }; }
    protected function hasMatchingDescendant(CategoryNode $category, string $filter): bool
    {
        foreach ($category->getChildren(true) as $child) if ($this->canViewCategory($child) && $this->matchesState((int) $child->published, $filter)) return true;
        return false;
    }
}
