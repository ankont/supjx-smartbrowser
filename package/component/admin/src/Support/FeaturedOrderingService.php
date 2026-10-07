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
        if (!in_array($direction, ['up', 'down'], true) || $selection === []) {
            throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        }

        $ids = [];
        foreach ($selection as $resourceId) {
            if (!is_string($resourceId) || !preg_match('/^article:([1-9][0-9]*)$/D', $resourceId, $match)) {
                throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
            }
            $resource = $adapter->getResource($resourceId);
            if (empty($resource['capabilities']['reorder'])) throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
            $ids[(int) $match[1]] = (int) $match[1];
        }

        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true)->select($db->quoteName('content_id'))
            ->from($db->quoteName('#__content_frontpage'))
            ->order($db->quoteName('ordering') . ' ASC')->order($db->quoteName('content_id') . ' ASC');
        $siblings = array_map('intval', $db->setQuery($query)->loadColumn());
        if (array_diff($ids, $siblings)) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);

        $factory = $this->app->bootComponent('com_content')->getMVCFactory();
        $model = new FeaturedOrderModel(['ignore_request' => true, 'name' => 'Feature', 'option' => 'com_content'], $factory);
        $moved = [];
        foreach (OrderingSteps::movedIds($siblings, array_values($ids), $direction) as $id) {
            if ($model->reorder([$id], $direction === 'up' ? -1 : 1) !== true) {
                throw new \RuntimeException((string) ($model->getError() ?: Text::_('JERROR_AN_ERROR_HAS_OCCURRED')), 500);
            }
            $moved[] = 'article:' . $id;
        }
        return ['updated' => $moved];
    }
}
