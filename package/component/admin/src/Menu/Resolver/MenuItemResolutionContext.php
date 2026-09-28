<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Menu\Resolver;

use Joomla\Registry\Registry;
use Joomla\CMS\Uri\Uri;
use SuperSoft\Component\Smartbrowser\Administrator\Adapter\FlatArticleAdapter;

defined('_JEXEC') or die;

final class MenuItemResolutionContext
{
    public function __construct(
        public readonly FlatArticleAdapter $content,
        private readonly \Closure $loadMenuItem,
        private readonly \Closure $resolveMenuItem,
        public readonly array $visited = [],
        public readonly int $depth = 0,
        public readonly array $viewLevels = [],
    ) {
    }

    public function params(object $item): Registry
    {
        return new Registry((string) ($item->params ?? '{}'));
    }

    public function query(object $item): array
    {
        parse_str((string) parse_url((string) ($item->link ?? ''), PHP_URL_QUERY), $query);
        return is_array($query) ? $query : [];
    }

    public function load(int $id): object
    {
        return ($this->loadMenuItem)($id);
    }

    public function resolveAlias(object $item): array
    {
        return ($this->resolveMenuItem)($item, $this->visited, $this->depth + 1);
    }

    public function contextualArticles(array $articles): array
    {
        $articles = array_filter($articles, fn (array $resource): bool => empty($resource['metadata']['accessId'])
            || in_array((int) $resource['metadata']['accessId'], $this->viewLevels, true));
        return array_values(array_map(function (array $resource): array {
            $id = (int) ($resource['metadata']['id'] ?? 0);
            $url = $id ? Uri::root() . 'index.php?option=com_content&view=article&id=' . $id : null;
            return [
                ...$resource,
                'interactiveOverlays' => false,
                'actionable' => !empty($resource['capabilities']['edit']) || $url !== null,
                'capabilities' => [...($resource['capabilities'] ?? []), ...($url ? ['openLink' => true, 'copyLink' => true] : [])],
                'metadata' => [...($resource['metadata'] ?? []), ...($url ? ['url' => $url] : [])],
            ];
        }, $this->content->asContextualArticles(array_values($articles))));
    }

    public function frontendUrl(string $url): string
    {
        if ($url === '' || preg_match('#^(?:https?:)?//#', $url)) return $url;
        return Uri::root() . ltrim($url, '/');
    }
}
