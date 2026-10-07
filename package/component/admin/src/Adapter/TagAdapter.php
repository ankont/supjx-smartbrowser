<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter;

use Joomla\CMS\Language\Text;
use SuperSoft\Component\Smartbrowser\Administrator\Support\BatchRunner;
use SuperSoft\Component\Smartbrowser\Administrator\Support\OrderingService;

defined('_JEXEC') or die;

final class TagAdapter extends ContentAdapter implements ContextResourceProviderInterface
{
    protected const ROOT_ID = 'tags:root';

    public function getId(): string
    {
        return 'tags';
    }

    public function getRoots(): array
    {
        return [$this->tagRootResource()];
    }

    public function getResources(string $nodeId, array $options = []): array
    {
        $tagId = $this->tagId($nodeId);
        $tags = $this->tagTree();
        $nodes = $this->getTagChildren($nodeId, $options);

        return [
            'nodeId' => $nodeId,
            'nodes' => $nodes,
            'items' => [],
            'breadcrumb' => $this->getBreadcrumb($nodeId),
            'actions' => $this->getActions([]),
            'presentation' => $this->presentation(),
            'currentResource' => !$tagId ? $this->getRoots()[0] : $this->normalizeTag($this->getTag($tagId), $tags),
        ];
    }

    public function getContextResources(string $nodeId, array $options = []): array
    {
        if (empty($options['showContextResources'])) {
            return [];
        }

        $tagId = $this->tagId($nodeId);
        if (!$tagId) {
            return [];
        }

        return $this->contextualArticles($this->getArticlesByTag($tagId, [
            'stateFilter' => 'active',
            'sortBy' => 'title',
            'sortDirection' => 'asc',
            'filters' => [],
        ]));
    }

    public function getResource(string $resourceId, array $options = []): array
    {
        if (str_starts_with($resourceId, 'tag:')) {
            $this->assertBrowseScope([$resourceId]);
            return $this->normalizeTag($this->getTag((int) substr($resourceId, 4)), $this->tagTree());
        }

        return parent::getResource($resourceId, $options);
    }

    public function getBreadcrumb(string $nodeId): array
    {
        return $this->getTagBreadcrumb($nodeId);
    }

    public function getActions(array $selection = []): array
    {
        return array_values(array_filter([
            [...$this->action('createChild', 'COM_SMARTBROWSER_CREATE_CHILD_TAG', 'fas fa-plus', 'node', true, false, false, false, true), 'creationRole' => 'item'],
            $this->canCreateArticle() ? [...$this->action('newArticle', 'COM_SMARTBROWSER_NEW_ARTICLE', 'fas fa-file-alt', 'node', false, false, false, false, true), 'creationRole' => 'contextual'] : null,
            $this->action('edit', 'JACTION_EDIT', 'fas fa-edit', 'resource', false, true, true),
            $this->action('preview', 'COM_SMARTBROWSER_ACTION_PREVIEW', 'fas fa-eye', 'resource', false, true, true),
            $this->action('publish', 'JTOOLBAR_PUBLISH', 'fas fa-check', 'node', false, true, false, false, false, 'publication'),
            $this->action('unpublish', 'COM_SMARTBROWSER_ACTION_UNPUBLISH', 'fas fa-times', 'node', false, true, false, false, false, 'publication'),
            $this->action('archive', 'COM_SMARTBROWSER_ACTION_ARCHIVE', 'fas fa-archive', 'node', false, true, false, false, false, 'archiveState'),
            $this->action('unarchive', 'COM_SMARTBROWSER_ACTION_UNARCHIVE', 'fas fa-archive', 'node', false, true, false, false, false, 'archiveState'),
            $this->action('trash', 'COM_SMARTBROWSER_ACTION_TRASH', 'fas fa-trash', 'node', false, true),
        ]));
    }

    public function executeAction(string $action, array $selection, array $payload = []): mixed
    {
        if ($action === 'reorder') return (new OrderingService($this->app))->move($this, $selection, (string) ($payload['direction'] ?? ''), ['tag']);
        if ($action === 'batch') return (new BatchRunner($this->app))->run($this, 'tags', $selection, $payload);
        if ($action === 'newArticle') {
            $this->assertBrowseScope([(string) ($payload['nodeId'] ?? '')]);
            $tagId = $this->tagId((string) ($payload['nodeId'] ?? ''));
            if (!$tagId || !$this->canCreateArticle()) throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
            $this->getTag($tagId);
            return $this->editorResponse('index.php?option=com_content&task=article.add&sbTagId=' . $tagId);
        }
        if ($action === 'createChild') {
            $this->assertBrowseScope([(string) ($payload['nodeId'] ?? '')]);
            $tagId = $this->tagId((string) ($payload['nodeId'] ?? ''));
            if (empty($this->tagCapabilities($tagId ?: null)['createChild'])) {
                throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
            }
            return $this->editorResponse('index.php?option=com_tags&task=tag.add&parent_id=' . ($tagId ?: $this->tagRootId()));
        }

        if (!in_array($action, ['edit', 'preview', 'publish', 'unpublish', 'archive', 'unarchive', 'trash'], true)) {
            throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_UNKNOWN_ACTION'), 400);
        }
        $this->assertBrowseScope($selection);

        if ($action === 'preview') return $this->contentPreview($this->requireOne($selection));

        if ($action === 'edit') {
            $resourceId = $this->requireOne($selection);
            $resource = $this->getResource($resourceId);
            if (empty($resource['capabilities']['edit'])) {
                throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
            }
            return str_starts_with($resourceId, 'tag:')
                ? $this->editorResponse('index.php?option=com_tags&task=tag.edit&id=' . (int) substr($resourceId, 4))
                : $this->edit($resourceId);
        }

        $ids = [];
        foreach ($selection as $resourceId) {
            if (!str_starts_with((string) $resourceId, 'tag:')) {
                throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
            }
            $resource = $this->getResource((string) $resourceId);
            if (empty($resource['capabilities'][$action])) {
                throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
            }
            $ids[] = (int) substr((string) $resourceId, 4);
        }
        if ($ids === []) {
            throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        }

        $this->assertModelResult($this->tagModel(), 'publish', [$ids, match ($action) {
            'publish' => 1, 'unpublish' => 0, 'archive' => 2, 'unarchive' => 0, 'trash' => -2,
        }]);

        return ['updated' => array_values($selection)];
    }

    protected function browseRootKind(): string
    {
        return 'tag';
    }

    private function presentation(): array
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
            'infoFields' => [
                ['label' => 'COM_SMARTBROWSER_ALIAS_LABEL', 'source' => 'metadata.alias'],
                ['label' => 'COM_SMARTBROWSER_LANGUAGE_KEY', 'source' => 'metadata.languageKey'],
                ['label' => 'JSTATUS', 'source' => 'metadata.stateLabel'],
                ['label' => 'COM_SMARTBROWSER_DATE_CREATED', 'source' => 'metadata.created', 'format' => 'date'],
                ['label' => 'COM_SMARTBROWSER_DATE_MODIFIED', 'source' => 'metadata.modified', 'format' => 'date'],
                ['label' => 'JFIELD_LANGUAGE_LABEL', 'source' => 'metadata.language'],
                ['label' => 'JGLOBAL_FIELD_ID_LABEL', 'source' => 'metadata.id'],
            ],
            'filters' => [[
                'id' => 'state', 'label' => 'COM_SMARTBROWSER_FILTER_STATE', 'type' => 'select', 'default' => 'active',
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
            ]],
        ];
    }

    public function getCollectionPresentation(array $resources = []): array { return $this->presentation(); }
}
