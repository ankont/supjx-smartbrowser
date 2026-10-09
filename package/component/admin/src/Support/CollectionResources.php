<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

use Joomla\CMS\Language\Text;
use SuperSoft\Component\Smartbrowser\Administrator\Adapter\ResourceAdapterInterface;

defined('_JEXEC') or die;

final class CollectionResources
{
    public static function key(array $reference): string
    {
        return json_encode([$reference['adapter'], $reference['id']], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_LINE_TERMINATORS | JSON_THROW_ON_ERROR);
    }

    public static function entries(array $items, array $constraints = []): array
    {
        if (count($items) > 500) throw new \InvalidArgumentException('A collection supports at most 500 resources.', 400);
        $entries = []; $seen = []; $adapters = [];
        foreach ($items as $item) {
            $reference = $item['selection'] ?? $item;
            if (!is_array($reference) || !is_string($reference['adapter'] ?? null) || !preg_match('/^[a-z][a-z0-9-]*$/D', $reference['adapter'])
                || !is_string($reference['id'] ?? null) || (!empty($constraints['allowedAdapters']) && !in_array($reference['adapter'], $constraints['allowedAdapters'], true))) throw new \InvalidArgumentException('Invalid collection reference.', 400);
            $reference = ['adapter' => $reference['adapter'], 'id' => self::identifiers($reference['adapter'], [$reference['id']])[0]];
            $key = self::key($reference);
            if (isset($seen[$key])) continue;
            $usage = $item['usage'] ?? [];
            if (!is_array($usage) || ($usage && array_is_list($usage)) || count($usage) > 100 || strlen(json_encode($usage, JSON_THROW_ON_ERROR)) > 65536) throw new \InvalidArgumentException('Invalid collection usage.', 400);
            foreach ($usage as $usageKey => $value) if (!is_string($usageKey) || !preg_match('/^[a-z][a-z0-9_-]*(?:\.[a-zA-Z][a-zA-Z0-9_-]*)+$/D', $usageKey)) throw new \InvalidArgumentException('Invalid usage key.', 400);
            $entries[] = ['selection' => $reference, 'usage' => $usage];
            $seen[$key] = true; $adapters[$reference['adapter']] = true;
        }
        if (!empty($constraints['homogeneous']) && count($adapters) > 1) throw new \InvalidArgumentException('This collection requires one adapter.', 400);
        return $entries;
    }

    public static function jsonEntries(array $entries): array
    {
        return array_map(static fn ($entry) => [...$entry, 'usage' => (object) $entry['usage']], $entries);
    }

    /** Resolve each adapter group using the existing provider, then restore caller order. */
    public static function resolveEntries(array $entries, callable $provider): array
    {
        $groups = []; $resolved = [];
        foreach ($entries as $entry) $groups[$entry['selection']['adapter']][] = $entry['selection']['id'];
        foreach ($groups as $adapter => $ids) {
            try {
                $result = $provider($adapter, $ids);
                foreach ($result['resources'] as $resource) $resolved[self::key(['adapter' => $adapter, 'id' => $resource['id']])] = [
                    ...$resource, 'collectionActions' => $result['actions'] ?? [], 'collectionPresentation' => $result['presentation'] ?? [],
                    'collectionVisualSettings' => $result['visualSettings'] ?? null, 'collectionImageBackground' => $result['imageBackground'] ?? 'auto',
                ];
            } catch (\Throwable $error) {
                if (!in_array((int) $error->getCode(), [400, 403, 404], true)) throw $error;
            }
        }
        return array_map(static function ($entry) use ($resolved) {
            $reference = $entry['selection']; $key = self::key($reference);
            return [...($resolved[$key] ?? self::unavailable($reference['id'])), 'adapter' => $reference['adapter'], 'selection' => $reference, 'selectionKey' => $key];
        }, $entries);
    }

    public static function unavailable(string $id): array
    {
        return ['id' => $id, 'title' => Text::_('COM_SMARTBROWSER_COLLECTION_UNAVAILABLE') . ' (' . $id . ')', 'subtitle' => $id,
            'kind' => 'item', 'type' => 'unavailable', 'icon' => 'fas fa-exclamation-triangle', 'image' => null, 'unavailable' => true,
            'metadata' => ['cardSummary' => $id], 'capabilities' => [],
            'overlays' => [['id' => 'unavailable', 'icon' => 'fas fa-exclamation-triangle', 'tone' => 'warning', 'label' => Text::_('COM_SMARTBROWSER_COLLECTION_UNAVAILABLE')]]];
    }
    public static function identifiers(string $adapter, array $items): array
    {
        if (count($items) > 500) throw new \InvalidArgumentException('A collection supports at most 500 resources.', 400);
        $prefix = match (preg_replace('/^flat-/', '', $adapter)) {
            'articles', 'featured-articles', 'articles-by-tag' => 'article',
            'categories' => 'category', 'tags' => 'tag', 'menus' => 'menu-item', 'users' => 'user',
            default => null,
        };
        $ids = [];
        foreach ($items as $item) {
            if (!is_int($item) && !is_string($item)) throw new \InvalidArgumentException('Invalid collection identifier.', 400);
            $id = (string) $item;
            if ($prefix && ctype_digit($id) && (int) $id > 0) $id = $prefix . ':' . (int) $id;
            if ($id === '' || strlen($id) > 2048 || !str_contains($id, ':')) throw new \InvalidArgumentException('Use a canonical SmartBrowser resource identifier.', 400);
            $ids[] = $id;
        }
        return array_values(array_unique($ids));
    }

    public static function resolve(ResourceAdapterInterface $adapter, array $ids, object $identity, bool $site): array
    {
        $resources = [];
        foreach ($ids as $id) {
            try {
                $resource = $adapter->getResource($id);
                $access = (int) ($resource['metadata']['accessId'] ?? 0);
                if ($site && $access && !$identity->authorise('core.admin') && !in_array($access, $identity->getAuthorisedViewLevels(), true)) throw new \RuntimeException('Not accessible', 403);
                if ($site && isset($resource['status']) && (int) $resource['status'] !== 1 && empty($resource['capabilities']['edit']) && empty($resource['capabilities']['publish']) && empty($resource['capabilities']['restore']) && !$identity->authorise('core.admin')) throw new \RuntimeException('Not accessible', 403);
                $resources[] = $resource;
            } catch (\Throwable $error) {
                $missingFile = $error instanceof \Joomla\Component\Media\Administrator\Exception\FileNotFoundException;
                if (!$missingFile && !in_array((int) $error->getCode(), [400, 403, 404], true)) throw $error;
                // Never disclose the title or the reason an inaccessible reference cannot resolve.
                $resources[] = self::unavailable($id);
            }
        }
        return $resources;
    }
}
