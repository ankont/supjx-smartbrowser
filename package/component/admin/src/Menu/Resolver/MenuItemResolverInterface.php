<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Menu\Resolver;

defined('_JEXEC') or die;

interface MenuItemResolverInterface
{
    public function supports(object $menuItem): bool;

    public function resolve(object $menuItem, MenuItemResolutionContext $context): array;
}
