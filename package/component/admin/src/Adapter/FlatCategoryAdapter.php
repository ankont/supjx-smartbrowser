<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter;

use Joomla\CMS\Language\Text;

defined('_JEXEC') or die;

final class FlatCategoryAdapter extends CategoryAdapter
{
    protected const ROOT_ID = 'flat-categories:root';

    public function getId(): string
    {
        return 'flat-categories';
    }

    public function getRoots(): array
    {
        $categoryId = $this->browseRoot ? $this->browseRootNumericId() : null;
        return [[
            'id' => static::ROOT_ID,
            'title' => $categoryId ? $this->title($this->getCategory($categoryId)->title) : Text::_('COM_SMARTBROWSER_ALL_CATEGORIES'),
            'type' => 'root', 'kind' => 'node', 'icon' => 'icon-folder',
            'visible' => false, 'selectable' => false, 'navigable' => true, 'hasChildren' => false,
            'capabilities' => $this->categoryCapabilities($categoryId), 'metadata' => [],
        ]];
    }

    public function getResources(string $nodeId, array $options = []): array
    {
        if ($nodeId !== static::ROOT_ID) {
            throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        }

        $scope = $this->browseRoot ? $this->getCategory($this->browseRootNumericId()) : $this->categoryRoot();
        $selectedCategory = (int) ($options['filters']['category'] ?? 0);
        $inScope = $selectedCategory < 1 || !$this->browseRoot || $this->categoryWithinBrowseRoot($selectedCategory);
        $root = $inScope && $selectedCategory > 0 ? $this->getCategory($selectedCategory) : $scope;
        $matchingIds = $this->matchingCategoryIds($options);
        $maxLevels = FlatLevels::limit($options);
        $nodes = [];
        $categories = $root->getChildren(true);
        if ($selectedCategory > 0 && $inScope) array_unshift($categories, $root);
        $firstLevel = (int) $root->id > 1 ? 1 : 0;
        foreach ($categories as $category) {
            if ($maxLevels && (int) $category->level - (int) $root->level + $firstLevel > $maxLevels) continue;
            if (!$this->canViewCategory($category) || !$this->categoryMatches($category, $matchingIds)) continue;
            $resource = $this->normalizeCategory($category);
            $parentId = (int) $category->parent_id;
            $parentPath = $this->categoryPathTitles($parentId);
            $resource['metadata']['location'] = end($parentPath);
            $resource['metadata']['locationPath'] = implode(' / ', $parentPath);
            $resource['navigable'] = false;
            $nodes[] = $resource;
        }

        $presentation = $this->presentation();
        $presentation['filters'][] = [
            'id' => 'category', 'label' => 'COM_SMARTBROWSER_CATEGORY', 'type' => 'select', 'default' => '', 'options' => $this->categoryOptions(),
        ];
        $presentation['filters'][] = FlatLevels::filter();
        array_splice($presentation['columns'], 1, 0, [[
            'id' => 'location', 'label' => 'COM_SMARTBROWSER_LOCATION', 'source' => 'metadata.location',
            'headerIcon' => 'icon-folder-open',
        ]]);
        array_splice($presentation['sortFields'], 1, 0, [[
            'id' => 'location', 'label' => 'COM_SMARTBROWSER_LOCATION',
        ]]);

        return [
            'nodeId' => $nodeId, 'nodes' => $nodes, 'items' => [],
            'breadcrumb' => $this->getBreadcrumb($nodeId),
            'actions' => $this->getActions([]), 'presentation' => $presentation,
            'currentResource' => $this->getRoots()[0],
        ];
    }

    public function getBreadcrumb(string $nodeId): array
    {
        return [[
            'id' => static::ROOT_ID, 'title' => $this->getRoots()[0]['title'],
            'icon' => 'icon-folder', 'visible' => true,
        ]];
    }

    public function executeAction(string $action, array $selection, array $payload = []): mixed
    {
        if ($action === 'createChild' && ($payload['nodeId'] ?? '') === static::ROOT_ID && $this->browseRoot) {
            $categoryId = $this->browseRootNumericId();
            if (empty($this->categoryCapabilities($categoryId)['createChild'])) {
                throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
            }
            return $this->editorResponse('index.php?option=com_categories&task=category.add&extension=com_content&parent_id=' . $categoryId);
        }
        return parent::executeAction($action, $selection, $payload);
    }

    protected function hasVisibleBrowseHierarchy(): bool
    {
        return false;
    }
}
