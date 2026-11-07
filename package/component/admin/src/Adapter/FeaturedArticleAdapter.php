<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter;

use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\Database\DatabaseInterface;
use SuperSoft\Component\Smartbrowser\Administrator\Support\FeaturedOrderingService;

defined('_JEXEC') or die;

final class FeaturedArticleAdapter extends FlatArticleAdapter
{
    protected const ROOT_ID = 'featured-articles:root';

    public function getId(): string
    {
        return 'featured-articles';
    }

    public function getRoots(): array
    {
        $roots = parent::getRoots();
        if (!$this->browseRoot) $roots[0]['title'] = Text::_('COM_SMARTBROWSER_ADAPTER_FEATURED_ARTICLES');
        $roots[0]['icon'] = 'fas fa-star';
        $roots[0]['hasChildren'] = true;
        return $roots;
    }

    public function getResources(string $nodeId, array $options = []): array
    {
        $options['filters']['featured'] = '1';
        $options['sortBy'] = ($options['sortBy'] ?? '') === 'ordering' ? '' : ($options['sortBy'] ?? '');
        $result = parent::getResources($nodeId, $options);
        $category = $nodeId === static::ROOT_ID
            ? ($this->browseRoot ? $this->getCategory($this->browseRootNumericId()) : $this->categoryRoot())
            : $this->getCategory($this->categoryId($nodeId));
        $result['nodes'] = [];
        foreach ($category->getChildren(false) as $child) {
            if ($this->canViewCategory($child)) $result['nodes'][] = $this->normalizeCategory($child);
        }
        // Categories navigate the filter tree; the results and bulk actions remain article-only.
        $result['presentation']['navigationOnlyNodes'] = true;
        $result['presentation']['filters'] = array_values(array_filter(
            $result['presentation']['filters'],
            static fn (array $filter): bool => $filter['id'] !== 'featured'
        ));
        $result['presentation']['orderingField'] = 'ordering';
        array_unshift($result['presentation']['sortFields'], ['id' => 'ordering', 'label' => 'JGRID_HEADING_ORDERING']);

        $ids = array_map(static fn (array $item): int => (int) $item['metadata']['id'], $result['items']);
        if ($ids !== []) {
            $db = Factory::getContainer()->get(DatabaseInterface::class);
            $query = $db->getQuery(true)->select([$db->quoteName('content_id'), $db->quoteName('ordering')])
                ->from($db->quoteName('#__content_frontpage'))->whereIn($db->quoteName('content_id'), $ids);
            $orders = $db->setQuery($query)->loadAssocList('content_id');
            foreach ($result['items'] as &$item) {
                $item['metadata']['ordering'] = (int) ($orders[$item['metadata']['id']]['ordering'] ?? 0);
            }
            unset($item);
        }

        return $result;
    }

    public function getBreadcrumb(string $nodeId): array
    {
        $breadcrumb = parent::getBreadcrumb(static::ROOT_ID);
        $breadcrumb[0]['icon'] = 'fas fa-star';
        if ($nodeId === static::ROOT_ID) return $breadcrumb;
        $this->assertBrowseScope([$nodeId]);
        foreach (array_keys($this->getCategory($this->categoryId($nodeId))->getPath()) as $id) {
            if ((int) $id <= 1 || $this->browseRoot && !$this->categoryWithinBrowseRoot((int) $id)) continue;
            $category = $this->getCategory((int) $id);
            $breadcrumb[] = ['id' => 'category:' . $id, 'title' => $this->title($category->title), 'kind' => 'node', 'type' => 'category', 'icon' => 'fas fa-box', 'visible' => true];
        }
        return $breadcrumb;
    }

    public function getInitialNode(?string $candidate = null): string
    {
        if (!$candidate || $candidate === static::ROOT_ID) return static::ROOT_ID;
        try {
            $this->assertBrowseScope([$candidate]);
            $id = $this->categoryId($candidate);
            if ($id > 1) { $this->getCategory($id); return $candidate; }
        } catch (\Throwable) {}
        return static::ROOT_ID;
    }

    protected function articleCategoryScope(string $nodeId, array $options): ?array
    {
        if ($nodeId === static::ROOT_ID) return parent::articleCategoryScope($nodeId, $options);
        $this->assertBrowseScope([$nodeId]);
        $id = $this->categoryId($nodeId);
        if ($id <= 1) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        $root = $this->getCategory($id);
        $limit = FlatLevels::limit($options);
        $ids = [$id];
        foreach ($root->getChildren(true) as $child) {
            if ($this->canViewCategory($child) && (!$limit || (int) $child->level - (int) $root->level + 1 <= $limit)) $ids[] = (int) $child->id;
        }
        // Keep ordinary filters independent; intersect their scope with the selected subtree.
        $filterOptions = $options;
        $filterOptions['filters']['maxLevels'] = '';
        $filtered = parent::articleCategoryScope(static::ROOT_ID, $filterOptions);
        return $filtered === null ? $ids : array_values(array_intersect($ids, $filtered));
    }

    public function executeAction(string $action, array $selection, array $payload = []): mixed
    {
        if ($action === 'reorder') {
            return (new FeaturedOrderingService($this->app))->move($this, $selection, (string) ($payload['direction'] ?? ''));
        }
        return parent::executeAction($action, $selection, $payload);
    }
}
