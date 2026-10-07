<?php

namespace SuperSoft\Plugin\System\Smartbrowserintegration\Extension;

use Joomla\CMS\Event\Menu\PreprocessMenuItemsEvent;
use Joomla\CMS\Event\Model\PrepareDataEvent;
use Joomla\CMS\Component\ComponentHelper;
use Joomla\CMS\Log\Log;
use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Plugin\PluginHelper;
use Joomla\CMS\Uri\Uri;
use Joomla\Event\SubscriberInterface;
use Joomla\Event\Priority;
use Joomla\CMS\Session\Session;
use Throwable;

defined('_JEXEC') or die;

final class Smartbrowserintegration extends CMSPlugin implements SubscriberInterface
{
    protected $autoloadLanguage = true;

    public static function getSubscribedEvents(): array
    {
        return ['onEditorButtonsSetup' => ['replaceEditorButtons', Priority::LOW], 'onPreprocessMenuItems' => 'replaceManagerLinks', 'onBeforeCompileHead' => 'preparePickers', 'onAfterRoute' => 'returnFromMenuEditor', 'onContentPrepareData' => 'prefillArticleContext'];
    }

    public function replaceEditorButtons($event): void
    {
        $params = ComponentHelper::getParams('com_smartbrowser');
        $replacements = [];
        if ($params->get('replace_media', 0) || $params->get('replace_media_field', 0)) $replacements['image'] = 'smartbrowser-media';
        if ($params->get('replace_articles', 0)) $replacements['article'] = 'smartbrowser-article';
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

    public function preparePickers(): void
    {
        $app = $this->getApplication();
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
        $mediaPicker = (bool) ComponentHelper::getParams('com_smartbrowser')->get('replace_media_field', 0);
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
        $integrated = (bool) array_filter($replacements, static fn (string $key): bool => (bool) $params->get($key, 0));
        foreach ($items as $item) {
            if ($integrated && $params->get('hide_component_menu', 0) && $this->isComponentMenu((string) ($item->link ?? ''))) {
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
        if ($featured) return ComponentHelper::getParams('com_smartbrowser')->get('replace_featured_articles', 0) ? 'featured-articles' : null;
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
        if (!isset($map[$key]) || !ComponentHelper::getParams('com_smartbrowser')->get($map[$key][1], 0)) return null;
        if (($query['option'] ?? '') === 'com_categories' && ($query['extension'] ?? 'com_content') !== 'com_content') return null;
        return $map[$key][0];
    }
}
