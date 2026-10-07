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
        $nodes = [];
        foreach ($category->getChildren(false) as $child) {
            if ($this->canViewCategory($child) && ($this->matchesState((int) $child->published, $stateFilter) || $this->hasMatchingDescendant($child, $stateFilter))) {
                $nodes[] = $this->normalizeCategory($child);
            }
        }
        return [
            'nodeId' => $nodeId, 'nodes' => $nodes,
            'items' => $categoryId ? $this->getArticles($categoryId, $options + ['stateFilter' => $stateFilter]) : [],
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
