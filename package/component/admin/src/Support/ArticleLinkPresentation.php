<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

defined('_JEXEC') or die;

/** Normalize an article's render-time links; never writes back to the article table. */
final class ArticleLinkPresentation
{
    public static function prepare(object $article, ?callable $resolver = null): void
    {
        if (isset($article->smartbrowserLinks) || !isset($article->urls)) return;
        $urls = is_array($article->urls) ? $article->urls : (is_object($article->urls) ? (array) $article->urls : json_decode((string) $article->urls, true));
        if (!is_array($urls)) return;
        $links = []; $changed = false;
        foreach (['a', 'b', 'c'] as $slot) {
            $raw = $urls['url' . $slot] ?? '';
            if (!is_string($raw) || !str_contains($raw, '://')) continue;
            try {
                $address = SelectionAddress::parse($raw);
                if (!$address) continue;
                $entry = SelectionAddress::decode($raw);
                $entry['usage']['link.text'] = (string) ($urls['url' . $slot . 'text'] ?? '');
                $entry['usage']['link.target'] = (string) ($urls['target' . $slot] ?? '');
                $config = SelectionFieldSupport::configuration(['allowed_adapters' => $entry['selection']['adapter'], 'multiple' => 0, 'selection_target' => 'both']);
                $prepared = SelectionFieldSupport::prepare(SelectionFieldValue::encode(['items' => [$entry]]), $config, $resolver, true);
                $selected = $prepared['items'][0] ?? null;
                $urls['url' . $slot] = $address['url'];
                $changed = true;
                $links[$slot] = ['address' => $raw, 'url' => $address['url'], 'selected' => $selected];
            } catch (\Throwable $error) {
                // A bad extension property must not expose address syntax or break the article.
                try { $address = SelectionAddress::parse($raw); } catch (\Throwable $ignored) { $address = null; }
                if ($address) { $urls['url' . $slot] = $address['url']; $changed = true; }
            }
        }
        if (!$changed) return;
        $article->urls = is_string($article->urls) ? json_encode($urls, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR) : (is_object($article->urls) ? (object) $urls : $urls);
        $article->smartbrowserLinks = $links;
    }
}
