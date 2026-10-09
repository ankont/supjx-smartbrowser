<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter;

defined('_JEXEC') or die;

/** Resolve an existing reference using reader visibility, never authoring permissions. */
interface ReadableResourceAdapterInterface
{
    public function getReadableResource(string $resourceId): array;
}
