<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter;

use Joomla\CMS\Language\Text;

defined('_JEXEC') or die;

final class FlatArticleAdapter extends ArticleCollectionAdapter
{
    protected const ROOT_ID = 'flat-articles:root';

    public function getId(): string
    {
        return 'flat-articles';
    }

    public function getRoots(): array
    {
        $categoryId = $this->browseRoot ? $this->browseRootNumericId() : null;
        $canCreate = $categoryId
            ? $this->categoryCapabilities($categoryId)['newArticle']
            : $this->app->getIdentity()->authorise('core.create', 'com_content');
        return [[
            'id' => static::ROOT_ID, 'title' => $categoryId ? $this->title($this->getCategory($categoryId)->title) : Text::_('COM_SMARTBROWSER_ALL_ARTICLES'),
            'type' => 'root', 'kind' => 'node', 'icon' => 'icon-file-alt',
            'visible' => false, 'selectable' => false, 'navigable' => true, 'hasChildren' => false,
            'capabilities' => ['newArticle' => $canCreate], 'metadata' => [],
        ]];
    }

    public function getResources(string $nodeId, array $options = []): array
    {
        if ($nodeId !== static::ROOT_ID) {
            throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        }
        $stateFilter = (string) ($options['filters']['state'] ?? 'active');
        $maxLevels = FlatLevels::limit($options);
        $selectedCategory = (int) ($options['filters']['category'] ?? 0);
        $categoryIds = null;
        if ($maxLevels || $selectedCategory > 0) {
            $scope = $this->browseRoot ? $this->getCategory($this->browseRootNumericId()) : $this->categoryRoot();
            if ($selectedCategory > 0 && $this->browseRoot && !$this->categoryWithinBrowseRoot($selectedCategory)) {
                $categoryIds = [];
            } else {
                $root = $selectedCategory > 0 ? $this->getCategory($selectedCategory) : $scope;
                $rootLevel = (int) $root->level;
                $firstLevel = (int) $root->id > 1 ? 1 : 0;
                $categoryIds = [(int) $root->id];
                foreach ($root->getChildren(true) as $category) {
                    if ($this->canViewCategory($category) && (!$maxLevels || (int) $category->level - $rootLevel + $firstLevel <= $maxLevels)) {
                        $categoryIds[] = (int) $category->id;
                    }
                }
            }
        }
        $presentation = $this->articlePresentation(true, true, false);
        $presentation['filters'] = array_values(array_filter($presentation['filters'], static fn (array $filter): bool => $filter['id'] !== 'category'));
        $presentation['filters'][] = [
            'id' => 'category', 'label' => 'COM_SMARTBROWSER_CATEGORY', 'type' => 'select', 'default' => '', 'options' => $this->categoryOptions(),
        ];
        $presentation['filters'][] = FlatLevels::filter();

        $presentation['columns'] = array_values(array_filter($presentation['columns'], static fn (array $column): bool => $column['id'] !== 'category'));
        array_splice($presentation['columns'], 1, 0, [[
            'id' => 'location', 'label' => 'COM_SMARTBROWSER_LOCATION', 'source' => 'metadata.location', 'headerIcon' => 'icon-folder-open',
        ]]);
        $presentation['sortFields'][] = ['id' => 'location', 'label' => 'COM_SMARTBROWSER_LOCATION'];
        $presentation['infoFields'] = array_values(array_filter($presentation['infoFields'], static fn (array $field): bool => $field['source'] !== 'metadata.category'));
        $items = $categoryIds === [] ? [] : ($categoryIds === null
            ? $this->getAllArticles($options + ['stateFilter' => $stateFilter])
            : $this->resolveArticles($options + ['stateFilter' => $stateFilter], $categoryIds));
        foreach ($items as &$item) {
            $categoryId = (int) substr((string) $item['parentId'], 9);
            $path = $this->categoryPathTitles($categoryId);
            $item['metadata']['location'] = end($path);
            $item['metadata']['locationPath'] = implode(' / ', $path);
        }
        unset($item);

        return [
            'nodeId' => $nodeId,
            'nodes' => [],
            'items' => $items,
            'breadcrumb' => $this->getBreadcrumb($nodeId),
            'actions' => $this->getActions([]),
            'presentation' => $presentation,
            'currentResource' => $this->getRoots()[0],
        ];
    }

    public function getBreadcrumb(string $nodeId): array
    {
        return [[
            'id' => static::ROOT_ID,
            'title' => $this->getRoots()[0]['title'],
            'icon' => $this->browseRoot ? 'icon-folder' : 'icon-file-alt',
            'visible' => true,
        ]];
    }

    public function getActions(array $selection = []): array
    {
        return array_values(array_filter([
            $this->getRoots()[0]['capabilities']['newArticle']
                ? $this->action('newArticle', 'COM_SMARTBROWSER_NEW_ARTICLE', 'icon-file-add', 'node', true, false, false, false, true)
                : null,
            ...$this->articleActions(),
        ]));
    }

    public function executeAction(string $action, array $selection, array $payload = []): mixed
    {
        if ($action === 'batch') return $this->executeArticleBatch($selection, $payload);
        if ($action === 'newArticle') {
            if (!$this->getRoots()[0]['capabilities']['newArticle']) {
                throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
            }
            return $this->editorResponse('index.php?option=com_content&task=article.add'
                . ($this->browseRoot ? '&catid=' . $this->browseRootNumericId() : ''));
        }
        return $this->executeArticleAction($action, $selection, true);
    }

    protected function hasVisibleBrowseHierarchy(): bool
    {
        return false;
    }
}
