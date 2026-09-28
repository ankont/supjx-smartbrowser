<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Menu\Resolver;

defined('_JEXEC') or die;

final class UrlMenuItemResolver implements MenuItemResolverInterface
{
    public function supports(object $menuItem): bool { return (string) $menuItem->type === 'url'; }
    public function resolve(object $menuItem, MenuItemResolutionContext $context): array
    {
        $url = $context->frontendUrl((string) $menuItem->link);
        return ['resources' => [[
            'id' => 'menu-link:' . (int) $menuItem->id, 'title' => (string) $menuItem->title,
            'subtitle' => $url, 'kind' => 'item', 'type' => 'link', 'icon' => 'icon-link', 'image' => null,
            'role' => 'contextual', 'focusable' => true, 'selectable' => false, 'bulkSelectable' => false,
            'actionable' => $url !== '', 'navigable' => false, 'capabilities' => $url !== '' ? ['openLink' => true, 'copyLink' => true] : [],
            'metadata' => ['url' => $url, 'menuItemId' => (int) $menuItem->id, 'typeLabel' => (string) ($menuItem->type_label ?? 'URL')],
        ]], 'provenance' => ['resolver' => 'url']];
    }
}
