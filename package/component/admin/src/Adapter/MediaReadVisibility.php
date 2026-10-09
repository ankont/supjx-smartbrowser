<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter;

use Joomla\CMS\Uri\Uri;
use Joomla\CMS\Factory;
use Joomla\Plugin\Filesystem\Local\Adapter\LocalAdapter;

defined('_JEXEC') or die;

final class MediaReadVisibility
{
    private static ?\WeakMap $checks = null;

    public static function assertPublic(object $provider, string $path, object $file): string
    {
        // Joomla's filesystem interface has no reader ACL. Only the exact native local
        // implementation is verified here; custom providers/subclasses remain fail-closed.
        if (get_class($provider) !== LocalAdapter::class || ($file->type ?? '') !== 'file') throw new \RuntimeException('No safe provider read policy', 403);
        $url = $provider->getUrl($path);
        $root = Uri::root();
        $parts = parse_url($url);
        if (!str_starts_with($url, $root) || !is_array($parts) || !in_array($parts['scheme'] ?? '', ['http', 'https'], true)
            || isset($parts['query']) || isset($parts['fragment']) || isset($parts['user']) || isset($parts['pass'])) throw new \RuntimeException('Unsafe media URL', 403);
        $relative = rawurldecode(substr($url, strlen($root)));
        if (str_contains($relative, "\0") || str_contains($relative, '\\') || in_array('..', explode('/', $relative), true)) throw new \RuntimeException('Unsafe media path', 403);
        $siteRoot = realpath(JPATH_ROOT);
        $diskPath = realpath(JPATH_ROOT . '/' . $relative);
        if (!$siteRoot || !$diskPath || !is_file($diskPath) || !str_starts_with(str_replace('\\', '/', $diskPath), rtrim(str_replace('\\', '/', $siteRoot), '/') . '/')) throw new \RuntimeException('Unavailable media', 403);
        $app = Factory::getApplication();
        $identity = $app->getIdentity();
        $levels = $identity->getAuthorisedViewLevels(); sort($levels);
        clearstatcache(true, $diskPath);
        $cacheKey = json_encode([$url, $diskPath, (int) ($identity->id ?? 0), $levels, stat($diskPath), $file->mime_type ?? '', $_SERVER['SERVER_ADDR'] ?? '', $_SERVER['SERVER_PORT'] ?? ''], JSON_THROW_ON_ERROR);
        self::$checks ??= new \WeakMap();
        $checks = self::$checks[$app] ?? [];
        if (array_key_exists($cacheKey, $checks)) {
            if (!$checks[$cacheKey]) throw new \RuntimeException('Public media access unverified', 403);
            return $url;
        }
        // Uri::root() may originate in Host headers. Never resolve its hostname or
        // connect to an arbitrary port: pin the probe to this server's listening endpoint.
        $address = $_SERVER['SERVER_ADDR'] ?? '';
        $port = (int) ($_SERVER['SERVER_PORT'] ?? 0);
        $urlPort = (int) ($parts['port'] ?? ($parts['scheme'] === 'https' ? 443 : 80));
        if (!filter_var($address, FILTER_VALIDATE_IP) || !$port || $urlPort !== $port
            || preg_match('/[^a-zA-Z0-9.:-]/', $parts['host'] ?? '')) throw new \RuntimeException('No trusted local HTTP endpoint', 403);
        $host = $parts['host'] . (isset($parts['port']) ? ':' . $parts['port'] : '');
        $target = $parts['scheme'] . '://' . (str_contains($address, ':') ? '[' . $address . ']' : $address)
            . ':' . $port . ($parts['path'] ?? '/');
        $checks[$cacheKey] = false; self::$checks[$app] = $checks;
        // Verify an anonymous GET, not merely HEAD: gateways may authorise the methods
        // differently. Read at most 512 bytes even when a server ignores the range.
        $context = stream_context_create(['http' => ['method' => 'GET', 'timeout' => 3, 'follow_location' => 0,
            'ignore_errors' => true, 'header' => "Host: $host\r\nRange: bytes=0-511\r\nAccept-Encoding: identity\r\nConnection: close"],
            'ssl' => ['verify_peer' => true, 'verify_peer_name' => true, 'peer_name' => $parts['host'], 'SNI_enabled' => true]]);
        $stream = @fopen($target, 'rb', false, $context);
        if (!$stream) throw new \RuntimeException('Public media access unverified', 403);
        try {
            $bytes = fread($stream, 512);
            $response = stream_get_meta_data($stream);
        } finally { fclose($stream); }
        $headers = []; $code = 0;
        foreach ($response['wrapper_data'] ?? [] as $header) {
            if (preg_match('#^HTTP/\S+ ([0-9]{3})#', $header, $match)) { $code = (int) $match[1]; $headers = []; }
            elseif (str_contains($header, ':')) { [$key, $value] = explode(':', $header, 2); $headers[strtolower(trim($key))] = trim($value); }
        }
        $size = filesize($diskPath);
        $expected = min(512, $size);
        $type = strtolower(trim(explode(';', $headers['content-type'] ?? '')[0]));
        $range = 'bytes 0-' . ($expected - 1) . '/' . $size;
        if (!empty($response['timed_out']) || ($code !== 206 && !($code === 200 && $size <= 512))
            || $code === 206 && ($headers['content-range'] ?? '') !== $range
            || $type !== strtolower((string) ($file->mime_type ?? '')) || !is_string($bytes) || strlen($bytes) !== $expected
            || $bytes !== file_get_contents($diskPath, false, null, 0, 512)) throw new \RuntimeException('Public media access unverified', 403);
        $checks[$cacheKey] = true; self::$checks[$app] = $checks;
        return $url;
    }
}
