<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter;

use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\Database\DatabaseInterface;
use SuperSoft\Component\Smartbrowser\Administrator\Support\FeaturedOrderingService;

defined('_JEXEC') or die;

final class FeaturedArticleAdapter extends FlatArticleAdapter
{
    protected const ROOT_ID = 'featured-articles:root';

    public function getId(): string
    {
        return 'featured-articles';
    }

    public function getRoots(): array
    {
        $roots = parent::getRoots();
        if (!$this->browseRoot) $roots[0]['title'] = Text::_('COM_SMARTBROWSER_ADAPTER_FEATURED_ARTICLES');
        $roots[0]['icon'] = 'fas fa-star';
        return $roots;
    }

    public function getResources(string $nodeId, array $options = []): array
    {
        $options['filters']['featured'] = '1';
        $options['sortBy'] = ($options['sortBy'] ?? '') === 'ordering' ? '' : ($options['sortBy'] ?? '');
        $result = parent::getResources($nodeId, $options);
        $result['presentation']['filters'] = array_values(array_filter(
            $result['presentation']['filters'],
            static fn (array $filter): bool => $filter['id'] !== 'featured'
        ));
        $result['presentation']['orderingField'] = 'ordering';
        array_unshift($result['presentation']['sortFields'], ['id' => 'ordering', 'label' => 'JGRID_HEADING_ORDERING']);

        $ids = array_map(static fn (array $item): int => (int) $item['metadata']['id'], $result['items']);
        if ($ids !== []) {
            $db = Factory::getContainer()->get(DatabaseInterface::class);
            $query = $db->getQuery(true)->select([$db->quoteName('content_id'), $db->quoteName('ordering')])
                ->from($db->quoteName('#__content_frontpage'))->whereIn($db->quoteName('content_id'), $ids);
            $orders = $db->setQuery($query)->loadAssocList('content_id');
            foreach ($result['items'] as &$item) {
                $item['metadata']['ordering'] = (int) ($orders[$item['metadata']['id']]['ordering'] ?? 0);
            }
            unset($item);
        }

        return $result;
    }

    public function getBreadcrumb(string $nodeId): array
    {
        $breadcrumb = parent::getBreadcrumb($nodeId);
        $breadcrumb[0]['icon'] = 'fas fa-star';
        return $breadcrumb;
    }

    public function executeAction(string $action, array $selection, array $payload = []): mixed
    {
        if ($action === 'reorder') {
            return (new FeaturedOrderingService($this->app))->move($this, $selection, (string) ($payload['direction'] ?? ''));
        }
        return parent::executeAction($action, $selection, $payload);
    }
}
