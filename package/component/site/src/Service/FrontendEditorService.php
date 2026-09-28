<?php
namespace SuperSoft\Component\Smartbrowser\Site\Service;
use Joomla\CMS\Application\CMSApplicationInterface;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Form\Form;
use Joomla\CMS\Form\FormHelper;
use Joomla\CMS\Factory;
use Joomla\Database\DatabaseInterface;
use SuperSoft\Component\Smartbrowser\Administrator\Support\SmartAuthorsAccess;
defined('_JEXEC') or die;
final class FrontendEditorService
{
    public function __construct(private readonly CMSApplicationInterface $app) {}

    public function getForm(string $type, int $id): object
    {
        if ($type === 'menu-item' && $id === 0 && !$this->app->getInput()->getBool('menuTypeSelected')) {
            foreach (['type', 'link', 'data'] as $key) $this->app->setUserState('com_menus.edit.item.' . $key, null);
        }
        $model = $this->model($type, $id);
        $form = $model->getForm([], true);
        if (!$form) throw new \RuntimeException($model->getError() ?: Text::_('JERROR_AN_ERROR_HAS_OCCURRED'), 500);
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
        if ($type === 'article') $data['id'] = $id;
        if ($type === 'menu-item' && $id > 0 && empty($data['type'])) {
            $data['type'] = $this->storedMenuItemType($id);
        }
        $model = $this->model($type, $id);
        $form = $model->getForm($data, false);
        if (!$form) throw new \RuntimeException($model->getError() ?: Text::_('JERROR_AN_ERROR_HAS_OCCURRED'), 500);
        $valid = $model->validate($form, $data);
        if ($valid === false) throw new \RuntimeException(implode("\n", array_map('strval', $model->getErrors())), 400);
        if ($type === 'article') $valid['id'] = $id;
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
        return match ($type) {
            'article' => $this->createSiteModel('com_content', 'Form', ['a_id' => $id]),
            'category' => $this->createModel('com_categories', 'Category', ['extension' => 'com_content']),
            'tag' => $this->createModel('com_tags', 'Tag'),
            'menu-item' => $this->createModel('com_menus', 'Item'),
            'user' => $this->createModel('com_users', 'User'),
            default => throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400),
        };
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
