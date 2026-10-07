<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

use Joomla\CMS\Application\CMSApplicationInterface;

defined('_JEXEC') or die;

final class ManagerUrlProvider
{
    private const LINKS = [
        'media' => 'index.php?option=com_media',
        'flat-media' => 'index.php?option=com_media',
        'articles' => 'index.php?option=com_content&view=articles',
        'flat-articles' => 'index.php?option=com_content&view=articles',
        'featured-articles' => 'index.php?option=com_content&view=featured',
        'categories' => 'index.php?option=com_categories&view=categories&extension=com_content',
        'flat-categories' => 'index.php?option=com_categories&view=categories&extension=com_content',
        'tags' => 'index.php?option=com_tags&view=tags',
        'flat-tags' => 'index.php?option=com_tags&view=tags',
        'articles-by-tag' => 'index.php?option=com_content&view=articles',
        'flat-articles-by-tag' => 'index.php?option=com_content&view=articles',
        'menus' => 'index.php?option=com_menus&view=items',
        'flat-menus' => 'index.php?option=com_menus&view=items',
        'users' => 'index.php?option=com_users&view=users',
        'flat-users' => 'index.php?option=com_users&view=users',
    ];

    public static function for(CMSApplicationInterface $app, string $adapter): ?string
    {
        if (!isset(self::LINKS[$adapter])) return null;
        $component = match ($adapter) {
            'media', 'flat-media' => 'com_media',
            'articles', 'flat-articles', 'featured-articles', 'articles-by-tag', 'flat-articles-by-tag' => 'com_content',
            'categories', 'flat-categories' => 'com_categories',
            'tags', 'flat-tags' => 'com_tags',
            'menus', 'flat-menus' => 'com_menus',
            'users', 'flat-users' => 'com_users',
        };
        $identity = $app->getIdentity();
        if (!$identity->authorise('core.login.admin') || !$identity->authorise('core.manage', $component)) return null;
        return AdministratorRoute::link($app, self::LINKS[$adapter]);
    }
}
