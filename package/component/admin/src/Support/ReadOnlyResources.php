<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

use SuperSoft\Component\Smartbrowser\Administrator\Adapter\AdapterRegistry;
use SuperSoft\Component\Smartbrowser\Administrator\Adapter\StoredSelectionReadableAdapterInterface;

defined('_JEXEC') or die;

final class ReadOnlyResources
{
    public static function resolve(AdapterRegistry $registry, string $adapter, array $ids, ?string $root = null, ?StoredSelectionReadContext $context = null): array
    {
        $resources = [];
        foreach ($ids as $id) {
            try {
                $reader = $registry->getReadable($adapter, $root);
                $resource = $context && $reader instanceof StoredSelectionReadableAdapterInterface
                    ? $reader->getStoredReadableResource($id, $context) : $reader->getReadableResource($id);
                $resources[] = ResourceDescriptor::complete($resource);
            } catch (\Throwable $error) {
                // Fail closed for unsupported policies, missing records and provider failures alike.
                $resources[] = CollectionResources::unavailable($id);
            }
        }
        return $resources;
    }
}
