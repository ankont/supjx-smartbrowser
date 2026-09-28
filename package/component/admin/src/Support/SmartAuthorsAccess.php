<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

use Joomla\CMS\Application\CMSApplicationInterface;
use Joomla\CMS\Plugin\PluginHelper;
use Joomla\CMS\User\User;
use SuperSoft\Plugin\System\SmartAuthors\Helper\SmartAuthorsHelper;

defined('_JEXEC') or die;

final class SmartAuthorsAccess
{
    private static ?bool $helperAvailable = null;

    private static function hasHelper(CMSApplicationInterface $app): bool
    {
        if (self::$helperAvailable !== null) return self::$helperAvailable;
        if (!PluginHelper::isEnabled('system', 'smartauthors')) return self::$helperAvailable = false;
        self::service($app);
        return self::$helperAvailable = class_exists(SmartAuthorsHelper::class);
    }

    public static function canEditArticle(CMSApplicationInterface $app, User $user, object $article): bool
    {
        if (self::hasHelper($app)) return SmartAuthorsHelper::canEditArticle($user, $article);
        $asset = 'com_content.article.' . (int) $article->id;
        return $user->authorise('core.edit', $asset)
            || ((int) ($article->created_by ?? 0) === (int) $user->id && $user->authorise('core.edit.own', $asset));
    }

    public static function canManageArticleState(CMSApplicationInterface $app, User $user, object $article): bool
    {
        if (self::hasHelper($app)) return SmartAuthorsHelper::canManageArticleState($user, $article);
        return $user->authorise('core.edit.state', 'com_content.article.' . (int) $article->id);
    }

    public static function canChangeArticleState(CMSApplicationInterface $app, User $user, object $article, int $targetState): bool
    {
        if (self::hasHelper($app)) return SmartAuthorsHelper::canChangeState($user, $article, $targetState);
        return $user->authorise('core.edit.state', 'com_content.article.' . (int) $article->id);
    }

    public static function canTrashArticle(CMSApplicationInterface $app, User $user, object $article): bool
    {
        if (self::hasHelper($app)) return SmartAuthorsHelper::canTrashArticle($user, $article);
        $asset = 'com_content.article.' . (int) $article->id;
        return $user->authorise('core.delete', $asset) || $user->authorise('core.edit.state', $asset);
    }

    public static function service(CMSApplicationInterface $app): ?object
    {
        if (!PluginHelper::isEnabled('system', 'smartauthors')) return null;

        try {
            $plugin = $app->bootPlugin('smartauthors', 'system');
        } catch (\Throwable) {
            return null;
        }

        return is_object($plugin) && method_exists($plugin, 'getAccessService')
            ? $plugin->getAccessService() : null;
    }
}
