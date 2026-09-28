<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Menu\Resolver;

defined('_JEXEC') or die;

final class AliasMenuItemResolver implements MenuItemResolverInterface
{
    public function supports(object $menuItem): bool { return (string) $menuItem->type === 'alias'; }
    public function resolve(object $menuItem, MenuItemResolutionContext $context): array
    {
        $targetId = (int) $context->params($menuItem)->get('aliasoptions', 0);
        if (!$targetId) return ['resources' => [], 'metadata' => ['warning' => 'alias-target-missing']];
        $result = $context->resolveAlias($context->load($targetId));
        $result['provenance'] = [...($result['provenance'] ?? []), 'aliasOf' => $targetId, 'aliasMenuItemId' => (int) $menuItem->id];
        return $result;
    }
}
