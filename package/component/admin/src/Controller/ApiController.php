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

defined('_JEXEC') or die;

class ApiController extends BaseController
{
    public function resources(): void
    {
        $this->respond(function (): array {
            $adapter = $this->getAdapter();
            $nodeId  = $this->input->getString('node');

            if ($nodeId === '') {
                return ['roots' => $adapter->getRoots(), 'actions' => $this->input->getCmd('mode') === 'readonly' ? [] : $adapter->getActions([])];
            }

            $filters = json_decode($this->input->getString('filters', '{}'), true);

            $options = [
                'search' => $this->input->getString('search') ?: null,
                'sortBy' => $this->input->getCmd('sortBy', 'modified'),
                'sortDirection' => $this->input->getCmd('sortDirection', 'desc'),
                'filters' => is_array($filters) ? $filters : [],
                'showContextResources' => $this->input->getBool('showContextResources', ContextOptions::enabled($adapter->getId(), $this->app->isClient('site'))),
            ];
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

            return $result;
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
