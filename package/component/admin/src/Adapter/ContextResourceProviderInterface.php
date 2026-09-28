<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter;

defined('_JEXEC') or die;

interface ContextResourceProviderInterface
{
    public function getContextResources(string $nodeId, array $options = []): array;
}
