<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter;

use Joomla\CMS\Language\Text;
use SuperSoft\Component\Smartbrowser\Administrator\Support\BatchRunner;
use SuperSoft\Component\Smartbrowser\Administrator\Support\OrderingService;

defined('_JEXEC') or die;

abstract class ArticleCollectionAdapter extends ContentAdapter
{
    protected function executeArticleBatch(array $selection, array $payload): array
    {
        return (new BatchRunner($this->app))->run($this, 'articles', $selection, $payload);
    }

    protected function articleActions(): array
    {
        return [
            $this->action('edit', 'JACTION_EDIT', 'fas fa-edit', 'resource', false, true, true),
            $this->action('preview', 'COM_SMARTBROWSER_ACTION_PREVIEW', 'fas fa-eye', 'item', false, true, true, true),
            $this->action('checkin', 'COM_SMARTBROWSER_ACTION_CHECKIN', 'fas fa-unlock', 'selection', false, true),
            $this->action('publish', 'JTOOLBAR_PUBLISH', 'fas fa-check', 'selection', false, true, false, false, false, 'publication'),
            $this->action('unpublish', 'COM_SMARTBROWSER_ACTION_UNPUBLISH', 'fas fa-times', 'selection', false, true, false, false, false, 'publication'),
            $this->action('archive', 'COM_SMARTBROWSER_ACTION_ARCHIVE', 'fas fa-archive', 'selection', false, true, false, false, false, 'archiveState'),
            $this->action('unarchive', 'COM_SMARTBROWSER_ACTION_UNARCHIVE', 'fas fa-archive', 'selection', false, true, false, false, false, 'archiveState'),
            $this->action('feature', 'JFEATURE', 'fas fa-star', 'item', false, true, false, true, false, 'featured'),
            $this->action('unfeature', 'JUNFEATURE', 'far fa-star', 'item', false, true, false, true, false, 'featured'),
            $this->action('trash', 'COM_SMARTBROWSER_ACTION_TRASH', 'fas fa-trash', 'selection', false, true, false, false, false, 'trashState'),
            $this->action('restore', 'COM_SMARTBROWSER_ACTION_RESTORE', 'fas fa-undo', 'selection', false, true, false, false, false, 'trashState'),
            [...$this->action('delete', 'JACTION_DELETE', 'fas fa-trash-alt', 'selection', false, true), 'trashedOnly' => true],
        ];
    }

    protected function executeArticleAction(string $action, array $selection, bool $articlesOnly = false, array $payload = []): mixed
    {
        if ($action === 'reorder') return (new OrderingService($this->app))->move($this, $selection, (string) ($payload['direction'] ?? ''), $articlesOnly ? ['article'] : ['article', 'category']);
        if ($articlesOnly) {
            if ($selection === []) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
            foreach ($selection as $id) {
                if (!str_starts_with((string) $id, 'article:')) {
                    throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
                }
            }
        }
        if ($action === 'edit' && empty($this->getResource($this->requireOne($selection))['capabilities']['edit'])) {
            throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
        }

        return match ($action) {
            'edit' => $this->edit($this->requireOne($selection)),
            'preview' => $this->contentPreview($this->requireOne($selection)),
            'checkin' => $this->checkinArticles($selection),
            'publish' => $this->setState($selection, 1),
            'unpublish' => $this->setState($selection, 0),
            'archive' => $this->setState($selection, 2),
            'unarchive' => $this->setState($selection, 0),
            'restore' => $this->setState($selection, 0),
            'trash' => $this->setState($selection, -2),
            'delete' => $this->deleteTrashed($selection),
            'feature' => $this->setFeatured($selection, 1),
            'unfeature' => $this->setFeatured($selection, 0),
            default => throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_UNKNOWN_ACTION'), 400),
        };
    }

    protected function articlePresentation(bool $showCategoryColumn = false, bool $showCategoryGrid = true, bool $includeOrdering = true, bool $includeTagFilter = true): array
    {
        $sortFields = [
            ['id' => 'title', 'label' => 'COM_SMARTBROWSER_NAME'], ['id' => 'alias', 'label' => 'COM_SMARTBROWSER_ALIAS_LABEL'],
            ['id' => 'state', 'label' => 'JSTATUS'], ['id' => 'author', 'label' => 'JAUTHOR'],
            ['id' => 'created', 'label' => 'COM_SMARTBROWSER_DATE_CREATED'], ['id' => 'modified', 'label' => 'COM_SMARTBROWSER_DATE_MODIFIED'],
            ['id' => 'language', 'label' => 'JFIELD_LANGUAGE_LABEL'], ['id' => 'id', 'label' => 'JGLOBAL_FIELD_ID_LABEL'],
        ];
        if ($includeOrdering) array_splice($sortFields, 6, 0, [[
            'id' => 'ordering', 'label' => 'JGRID_HEADING_ORDERING',
        ]]);

        $columns = [
            ['id' => 'title', 'label' => 'COM_SMARTBROWSER_NAME', 'source' => 'title'],
            ['id' => 'alias', 'label' => 'COM_SMARTBROWSER_ALIAS_LABEL', 'source' => 'metadata.alias'],
        ];
        if ($showCategoryColumn) $columns[] = ['id' => 'category', 'label' => 'COM_SMARTBROWSER_CATEGORY', 'source' => 'metadata.category'];
        array_push($columns,
            ['id' => 'status', 'label' => 'JSTATUS', 'source' => 'metadata.stateLabel', 'format' => 'status', 'overlays' => true, 'sortField' => 'state'],
            ['id' => 'author', 'label' => 'JAUTHOR', 'source' => 'metadata.author'],
            ['id' => 'dates', 'dateGroup' => true, 'fields' => [
                ['id' => 'created', 'label' => 'COM_SMARTBROWSER_DATE_CREATED', 'source' => 'metadata.created', 'format' => 'date'],
                ['id' => 'modified', 'label' => 'COM_SMARTBROWSER_DATE_MODIFIED', 'source' => 'metadata.modified', 'format' => 'date'],
            ]],
            ['id' => 'language', 'label' => 'JFIELD_LANGUAGE_LABEL', 'source' => 'metadata.language', 'format' => 'language', 'headerIcon' => 'fas fa-globe'],
            ['id' => 'id', 'label' => 'JGLOBAL_FIELD_ID_LABEL', 'source' => 'metadata.id'],
        );

        $infoFields = [
            ['label' => 'COM_SMARTBROWSER_ALIAS_LABEL', 'source' => 'metadata.alias'],
        ];
        if ($showCategoryColumn) $infoFields[] = ['label' => 'JCATEGORY', 'source' => 'metadata.category', 'kinds' => ['item']];
        array_push($infoFields,
            ['label' => 'COM_SMARTBROWSER_LANGUAGE_KEY', 'source' => 'metadata.languageKey'],
            ['label' => 'JSTATUS', 'source' => 'metadata.stateLabel'],
            ['label' => 'JAUTHOR', 'source' => 'metadata.author', 'kinds' => ['item']],
            ['label' => 'COM_SMARTBROWSER_DATE_CREATED', 'source' => 'metadata.created', 'format' => 'date'],
            ['label' => 'COM_SMARTBROWSER_DATE_MODIFIED', 'source' => 'metadata.modified', 'format' => 'date'],
            ['label' => 'JFIELD_LANGUAGE_LABEL', 'source' => 'metadata.language', 'format' => 'language'],
            ['label' => 'JGLOBAL_FIELD_ID_LABEL', 'source' => 'metadata.id'],
        );

        return [
            'orderingField' => $includeOrdering ? 'ordering' : null,
            'sortFields' => $sortFields,
            'columns' => $columns,
            'gridFields' => [['source' => $showCategoryGrid ? 'metadata.cardSummaryWithCategory' : 'metadata.cardSummary']],
            'infoFields' => $infoFields,
            'filters' => $this->articleFilters($includeTagFilter, $showCategoryColumn),
            'batchOptions' => [
                'category' => $this->categoryOptions(true),
                'tag' => $this->batchTagOptions(),
            ],
        ];
    }

    private function articleFilters(bool $includeTagFilter, bool $includeCategoryFilter): array
    {
        $filters = [[
            'id' => 'state', 'label' => 'COM_SMARTBROWSER_FILTER_STATE', 'type' => 'select', 'default' => 'active',
            'options' => [
                ['value' => 'active', 'label' => 'COM_SMARTBROWSER_SELECT_STATUS'], ['value' => 'published', 'label' => 'COM_SMARTBROWSER_FILTER_PUBLISHED'],
                ['value' => 'unpublished', 'label' => 'COM_SMARTBROWSER_FILTER_UNPUBLISHED'], ['value' => 'archived', 'label' => 'COM_SMARTBROWSER_FILTER_ARCHIVED'],
                ['value' => 'trashed', 'label' => 'COM_SMARTBROWSER_FILTER_TRASHED'], ['value' => 'all', 'label' => 'COM_SMARTBROWSER_FILTER_ALL'],
            ],
        ], [
            'id' => 'featured', 'label' => 'JFEATURED', 'type' => 'select', 'default' => '',
            'options' => [['value' => '', 'label' => 'COM_SMARTBROWSER_SELECT_FEATURED'], ['value' => '1', 'label' => 'COM_SMARTBROWSER_FILTER_FEATURED'], ['value' => '0', 'label' => 'COM_SMARTBROWSER_FILTER_UNFEATURED']],
        ], [
            'id' => 'access', 'label' => 'JFIELD_ACCESS_LABEL', 'type' => 'select', 'default' => '', 'options' => $this->accessOptions(),
        ], [
            'id' => 'language', 'label' => 'JFIELD_LANGUAGE_LABEL', 'type' => 'select', 'default' => '', 'options' => $this->languageOptions(),
        ], [
            'id' => 'author', 'label' => 'JAUTHOR', 'type' => 'select', 'default' => '', 'options' => $this->modelOptions('com_users', 'Users', 'id', 'name', 'COM_SMARTBROWSER_SELECT_AUTHOR'),
        ], [
            'id' => 'checkedOut', 'label' => 'COM_SMARTBROWSER_CHECKOUT', 'type' => 'select', 'default' => '',
            'options' => [['value' => '', 'label' => 'COM_SMARTBROWSER_SELECT_CHECKOUT'], ['value' => '-1', 'label' => 'COM_SMARTBROWSER_FILTER_CHECKED_OUT'], ['value' => '0', 'label' => 'COM_SMARTBROWSER_FILTER_NOT_CHECKED_OUT']],
        ]];
        if ($includeCategoryFilter) array_splice($filters, 2, 0, [[
            'id' => 'category', 'label' => 'COM_SMARTBROWSER_CATEGORY', 'type' => 'select', 'default' => '', 'options' => $this->categoryOptions(),
        ]]);
        if ($includeTagFilter) array_splice($filters, -1, 0, [[
            'id' => 'tag', 'label' => 'JTAG', 'type' => 'select', 'default' => '', 'options' => $this->modelOptions('com_tags', 'Tags', 'id', 'title', 'COM_SMARTBROWSER_SELECT_TAG'),
        ]]);

        return $filters;
    }
}
