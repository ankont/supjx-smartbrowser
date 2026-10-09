<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter;

use SuperSoft\Component\Smartbrowser\Administrator\Support\StoredSelectionReadContext;

defined('_JEXEC') or die;

interface StoredSelectionReadableAdapterInterface extends ReadableResourceAdapterInterface
{
    public function getStoredReadableResource(string $resourceId, StoredSelectionReadContext $context): array;
}
