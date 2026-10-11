<?php

namespace SuperSoft\Plugin\System\Smartbrowserintegration\Extension;

use Joomla\CMS\Event\Menu\PreprocessMenuItemsEvent;
use Joomla\CMS\Event\Model\PrepareDataEvent;
use Joomla\CMS\Component\ComponentHelper;
use Joomla\CMS\Log\Log;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Plugin\PluginHelper;
use Joomla\CMS\Uri\Uri;
use Joomla\Event\SubscriberInterface;
use Joomla\Event\Priority;
use Joomla\CMS\Session\Session;
use Throwable;
use SuperSoft\Component\Smartbrowser\Administrator\Support\IntegrationOptions;

defined('_JEXEC') or die;

final class Smartbrowserintegration extends CMSPlugin implements SubscriberInterface
{
    protected $autoloadLanguage = true;

    public static function getSubscribedEvents(): array
    {
        return ['onEditorButtonsSetup' => ['replaceEditorButtons', Priority::LOW], 'onPreprocessMenuItems' => 'replaceManagerLinks', 'onBeforeCompileHead' => 'preparePickers', 'onBeforeRender' => 'prepareOptionsToolbar', 'onAfterRoute' => 'routeEditors', 'onContentPrepareData' => 'prefillArticleContext'];
    }

    public function routeEditors(): void
    {
        $this->returnFromNativeEditor();
        $this->replaceNativeEditor();
        $this->returnFromMenuEditor();
    }

    public function returnFromNativeEditor(): void
    {
        $app = $this->getApplication();
        $input = $app->getInput();
        $option = $input->getCmd('option', '');
        $key = 'com_smartbrowser.editor.native_return';
        $prefix = match ($option) {
            'com_content' => 'article', 'com_categories' => 'category', 'com_tags' => 'tag',
            'com_menus' => 'item', 'com_users' => 'user', default => null,
        };
        if ($prefix && $input->getBool('sbNative') && $input->getMethod() === 'GET') {
            $encoded = $input->getString('sbReturn', '');
            $url = strlen($encoded) <= 4096 ? base64_decode($encoded, true) : false;
            $app->setUserState($key, $url && Uri::isInternal($url) ? ['option'=>$option, 'url'=>$url, 'pending'=>false] : null);
            return;
        }
        $context = $app->getUserState($key);
        if (!is_array($context)) return;
        if ($option !== $context['option']) {
            $app->setUserState($key, null);
            return;
        }
        $task = $input->getCmd('task', '');
        if ($input->getMethod() === 'POST' && in_array($task, [$prefix . '.save', $prefix . '.cancel'], true) && Session::checkToken('request')) {
            $context['pending'] = true;
            $app->setUserState($key, $context);
            return;
        }
        $finishedViews = $app->isClient('site') ? ['article', 'category', 'featured'] : ['articles', 'featured', 'categories', 'tags', 'items', 'users'];
        if ($input->getMethod() === 'GET' && $task === '' && !empty($context['pending'])
            && in_array($input->getCmd('view', ''), $finishedViews, true)) {
            $app->setUserState($key, null);
            $app->setUserState('com_smartbrowser.editor.native', null);
            if (Uri::isInternal($context['url'])) {
                $app->redirect($context['url']);
                $app->close();
            }
        }
    }

    public function replaceNativeEditor(): void
    {
        $app = $this->getApplication();
        $input = $app->getInput();
        $option = $input->getCmd('option', '');
        $site = $app->isClient('site');
        if ($site && $option === 'com_content' && $input->getBool('sbEditor')
            && IntegrationOptions::enabled('replace_editor_article_site')) {
            $task = $input->getCmd('task', '');
            if (!in_array($task, ['', 'editor.save', 'editor.cancel'], true)) return;
            $id = $input->getInt('a_id');
            if ($id <= 0) return;
            $app->setUserState('com_smartbrowser.editor.native', null);
            $input->set('option', 'com_smartbrowser');
            $input->set('view', 'editor');
            $input->set('layout', 'modal');
            $input->set('type', 'article');
            $input->set('id', $id);
            return;
        }
        $type = match ($option) {
            'com_content' => 'article', 'com_categories' => 'category', 'com_tags' => 'tag',
            'com_menus' => 'menu-item', 'com_users' => 'user', default => null,
        };
        $id = $input->getInt('id', $input->getInt('a_id'));
        $requestedTask = $input->getCmd('task', '');
        $creating = $type && $requestedTask === ($type === 'menu-item' ? 'item' : $type) . '.add';
        if ($site && $type === 'article') $id = $input->getInt('a_id');
        if ($creating) $id = 0;
        if ($id <= 0 && !$creating) {
            $ids = $input->get('cid', [], 'array');
            if (isset($ids[0]) && is_scalar($ids[0])) $id = max(0, (int) $ids[0]);
        }
        $stateKey = 'com_smartbrowser.editor.native';
        if ($input->getBool('sbNative') && $type) {
            $app->setUserState($stateKey, [$option, $id]);
            return;
        }
        $view = $input->getCmd('view', '');
        $task = $input->getCmd('task', '');
        $editView = match ($type) { 'article' => $site ? 'form' : 'article', 'category' => 'category', 'tag' => 'tag', 'menu-item' => 'item', 'user' => 'user', default => '' };
        $taskPrefix = $type === 'menu-item' ? 'item' : ($type ?? '');
        $entry = in_array($task, [$taskPrefix . '.edit', $taskPrefix . '.add'], true)
            || ($task === '' && $editView !== '' && $view === $editView);
        if ($task === '' && $entry && $id > 0 && $app->getUserState($stateKey) === [$option, 0]) {
            // Native Apply can assign a new record ID while staying in the fallback editor.
            $app->setUserState($stateKey, [$option, $id]);
            return;
        }
        if ($app->getUserState($stateKey) === [$option, $id] && ($entry || $input->getMethod() === 'POST')) return;
        $app->setUserState($stateKey, null);
        $navigationPost = $input->getMethod() === 'POST' && in_array($task, [$taskPrefix . '.edit', $taskPrefix . '.add'], true)
            && Session::checkToken('request');
        if (!$type || !$entry || ($input->getMethod() !== 'GET' && !$navigationPost) || $app->getIdentity()->guest
            || ($type === 'category' && $input->getCmd('extension', 'com_content') !== 'com_content')) return;
        $key = IntegrationOptions::editorKey($type, $site);
        if (!$key || !IntegrationOptions::enabled($key)) return;
        $url = 'index.php?option=com_smartbrowser&view=editor&layout=modal&type=' . $type . '&id=' . $id;
        $url .= $input->getCmd('tmpl') === 'component' ? '&tmpl=component' : '&sbpage=1';
        foreach (['extension', 'parent_id', 'menutype', 'catid', 'Itemid'] as $name) {
            $value = $input->getString($name, '');
            if ($value !== '') $url .= '&' . $name . '=' . rawurlencode($value);
        }
        $return = $site ? ($id > 0 ? 'index.php?option=com_content&view=article&id=' . $id : 'index.php') : 'index.php?option=com_smartbrowser&view=dashboard';
        $encoded = $input->getString('return', '');
        $requested = strlen($encoded) <= 4096 ? base64_decode($encoded, true) : false;
        if ($requested && Uri::isInternal($requested)) $return = $requested;
        $url .= '&sbReturn=' . rawurlencode(base64_encode($return));
        $app->redirect(\Joomla\CMS\Router\Route::_($url, false));
        $app->close();
    }

    public function prepareOptionsToolbar(): void
    {
        $app = $this->getApplication();
        if (!$app->isClient('administrator') || $app->getInput()->getCmd('option') !== 'com_config'
            || $app->getInput()->getCmd('component') !== 'com_smartbrowser') return;
        $document = $app->getDocument();
        if (!method_exists($document, 'getToolbar')) return;
        $toolbar = $document->getToolbar();
        $toolbar->setItems(array_values(array_filter($toolbar->getItems(), static fn ($button): bool =>
            !$button instanceof \Joomla\CMS\Toolbar\Button\HelpButton)));
    }

    public function replaceEditorButtons($event): void
    {
        $params = ComponentHelper::getParams('com_smartbrowser');
        $replacements = [];
        if (IntegrationOptions::enabled('replace_editor_media', $params)) $replacements['image'] = 'smartbrowser-media';
        if (IntegrationOptions::enabled('replace_editor_articles', $params)) $replacements['article'] = 'smartbrowser-article';
        if (IntegrationOptions::enabled('replace_editor_menus', $params)) $replacements['menu'] = 'smartbrowser-menu';
        $buttons = array_filter($event->getButtonsRegistry()->getAll(), static fn ($button) => isset($replacements[$button->getButtonName()]));
        if (!$buttons) return;
        $app = $this->getApplication();
        $document = $app->getDocument();
        try {
            $assets = $document->getWebAssetManager();
            $assets->getRegistry()->addExtensionRegistryFile('com_smartbrowser');
            $assets->useStyle('com_smartbrowser.app')->useScript('com_smartbrowser.editor-buttons');
            $base = Uri::root() . ($app->isClient('administrator') ? 'administrator/' : '');
            $document->addScriptOptions('com_smartbrowser.editor-buttons', [
                'url' => $base . 'index.php?option=com_smartbrowser&view=browser',
                'apiUrl' => $base . 'index.php?option=com_smartbrowser',
                'siteUrl' => Uri::root(), 'csrfToken' => Session::getFormToken(),
            ]);
            // Replace only buttons already authorised by the native editor plugins.
            foreach ($buttons as $button) $button->set('action', $replacements[$button->getButtonName()]);
        } catch (Throwable $error) {
            Log::add('SmartBrowser editor button integration could not be loaded: ' . $error->getMessage(), Log::ERROR, 'smartbrowser');
        }
    }

    public function returnFromMenuEditor(): void
    {
        $app = $this->getApplication();
        if (!$app->isClient('administrator')) return;
        $input = $app->getInput();
        $stateKey = 'com_smartbrowser.menu_editor_return';
        if ($input->getCmd('option') === 'com_smartbrowser') {
            if ($input->getCmd('view') === 'browser' && !$input->getCmd('task') && $input->getCmd('tmpl') !== 'component') {
                $app->setUserState($stateKey, null);
            }
            return;
        }
        if ($input->getCmd('option') !== 'com_menus') return;
        if (in_array($input->getCmd('task'), ['item.save', 'item.cancel', 'item.apply', 'item.save2copy'], true) && $input->getMethod() === 'POST') {
            $encoded = $input->post->getString('sbReturn');
            $url = $encoded ? base64_decode($encoded, true) : false;
            if ($url && Uri::isInternal($url)) {
                parse_str((string) parse_url($url, PHP_URL_QUERY), $query);
                if (($query['option'] ?? '') === 'com_smartbrowser' && ($query['view'] ?? '') === 'browser') {
                    $app->setUserState($stateKey, $url);
                }
            }
            return;
        }
        $url = $app->getUserState($stateKey);
        if (!$url) return;
        if ($input->getCmd('view', 'items') === 'items' && !$input->getCmd('task')) {
            $app->setUserState($stateKey, null);
            $app->redirect($url);
        }
    }

    public function prefillArticleContext(PrepareDataEvent $event): void
    {
        $app = $this->getApplication();
        if ($event->getArgument('context') !== 'com_content.article'
            || $app->getInput()->getInt('sbTagId') <= 0
            || $app->getInput()->getInt('id') > 0
            || !in_array($app->getInput()->getCmd('option'), ['com_content', 'com_smartbrowser'], true)) return;

        $data = $event->getData();
        if (is_array($data)) {
            if (!empty($data['id']) || !empty($data['tags'])) return;
            $data['tags'] = [$app->getInput()->getInt('sbTagId')];
        } else {
            if (!empty($data->id) || !empty($data->tags)) return;
            $data->tags = [$app->getInput()->getInt('sbTagId')];
        }
        $event->updateData($data);
    }

    public function replaceManagerLinks(PreprocessMenuItemsEvent $event): void
    {
        if (!$this->getApplication()->isClient('administrator')) return;
        $items = $event->getItems();
        $this->rewrite($items);
        $event->updateItems($items);
    }

    public function prepareArticleEditLinks(): void
    {
        $app = $this->getApplication();
        if (!$app->isClient('site') || $app->getIdentity()->guest
            || !IntegrationOptions::enabled('replace_editor_article_site')
            || ComponentHelper::getParams('com_smartbrowser')->get('editor_site', 'modal') !== 'modal'
            || $app->getInput()->getCmd('tmpl', '') === 'component') return;
        $document = $app->getDocument();
        if (!method_exists($document, 'getWebAssetManager')) return;
        $assets = $document->getWebAssetManager();
        $assets->getRegistry()->addExtensionRegistryFile('com_smartbrowser');
        $assets->registerScript('com_smartbrowser.article-edit-links', 'com_smartbrowser/article-edit-links.js', [], ['type' => 'module'], ['core', 'com_smartbrowser.dialog-dismiss']);
        $assets->useStyle('com_smartbrowser.app')->useScript('com_smartbrowser.article-edit-links');
        foreach (['COM_SMARTBROWSER_WORKING', 'COM_SMARTBROWSER_EDITOR_MAXIMIZE', 'COM_SMARTBROWSER_EDITOR_RESTORE'] as $key) Text::script($key);
    }

    public function preparePickers(): void
    {
        $app = $this->getApplication();
        $this->prepareArticleEditLinks();
        if ($app->isClient('administrator') && $app->getInput()->getCmd('option') === 'com_menus'
            && $app->getInput()->getCmd('view') === 'item') {
            $encoded = $app->getInput()->getString('return');
            if (!$encoded && $app->getUserState('com_smartbrowser.menu_editor_return')) {
                $encoded = base64_encode($app->getUserState('com_smartbrowser.menu_editor_return'));
            }
            $url = $encoded ? base64_decode($encoded, true) : false;
            if ($url && Uri::isInternal($url)) {
                parse_str((string) parse_url($url, PHP_URL_QUERY), $query);
                if (($query['option'] ?? '') === 'com_smartbrowser' && ($query['view'] ?? '') === 'browser') {
                    $app->getDocument()->addScriptDeclaration('document.addEventListener("DOMContentLoaded", function () { const form = document.getElementById("item-form") || document.getElementById("adminForm"); if (!form) return; const input = form.elements.sbReturn || document.createElement("input"); input.type = "hidden"; input.name = "sbReturn"; input.value = ' . json_encode($encoded) . '; if (!input.parentNode) form.append(input); });');
                }
            }
        }
        $mediaPicker = IntegrationOptions::enabled('replace_media_field');
        if (IntegrationOptions::enabled('replace_image_selectors')) {
            try {
                \SuperSoft\Component\Smartbrowser\Administrator\Support\ImageSelectorSupport::prepare($app->getDocument());
            } catch (Throwable $error) {
                Log::add('SmartBrowser image selectors could not be loaded.', Log::ERROR, 'smartbrowser');
            }
        }
        $smartAuthorsUsers = $app->isClient('administrator')
            && $app->getInput()->getCmd('option') === 'com_categories'
            && $app->getInput()->getCmd('extension', 'com_content') === 'com_content'
            && PluginHelper::isEnabled('system', 'smartauthors');
        if (!$mediaPicker && !$smartAuthorsUsers) return;
        $document = $this->getApplication()->getDocument();
        if (!method_exists($document, 'getWebAssetManager')) return;
        $base = $this->getApplication()->isClient('administrator') ? Uri::root() . 'administrator/' : Uri::root();
        $document->addScriptOptions('com_smartbrowser.picker', ['url' => $base . 'index.php?option=com_smartbrowser&view=browser']);
        $assets = $document->getWebAssetManager();
        try {
            $assets->getRegistry()->addExtensionRegistryFile('com_smartbrowser');
            if (!$assets->assetExists('style', 'com_smartbrowser.app')) {
                $assets->registerStyle('com_smartbrowser.app', 'com_smartbrowser/smartbrowser.css');
            }
            if (!$assets->assetExists('script', 'com_smartbrowser.picker')) {
                if (!$assets->assetExists('script', 'com_smartbrowser.media-value')) {
                    $assets->registerScript('com_smartbrowser.media-value', 'com_smartbrowser/media-value.js', [], ['defer' => true], ['core']);
                }
                if (!$assets->assetExists('script', 'com_smartbrowser.dialog-dismiss')) {
                    $assets->registerScript('com_smartbrowser.dialog-dismiss', 'com_smartbrowser/dialog-dismiss.js', [], ['defer' => true], ['core']);
                }
                $assets->registerScript('com_smartbrowser.picker', 'com_smartbrowser/picker.js', [], ['defer' => true], ['core', 'com_smartbrowser.dialog-dismiss', 'com_smartbrowser.media-value']);
            }
            if ($mediaPicker && !$assets->assetExists('script', 'com_smartbrowser.media-field')) {
                $assets->registerScript(
                    'com_smartbrowser.media-field',
                    'com_smartbrowser/media-field.js',
                    [],
                    ['defer' => true],
                    ['com_smartbrowser.picker']
                );
            }
            if ($smartAuthorsUsers && !$assets->assetExists('script', 'com_smartbrowser.smartauthors-user-field')) {
                $assets->registerScript(
                    'com_smartbrowser.smartauthors-user-field',
                    'com_smartbrowser/smartauthors-user-field.js',
                    [],
                    ['defer' => true],
                    ['com_smartbrowser.picker']
                );
            }
            $assets->useStyle('com_smartbrowser.app')->useScript('com_smartbrowser.picker');
            if ($mediaPicker) $assets->useScript('com_smartbrowser.media-field');
            if ($smartAuthorsUsers) $assets->useScript('com_smartbrowser.smartauthors-user-field');
        } catch (Throwable $error) {
            Log::add('SmartBrowser media field integration could not be loaded: ' . $error->getMessage(), Log::ERROR, 'smartbrowser');
        }
    }

    private function rewrite(array &$items): void
    {
        $params = ComponentHelper::getParams('com_smartbrowser');
        $replacements = ['replace_articles', 'replace_featured_articles', 'replace_categories', 'replace_tags', 'replace_media', 'replace_menus', 'replace_users'];
        $integrated = (bool) array_filter($replacements, static fn (string $key): bool => IntegrationOptions::enabled($key, $params));
        foreach ($items as $item) {
            if ($integrated && IntegrationOptions::enabled('hide_component_menu', $params) && $this->isComponentMenu((string) ($item->link ?? ''))) {
                $item->getParams()->set('menu_show', 0);
                continue;
            }
            if (isset($item->link) && ($adapter = $this->managerAdapter((string) $item->link))) {
                $originalLink = (string) $item->link;
                $item->link = 'index.php?option=com_smartbrowser&view=browser&adapter=' . $adapter . '&mode=manage&integrated=1';
                if ($adapter === 'menus') {
                    parse_str((string) parse_url(html_entity_decode($originalLink), PHP_URL_QUERY), $query);
                    if (!empty($query['menutype'])) {
                        $item->link .= '&browseRoot=' . rawurlencode('menu:' . (string) $query['menutype']);
                        $item->link .= '&nativeMenuTitle=' . rawurlencode((string) $item->title);
                    }
                }
            }
            if (!empty($item->submenu) && is_array($item->submenu)) $this->rewrite($item->submenu);
        }
    }

    private function isComponentMenu(string $link): bool
    {
        parse_str((string) parse_url(html_entity_decode($link), PHP_URL_QUERY), $query);
        return ($query['option'] ?? '') === 'com_smartbrowser'
            && in_array(($query['view'] ?? ''), ['', 'dashboard'], true)
            && empty($query['task']);
    }

    private function managerAdapter(string $link): ?string
    {
        $query = [];
        parse_str((string) parse_url(html_entity_decode($link), PHP_URL_QUERY), $query);
        if (!empty($query['task']) || !empty($query['layout'])) return null;
        $featured = ($query['option'] ?? '') === 'com_content'
            && (($query['view'] ?? '') === 'featured'
                || (($query['view'] ?? '') === 'articles' && (string) ($query['filter']['featured'] ?? '') === '1'));
        if ($featured) return IntegrationOptions::enabled('replace_featured_articles') ? 'featured-articles' : null;
        $map = [
            'com_content:articles' => ['articles', 'replace_articles'],
            'com_content:' => ['articles', 'replace_articles'],
            'com_categories:categories' => ['categories', 'replace_categories'],
            'com_tags:tags' => ['tags', 'replace_tags'],
            'com_media:' => ['media', 'replace_media'],
            'com_menus:items' => ['menus', 'replace_menus'],
            'com_users:users' => ['users', 'replace_users'],
        ];
        $key = ($query['option'] ?? '') . ':' . ($query['view'] ?? '');
        if (!isset($map[$key]) || !IntegrationOptions::enabled($map[$key][1])) return null;
        if (($query['option'] ?? '') === 'com_categories' && ($query['extension'] ?? 'com_content') !== 'com_content') return null;
        return $map[$key][0];
    }
}
