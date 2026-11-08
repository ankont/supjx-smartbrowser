<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter;

use Joomla\CMS\Language\Text;

defined('_JEXEC') or die;

final class ArticleAdapter extends ArticleCollectionAdapter
{
    public function getId(): string { return 'articles'; }

    public function getResources(string $nodeId, array $options = []): array
    {
        $categoryId = $this->categoryId($nodeId);
        $category = $categoryId ? $this->getCategory($categoryId) : $this->categoryRoot();
        $stateFilter = (string) ($options['filters']['state'] ?? 'active');
        $unpagedOptions = $options;
        unset($unpagedOptions['pagination']);
        $articleCategories = $stateFilter === 'trashed'
            ? array_fill_keys(array_column($this->getAllArticles($unpagedOptions + ['stateFilter' => 'trashed', 'referencesOnly' => true]), 'parentId'), true) : [];
        $nodes = [];
        foreach ($category->getChildren(false) as $child) {
            $containsArticle = isset($articleCategories['category:' . (int) $child->id]);
            if ($articleCategories && !$containsArticle) {
                foreach ($child->getChildren(true) as $descendant) {
                    if (isset($articleCategories['category:' . (int) $descendant->id])) { $containsArticle = true; break; }
                }
            }
            if ($this->canViewCategory($child) && ($containsArticle || $this->matchesState((int) $child->published, $stateFilter) || $this->hasMatchingDescendant($child, $stateFilter))) {
                $nodes[] = $this->normalizeCategory($child);
            }
        }
        $navigationNodes = $nodes;
        $page = $options['pagination'] ?? null;
        if ($page) {
            $search = trim((string) ($options['search'] ?? ''));
            if ($search !== '') $nodes = array_values(array_filter($nodes, static fn (array $node): bool => mb_stripos(
                implode(' ', [$node['title'], $node['subtitle'] ?? '', $node['metadata']['alias'] ?? '']), $search, 0, 'UTF-8'
            ) !== false));
            // The API's fallback article order must not reorder category nodes.
            $field = ($options['explicitSort'] ?? true) ? ($options['sortBy'] ?? '') : '';
            if ($field !== '') usort($nodes, static function (array $a, array $b) use ($field, $options): int {
                $left = $a[$field] ?? $a['metadata'][$field] ?? '';
                $right = $b[$field] ?? $b['metadata'][$field] ?? '';
                $comparison = is_string($left) && is_string($right) ? strnatcasecmp($left, $right) : $left <=> $right;
                return (($options['sortDirection'] ?? 'asc') === 'desc' ? -$comparison : $comparison) ?: strcmp($a['id'], $b['id']);
            });
            $page->prefix = count($nodes);
            if (!$categoryId) $page->count(0);
        }
        $items = $categoryId && empty($options['navigationOnly']) ? $this->getArticles($categoryId, $options + ['stateFilter' => $stateFilter]) : [];
        return [
            ...($page ? ['pagination' => $page->descriptor(), 'navigationNodes' => $navigationNodes] : []),
            'nodeId' => $nodeId, 'nodes' => $page ? $page->nodes($nodes) : $nodes,
            'items' => $items,
            'breadcrumb' => $this->getBreadcrumb($nodeId), 'actions' => $this->getActions([]),
            'presentation' => $this->articlePresentation(false, false),
            'currentResource' => $categoryId ? $this->normalizeCategory($category) : $this->getRoots()[0],
        ];
    }

    public function getActions(array $selection = []): array
    {
        $identity = $this->app->getIdentity();
        $canCreate = $this->canCreateArticle();
        return array_values(array_filter([
            $canCreate ? [...$this->action('newArticle', 'COM_SMARTBROWSER_NEW_ARTICLE', 'fas fa-plus', 'node', true, false, false, false, true), 'creationRole' => 'item'] : null,
            $identity->authorise('core.create', 'com_content') ? [...$this->action('createChild', 'COM_SMARTBROWSER_CREATE_CHILD_CATEGORY', 'fas fa-box', 'node', false, false, false, false, true), 'creationRole' => 'node'] : null,
            ...$this->articleActions(),
        ]));
    }

    public function executeAction(string $action, array $selection, array $payload = []): mixed
    {
        if ($action === 'batch') return $this->executeArticleBatch($selection, $payload);
        if (in_array($action, ['newArticle', 'createChild'], true)) {
            $categoryId = $this->categoryId((string) ($payload['nodeId'] ?? ''));
            if (empty($this->categoryCapabilities($categoryId ?: null)[$action])) throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
        }
        return match ($action) {
            'newArticle' => $this->editorResponse('index.php?option=com_content&task=article.add&catid=' . $this->categoryId((string) ($payload['nodeId'] ?? ''))),
            'createChild' => $this->editorResponse('index.php?option=com_categories&task=category.add&extension=com_content&parent_id=' . max(1, $this->categoryId((string) ($payload['nodeId'] ?? '')))),
            default => $this->executeArticleAction($action, $selection, false, $payload),
        };
    }
}
