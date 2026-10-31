<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

use Joomla\CMS\Factory;
use Joomla\Database\DatabaseInterface;
use Joomla\Registry\Registry;

defined('_JEXEC') or die;

/** A short-lived, article-scoped preview grant, including across Joomla client sessions. */
final class ArticlePreview
{
    public static function allowed(object $app, object $user, object $article): bool
    {
        if ($user->guest || !empty($user->block)) return false;
        if (!$user->authorise('core.admin') && !in_array((int) $article->access, $user->getAuthorisedViewLevels(), true)) return false;
        return $user->authorise('core.manage', 'com_content')
            || SmartAuthorsAccess::canEditArticle($app, $user, $article)
            || SmartAuthorsAccess::canManageArticleState($app, $user, $article);
    }

    public static function issue(int $id, int $user, string $secret, ?int $now = null): string
    {
        $payload = $id . ':' . $user . ':' . (($now ?? time()) + 300);
        return $payload . '.' . hash_hmac('sha256', $payload, $secret);
    }

    public static function verify(string $token, int $id, string $secret, ?int $now = null): int
    {
        $now ??= time();
        if (!preg_match('/^([1-9][0-9]*):([1-9][0-9]*):([0-9]+)\.([a-f0-9]{64})$/D', $token, $parts)
            || (int) $parts[1] !== $id || (int) $parts[3] < $now || (int) $parts[3] > $now + 300
            || !hash_equals(hash_hmac('sha256', substr($token, 0, strrpos($token, '.')), $secret), $parts[4])) throw new \RuntimeException('Invalid or expired preview.', 403);
        return (int) $parts[2];
    }

    /** Native article view data, without public publication filters; ACL is checked before return. */
    public static function item(int $id, object $app, object $user, Registry $params): object
    {
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $query = $db->getQuery(true)->select('a.*')
            ->select(['c.title AS category_title', 'c.alias AS category_alias', 'c.access AS category_access', 'c.language AS category_language', 'c.parent_id AS parent_id',
                'parent.title AS parent_title', 'parent.alias AS parent_alias', 'parent.path AS parent_route', 'parent.language AS parent_language', 'u.name AS author', 'u.email AS author_email', 'fp.featured_up', 'fp.featured_down'])
            ->from($db->quoteName('#__content', 'a'))
            ->join('INNER', $db->quoteName('#__categories', 'c') . ' ON c.id = a.catid')
            ->join('LEFT', $db->quoteName('#__categories', 'parent') . ' ON parent.id = c.parent_id')
            ->join('LEFT', $db->quoteName('#__users', 'u') . ' ON u.id = a.created_by')
            ->join('LEFT', $db->quoteName('#__content_frontpage', 'fp') . ' ON fp.content_id = a.id')
            ->where('a.id = ' . $id);
        $item = $db->setQuery($query)->loadObject();
        if (!$item) throw new \RuntimeException('Article not found.', 404);
        if (!self::allowed($app, $user, $item)) throw new \RuntimeException('Not authorised to preview this article.', 403);
        $item->params = clone $params;
        $item->params->merge(new Registry($item->attribs));
        $item->params->set('access-view', true);
        $item->params->set('access-edit', false);
        $item->metadata = new Registry($item->metadata);
        $item->rating = null; $item->rating_count = 0;
        return $item;
    }
}
