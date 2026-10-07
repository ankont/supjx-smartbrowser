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
