<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

use Joomla\CMS\Uri\Uri;
use Joomla\Component\Media\Administrator\Model\ApiModel;
use Joomla\Component\Media\Administrator\Model\MediaModel;
use Joomla\Plugin\Filesystem\Local\Adapter\LocalAdapter;

defined('_JEXEC') or die;

/** Translate native article values to temporary selections, never a new storage format. */
final class ArticleMediaSelection
{
    public static function orderedLinks(array $urls): array
    {
        $links = [];
        foreach (['a', 'b', 'c'] as $slot) {
            if (isset($urls['url' . $slot]) && $urls['url' . $slot] !== '') $links[] = [$urls['url' . $slot], $urls['url' . $slot . 'text'] ?? '', $urls['target' . $slot] ?? ''];
        }
        foreach (['a', 'b', 'c'] as $index => $slot) {
            [$urls['url' . $slot], $urls['url' . $slot . 'text'], $urls['target' . $slot]] = $links[$index] ?? ['', '', ''];
        }
        return $urls;
    }

    public static function imageReference(string $value): ?array
    {
        if ($value === '') return null;
        $marker = strpos($value, '#joomlaImage://');
        if ($marker !== false) {
            $parts = parse_url(substr($value, $marker + 1));
            if (!empty($parts['host']) && !empty($parts['path'])) {
                return ['adapter' => 'media', 'id' => $parts['host'] . ':' . rawurldecode($parts['path'])];
            }
        }
        if (str_starts_with($value, '//') || parse_url($value, PHP_URL_SCHEME) && !str_starts_with($value, Uri::root())) return null;
        $url = str_starts_with($value, Uri::root()) ? $value : Uri::root() . ltrim($value, '/');
        $api = new ApiModel();
        foreach ((new MediaModel())->getProviders() as $provider) foreach ($provider->adapterNames as $name) {
            $filesystem = $provider->name . '-' . $name;
            try {
                $adapter = $api->getAdapter($filesystem);
                if (get_class($adapter) !== LocalAdapter::class) continue;
                $root = rtrim($adapter->getUrl('/'), '/') . '/';
                if (!str_starts_with($url, $root)) continue;
                $path = '/' . rawurldecode(substr($url, strlen($root)));
                if (str_contains($path, '\\') || str_contains($path, '?') || str_contains($path, '#') || in_array('..', explode('/', $path), true)) continue;
                return ['adapter' => 'media', 'id' => $filesystem . ':' . $path];
            } catch (\Throwable $error) { continue; }
        }
        return null;
    }

    public static function imageUsage(object $form, string $role): array
    {
        $prefix = $role === 'intro' ? 'image_intro' : 'image_fulltext';
        return ['media.alt' => (string) $form->getValue($prefix . '_alt', 'images', ''),
            'media.decorative' => (bool) $form->getValue($prefix . '_alt_empty', 'images', false),
            'media.caption' => (string) $form->getValue($prefix . '_caption', 'images', ''),
            'media.class' => (string) $form->getValue('float_' . $role, 'images', '')];
    }

    public static function linkEntry(object $form, string $slot): ?array
    {
        $url = (string) $form->getValue('url' . $slot, 'urls', '');
        if ($url === '') return null;
        $type = str_starts_with($url, 'mailto:') ? 'mail' : (str_starts_with($url, 'tel:') ? 'tel' : (str_starts_with($url, '#') ? 'fragment' : 'web'));
        return ['selection' => DirectLinkUri::reference($type, $url), 'usage' => [
            'link.text' => (string) $form->getValue('url' . $slot . 'text', 'urls', ''),
            'link.target' => (string) $form->getValue('target' . $slot, 'urls', '')]];
    }
}
