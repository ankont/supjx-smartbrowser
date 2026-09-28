<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Menu\Resolver;

defined('_JEXEC') or die;

final class FeaturedArticlesResolver implements MenuItemResolverInterface
{
    public function supports(object $menuItem): bool
    {
        parse_str((string) parse_url((string) $menuItem->link, PHP_URL_QUERY), $query);
        return ($query['option'] ?? '') === 'com_content'
            && ($query['view'] ?? '') === 'featured';
    }
    public function resolve(object $menuItem, MenuItemResolutionContext $context): array
    {
        $query = $context->query($menuItem);
        $params = $context->params($menuItem);
        $categoryId = (int) ($query['id'] ?? 0);
        $categoryIds = null;
        if ($categoryId > 0) {
            $categoryIds = $context->content->resolveCategoryScopeIds(
                $categoryId,
                (int) $params->get('show_subcategory_content', 0),
            );
        }
        $articles = $context->content->resolveArticles([
            'stateFilter' => 'published', 'sortBy' => 'ordering', 'sortDirection' => 'asc', 'filters' => ['featured' => '1'],
        ], $categoryIds);
        return ['resources' => $context->contextualArticles($articles), 'provenance' => ['resolver' => 'featured-articles', 'categoryId' => $categoryId ?: null]];
    }
}
