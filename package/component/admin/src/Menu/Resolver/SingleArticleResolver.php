<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Menu\Resolver;

defined('_JEXEC') or die;

final class SingleArticleResolver implements MenuItemResolverInterface
{
    public function supports(object $menuItem): bool
    {
        parse_str((string) parse_url((string) $menuItem->link, PHP_URL_QUERY), $query);
        return ($query['option'] ?? '') === 'com_content' && ($query['view'] ?? '') === 'article';
    }
    public function resolve(object $menuItem, MenuItemResolutionContext $context): array
    {
        $id = (int) ($context->query($menuItem)['id'] ?? 0);
        $resources = $id ? $context->contextualArticles([$context->content->getResource('article:' . $id)]) : [];
        return ['resources' => $resources, 'provenance' => ['resolver' => 'single-article', 'articleId' => $id]];
    }
}
