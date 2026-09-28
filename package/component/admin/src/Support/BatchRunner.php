<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

use Joomla\CMS\Application\CMSApplicationInterface;
use Joomla\CMS\Factory;
use Joomla\CMS\Helper\TagsHelper;
use Joomla\CMS\Language\Text;
use Joomla\Database\DatabaseInterface;
use SuperSoft\Component\Smartbrowser\Administrator\Adapter\ResourceAdapterInterface;

defined('_JEXEC') or die;

final class BatchRunner
{
    public function __construct(private readonly CMSApplicationInterface $app)
    {
    }

    public function run(ResourceAdapterInterface $adapter, string $kind, array $selection, array $payload): array
    {
        $prefix = match ($kind) {
            'articles' => 'article:', 'categories' => 'category:', 'tags' => 'tag:',
            'menus' => 'menu-item:', 'users' => 'user:',
            default => throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_UNKNOWN_ACTION'), 400),
        };
        if ($selection === []) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);

        $ids = [];
        foreach ($selection as $resourceId) {
            $resourceId = (string) $resourceId;
            if (!str_starts_with($resourceId, $prefix) || !ctype_digit(substr($resourceId, strlen($prefix)))) {
                throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
            }
            $resource = $adapter->getResource($resourceId);
            if (empty($resource['capabilities']['edit'])) throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
            $ids[] = (int) substr($resourceId, strlen($prefix));
        }
        $ids = array_values(array_unique($ids));
        if (in_array(0, $ids, true)) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);

        if ($kind === 'users') return $this->runUsers($ids, $selection, $payload);

        $originalExtension = $this->app->getInput()->get('extension');
        if ($kind === 'categories') $this->app->getInput()->set('extension', 'com_content');
        try {
            $model = $this->model($kind);
            $contexts = $this->contexts($kind, $ids);
            $created = [];
            $done = false;

            $placement = (string) ($payload['placement'] ?? 'none');
            if (!in_array($placement, ['none', 'move', 'copy'], true)) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
            if ($placement !== 'none') {
                $destination = $this->destination($kind, $payload);
                if ($placement === 'copy') {
                    $mapping = $this->copyWithIds($model, $destination, $ids, $contexts);
                    if ($mapping === false) $this->fail($model);
                    $created = array_values($mapping);
                    $ids = array_map('intval', $created);
                    $contexts = $this->contexts($kind, $ids);
                } else {
                    $key = $kind === 'menus' ? 'menu_id' : 'category_id';
                    $this->apply($model, [$key => $destination, 'move_copy' => 'm'], $ids, $contexts);
                }
                $done = true;
            }

            $access = (string) ($payload['access'] ?? '');
            if ($access !== '') {
                $this->assertRecord('#__viewlevels', 'id', (int) $access);
                $this->apply($model, ['assetgroup_id' => (int) $access], $ids, $contexts);
                $done = true;
            }
            $language = (string) ($payload['language'] ?? '');
            if ($language !== '') {
                if ($language !== '*') $this->assertRecord('#__languages', 'lang_code', $language);
                $this->apply($model, ['language_id' => $language], $ids, $contexts);
                $done = true;
            }

            if (in_array($kind, ['articles', 'categories'], true)) {
                foreach ($this->tagIds($payload['tagAdd'] ?? []) as $tagId) {
                    $this->apply($model, ['tag' => $tagId], $ids, $contexts);
                    $done = true;
                }
                $removeTags = $this->tagIds($payload['tagRemove'] ?? []);
                if ($removeTags) {
                    $this->removeTags($model, $kind, $ids, $removeTags);
                    $done = true;
                }
            }
            if ($kind === 'categories' && !empty($payload['flipOrdering'])) {
                $this->apply($model, ['flip_ordering' => 1], $ids, $contexts);
                $done = true;
            }
            if (!$done) throw new \InvalidArgumentException(Text::_('JLIB_APPLICATION_ERROR_INSUFFICIENT_BATCH_INFORMATION'), 400);
            return ['updated' => array_values($selection), 'created' => array_map(static fn (int $id): string => $prefix . $id, $created)];
        } finally {
            $this->app->getInput()->set('extension', $originalExtension);
        }
    }

    private function runUsers(array $ids, array $selection, array $payload): array
    {
        $commands = [];
        $group = (int) ($payload['group'] ?? 0);
        if ($group > 0) {
            $this->assertRecord('#__usergroups', 'id', $group);
            $action = (string) ($payload['groupAction'] ?? '');
            if (!in_array($action, ['add', 'del', 'set'], true)) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
            $commands['group_id'] = $group;
            $commands['group_action'] = $action;
        }
        $reset = (string) ($payload['reset'] ?? '');
        if ($reset !== '') {
            if (!in_array($reset, ['yes', 'no'], true)) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
            $commands['reset_id'] = $reset;
        }
        if ($commands === []) throw new \InvalidArgumentException(Text::_('JLIB_APPLICATION_ERROR_INSUFFICIENT_BATCH_INFORMATION'), 400);
        $model = $this->model('users');
        $this->apply($model, $commands, $ids, $this->contexts('users', $ids));
        return ['updated' => array_values($selection)];
    }

    private function model(string $kind): object
    {
        $component = match ($kind) {
            'articles' => 'com_content', 'categories' => 'com_categories', 'tags' => 'com_tags',
            'menus' => 'com_menus', 'users' => 'com_users',
        };
        $factory = $this->app->bootComponent($component)->getMVCFactory();
        return match ($kind) {
            'articles' => $factory->createModel('Article', 'Administrator', ['ignore_request' => true]),
            'categories' => $factory->createModel('Category', 'Administrator', ['ignore_request' => true]),
            'menus' => $factory->createModel('Item', 'Administrator', ['ignore_request' => true]),
            'tags' => $factory->createModel('Tag', 'Administrator', ['ignore_request' => true]),
            'users' => $factory->createModel('User', 'Administrator', ['ignore_request' => true]),
        };
    }

    private function contexts(string $kind, array $ids): array
    {
        $base = match ($kind) {
            'articles' => 'com_content.article.', 'categories' => 'com_content.category.',
            'tags' => 'com_tags.tag.', 'menus' => 'com_menus.item.', 'users' => 'com_users.user.',
        };
        $contexts = [];
        foreach ($ids as $id) $contexts[$id] = $base . $id;
        return $contexts;
    }

    private function copyWithIds(object $model, int|string $destination, array $ids, array $contexts): array|false
    {
        $copy = \Closure::bind(static function (object $model, int|string $destination, array $ids, array $contexts): array|false {
            $model->initBatch();
            return $model->batchCopy($destination, $ids, $contexts);
        }, null, $model);

        return $copy($model, $destination, $ids, $contexts);
    }

    private function destination(string $kind, array $payload): int|string
    {
        if (in_array($kind, ['articles', 'categories'], true)) {
            $id = (int) ($payload['category'] ?? 0);
            if ($id < 1) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
            if ($kind === 'articles' || $id !== 1) $this->assertRecord('#__categories', 'id', $id, ['extension' => 'com_content', 'published' => [0, 1]]);
            return $kind === 'categories' && (string) ($payload['placement'] ?? '') === 'copy' ? $id . '.com_content' : $id;
        }
        if ($kind === 'menus') {
            $menu = (string) ($payload['menu'] ?? '');
            $parent = (int) ($payload['menuParent'] ?? 0);
            if ($menu === '' || $parent < 0) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
            $this->assertRecord('#__menu_types', 'menutype', $menu, ['client_id' => 0]);
            if ($parent) $this->assertRecord('#__menu', 'id', $parent, ['client_id' => 0, 'menutype' => $menu, 'published' => [0, 1]]);
            return $menu . '.' . $parent;
        }
        throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
    }

    private function tagIds(mixed $values): array
    {
        if (!is_array($values)) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        $ids = array_values(array_unique(array_map('intval', $values)));
        foreach ($ids as $id) $this->assertRecord('#__tags', 'id', $id, ['published' => [1]]);
        return $ids;
    }

    private function removeTags(object $model, string $kind, array $ids, array $tagIds): void
    {
        $helper = new TagsHelper();
        $helper->typeAlias = $kind === 'articles' ? 'com_content.article' : 'com_content.category';
        foreach ($ids as $id) {
            $table = $model->getTable();
            if (!$table->load($id) || !$helper->unTagItem($id, $table, $tagIds)) {
                throw new \RuntimeException($table->getError() ?: Text::_('JERROR_AN_ERROR_HAS_OCCURRED'), 500);
            }
        }
    }

    private function assertRecord(string $table, string $column, int|string $value, array $conditions = []): void
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true)->select('1')->from($db->quoteName($table))
            ->where($db->quoteName($column) . ' = ' . $db->quote((string) $value));
        foreach ($conditions as $field => $allowed) {
            $values = (array) $allowed;
            $query->where($db->quoteName($field) . ' IN (' . implode(',', array_map(static fn ($item): string => $db->quote((string) $item), $values)) . ')');
        }
        if (!$db->setQuery($query)->loadResult()) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
    }

    private function apply(object $model, array $commands, array $ids, array $contexts): void
    {
        if (!$model->batch($commands, $ids, $contexts)) $this->fail($model);
    }

    private function fail(object $model): never
    {
        throw new \RuntimeException($model->getError() ?: Text::_('JERROR_AN_ERROR_HAS_OCCURRED'), 500);
    }
}
