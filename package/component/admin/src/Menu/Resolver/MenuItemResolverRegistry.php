<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Menu\Resolver;

use Joomla\CMS\Application\CMSApplicationInterface;
use SuperSoft\Component\Smartbrowser\Administrator\Adapter\FlatArticleAdapter;

defined('_JEXEC') or die;

final class MenuItemResolverRegistry
{
    private const MAX_ALIAS_DEPTH = 12;
    private array $resolvers;

    public function __construct(
        private readonly CMSApplicationInterface $app,
        private readonly \Closure $loadMenuItem,
    ) {
        $this->resolvers = [
            new StaticMenuItemResolver(),
            new AliasMenuItemResolver(),
            new SingleArticleResolver(),
            new CategoryArticlesResolver(),
            new FeaturedArticlesResolver(),
            new TaggedArticlesResolver(),
            new UrlMenuItemResolver(),
            new GenericComponentResolver(),
        ];
    }

    public function resolve(object $menuItem, array $visited = [], int $depth = 0): array
    {
        $id = (int) ($menuItem->id ?? 0);
        if ($depth > self::MAX_ALIAS_DEPTH || in_array($id, $visited, true)) {
            return ['resources' => [], 'metadata' => ['warning' => 'alias-cycle'], 'provenance' => ['menuItemId' => $id]];
        }

        $visited[] = $id;
        $context = new MenuItemResolutionContext(
            new FlatArticleAdapter($this->app),
            $this->loadMenuItem,
            fn (object $item, array $chain, int $nextDepth): array => $this->resolve($item, $chain, $nextDepth),
            $visited,
            $depth,
            $this->app->getIdentity()->getAuthorisedViewLevels(),
        );

        try {
            foreach ($this->resolvers as $resolver) {
                if ($resolver->supports($menuItem)) {
                    return $resolver->resolve($menuItem, $context) + ['resources' => [], 'metadata' => [], 'provenance' => []];
                }
            }
        } catch (\Throwable $error) {
            return ['resources' => [], 'metadata' => ['warning' => 'resolution-failed', 'message' => $error->getMessage()], 'provenance' => ['menuItemId' => $id]];
        }

        return ['resources' => [], 'metadata' => [], 'provenance' => ['menuItemId' => $id]];
    }
}
