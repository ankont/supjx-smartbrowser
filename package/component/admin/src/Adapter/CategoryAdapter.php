<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter;

use Joomla\CMS\Language\Text;
use SuperSoft\Component\Smartbrowser\Administrator\Support\BatchRunner;
use SuperSoft\Component\Smartbrowser\Administrator\Support\OrderingService;

defined('_JEXEC') or die;

class CategoryAdapter extends ContentAdapter implements ContextResourceProviderInterface
{
    public function getId(): string
    {
        return 'categories';
    }

    public function getResources(string $nodeId, array $options = []): array
    {
        $categoryId = $this->categoryId($nodeId);
        $category = $categoryId ? $this->getCategory($categoryId) : $this->categoryRoot();
        $matchingIds = $this->matchingCategoryIds($options);
        $nodes = [];

        foreach ($category->getChildren(false) as $child) {
            if ($this->canViewCategory($child) && ($this->categoryMatches($child, $matchingIds) || $this->hasMatchingCategoryDescendant($child, $matchingIds))) {
                $nodes[] = $this->normalizeCategory($child);
            }
        }

        return [
            'nodeId' => $nodeId,
            'nodes' => $nodes,
            'items' => [],
            'breadcrumb' => $this->getBreadcrumb($nodeId),
            'actions' => $this->getActions([]),
            'presentation' => $this->presentation(),
            'currentResource' => $categoryId ? $this->normalizeCategory($category) : $this->getRoots()[0],
        ];
    }

    public function getContextResources(string $nodeId, array $options = []): array
    {
        if (empty($options['showContextResources'])) {
            return [];
        }

        $categoryId = $this->categoryId($nodeId);
        if (!$categoryId) {
            return [];
        }

        return $this->contextualArticles($this->getArticles($categoryId, [
            'stateFilter' => 'active',
            'sortBy' => 'ordering',
            'sortDirection' => 'asc',
            'filters' => [],
        ]));
    }

    public function getActions(array $selection = []): array
    {
        return array_values(array_filter([
            [...$this->action('createChild', 'COM_SMARTBROWSER_CREATE_CHILD_CATEGORY', 'fas fa-plus', 'node', true, false, false, false, true), 'creationRole' => 'item'],
            $this->canCreateArticle() ? [...$this->action('newArticle', 'COM_SMARTBROWSER_NEW_ARTICLE', 'fas fa-newspaper', 'node', false, false, false, false, true), 'creationRole' => 'contextual'] : null,
            $this->action('edit', 'JACTION_EDIT', 'fas fa-edit', 'resource', false, true, true, false, false),
            $this->action('publish', 'JTOOLBAR_PUBLISH', 'fas fa-check', 'node', false, true, false, false, false, 'publication'),
            $this->action('unpublish', 'COM_SMARTBROWSER_ACTION_UNPUBLISH', 'fas fa-times', 'node', false, true, false, false, false, 'publication'),
            $this->action('archive', 'COM_SMARTBROWSER_ACTION_ARCHIVE', 'fas fa-archive', 'node', false, true, false, false, false, 'archiveState'),
            $this->action('unarchive', 'COM_SMARTBROWSER_ACTION_UNARCHIVE', 'fas fa-archive', 'node', false, true, false, false, false, 'archiveState'),
            $this->action('trash', 'COM_SMARTBROWSER_ACTION_TRASH', 'fas fa-trash', 'node', false, true, false, false, false, 'trashState'),
            $this->action('restore', 'COM_SMARTBROWSER_ACTION_RESTORE', 'fas fa-undo', 'node', false, true, false, false, false, 'trashState'),
            [...$this->action('delete', 'JACTION_DELETE', 'fas fa-trash-alt', 'node', false, true), 'trashedOnly' => true],
        ]));
    }

    public function executeAction(string $action, array $selection, array $payload = []): mixed
    {
        if ($action === 'reorder') return (new OrderingService($this->app))->move($this, $selection, (string) ($payload['direction'] ?? ''), ['category']);
        if ($action === 'batch') return (new BatchRunner($this->app))->run($this, 'categories', $selection, $payload);
        if ($action === 'newArticle') {
            $categoryId = $this->categoryId((string) ($payload['nodeId'] ?? ''));
            if (empty($this->categoryCapabilities($categoryId ?: null)['newArticle'])) {
                throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
            }
            return $this->editorResponse('index.php?option=com_content&task=article.add&catid=' . $categoryId);
        }
        if ($action === 'createChild') {
            $categoryId = $this->categoryId((string) ($payload['nodeId'] ?? ''));
            if (empty($this->categoryCapabilities($categoryId ?: null)['createChild'])) {
                throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
            }
            return $this->editorResponse('index.php?option=com_categories&task=category.add&extension=com_content&parent_id=' . max(1, $categoryId));
        }

        if (!in_array($action, ['edit', 'publish', 'unpublish', 'archive', 'unarchive', 'trash', 'restore', 'delete'], true)) {
            throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_UNKNOWN_ACTION'), 400);
        }

        if ($action === 'edit') {
            $resource = $this->getResource($this->requireOne($selection));
            if (empty($resource['capabilities']['edit'])) {
                throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
            }
            return $this->edit((string) reset($selection));
        }

        $this->assertCategoryAction($selection, $action);

        return match ($action) {
            'publish' => $this->setState($selection, 1),
            'unpublish' => $this->setState($selection, 0),
            'archive' => $this->setState($selection, 2),
            'unarchive' => $this->setState($selection, 0),
            'trash' => $this->setState($selection, -2),
            'restore' => $this->setState($selection, 0),
            'delete' => $this->deleteTrashed($selection),
        };
    }

    private function assertCategoryAction(array $selection, string $action): void
    {
        if ($selection === []) {
            throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        }

        foreach ($selection as $resourceId) {
            if (!str_starts_with((string) $resourceId, 'category:')) {
                throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
            }
            $resource = $this->getResource((string) $resourceId);
            if (empty($resource['capabilities'][$action])) {
                throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
            }
        }
    }

    protected function matchingCategoryIds(array $options): array
    {
        $filters = $options['filters'] ?? [];
        $model = $this->app->bootComponent('com_categories')->getMVCFactory()->createModel('Categories', 'Administrator', ['ignore_request' => true]);
        $model->setState('filter.extension', 'com_content');
        $model->setState('filter.published', match ((string) ($filters['state'] ?? 'active')) {
            'published' => 1, 'unpublished' => 0, 'archived' => 2, 'trashed' => -2, 'all' => '*', default => '',
        });
        $model->setState('filter.access', (int) ($filters['access'] ?? 0));
        $model->setState('filter.language', (string) ($filters['language'] ?? ''));
        $model->setState('filter.tag', (string) ($filters['tag'] ?? ''));
        $categoryId = (int) ($filters['category'] ?? 0);
        if ($categoryId > 0) {
            $root = $this->browseRoot ? $this->getCategory($this->browseRootNumericId()) : $this->categoryRoot();
            $inScope = (int) $root->id === $categoryId;
            foreach ($root->getChildren(true) as $child) {
                if ((int) $child->id === $categoryId && $this->canViewCategory($child)) $inScope = true;
            }
            if (!$inScope) return [];
            $model->setState('filter.category_id', $categoryId);
        }
        $model->setState('list.limit', 0);
        return array_fill_keys(array_map(static fn ($item) => (int) $item->id, $model->getItems()), true);
    }

    protected function categoryMatches(object $category, array $matchingIds): bool
    {
        return isset($matchingIds[(int) $category->id]);
    }

    protected function hasMatchingCategoryDescendant(object $category, array $matchingIds): bool
    {
        foreach ($category->getChildren(true) as $child) {
            if ($this->canViewCategory($child) && $this->categoryMatches($child, $matchingIds)) return true;
        }
        return false;
    }

    protected function presentation(): array
    {
        return [
            'orderingField' => 'ordering',
            'sortFields' => [
                ['id' => 'title', 'label' => 'COM_SMARTBROWSER_NAME'],
                ['id' => 'alias', 'label' => 'COM_SMARTBROWSER_ALIAS_LABEL'],
                ['id' => 'state', 'label' => 'JSTATUS'],
                ['id' => 'created', 'label' => 'COM_SMARTBROWSER_DATE_CREATED'],
                ['id' => 'modified', 'label' => 'COM_SMARTBROWSER_DATE_MODIFIED'],
                ['id' => 'ordering', 'label' => 'JGRID_HEADING_ORDERING'],
                ['id' => 'language', 'label' => 'JFIELD_LANGUAGE_LABEL'],
                ['id' => 'id', 'label' => 'JGLOBAL_FIELD_ID_LABEL'],
            ],
            'columns' => [
                ['id' => 'title', 'label' => 'COM_SMARTBROWSER_NAME', 'source' => 'title'],
                ['id' => 'alias', 'label' => 'COM_SMARTBROWSER_ALIAS_LABEL', 'source' => 'metadata.alias'],
                ['id' => 'status', 'label' => 'JSTATUS', 'source' => 'metadata.stateLabel', 'format' => 'status', 'sortField' => 'state'],
                ['id' => 'dates', 'dateGroup' => true, 'fields' => [
                    ['id' => 'created', 'label' => 'COM_SMARTBROWSER_DATE_CREATED', 'source' => 'metadata.created', 'format' => 'date'],
                    ['id' => 'modified', 'label' => 'COM_SMARTBROWSER_DATE_MODIFIED', 'source' => 'metadata.modified', 'format' => 'date'],
                ]],
                ['id' => 'language', 'label' => 'JFIELD_LANGUAGE_LABEL', 'source' => 'metadata.language', 'format' => 'language', 'headerIcon' => 'fas fa-globe'],
                ['id' => 'id', 'label' => 'JGLOBAL_FIELD_ID_LABEL', 'source' => 'metadata.id'],
            ],
            'gridFields' => [['source' => 'metadata.cardSummary']],
            'batchOptions' => [
                'category' => array_merge([['value' => '1', 'label' => 'COM_SMARTBROWSER_CONTENT_ROOT']], $this->categoryOptions(true)),
                'tag' => $this->batchTagOptions(),
            ],
            'infoFields' => [
                ['label' => 'COM_SMARTBROWSER_ALIAS_LABEL', 'source' => 'metadata.alias'],
                ['label' => 'COM_SMARTBROWSER_LANGUAGE_KEY', 'source' => 'metadata.languageKey', 'kinds' => ['node']],
                ['label' => 'JSTATUS', 'source' => 'metadata.stateLabel'],
                ['label' => 'COM_SMARTBROWSER_DATE_CREATED', 'source' => 'metadata.created', 'format' => 'date'],
                ['label' => 'COM_SMARTBROWSER_DATE_MODIFIED', 'source' => 'metadata.modified', 'format' => 'date'],
                ['label' => 'JFIELD_LANGUAGE_LABEL', 'source' => 'metadata.language'],
                ['label' => 'JGLOBAL_FIELD_ID_LABEL', 'source' => 'metadata.id'],
            ],
            'filters' => [[
                'id' => 'state',
                'label' => 'COM_SMARTBROWSER_FILTER_STATE',
                'type' => 'select',
                'default' => 'active',
                'options' => [
                    ['value' => 'active', 'label' => 'COM_SMARTBROWSER_SELECT_STATUS'],
                    ['value' => 'published', 'label' => 'COM_SMARTBROWSER_FILTER_PUBLISHED'],
                    ['value' => 'unpublished', 'label' => 'COM_SMARTBROWSER_FILTER_UNPUBLISHED'],
                    ['value' => 'archived', 'label' => 'COM_SMARTBROWSER_FILTER_ARCHIVED'],
                    ['value' => 'trashed', 'label' => 'COM_SMARTBROWSER_FILTER_TRASHED'],
                    ['value' => 'all', 'label' => 'COM_SMARTBROWSER_FILTER_ALL'],
                ],
            ], [
                'id' => 'access', 'label' => 'JFIELD_ACCESS_LABEL', 'type' => 'select', 'default' => '', 'options' => $this->accessOptions(),
            ], [
                'id' => 'language', 'label' => 'JFIELD_LANGUAGE_LABEL', 'type' => 'select', 'default' => '', 'options' => $this->languageOptions(),
            ], [
                'id' => 'tag', 'label' => 'JTAG', 'type' => 'select', 'default' => '',
                'options' => $this->modelOptions('com_tags', 'Tags', 'id', 'title', 'COM_SMARTBROWSER_SELECT_TAG'),
            ]],
        ];
    }

    public function getCollectionPresentation(array $resources = []): array { return $this->presentation(); }
}
