<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter;

defined('_JEXEC') or die;

final class ArticlesByTagAdapter extends ArticleCollectionAdapter
{
    protected const ROOT_ID = 'articles-by-tag:root';

    public function getId(): string
    {
        return 'articles-by-tag';
    }

    public function getRoots(): array
    {
        return [$this->tagRootResource()];
    }

    public function getResources(string $nodeId, array $options = []): array
    {
        $tagId = $this->tagId($nodeId);
        $tree = $this->tagTree();
        $nodes = $this->getTagChildren($nodeId, ['filters' => ['state' => 'active']]);
        $stateFilter = (string) ($options['filters']['state'] ?? 'active');

        return [
            'nodeId' => $nodeId,
            'nodes' => $nodes,
            'items' => $tagId ? $this->getArticlesByTag($tagId, $options + ['stateFilter' => $stateFilter]) : [],
            'breadcrumb' => $this->getBreadcrumb($nodeId),
            'actions' => $this->getActions([]),
            'presentation' => $this->articlePresentation(true, true, false, false),
            'currentResource' => $tagId ? $this->normalizeTag($this->getTag($tagId), $tree) : $this->getRoots()[0],
        ];
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

    public function getCollectionPresentation(array $resources = []): array { return $this->articlePresentation(true, true, false, false); }

    public function getActions(array $selection = []): array
    {
        $tagActions = (new TagAdapter($this->app))->getActions();
        $nodeAction = [...$tagActions[0], 'icon' => 'fas fa-tag', 'creationRole' => 'node'];
        $articleAction = array_values(array_filter($tagActions, static fn (array $item): bool => $item['id'] === 'newArticle'))[0] ?? null;
        if ($articleAction !== null) $articleAction = [...$articleAction, 'icon' => 'fas fa-plus', 'creationRole' => 'item'];
        return [...array_values(array_filter([$articleAction, $nodeAction])), ...array_map(
            static fn (array $action): array => $action['id'] === 'preview' ? [...$action, 'itemsOnly' => false] : $action,
            $this->articleActions()
        )];
    }

    public function executeAction(string $action, array $selection, array $payload = []): mixed
    {
        if ($action === 'batch') return $this->executeArticleBatch($selection, $payload);
        if (in_array($action, ['createChild', 'newArticle'], true)) {
            if (($payload['nodeId'] ?? '') === static::ROOT_ID) $payload['nodeId'] = 'tags:root';
            return $this->tagAdapter()->executeAction($action, [], $payload);
        }

        $tagSelection = array_values(array_filter($selection, fn ($id) => str_starts_with((string) $id, 'tag:')));
        $articleSelection = array_values(array_filter($selection, fn ($id) => str_starts_with((string) $id, 'article:')));
        if (count($tagSelection) + count($articleSelection) !== count($selection)) {
            throw new \InvalidArgumentException(\Joomla\CMS\Language\Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        }
        if ($tagSelection === []) {
            return $this->executeArticleAction($action, $articleSelection, true);
        }
        if ($articleSelection === []) {
            return $this->tagAdapter()->executeAction($action, $tagSelection);
        }
        if (!in_array($action, ['publish', 'unpublish', 'archive', 'unarchive', 'trash'], true)) {
            throw new \InvalidArgumentException(\Joomla\CMS\Language\Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        }
        $this->tagAdapter()->executeAction($action, $tagSelection);
        $this->executeArticleAction($action, $articleSelection, true);
        return ['updated' => array_values($selection)];
    }

    private function tagAdapter(): TagAdapter
    {
        $adapter = new TagAdapter($this->app);
        $adapter->configureBrowseRoot($this->getBrowseRoot());
        return $adapter;
    }

    protected function browseRootKind(): string
    {
        return 'tag';
    }
}
