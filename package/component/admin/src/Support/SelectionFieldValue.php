<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

defined('_JEXEC') or die;

/** Serialization only; capability values remain the existing Picker usage contract. */
final class SelectionFieldValue
{
    public static function decode($raw, array|string|null $adapters = null, bool $multiple = true, bool $homogeneous = false): array
    {
        if ($raw === '' || $raw === null) return ['version' => 1, 'items' => []];
        if (!is_string($raw) || strlen($raw) > 262144) throw new \InvalidArgumentException('Invalid selection field value.');
        $data = json_decode($raw, true, 32, JSON_THROW_ON_ERROR);
        if (!is_array($data) || ($data['version'] ?? null) !== 1) throw new \InvalidArgumentException('Invalid field version.');
        $rawItems = $data['items'] ?? null;
        if ($rawItems === null && is_array($data['selection'] ?? null)) $rawItems = array_map(static fn ($reference) => ['selection' => $reference, 'usage' => $data['usage'][$reference['id']] ?? []], $data['selection']);
        if (!is_array($rawItems) || !array_is_list($rawItems)) throw new \InvalidArgumentException('Invalid field collection.');
        $items = CollectionResources::entries($rawItems, ['allowedAdapters' => is_array($adapters) ? $adapters : ($adapters ? [$adapters] : []), 'homogeneous' => $homogeneous]);
        if (count($items) !== count($rawItems) || !$multiple && count($items) > 1) throw new \InvalidArgumentException('Invalid field selection.');
        return ['version' => 1, 'items' => $items];
    }

    public static function encode(array $value): string
    {
        if (!$value['items']) return '';
        return json_encode(['version' => 1, 'items' => CollectionResources::jsonEntries($value['items'])], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    }
}
