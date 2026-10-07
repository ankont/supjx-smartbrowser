<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

use Joomla\CMS\Language\Text;
use SuperSoft\Component\Smartbrowser\Administrator\Adapter\ResourceAdapterInterface;

defined('_JEXEC') or die;

final class CollectionResources
{
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
                $resources[] = [
                    'id' => $id, 'title' => Text::_('COM_SMARTBROWSER_COLLECTION_UNAVAILABLE') . ' (' . $id . ')', 'subtitle' => $id,
                    'kind' => 'item', 'type' => 'unavailable', 'icon' => 'fas fa-exclamation-triangle', 'image' => null,
                    'unavailable' => true, 'metadata' => ['cardSummary' => $id], 'capabilities' => [],
                    'overlays' => [['id' => 'unavailable', 'icon' => 'fas fa-exclamation-triangle', 'tone' => 'warning', 'label' => Text::_('COM_SMARTBROWSER_COLLECTION_UNAVAILABLE')]],
                ];
            }
        }
        return $resources;
    }
}
