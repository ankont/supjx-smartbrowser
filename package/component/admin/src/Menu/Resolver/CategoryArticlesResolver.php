<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Menu\Resolver;

defined('_JEXEC') or die;

final class CategoryArticlesResolver implements MenuItemResolverInterface
{
    public function supports(object $menuItem): bool
    {
        parse_str((string) parse_url((string) ($menuItem->link ?? ''), PHP_URL_QUERY), $query);
        return ($query['option'] ?? '') === 'com_content'
            && ($query['view'] ?? '') === 'category';
    }

    public function resolve(object $menuItem, MenuItemResolutionContext $context): array
    {
        $query = $context->query($menuItem);
        $params = $context->params($menuItem);
        $categoryId = (int) ($query['id'] ?? 0);
        if ($categoryId < 1) {
            return ['resources' => [], 'metadata' => ['warning' => 'category-missing'], 'provenance' => ['resolver' => 'category-articles']];
        }
        $depth = (int) $params->get('show_subcategory_content', 0);
        $categories = $context->content->resolveCategoryScopeIds($categoryId, $depth);
        $options = $this->articleOptions($params, str_contains(strtolower((string) ($query['layout'] ?? '')), 'featured'));
        $articles = $context->content->resolveArticles($options, array_values(array_unique($categories)));
        return ['resources' => $context->contextualArticles($articles), 'provenance' => ['resolver' => 'category-articles', 'categoryId' => $categoryId]];
    }

    private function articleOptions(object $params, bool $featuredLayout = false): array
    {
        $order = (string) $params->get('orderby_sec', 'rdate');
        [$sortBy, $direction] = match ($order) {
            'alpha' => ['title', 'asc'], 'ralpha' => ['title', 'desc'], 'date' => ['created', 'asc'],
            'order' => ['ordering', 'asc'], 'rorder' => ['ordering', 'desc'], default => ['created', 'desc'],
        };
        $featured = $featuredLayout ? 'only' : (string) $params->get('show_featured', 'show');
        return ['stateFilter' => 'published', 'sortBy' => $sortBy, 'sortDirection' => $direction, 'filters' => [
            'featured' => $featured === 'only' ? '1' : ($featured === 'hide' ? '0' : ''),
        ]];
    }
}
