<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

use Joomla\CMS\Factory;
use SuperSoft\Component\Smartbrowser\Administrator\Adapter\AdapterRegistry;

defined('_JEXEC') or die;

final class SelectionFieldSupport
{
    public static function configuration(array $params): array
    {
        $allowed = $params['allowed_adapters'] ?? ($params['adapter'] ?? 'media');
        $allowed = array_values(array_unique(array_filter(array_map(static fn ($id) => preg_replace('/^flat-/', '', trim($id)), is_array($allowed) ? $allowed : explode(',', (string) $allowed)))));
        if (!$allowed || count($allowed) > 50 || array_filter($allowed, static fn ($id) => !preg_match('/^[a-z][a-z0-9-]*$/D', $id))) throw new \InvalidArgumentException('Invalid adapters.');
        $adapter = $allowed[0];
        $profile = trim((string) ($params['selection_profile'] ?? '{}'));
        if (strlen($profile) > 32768) throw new \InvalidArgumentException('Profile too large.');
        $decoded = json_decode($profile ?: '{}', false, 32, JSON_THROW_ON_ERROR);
        if (!is_object($decoded)) throw new \InvalidArgumentException('A selection profile must be a JSON object.');
        foreach ($decoded as $key => $policy) {
            if (!preg_match('/^[a-z][a-z0-9_-]*(?:\.[a-zA-Z][a-zA-Z0-9_-]*)+$/D', $key) || (!is_object($policy) && !is_bool($policy))) throw new \InvalidArgumentException('Invalid selection profile.');
        }
        $multiple = in_array($params['multiple'] ?? false, [true, 1, '1', 'true'], true);
        $display = (string) ($params['editor_display'] ?? 'auto');
        if (!in_array($display, ['auto', 'compact', 'collection'], true)) throw new \InvalidArgumentException('Invalid editor display.');
        $target = (string) ($params['selection_target'] ?? 'item');
        if (!in_array($target, ['item', 'node', 'both'], true)) throw new \InvalidArgumentException('Invalid selection target.');
        $types = array_values(array_filter(array_map('trim', explode(',', (string) ($params['allowed_resource_types'] ?? '')))));
        if (count($types) > 50 || array_filter($types, static fn ($type) => !preg_match('/^[a-z][a-z0-9_-]*$/D', $type))) throw new \InvalidArgumentException('Invalid resource types.');
        $root = (string) ($params['browse_root'] ?? '');
        if (strlen($root) > 2048) throw new \InvalidArgumentException('Invalid browse root.');
        $anchors = (string) ($params['anchor_suggestions'] ?? 'none');
        if (!in_array($anchors, ['none', 'anchors', 'all'], true)) throw new \InvalidArgumentException('Invalid anchor suggestions.');
        $phonePrefix=trim((string) ($params['phone_country_prefix'] ?? ''));
        if ($phonePrefix !== '' && !preg_match('/^\+[1-9][0-9]{0,2}$/D', $phonePrefix)) throw new \InvalidArgumentException('Invalid country prefix.');
        return ['adapter' => $adapter, 'allowedAdapters' => $allowed, 'homogeneous' => in_array($params['homogeneous'] ?? '1', [true, 1, '1', 'true'], true), 'browseRoot' => $root, 'multiple' => $multiple, 'ordering' => $multiple && in_array($params['ordering'] ?? '1', [true, 1, '1', 'true'], true),
            'editorDisplay' => $display === 'auto' ? ($multiple ? 'collection' : 'compact') : $display, 'anchorSuggestions' => $anchors, 'phoneCountryPrefix'=>$phonePrefix,
            'selectionTarget' => $target, 'allowedResourceTypes' => $types, 'selectionProfile' => $decoded];
    }

    public static function prepare($raw, array $config, ?callable $resolver = null, ?bool $readOnly = null, ?StoredSelectionReadContext $context = null): array
    {
        try { $value = SelectionFieldValue::decode($raw, $config['allowedAdapters'], $config['multiple'], $config['homogeneous']); }
        catch (\Throwable $error) { return ['version' => 1, 'items' => [], 'invalid' => true]; }
        $readOnly ??= $resolver === null && Factory::getApplication()->isClient('site');
        $resources = CollectionResources::resolveEntries($value['items'], function ($id, $ids) use ($config, $resolver, $readOnly, $context) {
            if ($resolver) return ['resources' => array_map(static fn ($resourceId) => self::resolve(['adapter' => $id, 'id' => $resourceId], $config, $resolver), $ids)];
            $app = Factory::getApplication();
            if ($readOnly) return (new ResourceVisualDecorator($app))->decorate(['resources' => ReadOnlyResources::resolve(new AdapterRegistry($app), $id, $ids, $id === $config['adapter'] ? ($config['browseRoot'] ?: null) : null, $context)], $id);
            $adapter = (new AdapterRegistry($app))->get($id, $id === $config['adapter'] ? ($config['browseRoot'] ?: null) : null);
            $resources = CollectionResources::resolve($adapter, $ids, $app->getIdentity(), $app->isClient('site'));
            $presentation = method_exists($adapter, 'getCollectionPresentation') ? $adapter->getCollectionPresentation($resources) : [];
            return (new ResourceVisualDecorator($app))->decorate(['resources' => $resources, 'presentation' => $presentation], $id);
        });
        $items = [];
        foreach ($value['items'] as $index => $entry) {
            $reference = $entry['selection'];
            $resource = ResourceDescriptor::complete($resources[$index]);
            $values = $entry['usage'];
            $thumbnail = self::image($resource);
            foreach ($resource['selectionCapabilities'] ?? [] as $definition) {
                if (($definition['visualRole'] ?? '') !== 'thumbnail' || ($definition['type'] ?? '') !== 'resource'
                    || empty($values[$definition['key']])) continue;
                $override = $values[$definition['key']];
                if (!is_array($override) || !isset($override['adapter'], $override['id'])) continue;
                $overrideConfig = [...$config, 'adapter' => $definition['picker']['adapter'] ?? $override['adapter'], 'browseRoot' => $definition['picker']['browseRoot'] ?? ''];
                if ($override['adapter'] !== $overrideConfig['adapter']) continue;
                $resolved = self::resolve($override, $overrideConfig, $resolver, $readOnly);
                if (!empty($resolved['unavailable']) || ($resolved['selectable'] ?? true) === false
                    || ($definition['picker']['allowedResourceTypes'] ?? []) && !in_array($resolved['type'] ?? '', $definition['picker']['allowedResourceTypes'], true)) continue;
                $thumbnail = self::image($resolved) ?: $thumbnail;
                break;
            }
            $items[] = ['selection' => $reference, 'resource' => $resource, 'usage' => $values, 'effectiveThumbnail' => $thumbnail,
                'effectiveIcon' => ResourceDescriptor::effectiveIcon($resource, $values), 'unavailable' => !empty($resource['unavailable'])];
        }
        return [...$value, 'items' => $items, 'invalid' => false];
    }

    private static function resolve(array $reference, array $config, ?callable $resolver, bool $readOnly = false): array
    {
        try {
            if ($resolver) return $resolver($reference, $config);
            $app = Factory::getApplication();
            if ($readOnly) return (new ResourceVisualDecorator($app))->decorate(['resources' => ReadOnlyResources::resolve(new AdapterRegistry($app), $reference['adapter'], [$reference['id']], $config['browseRoot'] ?: null)], $reference['adapter'])['resources'][0];
            $adapter = (new AdapterRegistry($app))->get($reference['adapter'], $config['browseRoot'] ?: null);
            $resources = CollectionResources::resolve($adapter, [$reference['id']], $app->getIdentity(), $app->isClient('site'));
            return (new ResourceVisualDecorator($app))->decorate(['resources' => $resources], $reference['adapter'])['resources'][0];
        } catch (\Throwable $error) {
            return ['id' => $reference['id'], 'title' => '', 'type' => 'unavailable', 'kind' => 'item', 'unavailable' => true, 'metadata' => [], 'capabilities' => []];
        }
    }

    public static function usageValues(array $resource, array $values, array $config, ?callable $resolver = null): array
    {
        $profile = json_decode(json_encode($config['selectionProfile'], JSON_THROW_ON_ERROR), true, 32, JSON_THROW_ON_ERROR);
        return SelectionUsageValidation::values(ResourceDescriptor::complete($resource), $profile, $values, static fn ($reference, $picker) => self::resolve($reference, [...$config, 'browseRoot' => $picker['browseRoot'] ?? ''], $resolver));
    }

    private static function image(array $resource): ?string
    {
        if (!empty($resource['unavailable'])) return null;
        foreach ([$resource['thumbnail'] ?? null, $resource['metadata']['thumbnail'] ?? null, $resource['metadata']['poster'] ?? null,
            $resource['image'] ?? null, ($resource['type'] ?? '') === 'image' ? ($resource['metadata']['url'] ?? null) : null] as $image) {
            if (is_string($image) && $image !== '') return $image;
        }
        return null;
    }
}
