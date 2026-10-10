<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Controller;

use Joomla\CMS\MVC\Controller\BaseController;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Response\JsonResponse;
use Joomla\CMS\Session\Session;
use SuperSoft\Component\Smartbrowser\Administrator\Adapter\AdapterRegistry;
use SuperSoft\Component\Smartbrowser\Administrator\Adapter\BrowseRootAwareInterface;
use SuperSoft\Component\Smartbrowser\Administrator\Adapter\ContextResourceProviderInterface;
use SuperSoft\Component\Smartbrowser\Administrator\Adapter\ResourceAdapterInterface;
use SuperSoft\Component\Smartbrowser\Administrator\Support\SiteAuthentication;
use SuperSoft\Component\Smartbrowser\Administrator\Support\ContextOptions;
use SuperSoft\Component\Smartbrowser\Administrator\Support\ResourceVisualDecorator;
use Joomla\Component\Media\Administrator\Exception\FileExistsException;
use Joomla\Component\Media\Administrator\Exception\InvalidPathException;

defined('_JEXEC') or die;

class ApiController extends BaseController
{
    public function collection(): void
    {
        $this->respond(function (): array {
            if (!Session::checkToken('json')) throw new \RuntimeException('Invalid token', 403);
            $body = json_decode($this->input->json->getRaw(), true, 512, JSON_THROW_ON_ERROR);
            if (!is_array($body['items'] ?? null)) throw new \InvalidArgumentException('Invalid collection.', 400);
            if (!empty($body['referenceItems'])) {
                $collection = \SuperSoft\Component\Smartbrowser\Administrator\Support\CollectionResources::class;
                $entries = $collection::entries($body['items'], ['homogeneous' => !empty($body['homogeneous'])]);
                if (($body['operation'] ?? 'resolve') === 'reorder') {
                    if ($this->input->getCmd('mode') === 'readonly') throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
                    $keys = array_map(static fn ($entry) => $collection::key($entry['selection']), $entries);
                    $selection = $body['selection'] ?? [];
                    if (!is_array($selection) || array_diff($selection, $keys)) throw new \InvalidArgumentException('Invalid ordering selection.', 400);
                    $ordered = \SuperSoft\Component\Smartbrowser\Administrator\Support\OrderingSteps::orderedIds($keys, $selection, (string) ($body['direction'] ?? ''));
                    $byKey = array_combine($keys, $entries);
                    return ['items' => $collection::jsonEntries(array_map(static fn ($key) => $byKey[$key], $ordered))];
                }
                if (($body['operation'] ?? 'resolve') !== 'resolve') throw new \InvalidArgumentException('Invalid collection operation.', 400);
                $resources = $collection::resolveEntries($entries, function ($id, $ids) use ($collection) {
                    $root = $id === preg_replace('/^flat-/', '', $this->input->getCmd('adapter')) ? $this->input->getString('browseRoot') : '';
                    $adapter = (new AdapterRegistry($this->app))->get($id, $root ?: null);
                    $params = \Joomla\CMS\Component\ComponentHelper::getParams('com_smartbrowser');
                    $resources = $collection::resolve($adapter, $ids, $this->app->getIdentity(), $this->app->isClient('site'));
                    return (new ResourceVisualDecorator($this->app))->decorate([
                        'resources' => $resources,
                        'actions' => $this->input->getCmd('mode') === 'readonly' ? [] : $adapter->getActions([]),
                        'presentation' => method_exists($adapter, 'getCollectionPresentation') ? $adapter->getCollectionPresentation($resources) : [],
                        'visualSettings' => \SuperSoft\Component\Smartbrowser\Administrator\Support\VisualOptions::forAdapter($id, $params),
                        'imageBackground' => $params->get('image_background', 'auto'),
                    ], $id);
                });
                return ['items' => $collection::jsonEntries($entries), 'resources' => $resources, 'actions' => [], 'presentation' => ['columns' => [['id' => 'title', 'label' => 'COM_SMARTBROWSER_NAME']]]];
            }
            $adapter = $this->getAdapter();
            $ids = \SuperSoft\Component\Smartbrowser\Administrator\Support\CollectionResources::identifiers($adapter->getId(), $body['items']);
            if (($body['operation'] ?? 'resolve') === 'reorder') {
                if ($this->input->getCmd('mode') === 'readonly') throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
                $selected = \SuperSoft\Component\Smartbrowser\Administrator\Support\CollectionResources::identifiers($adapter->getId(), is_array($body['selection'] ?? null) ? $body['selection'] : []);
                return ['items' => \SuperSoft\Component\Smartbrowser\Administrator\Support\OrderingSteps::orderedIds($ids, $selected, (string) ($body['direction'] ?? ''))];
            }
            if (($body['operation'] ?? 'resolve') !== 'resolve') throw new \InvalidArgumentException('Invalid collection operation.', 400);
            $resources = \SuperSoft\Component\Smartbrowser\Administrator\Support\CollectionResources::resolve($adapter, $ids, $this->app->getIdentity(), $this->app->isClient('site'));
            $params = \Joomla\CMS\Component\ComponentHelper::getParams('com_smartbrowser');
            return (new ResourceVisualDecorator($this->app))->decorate([
                'identifiers' => $ids, 'resources' => $resources,
                'actions' => $this->input->getCmd('mode') === 'readonly' ? [] : $adapter->getActions([]),
                'presentation' => method_exists($adapter, 'getCollectionPresentation') ? $adapter->getCollectionPresentation($resources) : [],
                'visualSettings' => \SuperSoft\Component\Smartbrowser\Administrator\Support\VisualOptions::forAdapter($adapter->getId(), $params),
                'imageBackground' => $params->get('image_background', 'auto'),
            ], $adapter->getId());
        });
    }
    public function resources(): void
    {
        $this->respond(function (): array {
            $adapter = $this->getAdapter();
            $nodeId  = $this->input->getString('node');

            if ($nodeId === '') {
                return (new ResourceVisualDecorator($this->app))->decorate([
                    'roots' => $adapter->getRoots(),
                    'actions' => $this->input->getCmd('mode') === 'readonly' ? [] : $adapter->getActions([]),
                ], $adapter->getId());
            }

            $filters = json_decode($this->input->getString('filters', '{}'), true);

            $options = [
                'search' => $this->input->getString('search') ?: null,
                'sortBy' => $this->input->getCmd('sortBy', 'modified'),
                'sortDirection' => $this->input->getCmd('sortDirection', 'desc'),
                'filters' => is_array($filters) ? $filters : [],
                'showContextResources' => $this->input->getBool('showContextResources', ContextOptions::enabled($adapter->getId(), $this->app->isClient('site'))),
            ];
            if ($this->input->getMethod() === 'POST') {
                if (!Session::checkToken('json')) throw new \RuntimeException('Invalid token', 403);
                $body = json_decode($this->input->json->getRaw(), true, 32, JSON_THROW_ON_ERROR);
                $options['selection'] = \SuperSoft\Component\Smartbrowser\Administrator\Support\CollectionResources::entries($body['items'] ?? []);
            }
            $result = $adapter->getResources($nodeId, $options);
            if ($this->input->getCmd('mode') === 'readonly') $result['actions'] = [];
            $contextItems = $options['showContextResources'] && $adapter instanceof ContextResourceProviderInterface
                ? $adapter->getContextResources($nodeId, $options)
                : [];
            $result['contextItems'] = array_map(static fn (array $resource): array => [
                ...$resource,
                'role' => 'contextual',
                'focusable' => $resource['focusable'] ?? true,
                'selectable' => false,
                'bulkSelectable' => false,
                'actionable' => false,
                'navigable' => false,
                'activatable' => false,
                'interactiveOverlays' => false,
                'capabilities' => [],
            ], $contextItems);

            return (new ResourceVisualDecorator($this->app))->decorate($result, $adapter->getId());
        });
    }

    public function action(): void
    {
        $this->respond(function (): mixed {
            if ($this->input->getCmd('mode') === 'readonly') {
                throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
            }
            if (!Session::checkToken('json')) {
                throw new \RuntimeException('Invalid token', 403);
            }

            $body      = json_decode($this->input->json->getRaw(), true, 512, JSON_THROW_ON_ERROR);
            $action    = (string) ($body['action'] ?? '');
            $selection = is_array($body['selection'] ?? null) ? $body['selection'] : [];
            $payload   = is_array($body['payload'] ?? null) ? $body['payload'] : [];

            $adapter = $this->getAdapter();
            if ($adapter instanceof BrowseRootAwareInterface) {
                $scopeIds = array_values($selection);
                if (!empty($payload['nodeId'])) $scopeIds[] = (string) $payload['nodeId'];
                $adapter->assertBrowseScope($scopeIds);
            }

            return $adapter->executeAction($action, $selection, $payload);
        });
    }

    private function getAdapter(): ResourceAdapterInterface
    {
        return (new AdapterRegistry($this->app))->get(
            $this->input->getCmd('adapter', 'media'),
            $this->input->getString('browseRoot') ?: null,
            $this->input->getString('flatScope') ?: null
        );
    }

    private function respond(callable $callback): void
    {
        $language = $this->app->getLanguage();
        $language->load('joomla', JPATH_ADMINISTRATOR, null, true);
        $language->load('com_smartbrowser', JPATH_ADMINISTRATOR, null, true);
        $language->load('com_media', JPATH_ADMINISTRATOR, null, true);
        try {
            if ($this->app->isClient('site') && $this->app->getIdentity()->guest) {
                $response = new JsonResponse([
                    'authenticationRequired' => true,
                    'loginUrl' => SiteAuthentication::loginUrl($this->input->server->getString('HTTP_REFERER') ?: null),
                ], Text::_('COM_SMARTBROWSER_AUTHENTICATION_REQUIRED'));
                $status = 401;
            } else {
                $response = new JsonResponse($callback());
                $status   = 200;
            }
        } catch (\Throwable $error) {
            if ($error instanceof FileExistsException) {
                $error = new \RuntimeException(Text::_('COM_SMARTBROWSER_ERROR_FILE_EXISTS'), 409, $error);
            } elseif ($error instanceof InvalidPathException) {
                $error = new \InvalidArgumentException($error->getMessage() ?: Text::_('JLIB_MEDIA_ERROR_WARNFILETYPE'), 400, $error);
            }
            $status   = $error->getCode() >= 400 && $error->getCode() < 600 ? $error->getCode() : 500;
            $response = new JsonResponse($error);
        }

        $this->app->setHeader('Content-Type', 'application/json');
        $this->app->setHeader('status', $status, true);
        $this->app->sendHeaders();
        echo $response;
        $this->app->close();
    }
}
