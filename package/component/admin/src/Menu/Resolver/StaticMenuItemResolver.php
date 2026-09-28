<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Menu\Resolver;

defined('_JEXEC') or die;

final class StaticMenuItemResolver implements MenuItemResolverInterface
{
    public function supports(object $menuItem): bool { return in_array((string) $menuItem->type, ['separator', 'heading', 'container'], true); }
    public function resolve(object $menuItem, MenuItemResolutionContext $context): array
    {
        return ['resources' => [], 'provenance' => ['resolver' => 'static', 'menuItemId' => (int) $menuItem->id]];
    }
}
