<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

defined('_JEXEC') or die;

/** Server-side boundary for the same capability/profile contract used by the Picker. */
final class SelectionUsageValidation
{
    public static function values(array $resource, array $profile, array $values, callable $resolve): array
    {
        if (!empty($resource['unavailable'])) return $values;
        $definitions = [];
        foreach ($resource['selectionCapabilities'] ?? [] as $definition) {
            $key = $definition['key'];
            if (!array_key_exists($key, $profile) || $profile[$key] === false) continue;
            $policy = is_array($profile[$key]) ? $profile[$key] : [];
            $definitions[$key] = [...$definition, 'policy' => $policy, 'required' => ($policy['required'] ?? false) === true];
            if (!array_key_exists($key, $values)) $values[$key] = array_key_exists('default', $policy) ? $policy['default'] : ($definition['default'] ?? null);
        }
        if (array_diff(array_keys($values), array_keys($definitions))) throw new \InvalidArgumentException('Unsupported usage property.');
        foreach ($definitions as $key => $definition) {
            $dependency = $definition['disabledWhen'] ?? [];
            $disabled = isset($dependency['key']) && array_key_exists($dependency['key'], $values) && $values[$dependency['key']] === ($dependency['equals'] ?? null);
            if ($disabled) $values[$key] = $definition['inactiveValue'] ?? null;
            $value = $values[$key];
            $empty = $value === null || is_string($value) && trim($value) === '';
            if ($empty) {
                if (!$disabled && $definition['required']) throw new \InvalidArgumentException('Required usage property.');
                continue;
            }
            $valid = match ($definition['type']) {
                'string' => is_string($value), 'boolean' => is_bool($value),
                'number' => (is_int($value) || is_float($value)) && is_finite((float) $value),
                'object' => is_array($value) && (!$value || !array_is_list($value)),
                'resource' => is_array($value) && is_string($value['adapter'] ?? null) && is_string($value['id'] ?? null),
                default => false,
            };
            if (!$valid) throw new \InvalidArgumentException('Invalid usage type.');
            foreach ([$definition['validation'] ?? [], $definition['policy']['constraints'] ?? []] as $rules) {
                $length = is_string($value) ? preg_match_all('/./us', $value) : 0;
                if (is_string($value) && (isset($rules['maxLength']) && $length > $rules['maxLength'] || isset($rules['minLength']) && $length < $rules['minLength'])
                    || is_numeric($value) && !is_string($value) && (isset($rules['min']) && $value < $rules['min'] || isset($rules['max']) && $value > $rules['max'] || !empty($rules['integer']) && floor($value) !== (float) $value)
                    || isset($rules['allowedValues']) && !in_array($value, $rules['allowedValues'], true)) throw new \InvalidArgumentException('Usage constraint failed.');
                if (!empty($rules['pattern']) && is_string($value) && @preg_match('~' . str_replace('~', '\\~', $rules['pattern']) . '~u', $value) !== 1) throw new \InvalidArgumentException('Usage pattern failed.');
            }
            if (isset($definition['options']) && !in_array($value, array_column($definition['options'], 'value'), true)) throw new \InvalidArgumentException('Invalid usage option.');
            if ($definition['type'] !== 'resource') continue;
            $reference = CollectionResources::entries([['selection' => $value]])[0]['selection'];
            $picker = $definition['picker'] ?? [];
            if (isset($picker['adapter']) && $reference['adapter'] !== $picker['adapter']
                || !empty($picker['allowedAdapters']) && !in_array($reference['adapter'], $picker['allowedAdapters'], true)) throw new \InvalidArgumentException('Invalid usage adapter.');
            $resolved = $resolve($reference, $picker);
            if (!$resolved || !empty($resolved['unavailable']) || ($resolved['selectable'] ?? true) === false
                || isset($picker['selectionTarget']) && $picker['selectionTarget'] !== 'both' && ($resolved['kind'] ?? '') !== $picker['selectionTarget']
                || !empty($picker['allowedResourceTypes']) && !in_array($resolved['type'] ?? '', $picker['allowedResourceTypes'], true)) throw new \InvalidArgumentException('Invalid usage resource.');
            $values[$key] = $reference;
        }
        return $values;
    }
}
