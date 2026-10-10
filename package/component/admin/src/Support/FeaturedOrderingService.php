<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

use Joomla\CMS\Application\CMSApplicationInterface;
use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\Database\DatabaseInterface;
use SuperSoft\Component\Smartbrowser\Administrator\Adapter\ResourceAdapterInterface;
use SuperSoft\Component\Smartbrowser\Administrator\Model\FeaturedOrderModel;

defined('_JEXEC') or die;

final class FeaturedOrderingService
{
    public function __construct(private readonly CMSApplicationInterface $app) {}

    public function move(ResourceAdapterInterface $adapter, array $selection, string $direction): array
    {
        return $this->apply($adapter, $selection, $direction);
    }

    public function sort(ResourceAdapterInterface $adapter, array $selection, string $field, string $direction): array
    {
        $fields = [...array_column($adapter->getCollectionPresentation()['sortFields'] ?? [], 'id'), 'ordering'];
        if (!in_array($field, $fields, true) || !in_array($direction, ['asc', 'desc'], true) || count($selection) > 500) {
            throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        }
        return $this->apply($adapter, $selection, $direction, $field);
    }

    private function apply(ResourceAdapterInterface $adapter, array $selection, string $direction, ?string $sortField = null): array
    {
        if ($sortField === null && !in_array($direction, ['up', 'down'], true) || $selection === []) {
            throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        }

        $ids = []; $resources = [];
        foreach ($selection as $resourceId) {
            if (!is_string($resourceId) || !preg_match('/^article:([1-9][0-9]*)$/D', $resourceId, $match)) {
                throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
            }
            $resource = $adapter->getResource($resourceId);
            if (empty($resource['capabilities']['reorder'])) throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
            $ids[(int) $match[1]] = (int) $match[1];
            $resources[(int) $match[1]] = $resource;
        }

        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true)->select($db->quoteName('content_id'))
            ->from($db->quoteName('#__content_frontpage'))
            ->order($db->quoteName('ordering') . ' ASC')->order($db->quoteName('content_id') . ' ASC');
        $siblings = array_map('intval', $db->setQuery($query)->loadColumn());
        if (array_diff($ids, $siblings)) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        if ($sortField !== null) {
            $ids = array_values(array_filter($siblings, static fn ($id) => isset($resources[$id])));
            $value = static fn ($id) => $sortField === 'ordering' ? array_search($id, $siblings, true)
                : ($sortField === 'title' ? ($resources[$id]['title'] ?? '') : ($resources[$id]['metadata'][$sortField] ?? ''));
            usort($ids, static function ($left, $right) use ($value, $direction, $siblings) {
                $a = $value($left); $b = $value($right);
                $comparison = is_numeric($a) && is_numeric($b) ? $a <=> $b : strnatcasecmp((string) $a, (string) $b);
                return $comparison ? ($direction === 'asc' ? $comparison : -$comparison) : array_search($left, $siblings, true) <=> array_search($right, $siblings, true);
            });
        }
        $moves = $sortField !== null ? OrderingSteps::sortPlan($siblings, $ids)
            : array_map(static fn ($id) => ['id' => $id, 'step' => $direction === 'up' ? -1 : 1], OrderingSteps::movedIds($siblings, array_values($ids), $direction));

        $factory = $this->app->bootComponent('com_content')->getMVCFactory();
        $model = new FeaturedOrderModel(['ignore_request' => true, 'name' => 'Feature', 'option' => 'com_content'], $factory);
        $moved = [];
        foreach ($moves as $move) {
            $id = $move['id'];
            if ($model->reorder([$id], $move['step']) !== true) {
                throw new \RuntimeException((string) ($model->getError() ?: Text::_('JERROR_AN_ERROR_HAS_OCCURRED')), 500);
            }
            $moved[] = 'article:' . $id;
        }
        return ['updated' => $moved];
    }
}
