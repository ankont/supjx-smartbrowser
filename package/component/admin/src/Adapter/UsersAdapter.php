<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter;

use Joomla\CMS\Access\Access;
use Joomla\CMS\Application\CMSApplicationInterface;
use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Plugin\PluginHelper;
use Joomla\Database\DatabaseInterface;
use SuperSoft\Component\Smartbrowser\Administrator\Support\AdministratorRoute;
use SuperSoft\Component\Smartbrowser\Administrator\Support\EditorRoute;
use SuperSoft\Component\Smartbrowser\Administrator\Support\BatchRunner;

defined('_JEXEC') or die;

final class UsersAdapter implements ResourceAdapterInterface, BrowseRootAwareInterface, StoredSelectionReadableAdapterInterface
{
    private const ROOT_ID = 'users:root';

    private ?string $browseRoot = null;
    private ?array $groups = null;

    public function __construct(private readonly CMSApplicationInterface $app)
    {
        $app->getLanguage()->load('com_smartbrowser', JPATH_ADMINISTRATOR, null, true);
    }

    public function getId(): string
    {
        return 'users';
    }

    public function getRoots(): array
    {
        if ($this->browseRoot) {
            return [[...$this->normalizeGroup($this->group($this->groupId($this->browseRoot))), 'type' => 'root', 'parentId' => null, 'visible' => true]];
        }

        return [[
            'id' => self::ROOT_ID, 'title' => Text::_('COM_SMARTBROWSER_USERS_ROOT'), 'subtitle' => '',
            'parentId' => null, 'kind' => 'node', 'type' => 'root', 'icon' => 'fas fa-users', 'image' => null,
            'visible' => false, 'selectable' => false, 'bulkSelectable' => false, 'focusable' => false,
            'actionable' => false, 'navigable' => true, 'hasChildren' => $this->hasGroupChildren(0),
            'capabilities' => ['open' => true], 'metadata' => [],
        ]];
    }

    public function getResources(string $nodeId, array $options = []): array
    {
        $this->assertBrowseScope([$nodeId]);
        $groupId = $this->groupId($nodeId);
        $nodes = array_values(array_map(
            fn (object $group): array => $this->normalizeGroup($group),
            array_filter($this->groups(), fn (object $group): bool => (int) $group->parent_id === $groupId)
        ));

        return [
            'nodeId' => $nodeId,
            'nodes' => $nodes,
            'items' => $groupId > 0 ? $this->usersForGroup($groupId, $options) : [],
            'breadcrumb' => $this->getBreadcrumb($nodeId),
            'actions' => $this->getActions([]),
            'presentation' => $this->presentation(),
            'currentResource' => $groupId > 0 ? $this->normalizeGroup($this->group($groupId)) : $this->getRoots()[0],
        ];
    }

    public function getResource(string $resourceId, array $options = []): array
    {
        $this->assertBrowseScope([$resourceId]);
        if (str_starts_with($resourceId, 'user-group:')) {
            return $this->normalizeGroup($this->group($this->groupId($resourceId)));
        }
        if (str_starts_with($resourceId, 'user:')) {
            return $this->normalizeUser($this->user((int) substr($resourceId, 5)));
        }
        if ($resourceId === self::ROOT_ID) {
            return $this->getRoots()[0];
        }

        throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
    }

    public function getReadableResource(string $resourceId): array
    {
        throw new \RuntimeException('Stored visible host context required.', 403);
    }

    public function getStoredReadableResource(string $resourceId, \SuperSoft\Component\Smartbrowser\Administrator\Support\StoredSelectionReadContext $context): array
    {
        if (!preg_match('/^user:([1-9][0-9]*)$/D', $resourceId, $matches)
            || !$context->permits(['adapter' => $this->getId(), 'id' => $resourceId])) throw new \RuntimeException('Not readable', 403);
        $user = $this->user((int) $matches[1]);
        return ['id' => $resourceId, 'title' => (string) $user->name, 'subtitle' => null, 'parentId' => null,
            'kind' => 'item', 'type' => 'user', 'icon' => 'fas fa-user', 'image' => null,
            'capabilities' => [], 'overlays' => [], 'metadata' => ['id' => (int) $user->id]];
    }

    public function getBreadcrumb(string $nodeId): array
    {
        $this->assertBrowseScope([$nodeId]);
        if ($nodeId === self::ROOT_ID) {
            return [['id' => self::ROOT_ID, 'title' => Text::_('COM_SMARTBROWSER_USERS_ROOT'), 'kind' => 'node', 'type' => 'root', 'icon' => 'fas fa-users', 'visible' => false]];
        }

        $group = $this->group($this->groupId($nodeId));
        $root = $this->browseRoot ? $this->group($this->groupId($this->browseRoot)) : null;
        $crumbs = $root ? [] : [[
            'id' => self::ROOT_ID,
            'title' => Text::_('COM_SMARTBROWSER_USERS_ROOT'),
            'kind' => 'node', 'type' => 'root', 'icon' => 'fas fa-users',
            'visible' => false,
        ]];
        foreach ($this->groups() as $candidate) {
            if ((int) $candidate->lft > (int) $group->lft || (int) $candidate->rgt < (int) $group->rgt) continue;
            if ($root && ((int) $candidate->lft < (int) $root->lft || (int) $candidate->rgt > (int) $root->rgt)) continue;
            $crumbs[] = ['id' => 'user-group:' . $candidate->id, 'title' => (string) $candidate->title, 'kind' => 'node', 'type' => 'user-group', 'icon' => 'fas fa-users-rectangle', 'visible' => true];
        }

        return $crumbs;
    }

    public function getActions(array $selection = []): array
    {
        $actions = [
            $this->app->getIdentity()->authorise('core.create', 'com_users')
                ? ['id' => 'newUser', 'label' => 'COM_SMARTBROWSER_NEW_USER', 'icon' => 'fas fa-plus', 'scope' => 'node', 'primary' => true, 'requiresSelection' => false, 'single' => false, 'itemsOnly' => false, 'currentNode' => true, 'creationRole' => 'item']
                : null,
            $this->action('edit', 'COM_SMARTBROWSER_EDIT_USER', 'fas fa-edit', true, true),
            $this->action('block', 'COM_SMARTBROWSER_BLOCK_USER', 'fas fa-lock', true, false, 'account-state'),
            $this->action('unblock', 'COM_SMARTBROWSER_UNBLOCK_USER', 'fas fa-unlock', true, false, 'account-state'),
            $this->action('activate', 'COM_SMARTBROWSER_ACTIVATE_USER', 'fas fa-check', true, false, 'activation'),
            $this->app->getIdentity()->authorise('core.admin') && $this->app->getIdentity()->authorise('core.edit', 'com_users')
                ? $this->action('removeFromGroup', 'COM_SMARTBROWSER_REMOVE_FROM_GROUP', 'fas fa-minus', true, false) : null,
            $this->app->getIdentity()->authorise('core.admin') && $this->app->getIdentity()->authorise('core.delete', 'com_users')
                ? $this->action('delete', 'COM_SMARTBROWSER_DELETE', 'fas fa-trash', true, false) : null,
        ];
        return array_values(array_filter($actions));
    }

    public function executeAction(string $action, array $selection, array $payload = []): mixed
    {
        if ($action === 'batch') return (new BatchRunner($this->app))->run($this, 'users', $selection, $payload);
        if ($action === 'newUser') {
            if (!$this->app->getIdentity()->authorise('core.create', 'com_users')) throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
            $nodeId = (string) ($payload['nodeId'] ?? self::ROOT_ID);
            $this->assertBrowseScope([$nodeId]);
            $groupId = $this->groupId($nodeId);
            if ($nodeId !== self::ROOT_ID && $groupId < 1) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
            if ($groupId > 0) $this->group($groupId);
            $url = 'index.php?option=com_users&task=user.add';
            if ($groupId > 0) $url .= '&sbGroupId=' . $groupId;
            return ['command' => 'openEditor', 'url' => EditorRoute::link($this->app, $url)];
        }
        if (!in_array($action, ['edit', 'block', 'unblock', 'activate', 'removeFromGroup', 'delete'], true)) {
            throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_UNKNOWN_ACTION'), 400);
        }
        if ($selection === []) {
            throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        }

        $ids = [];
        foreach ($selection as $resourceId) {
            $resourceId = (string) $resourceId;
            if (!str_starts_with($resourceId, 'user:')) {
                throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
            }
            $resource = $this->getResource($resourceId);
            if (empty($resource['capabilities'][$action])) {
                throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
            }
            $ids[] = (int) substr($resourceId, 5);
        }

        if ($action === 'edit') {
            if (count($ids) !== 1) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_SINGLE_SELECTION_REQUIRED'), 400);
            $url = 'index.php?option=com_users&task=user.edit&id=' . $ids[0];
            return ['command' => 'openEditor', 'url' => EditorRoute::link($this->app, $url)];
        }

        $model = $this->userModel();
        if ($action === 'removeFromGroup') {
            $groups = (array) ($payload['groups'] ?? []);
            foreach ($ids as $id) {
                $groupId = (int) ($groups['user:' . $id] ?? 0);
                if ($groupId < 1 || !in_array($groupId, $this->userGroupIds($id), true) || count($this->userGroupIds($id)) < 2) {
                    throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
                }
            }
            foreach ($ids as $id) {
                $model = $this->userModel();
                if (!$model->batchUser((int) $groups['user:' . $id], [$id], 'del')) {
                    throw new \RuntimeException($model->getError() ?: Text::_('JERROR_AN_ERROR_HAS_OCCURRED'), 500);
                }
            }
            return ['updated' => array_values($selection)];
        }
        $result = match ($action) {
            'block' => $model->block($ids, 1),
            'unblock' => $model->block($ids, 0),
            'activate' => $model->activate($ids),
            'delete' => $model->delete($ids),
        };
        if (!$result) throw new \RuntimeException($model->getError() ?: Text::_('JERROR_AN_ERROR_HAS_OCCURRED'), 500);

        return ['updated' => array_values($selection)];
    }

    public function configureBrowseRoot(?string $browseRoot): void
    {
        $this->browseRoot = $browseRoot !== null && $browseRoot !== '' ? $browseRoot : null;
        if (!$this->browseRoot) return;
        if (!str_starts_with($this->browseRoot, 'user-group:') || $this->groupId($this->browseRoot) < 1) {
            throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        }
        $this->group($this->groupId($this->browseRoot));
    }

    public function getBrowseRoot(): ?string
    {
        return $this->browseRoot;
    }

    public function getInitialNode(?string $candidate = null): string
    {
        $fallback = $this->browseRoot ?: self::ROOT_ID;
        if (!$candidate) return $fallback;
        try {
            $this->assertBrowseScope([$candidate]);
            return str_starts_with($candidate, 'user-group:') || $candidate === self::ROOT_ID ? $candidate : $fallback;
        } catch (\Throwable) {
            return $fallback;
        }
    }

    public function assertBrowseScope(array $resourceIds): void
    {
        foreach ($resourceIds as $resourceId) {
            $resourceId = (string) $resourceId;
            if ($resourceId === '') continue;
            if (!$this->browseRoot) {
                if ($resourceId === self::ROOT_ID || str_starts_with($resourceId, 'user-group:') || str_starts_with($resourceId, 'user:')) continue;
                throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
            }

            $inside = match (true) {
                str_starts_with($resourceId, 'user-group:') => $this->groupWithinBrowseRoot($this->groupId($resourceId)),
                str_starts_with($resourceId, 'user:') => $this->userWithinBrowseRoot((int) substr($resourceId, 5)),
                default => false,
            };
            if (!$inside) throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
        }
    }

    private function usersForGroup(int $groupId, array $options): array
    {
        $model = $this->app->bootComponent('com_users')->getMVCFactory()->createModel('Users', 'Administrator', ['ignore_request' => true]);
        $sortBy = (string) ($options['sortBy'] ?? 'name');
        $model->setState('filter.group_id', $groupId);
        $model->setState('filter.search', trim((string) ($options['search'] ?? '')));
        $model->setState('filter.state', match ((string) ($options['filters']['state'] ?? 'all')) {
            'enabled' => 0, 'blocked' => 1, default => '',
        });
        $model->setState('filter.active', match ((string) ($options['filters']['activation'] ?? 'all')) {
            'active' => 0, 'pending' => 1, default => '',
        });
        $filters = $options['filters'] ?? [];
        $model->setState('filter.mfa', in_array((string) ($filters['mfa'] ?? ''), ['0', '1'], true) ? (int) $filters['mfa'] : '');
        $model->setState('filter.range', $this->dateRange((string) ($filters['registered'] ?? '')));
        $model->setState('filter.lastvisitrange', $this->dateRange((string) ($filters['lastVisit'] ?? '')));
        $model->setState('list.ordering', match ($sortBy) {
            'username' => 'a.username', 'registered' => 'a.registerDate', 'lastVisit' => 'a.lastvisitDate',
            'id' => 'a.id', default => 'a.name',
        });
        $model->setState('list.direction', strtoupper(($options['sortDirection'] ?? 'asc') === 'desc' ? 'DESC' : 'ASC'));
        $model->setState('list.limit', 0);

        $users = $model->getItems() ?: [];
        $selectedGroup = (int) ($filters['group'] ?? 0);
        if ($selectedGroup > 0) {
            $users = array_filter($users, fn (object $user): bool => in_array($selectedGroup, $this->userGroupIds((int) $user->id), true));
        }
        return array_values(array_map(fn (object $user): array => $this->normalizeUser($user, $groupId), $users));
    }

    private function normalizeGroup(object $group): array
    {
        $id = (int) $group->id;
        return [
            'id' => 'user-group:' . $id, 'title' => (string) $group->title, 'subtitle' => Text::_('COM_SMARTBROWSER_USER_GROUP'),
            'parentId' => $this->browseRoot === 'user-group:' . $id ? null : ((int) $group->parent_id > 0 ? 'user-group:' . $group->parent_id : self::ROOT_ID),
            'kind' => 'node', 'type' => 'user-group', 'icon' => 'fas fa-users-rectangle', 'image' => null,
            'selectable' => false, 'bulkSelectable' => false, 'focusable' => true, 'actionable' => false,
            'navigable' => true, 'hasChildren' => $this->hasGroupChildren($id),
            'capabilities' => ['open' => true],
            'metadata' => ['id' => $id, 'parentId' => (int) $group->parent_id],
        ];
    }

    private function normalizeUser(object $user, ?int $groupId = null): array
    {
        $id = (int) $user->id;
        $blocked = (int) ($user->block ?? 0) === 1;
        $pending = trim((string) ($user->activation ?? '')) !== '';
        $capabilities = $this->userCapabilities($id, $blocked, $pending);
        $statusLabel = Text::_($blocked ? 'COM_SMARTBROWSER_USER_BLOCKED' : ($pending ? 'COM_SMARTBROWSER_USER_PENDING' : 'COM_SMARTBROWSER_USER_ENABLED'));
        $groups = $this->userGroupTitles($id, $user->group_names ?? null);

        return [
            'id' => 'user:' . $id, 'title' => (string) $user->name, 'subtitle' => (string) $user->username,
            'parentId' => null, 'kind' => 'item', 'type' => 'user', 'icon' => 'fas fa-user', 'image' => null,
            'status' => $blocked ? 0 : 1,
            'statusPresentation' => ['icon' => $blocked ? 'fas fa-lock' : 'fas fa-check', 'label' => $statusLabel, 'tone' => $blocked ? 'muted' : ($pending ? 'warning' : 'success')],
            'overlays' => [[
                'id' => 'status', 'icon' => $blocked ? 'fas fa-lock' : 'fas fa-check', 'label' => $statusLabel,
                'tone' => $blocked ? 'muted' : ($pending ? 'warning' : 'success'),
                'action' => $blocked ? 'unblock' : 'block',
            ]],
            'selectable' => true, 'bulkSelectable' => true, 'focusable' => true, 'actionable' => array_filter($capabilities) !== [],
            'navigable' => false, 'hasChildren' => false, 'capabilities' => $capabilities,
            'metadata' => [
                'id' => $id, 'username' => (string) $user->username, 'email' => (string) ($user->email ?? ''),
                'cardSummary' => implode("\n", array_filter([(string) $user->username, (string) ($user->email ?? '')])),
                'stateLabel' => $statusLabel,
                'blocked' => $blocked, 'pendingActivation' => $pending, 'groups' => implode(', ', $groups),
                'groupIds' => $this->userGroupIds($id), 'sourceGroupId' => $groupId,
                'registered' => $user->registerDate ?? null, 'lastVisit' => $user->lastvisitDate ?? null,
            ],
        ];
    }

    private function userCapabilities(int $id, bool $blocked, bool $pending): array
    {
        $identity = $this->app->getIdentity();
        $isProtectedSuperUser = Access::check($id, 'core.admin') && !$identity->authorise('core.admin');
        $canEdit = !$isProtectedSuperUser && $identity->authorise('core.edit', 'com_users');
        $canState = !$isProtectedSuperUser && $identity->authorise('core.edit.state', 'com_users');

        $canManage = $identity->authorise('core.admin') && $id !== (int) $identity->id;
        $multipleGroups = count($this->userGroupIds($id)) > 1;

        return [
            'edit' => $canEdit,
            'block' => $canState && !$blocked && $id !== (int) $identity->id,
            'unblock' => $canState && $blocked,
            'activate' => $canState && $pending,
            'removeFromGroup' => $canManage && $identity->authorise('core.edit', 'com_users') && $multipleGroups,
            'delete' => $canManage && $identity->authorise('core.delete', 'com_users'),
        ];
    }

    private function presentation(): array
    {
        return [
            'orderingField' => null,
            'sortFields' => [
                ['id' => 'name', 'label' => 'COM_SMARTBROWSER_NAME'], ['id' => 'username', 'label' => 'COM_SMARTBROWSER_USERNAME'],
                ['id' => 'registered', 'label' => 'COM_SMARTBROWSER_REGISTERED'], ['id' => 'lastVisit', 'label' => 'COM_SMARTBROWSER_LAST_VISIT'],
                ['id' => 'id', 'label' => 'JGLOBAL_FIELD_ID_LABEL'],
            ],
            'columns' => [
                ['id' => 'name', 'label' => 'COM_SMARTBROWSER_NAME', 'source' => 'title'],
                ['id' => 'username', 'label' => 'COM_SMARTBROWSER_USERNAME', 'source' => 'metadata.username'],
                ['id' => 'email', 'label' => 'JGLOBAL_EMAIL', 'source' => 'metadata.email'],
                ['id' => 'status', 'label' => 'JSTATUS', 'source' => 'metadata.stateLabel', 'format' => 'status', 'overlays' => true],
                ['id' => 'groups', 'label' => 'COM_SMARTBROWSER_USER_GROUPS', 'source' => 'metadata.groups'],
                ['id' => 'registered', 'label' => 'COM_SMARTBROWSER_REGISTERED', 'source' => 'metadata.registered', 'format' => 'date'],
                ['id' => 'lastVisit', 'label' => 'COM_SMARTBROWSER_LAST_VISIT', 'source' => 'metadata.lastVisit', 'format' => 'date'],
                ['id' => 'id', 'label' => 'JGLOBAL_FIELD_ID_LABEL', 'source' => 'metadata.id'],
            ],
            'gridFields' => [['source' => 'metadata.cardSummary']],
            'infoFields' => [
                ['label' => 'COM_SMARTBROWSER_USERNAME', 'source' => 'metadata.username'],
                ['label' => 'JGLOBAL_EMAIL', 'source' => 'metadata.email'], ['label' => 'JSTATUS', 'source' => 'metadata.stateLabel'],
                ['label' => 'COM_SMARTBROWSER_USER_GROUPS', 'source' => 'metadata.groups'],
                ['label' => 'COM_SMARTBROWSER_REGISTERED', 'source' => 'metadata.registered', 'format' => 'date'],
                ['label' => 'COM_SMARTBROWSER_LAST_VISIT', 'source' => 'metadata.lastVisit', 'format' => 'date'],
                ['label' => 'JGLOBAL_FIELD_ID_LABEL', 'source' => 'metadata.id'],
            ],
            'filters' => [[
                'id' => 'state', 'label' => 'JSTATUS', 'type' => 'select', 'default' => 'all',
                'options' => [['value' => 'all', 'label' => 'COM_SMARTBROWSER_SELECT_USER_STATE'], ['value' => 'enabled', 'label' => 'COM_SMARTBROWSER_USER_ENABLED'], ['value' => 'blocked', 'label' => 'COM_SMARTBROWSER_USER_BLOCKED']],
            ], ...(PluginHelper::isEnabled('multifactorauth') ? [[
                'id' => 'mfa', 'label' => 'COM_SMARTBROWSER_FILTER_MFA', 'type' => 'select', 'default' => '',
                'options' => [['value' => '', 'label' => 'COM_SMARTBROWSER_SELECT_MFA'], ['value' => '1', 'label' => 'COM_SMARTBROWSER_ENABLED'], ['value' => '0', 'label' => 'COM_SMARTBROWSER_DISABLED']],
            ]] : []), [
                'id' => 'activation', 'label' => 'COM_SMARTBROWSER_ACTIVATION', 'type' => 'select', 'default' => 'all',
                'options' => [['value' => 'all', 'label' => 'COM_SMARTBROWSER_SELECT_ACTIVE_STATE'], ['value' => 'active', 'label' => 'COM_SMARTBROWSER_USER_ENABLED'], ['value' => 'pending', 'label' => 'COM_SMARTBROWSER_USER_PENDING']],
            ], [
                'id' => 'group', 'label' => 'COM_SMARTBROWSER_USER_GROUP', 'type' => 'select', 'default' => '', 'options' => $this->groupOptions(),
            ], [
                'id' => 'lastVisit', 'label' => 'COM_SMARTBROWSER_LAST_VISIT', 'type' => 'select', 'default' => '', 'options' => $this->dateOptions(true),
            ], [
                'id' => 'registered', 'label' => 'COM_SMARTBROWSER_REGISTERED', 'type' => 'select', 'default' => '', 'options' => $this->dateOptions(false),
            ]],
        ];
    }

    public function getCollectionPresentation(array $resources = []): array { return $this->presentation(); }

    private function groupOptions(): array
    {
        $options = [['value' => '', 'label' => 'COM_SMARTBROWSER_SELECT_USER_GROUP']];
        foreach ($this->groups() as $group) {
            $options[] = ['value' => (string) $group->id, 'label' => str_repeat('- ', max(0, $this->groupDepth($group) - 1)) . $group->title];
        }
        return $options;
    }

    private function groupDepth(object $group): int
    {
        $depth = 0;
        foreach ($this->groups() as $candidate) {
            if ((int) $candidate->lft < (int) $group->lft && (int) $candidate->rgt > (int) $group->rgt) $depth++;
        }
        return $depth;
    }

    private function dateOptions(bool $includeNever): array
    {
        $options = [['value' => '', 'label' => $includeNever ? 'COM_SMARTBROWSER_SELECT_LAST_VISIT' : 'COM_SMARTBROWSER_SELECT_REGISTERED']];
        foreach (['today', 'past_week', 'past_1month', 'past_3month', 'past_6month', 'past_year', 'post_year'] as $range) {
            $options[] = ['value' => $range, 'label' => 'COM_SMARTBROWSER_DATE_' . strtoupper($range)];
        }
        if ($includeNever) $options[] = ['value' => 'never', 'label' => 'COM_SMARTBROWSER_DATE_NEVER'];
        return $options;
    }

    private function dateRange(string $range): string
    {
        return in_array($range, ['today', 'past_week', 'past_1month', 'past_3month', 'past_6month', 'past_year', 'post_year', 'never'], true) ? $range : '';
    }

    private function groups(): array
    {
        if ($this->groups !== null) return $this->groups;
        $db = $this->db();
        $query = $db->getQuery(true)->select(['id', 'parent_id', 'lft', 'rgt', 'title'])->from($db->quoteName('#__usergroups'))->order($db->quoteName('lft') . ' ASC');
        return $this->groups = array_values($db->setQuery($query)->loadObjectList() ?: []);
    }

    private function group(int $id): object
    {
        foreach ($this->groups() as $group) if ((int) $group->id === $id) return $group;
        throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 404);
    }

    private function user(int $id): object
    {
        $db = $this->db();
        $query = $db->getQuery(true)
            ->select([$db->quoteName('id'), $db->quoteName('name'), $db->quoteName('username'), $db->quoteName('email'), $db->quoteName('block'), $db->quoteName('activation'), $db->quoteName('registerDate'), $db->quoteName('lastvisitDate')])
            ->from($db->quoteName('#__users'))->where($db->quoteName('id') . ' = :id')->bind(':id', $id);
        $user = $db->setQuery($query)->loadObject();
        if (!$user) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 404);
        return $user;
    }

    private function userGroupTitles(int $userId, mixed $known = null): array
    {
        if (is_array($known)) return array_values(array_map('strval', $known));
        $db = $this->db();
        $query = $db->getQuery(true)->select($db->quoteName('g.title'))->from($db->quoteName('#__usergroups', 'g'))
            ->join('INNER', $db->quoteName('#__user_usergroup_map', 'm') . ' ON ' . $db->quoteName('m.group_id') . ' = ' . $db->quoteName('g.id'))
            ->where($db->quoteName('m.user_id') . ' = :userId')->bind(':userId', $userId)->order($db->quoteName('g.lft') . ' ASC');
        return array_values(array_map('strval', $db->setQuery($query)->loadColumn() ?: []));
    }

    private function userGroupIds(int $userId): array
    {
        $db = $this->db();
        $query = $db->getQuery(true)->select($db->quoteName('group_id'))
            ->from($db->quoteName('#__user_usergroup_map'))->where($db->quoteName('user_id') . ' = :userId')->bind(':userId', $userId);
        return array_map('intval', $db->setQuery($query)->loadColumn() ?: []);
    }

    private function hasGroupChildren(int $parentId): bool
    {
        foreach ($this->groups() as $group) if ((int) $group->parent_id === $parentId) return true;
        return false;
    }

    private function groupWithinBrowseRoot(int $groupId): bool
    {
        $root = $this->group($this->groupId((string) $this->browseRoot));
        $group = $this->group($groupId);
        return (int) $group->lft >= (int) $root->lft && (int) $group->rgt <= (int) $root->rgt;
    }

    private function userWithinBrowseRoot(int $userId): bool
    {
        $root = $this->group($this->groupId((string) $this->browseRoot));
        $db = $this->db();
        $query = $db->getQuery(true)->select('COUNT(*)')->from($db->quoteName('#__user_usergroup_map', 'm'))
            ->join('INNER', $db->quoteName('#__usergroups', 'g') . ' ON ' . $db->quoteName('g.id') . ' = ' . $db->quoteName('m.group_id'))
            ->where($db->quoteName('m.user_id') . ' = :userId')->where($db->quoteName('g.lft') . ' >= :left')->where($db->quoteName('g.rgt') . ' <= :right')
            ->bind(':userId', $userId)->bind(':left', $root->lft)->bind(':right', $root->rgt);
        return (int) $db->setQuery($query)->loadResult() > 0;
    }

    private function groupId(string $resourceId): int
    {
        if ($resourceId === self::ROOT_ID) return 0;
        return str_starts_with($resourceId, 'user-group:') ? (int) substr($resourceId, 11) : 0;
    }

    private function userModel(): object
    {
        return $this->app->bootComponent('com_users')->getMVCFactory()->createModel('User', 'Administrator', ['ignore_request' => true]);
    }

    private function db(): DatabaseInterface
    {
        return Factory::getContainer()->get(DatabaseInterface::class);
    }

    private function action(string $id, string $label, string $icon, bool $requiresSelection, bool $single, ?string $exclusiveGroup = null): array
    {
        return ['id' => $id, 'label' => $label, 'icon' => $icon, 'scope' => 'item', 'primary' => false, 'requiresSelection' => $requiresSelection, 'single' => $single, 'itemsOnly' => true, 'currentNode' => false, 'exclusiveGroup' => $exclusiveGroup];
    }
}
