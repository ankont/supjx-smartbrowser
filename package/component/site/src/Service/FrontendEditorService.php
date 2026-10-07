<?php
namespace SuperSoft\Component\Smartbrowser\Site\Service;
use Joomla\CMS\Application\CMSApplicationInterface;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Form\Form;
use Joomla\CMS\Form\FormHelper;
use Joomla\CMS\Factory;
use Joomla\Database\DatabaseInterface;
use Joomla\Registry\Registry;
use SuperSoft\Component\Smartbrowser\Administrator\Support\SmartAuthorsAccess;
defined('_JEXEC') or die;
final class FrontendEditorService
{
    public function __construct(private readonly CMSApplicationInterface $app) {}

    public static function supportsArticleCreateDefaults(): bool { return true; }

    private function articleCreateDefaults(string $type, int $id): array
    {
        $input = $this->app->getInput();
        if ($type !== 'article' || $id !== 0 || $input->getMethod() !== 'GET'
            || $this->app->getUserState('com_content.edit.article.data')) return [];
        $failure = $this->app->getUserState('com_smartbrowser.editor.failure');
        if (is_array($failure) && ($failure['type'] ?? '') === 'article' && (int) ($failure['id'] ?? -1) === 0) return [];
        $json = $input->getString('sbCreateDefaults', '');
        if ($json === '') return [];
        $invalid = static fn() => new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_CREATE_DEFAULTS'), 400);
        if (strlen($json) > 4096) throw $invalid();
        try { $decoded = json_decode($json, false, 8, JSON_THROW_ON_ERROR); }
        catch (\JsonException) { throw $invalid(); }
        if (!$decoded instanceof \stdClass) throw $invalid();
        $defaults = get_object_vars($decoded);
        if (array_diff(array_keys($defaults), ['title', 'alias', 'catid', 'language'])) throw $invalid();
        foreach (['title' => 255, 'alias' => 255, 'language' => 7] as $field => $limit) {
            if (!array_key_exists($field, $defaults)) continue;
            $value = $defaults[$field];
            if (!is_string($value) || preg_match_all('/./us', $value) > $limit || preg_match('/[\x00-\x1f\x7f]/u', $value)) throw $invalid();
        }
        if (isset($defaults['language']) && $defaults['language'] !== '*'
            && !preg_match('/^[a-z]{2,3}-[A-Za-z0-9]{2,3}$/D', $defaults['language'])) throw $invalid();
        if (array_key_exists('catid', $defaults) && (!is_int($defaults['catid']) || $defaults['catid'] <= 0)) throw $invalid();
        $requested = $input->getInt('catid');
        $category = $defaults['catid'] ?? $requested;
        if ($category <= 0 || $requested < 0 || ($requested > 0 && $requested !== $category)) throw $invalid();
        if (!$this->app->getIdentity()->authorise('core.create', 'com_content.category.' . $category)) {
            throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
        }
        // The native model and its ACL checks must use the exact authorized category.
        $input->set('catid', $category);
        return $defaults;
    }

    public function getForm(string $type, int $id): object
    {
        if ($type === 'article' && $id === 0) {
            $failure = $this->app->getUserState('com_smartbrowser.editor.failure');
            $previous = is_array($failure) && ($failure['type'] ?? '') === 'article' && (int) ($failure['id'] ?? -1) === 0
                ? ($failure['data'] ?? []) : $this->app->getUserState('com_content.edit.article.data', []);
            $previous = (array) $previous;
            if (isset($previous['catid']) && is_scalar($previous['catid']) && (int) $previous['catid'] > 0) {
                $this->app->getInput()->set('catid', (int) $previous['catid']);
            }
        }
        $createDefaults = $this->articleCreateDefaults($type, $id);
        if ($type === 'menu-item' && $id === 0 && !$this->app->getInput()->getBool('menuTypeSelected')) {
            foreach (['type', 'link', 'data'] as $key) $this->app->setUserState('com_menus.edit.item.' . $key, null);
        }
        $model = $this->model($type, $id);
        $form = $model->getForm([], true);
        if (!$form) throw new \RuntimeException($model->getError() ?: Text::_('JERROR_AN_ERROR_HAS_OCCURRED'), 500);
        if ($createDefaults && !(int) $form->getValue('id') && !$form->getValue('title')
            && !$form->getValue('alias') && !$form->getValue('articletext')) {
            if (isset($createDefaults['language'])) {
                $language = $form->getField('language');
                $options = $language ? ($language->options ?? []) : [];
                if ($options && !in_array($createDefaults['language'], array_map(static fn($option) => (string) $option->value, $options), true)) {
                    throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_CREATE_DEFAULTS'), 400);
                }
            }
            foreach ($createDefaults as $name => $value) $form->setValue($name, null, $value);
        }
        if ($type === 'category') {
            $form->setFieldAttribute('parent_id', 'parent', 'true');
            $form->setFieldAttribute('parent_id', 'extension', 'com_content');
        }
        if ($type === 'article' && $id > 0) {
            $form->bind($this->articleMediaGroups($model, $id));
        }
        if ($type === 'article' && $id === 0 && $this->app->getInput()->getInt('sbTagId') > 0 && !$form->getValue('tags')) {
            $form->setValue('tags', null, [$this->app->getInput()->getInt('sbTagId')]);
        }
        if ($id === 0 && in_array($type, ['category', 'tag'], true)) {
            $parentId = $this->app->getInput()->getInt('parent_id');
            if ($parentId > 0) $form->setValue('parent_id', null, $parentId);
        }
        if ($type === 'user' && $id === 0) {
            $groupId = $this->app->getInput()->getInt('sbGroupId');
            if ($groupId > 0) $form->setValue('groups', null, [$groupId]);
        }
        if ($this->app->getLanguage()->getTag() === 'el-GR') {
            $form->setFieldAttribute('alias', 'label', 'COM_SMARTBROWSER_ALIAS_LABEL');
            $form->setFieldAttribute('alias', 'description', 'COM_SMARTBROWSER_ALIAS_DESC');
        }
        if ($type === 'menu-item' && $id > 0 && !$this->app->getInput()->getBool('menuTypeSelected')) {
            $storedType = $this->storedMenuItemType($id);
            if (in_array($storedType, ['heading', 'url', 'separator', 'alias', 'container'], true)) {
                $form->setValue('type', null, $storedType);
                $typeField = $form->getField('type');
                if ($typeField) $typeField->value = $storedType;
            }
        }
        if ($type === 'menu-item' && $id === 0) {
            $menuType = $this->app->getInput()->getCmd('menutype');
            $parentId = $this->app->getInput()->getInt('parent_id', 1);
            if ($menuType !== '') $form->setValue('menutype', null, $menuType);
            if ($parentId > 1) $form->setValue('parent_id', null, $parentId);
        }
        return $form;
    }

    public function save(string $type, int $id, array $data, bool $copy = false): int
    {
        $data['id'] = $id;
        if ($type === 'article' && $id === 0 && isset($data['catid'])) {
            $this->app->getInput()->set('catid', (int) $data['catid']);
        }
        if ($type === 'menu-item' && $id > 0 && empty($data['type'])) {
            $data['type'] = $this->storedMenuItemType($id);
        }
        $model = $this->model($type, $id);
        $form = $model->getForm($data, false);
        if (!$form) throw new \RuntimeException($model->getError() ?: Text::_('JERROR_AN_ERROR_HAS_OCCURRED'), 500);
        $valid = $model->validate($form, $data);
        if ($valid === false) throw new \RuntimeException(implode("\n", array_map('strval', $model->getErrors())), 400);
        $valid['id'] = $id;
        if ($type === 'article' && $id > 0) {
            foreach ($this->articleMediaGroups($model, $id) as $group => $stored) {
                if (isset($valid[$group]) && is_array($valid[$group])) {
                    $valid[$group] = array_replace($stored, $valid[$group]);
                }
            }
        }
        if ($copy) {
            if ($type !== 'article' || $id <= 0) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
            $categoryId = (int) ($valid['catid'] ?? $this->articleCategoryId($id));
            $user = $this->app->getIdentity();
            $service = SmartAuthorsAccess::service($this->app);
            if (!$user->authorise('core.create', 'com_content.category.' . $categoryId)
                && ($service === null || !$service->canCreateArticle((int) $user->id, $categoryId))) {
                throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
            }
            $valid['catid'] = $categoryId;
            $valid['id'] = 0;
            $valid['associations'] = [];
            unset($valid['created'], $valid['created_by'], $valid['modified'], $valid['modified_by']);
            $this->app->getInput()->set('task', 'save2copy');
        }
        if ($type === 'category' && $id > 0 && !isset($valid['associations'])) {
            $valid['associations'] = (array) ($model->getItem($id)->associations ?? []);
        }
        if (!$model->save($valid)) throw new \RuntimeException($model->getError() ?: Text::_('JERROR_AN_ERROR_HAS_OCCURRED'), 500);
        return (int) $model->getState($model->getName() . '.id', $id);
    }

    private function articleCategoryId(int $id): int
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true)
            ->select($db->quoteName('catid'))
            ->from($db->quoteName('#__content'))
            ->where($db->quoteName('id') . ' = ' . $id);
        return (int) $db->setQuery($query)->loadResult();
    }

    private function articleMediaGroups(object $model, int $id): array
    {
        $article = $model->getItem($id);
        if (!$article || empty($article->id)) return [];

        $groups = [];
        foreach (['images', 'urls'] as $group) {
            $value = $article->{$group} ?? null;
            $groups[$group] = is_array($value) ? $value : (new Registry((string) $value))->toArray();
        }
        return $groups;
    }

    public function title(string $type, int $id): string
    {
        $key = $id > 0 ? 'COM_SMARTBROWSER_FRONTEND_EDITOR_EDIT_' : 'COM_SMARTBROWSER_FRONTEND_EDITOR_CREATE_';
        return Text::_($key . strtoupper(str_replace('-', '_', $type)));
    }

    public function storedMenuItemType(int $id): string
    {
        if ($id <= 0) return '';
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true)
            ->select($db->quoteName('type'))
            ->from($db->quoteName('#__menu'))
            ->where($db->quoteName('id') . ' = ' . $id);
        $db->setQuery($query);
        return (string) $db->loadResult();
    }

    public function clearMenuItemState(): void
    {
        foreach (['type', 'link', 'data'] as $key) $this->app->setUserState('com_menus.edit.item.' . $key, null);
    }

    private function model(string $type, int $id): object
    {
        $this->loadLanguages($type);
        $this->assertAllowed($type, $id);
        $input = $this->app->getInput();
        $input->set('id', $id);
        $model = match ($type) {
            'article' => $this->createSiteModel('com_content', 'Form', ['a_id' => $id]),
            'category' => $this->createModel('com_categories', 'Category', ['extension' => 'com_content']),
            'tag' => $this->createModel('com_tags', 'Tag'),
            'menu-item' => $this->createModel('com_menus', 'Item'),
            'user' => $this->createModel('com_users', 'User'),
            default => throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400),
        };
        if ($type === 'menu-item' && $id > 0) {
            $model->getState('item.id');
            $model->setState('item.type', $this->storedMenuItemType($id));
        }
        return $model;
    }

    private function loadLanguages(string $type): void
    {
        $language = $this->app->getLanguage();
        $language->load('com_smartbrowser', JPATH_ADMINISTRATOR, null, true);
        foreach (['joomla', 'lib_joomla'] as $extension) {
            $language->load($extension, JPATH_SITE, null, true);
            $language->load($extension, JPATH_ADMINISTRATOR, null, true);
        }
        $components = match ($type) {
            'article' => ['com_content', 'com_categories', 'com_fields', 'com_media'],
            'category' => ['com_categories', 'com_content', 'com_fields', 'com_media'],
            'tag' => ['com_tags', 'com_content', 'com_fields', 'com_media'],
            'menu-item' => ['com_menus', 'com_content', 'com_fields'],
            'user' => ['com_users', 'com_fields'],
            default => [],
        };
        foreach ($components as $component) {
            $language->load($component, JPATH_SITE, null, true);
            $language->load($component, JPATH_ADMINISTRATOR, null, true);
        }
    }

    private function createModel(string $component, string $name, array $input = []): object
    {
        foreach ($input as $key => $value) $this->app->getInput()->set($key, $value);
        $this->app->getLanguage()->load($component, JPATH_ADMINISTRATOR, null, true);
        if ($component === 'com_menus') {
            $this->app->bootComponent('com_content');
            FormHelper::addFieldPrefix('Joomla\\Component\\Content\\Administrator\\Field');
        }
        Form::addFormPath(JPATH_ADMINISTRATOR . '/components/' . $component . '/forms');
        Form::addFieldPath(JPATH_ADMINISTRATOR . '/components/' . $component . '/src/Field');
        return $this->app->bootComponent($component)->getMVCFactory()->createModel($name, 'Administrator', ['ignore_request' => false]);
    }

    private function createSiteModel(string $component, string $name, array $input = []): object
    {
        foreach ($input as $key => $value) $this->app->getInput()->set($key, $value);
        Form::addFormPath(JPATH_SITE . '/components/' . $component . '/forms');
        Form::addFieldPath(JPATH_ADMINISTRATOR . '/components/' . $component . '/src/Field');
        return $this->app->bootComponent($component)->getMVCFactory()->createModel($name, 'Site', ['ignore_request' => false]);
    }

    private function assertAllowed(string $type, int $id): void
    {
        $user = $this->app->getIdentity();
        $action = $id > 0 ? 'core.edit' : 'core.create';
        $asset = match ($type) {
            'article' => $id > 0
                ? 'com_content.article.' . $id
                : ($this->app->getInput()->getInt('catid') > 0 ? 'com_content.category.' . $this->app->getInput()->getInt('catid') : 'com_content'),
            'category' => $id > 0 ? 'com_content.category.' . $id : ($this->parentAsset('com_content.category.') ?: 'com_content'),
            'tag' => $id > 0 ? 'com_tags.tag.' . $id : ($this->parentAsset('com_tags.tag.') ?: 'com_tags'),
            'menu-item' => $this->menuAsset($id),
            'user' => 'com_users',
            default => '',
        };
        $allowed = $asset !== '' && $user->authorise($action, $asset);
        if ($type === 'article' && $id > 0 && !$allowed && $user->authorise('core.edit.own', $asset)) {
            $article = $this->app->bootComponent('com_content')->getMVCFactory()->createModel('Article', 'Administrator', ['ignore_request' => true])->getItem($id);
            $allowed = (int) ($article->created_by ?? 0) === (int) $user->id;
        }
        if ($type === 'article' && !$allowed) {
            if ($id > 0) {
                $db = Factory::getContainer()->get(DatabaseInterface::class);
                $query = $db->getQuery(true)
                    ->select($db->quoteName(['id', 'catid', 'created_by']))
                    ->from($db->quoteName('#__content'))
                    ->where($db->quoteName('id') . ' = ' . $id);
                $article = $db->setQuery($query)->loadObject();
                $allowed = $article !== null && SmartAuthorsAccess::canEditArticle($this->app, $user, $article);
            } else {
                $service = SmartAuthorsAccess::service($this->app);
                $categoryId = $this->app->getInput()->getInt('catid');
                $allowed = $service !== null && $categoryId > 0 && $service->canCreateArticle((int) $user->id, $categoryId);
            }
        }
        if (!$allowed) throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
    }

    private function parentAsset(string $prefix): ?string
    {
        $parentId = $this->app->getInput()->getInt('parent_id');
        return $parentId > 1 ? $prefix . $parentId : null;
    }

    private function menuAsset(int $id): string
    {
        $menuType = $this->app->getInput()->getCmd('menutype');
        if ($id > 0) {
            $model = $this->app->bootComponent('com_menus')->getMVCFactory()->createModel('Item', 'Administrator', ['ignore_request' => true]);
            $menuType = (string) ($model->getItem($id)->menutype ?? '');
        }
        if ($menuType === '') return 'com_menus';
        $menuModel = $this->app->bootComponent('com_menus')->getMVCFactory()->createModel('Menu', 'Administrator', ['ignore_request' => true]);
        return 'com_menus.menu.' . (int) ($menuModel->getItem($menuType)->id ?? 0);
    }
}
