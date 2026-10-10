<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

use Joomla\CMS\Application\CMSApplicationInterface;
use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\Database\DatabaseInterface;
use SuperSoft\Component\Smartbrowser\Administrator\Adapter\ResourceAdapterInterface;
use SuperSoft\Component\Smartbrowser\Administrator\Model\SmartAuthorsArticleModel;

defined('_JEXEC') or die;

final class OrderingService
{
    public function __construct(private readonly CMSApplicationInterface $app)
    {
    }

    public function move(ResourceAdapterInterface $adapter, array $selection, string $direction, array $allowedTypes): array
    {
        if (!in_array($direction, ['up', 'down'], true) || $selection === []) {
            throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        }

        $groups = [];
        foreach ($selection as $resourceId) {
            if (!is_string($resourceId)) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
            $parts = explode(':', $resourceId, 2);
            [$type, $id] = $parts + ['', ''];
            if (!in_array($type, $allowedTypes, true) || !ctype_digit($id) || (int) $id < 1) {
                throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
            }
            $resource = $adapter->getResource((string) $resourceId);
            if (empty($resource['capabilities']['reorder'])) throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
            $groups[$type][(int) $id] = (int) $id;
        }

        $moved = [];
        foreach ($groups as $type => $idsById) {
            $ids = array_values($idsById);
            $config = $this->configuration($type);
            $db = Factory::getContainer()->get(DatabaseInterface::class);
            $query = $db->getQuery(true)->select('*')->from($db->quoteName($config['table']))
                ->whereIn($db->quoteName('id'), $ids);
            $rows = $db->setQuery($query)->loadObjectList('id');
            if (count($rows) !== count($ids)) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
            $families = [];
            foreach ($ids as $id) {
                $row = $rows[$id];
                if ($type === 'category' && (string) $row->extension !== 'com_content') throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
                if ($type === 'menu-item' && (int) $row->client_id !== 0) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
                $key = (string) $row->{$config['parent']} . ':' . ($config['scope'] ? (string) $row->{$config['scope']} : '');
                $families[$key]['parent'] = $row->{$config['parent']};
                $families[$key]['scope'] = $config['scope'] ? $row->{$config['scope']} : null;
                $families[$key]['ids'][] = $id;
            }

            $model = $this->model($type);
            foreach ($families as $family) {
                $query = $db->getQuery(true)->select($db->quoteName('id'))
                    ->from($db->quoteName($config['table']))
                    ->where($db->quoteName($config['parent']) . ' = ' . $db->quote($family['parent']))
                    ->order($db->quoteName($config['order']) . ' ASC')
                    ->order($db->quoteName('id') . ' ASC');
                if ($config['scope']) $query->where($db->quoteName($config['scope']) . ' = ' . $db->quote($family['scope']));
                if ($type === 'menu-item') $query->where($db->quoteName('client_id') . ' = 0');
                $siblings = array_map('intval', $db->setQuery($query)->loadColumn());
                foreach (OrderingSteps::movedIds($siblings, $family['ids'], $direction) as $id) {
                    if ($model->reorder([$id], $direction === 'up' ? -1 : 1) !== true) {
                        throw new \RuntimeException((string) ($model->getError() ?: Text::_('JERROR_AN_ERROR_HAS_OCCURRED')), 500);
                    }
                    $moved[] = $type . ':' . $id;
                }
            }
        }

        return ['updated' => $moved];
    }

    public function sort(ResourceAdapterInterface $adapter, array $selection, string $field, string $direction, array $allowedTypes): array
    {
        $fields = array_column($adapter->getCollectionPresentation()['sortFields'] ?? [], 'id');
        if (!$selection || count($selection) > 500 || !in_array($field, $fields, true) || !in_array($direction, ['asc', 'desc'], true)) {
            throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        }
        $families = [];
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        foreach (array_unique($selection) as $reference) {
            [$type, $id] = explode(':', $reference, 2) + ['', ''];
            if (!in_array($type, $allowedTypes, true) || !ctype_digit($id)) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
            $resource = $adapter->getResource($reference);
            if (empty($resource['capabilities']['reorder'])) throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
            $config = $this->configuration($type);
            $row = $db->setQuery($db->getQuery(true)->select('*')->from($db->quoteName($config['table']))->where($db->quoteName('id') . ' = ' . (int) $id))->loadObject();
            if (!$row || $type === 'category' && $row->extension !== 'com_content' || $type === 'menu-item' && (int) $row->client_id !== 0) {
                throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
            }
            $key = $type . ':' . $row->{$config['parent']} . ':' . ($config['scope'] ? $row->{$config['scope']} : '');
            $families[$key]['type'] = $type;
            $families[$key]['row'] = $row;
            $families[$key]['resources'][(int) $id] = $resource;
        }
        $plans = [];
        foreach ($families as $family) {
            $type = $family['type']; $config = $this->configuration($type); $row = $family['row'];
            $query = $db->getQuery(true)->select($db->quoteName('id'))->from($db->quoteName($config['table']))
                ->where($db->quoteName($config['parent']) . ' = ' . $db->quote($row->{$config['parent']}))
                ->order($db->quoteName($config['order']) . ' ASC')->order($db->quoteName('id') . ' ASC');
            if ($config['scope']) $query->where($db->quoteName($config['scope']) . ' = ' . $db->quote($row->{$config['scope']}));
            if ($type === 'menu-item') $query->where($db->quoteName('client_id') . ' = 0');
            $siblings = array_map('intval', $db->setQuery($query)->loadColumn());
            $selected = array_values(array_filter($siblings, static fn ($id) => isset($family['resources'][$id])));
            $value = static fn ($id) => $field === 'title' ? ($family['resources'][$id]['title'] ?? '') : ($family['resources'][$id]['metadata'][$field] ?? '');
            usort($selected, static function ($left, $right) use ($value, $direction, $siblings) {
                $a = $value($left); $b = $value($right);
                $comparison = is_numeric($a) && is_numeric($b) ? $a <=> $b : strnatcasecmp((string) $a, (string) $b);
                return $comparison ? ($direction === 'asc' ? $comparison : -$comparison) : array_search($left, $siblings, true) <=> array_search($right, $siblings, true);
            });
            $plans[] = ['type' => $type, 'moves' => OrderingSteps::sortPlan($siblings, $selected)];
        }
        foreach ($plans as $plan) {
            $model = $this->model($plan['type']);
            foreach ($plan['moves'] as $move) {
                if ($model->reorder([$move['id']], $move['step']) !== true) throw new \RuntimeException((string) ($model->getError() ?: Text::_('JERROR_AN_ERROR_HAS_OCCURRED')), 500);
            }
        }
        return ['updated' => array_values($selection)];
    }

    private function configuration(string $type): array
    {
        return match ($type) {
            'article' => ['table' => '#__content', 'parent' => 'catid', 'scope' => null, 'order' => 'ordering'],
            'category' => ['table' => '#__categories', 'parent' => 'parent_id', 'scope' => 'extension', 'order' => 'lft'],
            'tag' => ['table' => '#__tags', 'parent' => 'parent_id', 'scope' => null, 'order' => 'lft'],
            'menu-item' => ['table' => '#__menu', 'parent' => 'parent_id', 'scope' => 'menutype', 'order' => 'lft'],
        };
    }

    private function model(string $type): object
    {
        if ($type === 'article') {
            $factory = $this->app->bootComponent('com_content')->getMVCFactory();
            return new SmartAuthorsArticleModel(['ignore_request' => true, 'name' => 'Article', 'option' => 'com_content'], $factory);
        }
        if ($type === 'category') {
            $this->app->getInput()->set('extension', 'com_content');
            return $this->app->bootComponent('com_categories')->getMVCFactory()->createModel('Category', 'Administrator', ['ignore_request' => true]);
        }
        $component = $type === 'tag' ? 'com_tags' : 'com_menus';
        $name = $type === 'tag' ? 'Tag' : 'Item';
        return $this->app->bootComponent($component)->getMVCFactory()->createModel($name, 'Administrator', ['ignore_request' => true]);
    }
}
