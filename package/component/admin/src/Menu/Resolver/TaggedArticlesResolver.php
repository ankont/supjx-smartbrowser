<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Menu\Resolver;

defined('_JEXEC') or die;

final class TaggedArticlesResolver implements MenuItemResolverInterface
{
    public function supports(object $menuItem): bool
    {
        parse_str((string) parse_url((string) $menuItem->link, PHP_URL_QUERY), $query);
        return ($query['option'] ?? '') === 'com_tags' && in_array(($query['view'] ?? ''), ['tag', 'tags'], true);
    }
    public function resolve(object $menuItem, MenuItemResolutionContext $context): array
    {
        $query = $context->query($menuItem);
        $raw = $query['id'] ?? $context->params($menuItem)->get('tag_id', []);
        $tagIds = is_array($raw) ? $raw : preg_split('/[,\-]/', (string) $raw);
        $articles = $context->content->resolveArticlesByTags($tagIds ?: [], [
            'stateFilter' => 'published', 'sortBy' => 'title', 'sortDirection' => 'asc', 'filters' => [],
        ], (int) $context->params($menuItem)->get('return_any_or_all', 1) === 0);
        return ['resources' => $context->contextualArticles($articles), 'provenance' => ['resolver' => 'tagged-articles', 'tagIds' => array_map('intval', $tagIds ?: [])]];
    }
}
