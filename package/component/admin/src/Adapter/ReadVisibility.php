<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter;

defined('_JEXEC') or die;

final class ReadVisibility
{
    public static function assertPublished(object $record, object $identity, string $state, ?int $now = null): void
    {
        if ((int) ($record->$state ?? 0) !== 1 || !isset($record->access)
            || !in_array((int) $record->access, $identity->getAuthorisedViewLevels(), true)) throw new \RuntimeException('Not readable', 403);
        $now ??= time();
        foreach (['publish_up', 'publish_down'] as $key) {
            $date = (string) ($record->$key ?? '');
            if ($date === '' || str_starts_with($date, '0000-00-00')) continue;
            $timestamp = strtotime($date . ' UTC');
            if ($timestamp === false || ($key === 'publish_up' ? $timestamp > $now : $timestamp < $now)) throw new \RuntimeException('Not readable', 403);
        }
    }

    public static function publicDescriptor(array $resource): array
    {
        $resource['metadata'] = array_intersect_key($resource['metadata'] ?? [], array_flip([
            'id', 'alias', 'languageKey', 'category', 'categoryPath', 'language', 'languageImage', 'created', 'modified', 'state', 'stateLabel', 'access', 'accessId', 'author',
        ]));
        $resource['capabilities'] = [];
        $resource['overlays'] = [];
        unset($resource['statusPresentation']);
        return $resource;
    }
}
