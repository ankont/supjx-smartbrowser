<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

defined('_JEXEC') or die;

/** Request-local, trusted host definitions. Never populate this from request JSON. */
final class ConsumerUsage
{
    private static array $definitions = [];

    public static function register(string $consumer, array $definitions): void
    {
        if (!preg_match('/^[a-z][a-z0-9_-]*$/D', $consumer)) throw new \InvalidArgumentException('Invalid consumer.');
        $seen = [];
        foreach ($definitions as $definition) {
            $key = $definition['key'] ?? '';
            if (!is_string($key) || !str_starts_with($key, 'ext.' . $consumer . '.') || isset($seen[$key])
                || !preg_match('/^ext\.[a-z][a-z0-9_-]*(?:\.[a-zA-Z][a-zA-Z0-9_-]*)+$/D', $key)
                || !in_array($definition['type'] ?? '', ['string', 'boolean', 'number', 'object', 'resource'], true)
                || empty($definition['resourceTypes']) || !is_array($definition['resourceTypes'])) throw new \InvalidArgumentException('Invalid consumer capability.');
            $seen[$key] = true;
        }
        self::$definitions[$consumer] = $definitions;
    }

    public static function definitions(string $consumer): array
    {
        return self::$definitions[$consumer] ?? [];
    }

    public static function resource(array $resource, string $consumer): array
    {
        foreach (self::definitions($consumer) as $definition) {
            if (in_array($resource['type'] ?? '', $definition['resourceTypes'], true)) $resource['selectionCapabilities'][] = $definition;
        }
        return $resource;
    }
}
