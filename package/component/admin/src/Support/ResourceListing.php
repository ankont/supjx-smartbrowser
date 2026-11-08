<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

defined('_JEXEC') or die;

/** Shared paging for adapters which enumerate their source before decoration. */
final class ResourceListing
{
    public static function prepare(array $result, array $options): array
    {
        // Flat views load their sidebar from the source adapter separately.
        $result['navigationNodes'] ??= !empty($options['flatListing']) ? [] : ($result['nodes'] ?? []);
        if (!empty($result['presentation']['navigationOnlyNodes'])) $result['nodes'] = [];
        foreach (['nodes', 'items', 'contextItems'] as $group) {
            $result[$group] = self::ordered($result[$group] ?? [], $options);
        }
        return $result;
    }

    public static function ordered(array $resources, array $options): array
    {
        $search = trim((string) ($options['search'] ?? ''));
        if ($search !== '') $resources = array_values(array_filter($resources, static fn (array $resource): bool => mb_stripos(
            implode(' ', [$resource['title'] ?? '', $resource['subtitle'] ?? '', $resource['metadata']['alias'] ?? '', $resource['metadata']['username'] ?? '', $resource['metadata']['email'] ?? '']), $search, 0, 'UTF-8'
        ) !== false));
        $field = $options['sortBy'] ?? '';
        if ($field === '') return $resources;
        $value = static fn (array $r) => match ($field) {
            'title', 'name' => $r['title'] ?? '',
            'location' => $r['metadata']['locationPath'] ?? $r['metadata']['categoryPath'] ?? $r['metadata']['location'] ?? $r['metadata']['parentPath'] ?? '',
            'ordering' => $r['metadata']['hierarchyOrder'] ?? $r['metadata']['ordering'] ?? 0,
            'dimension' => ($r['metadata']['width'] ?? 0) * ($r['metadata']['height'] ?? 0),
            default => $r['metadata'][$field] ?? '',
        };
        usort($resources, static function (array $a, array $b) use ($value, $options, $field): int {
            $comparison = 0;
            if ($field === 'ordering' && ($a['type'] ?? '') === 'article' && ($b['type'] ?? '') === 'article'
                && ($a['parentId'] ?? '') !== ($b['parentId'] ?? '') && !empty($a['metadata']['locationPath']) && !empty($b['metadata']['locationPath'])) {
                $comparison = strnatcasecmp($a['metadata']['locationPath'], $b['metadata']['locationPath']);
            }
            $left = $value($a); $right = $value($b);
            $comparison = $comparison ?: (is_string($left) && is_string($right) ? strnatcasecmp($left, $right) : $left <=> $right);
            $comparison = ($options['sortDirection'] ?? 'asc') === 'desc' ? -$comparison : $comparison;
            return $comparison ?: strcmp((string) $a['id'], (string) $b['id']);
        });
        return $resources;
    }

    public static function page(array $result, array $options, ResourcePagination $page): array
    {
        $result = self::prepare($result, $options);
        $page->count(count($result['nodes']) + count($result['items']) + count($result['contextItems']));
        $offset = $page->offset; $remaining = $page->limit;
        foreach (['nodes', 'items', 'contextItems'] as $group) {
            $count = count($result[$group]);
            $result[$group] = array_slice($result[$group], $offset, $remaining);
            $offset = max(0, $offset - $count);
            $remaining -= count($result[$group]);
        }
        $result['pagination'] = $page->descriptor();
        return $result;
    }

    public static function contextPage(array $result, array $options, ResourcePagination $page, callable $context): array
    {
        $result = self::prepare($result, $options);
        $page->prefix = count($result['nodes']) + count($result['items']);
        // Preserve the requested offset until the context query knows the total.
        $page->total = -1;
        $result['contextItems'] = $context($page);
        if ($page->total < 0) $page->count(0);
        $nodeCount = count($result['nodes']);
        $result['nodes'] = $page->nodes($result['nodes']);
        $result['items'] = array_slice($result['items'], max(0, $page->offset - $nodeCount), max(0, $page->limit - count($result['nodes'])));
        $result['pagination'] = $page->descriptor();
        return $result;
    }
}
