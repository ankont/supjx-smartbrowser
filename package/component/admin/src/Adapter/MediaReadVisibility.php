<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter;

use Joomla\CMS\Uri\Uri;
use Joomla\Plugin\Filesystem\Local\Adapter\LocalAdapter;

defined('_JEXEC') or die;

final class MediaReadVisibility
{
    /** Compatibility entry point; a native URL does not certify anonymous HTTP access. */
    public static function assertPublic(object $provider, string $path, object $file): string
    {
        return self::assertNativeUrl($provider, $path, $file);
    }

    public static function assertNativeUrl(object $provider, string $path, object $file): string
    {
        // Native resource lookup validates the configured provider path and supplies
        // metadata/URLs as in com_media. Custom providers need their own read policy.
        if (get_class($provider) !== LocalAdapter::class || ($file->type ?? '') !== 'file') throw new \RuntimeException('No safe provider read policy', 403);
        $url = $provider->getUrl($path);
        $root = Uri::root();
        $parts = parse_url($url);
        if (!str_starts_with($url, $root) || !is_array($parts) || !in_array($parts['scheme'] ?? '', ['http', 'https'], true)
            || empty($parts['host']) || isset($parts['query']) || isset($parts['fragment']) || isset($parts['user']) || isset($parts['pass'])
            || preg_match('/[\x00-\x20\x7f]/', $url) || preg_match('/%(?![a-fA-F0-9]{2})/', $url)) throw new \RuntimeException('Unsafe media URL', 403);
        $relative = rawurldecode(substr($url, strlen($root)));
        if (preg_match('/[\x00-\x1f\x7f]/', $relative) || str_contains($relative, '\\') || in_array('..', explode('/', $relative), true)) throw new \RuntimeException('Unsafe media path', 403);
        $siteRoot = realpath(JPATH_ROOT);
        $diskPath = realpath(JPATH_ROOT . '/' . $relative);
        if (!$siteRoot || !$diskPath || !is_file($diskPath) || !str_starts_with(str_replace('\\', '/', $diskPath), rtrim(str_replace('\\', '/', $siteRoot), '/') . '/')) throw new \RuntimeException('Unavailable media', 403);
        // Return the provider URL, never file contents. The web server still enforces
        // authentication and delivery rules on the visitor's actual file request.
        return $url;
    }
}
