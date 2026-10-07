<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter;

use Joomla\CMS\Application\CMSApplicationInterface;
use Joomla\CMS\Language\Text;
use SuperSoft\Component\Smartbrowser\Administrator\Support\SmartAuthorsAccess;
use SuperSoft\Component\Smartbrowser\Administrator\Support\IconOptions;

defined('_JEXEC') or die;

final class AdapterRegistry
{
    public function __construct(private readonly CMSApplicationInterface $app)
    {
    }

    public function get(string $id, ?string $browseRoot = null, ?string $flatScope = null): ResourceAdapterInterface
    {
        if (!$this->canUse($id)) {
            throw new \RuntimeException('Not authorised to manage content.', 403);
        }

        $adapter = match ($id) {
            'media'    => new MediaAdapter($this->app),
            'articles' => new ArticleAdapter($this->app),
            'flat-articles' => new FlatArticleAdapter($this->app),
            'featured-articles' => new FeaturedArticleAdapter($this->app),
            'flat-categories' => new FlatCategoryAdapter($this->app),
            'categories' => new CategoryAdapter($this->app),
            'tags' => new TagAdapter($this->app),
            'articles-by-tag' => new ArticlesByTagAdapter($this->app),
            'menus' => new MenuAdapter($this->app),
            'users' => new UsersAdapter($this->app),
            'flat-tags' => new FlatHierarchyAdapter(new TagAdapter($this->app)),
            'flat-articles-by-tag' => new FlatHierarchyAdapter(new ArticlesByTagAdapter($this->app)),
            'flat-menus' => new FlatHierarchyAdapter(new MenuAdapter($this->app)),
            'flat-users' => new FlatHierarchyAdapter(new UsersAdapter($this->app)),
            'flat-media' => new FlatHierarchyAdapter(new MediaAdapter($this->app)),
            default    => throw new \InvalidArgumentException('Unknown adapter', 404),
        };

        if ($adapter instanceof BrowseRootAwareInterface) $adapter->configureBrowseRoot($browseRoot);
        if ($adapter instanceof FlatHierarchyAdapter) $adapter->configureScope($flatScope);

        return $adapter;
    }

    public function descriptors(): array
    {
        return array_map(static function (array $descriptor): array {
            $icons = IconOptions::forAdapter($descriptor['id']);
            return [...$descriptor, 'icon' => $icons['adapter'], 'nodeIcon' => $icons['node'], 'nodeOpenIcon' => $icons['open']];
        }, array_values(array_filter([
            $this->canUse('media') ? ['id' => 'media', 'title' => Text::_('COM_SMARTBROWSER_ADAPTER_MEDIA'), 'icon' => 'fas fa-photo-video'] : null,
            $this->canUse('articles')
                ? ['id' => 'articles', 'title' => Text::_('COM_SMARTBROWSER_ADAPTER_ARTICLES'), 'icon' => 'fas fa-book-open']
                : null,
            $this->canUse('flat-articles')
                ? ['id' => 'flat-articles', 'title' => Text::_('COM_SMARTBROWSER_ADAPTER_FLAT_ARTICLES'), 'icon' => 'fas fa-book-open']
                : null,
            $this->canUse('featured-articles')
                ? ['id' => 'featured-articles', 'title' => Text::_('COM_SMARTBROWSER_ADAPTER_FEATURED_ARTICLES'), 'icon' => 'fas fa-star']
                : null,
            $this->canUse('categories')
                ? ['id' => 'categories', 'title' => Text::_('COM_SMARTBROWSER_ADAPTER_CATEGORIES'), 'icon' => 'fas fa-boxes']
                : null,
            $this->canUse('menus')
                ? ['id' => 'menus', 'title' => Text::_('COM_SMARTBROWSER_ADAPTER_MENUS'), 'icon' => 'fas fa-diagram-next']
                : null,
            $this->canUse('tags')
                ? ['id' => 'tags', 'title' => Text::_('COM_SMARTBROWSER_ADAPTER_TAGS'), 'icon' => 'fas fa-hashtag']
                : null,
            $this->canUse('articles-by-tag')
                ? ['id' => 'articles-by-tag', 'title' => Text::_('COM_SMARTBROWSER_ADAPTER_ARTICLES_BY_TAG'), 'icon' => 'fas fa-hashtag']
                : null,
            $this->canUse('users')
                ? ['id' => 'users', 'title' => Text::_('COM_SMARTBROWSER_ADAPTER_USERS'), 'icon' => 'fas fa-users']
                : null,
        ])));
    }

    private function canUse(string $id): bool
    {
        $identity = $this->app->getIdentity();
        if ($identity->guest) return false;
        if (!$this->app->isClient('site')) {
            return match ($id) {
                'media', 'flat-media' => true,
                'articles', 'flat-articles', 'featured-articles', 'categories', 'flat-categories' => $identity->authorise('core.manage', 'com_content'),
                'tags', 'flat-tags' => $identity->authorise('core.manage', 'com_tags'),
                'articles-by-tag', 'flat-articles-by-tag' => $identity->authorise('core.manage', 'com_content') && $identity->authorise('core.manage', 'com_tags'),
                'menus', 'flat-menus' => $identity->authorise('core.manage', 'com_menus'),
                'users', 'flat-users' => $identity->authorise('core.manage', 'com_users'),
                default => false,
            };
        }
        $allowed = fn (string $component, array $actions): bool => array_reduce(
            $actions,
            fn (bool $carry, string $action): bool => $carry || $identity->authorise($action, $component),
            false
        );
        $content = $allowed('com_content', ['core.manage', 'core.create', 'core.edit', 'core.edit.own', 'core.edit.state'])
            || $identity->getAuthorisedCategories('com_content', 'core.create')
            || $identity->getAuthorisedCategories('com_content', 'core.edit')
            || $identity->getAuthorisedCategories('com_content', 'core.edit.own');
        if (!$content) {
            $service = SmartAuthorsAccess::service($this->app);
            $content = $service !== null && $service->canCreateInAnyCategory((int) $identity->id);
        }
        return match ($id) {
            'media', 'flat-media' => true,
            'articles', 'flat-articles', 'featured-articles', 'categories', 'flat-categories' => $content,
            'tags', 'flat-tags' => $allowed('com_tags', ['core.manage', 'core.create', 'core.edit', 'core.edit.state']),
            'articles-by-tag', 'flat-articles-by-tag' => $content && $allowed('com_tags', ['core.manage', 'core.create', 'core.edit']),
            'menus', 'flat-menus' => $allowed('com_menus', ['core.manage', 'core.create', 'core.edit', 'core.edit.state']),
            'users', 'flat-users' => $allowed('com_users', ['core.manage', 'core.edit', 'core.edit.state']),
            default => false,
        };
    }
}
