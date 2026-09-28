<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Menu\Resolver;

defined('_JEXEC') or die;

final class GenericComponentResolver implements MenuItemResolverInterface
{
    public function supports(object $menuItem): bool { return true; }
    public function resolve(object $menuItem, MenuItemResolutionContext $context): array
    {
        $query = $context->query($menuItem);
        return [
            'resources' => [],
            'metadata' => ['component' => $query['option'] ?? '', 'view' => $query['view'] ?? '', 'layout' => $query['layout'] ?? ''],
            'provenance' => ['resolver' => 'generic-component', 'menuItemId' => (int) $menuItem->id],
        ];
    }
}
