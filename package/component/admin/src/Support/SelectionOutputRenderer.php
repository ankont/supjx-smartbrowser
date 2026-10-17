<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

use Joomla\CMS\Factory;
use Joomla\CMS\Layout\FileLayout;
use Joomla\CMS\Log\Log;
use Joomla\CMS\Plugin\PluginHelper;
use Joomla\Event\Event;

defined('_JEXEC') or die;

/** Render prepared, access-filtered selections. This class never resolves raw IDs. */
final class SelectionOutputRenderer
{
    public static function render(array $selected, array $options = []): string
    {
        if (!empty($selected['unavailable']) || !empty($selected['resource']['unavailable']) || empty($selected['resource']['id'])) return '';
        $layoutId = $options['layout'] ?? 'smartbrowser.resource';
        if (!is_string($layoutId) || !preg_match('/^[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)*$/D', $layoutId)) throw new \InvalidArgumentException('Invalid output layout.');
        $data = self::displayData($selected);
        $layout = new FileLayout($layoutId, null, ['component' => 'com_smartbrowser', 'client' => 0]);
        return self::present($layout->render($data), $selected, $options);
    }

    public static function renderSelection(array $prepared, array $options = []): string
    {
        if (!empty($prepared['invalid'])) return '';
        $items = [];
        foreach ($prepared['items'] ?? [] as $selected) {
            $html = self::render($selected, $options);
            if (trim($html) !== '') $items[] = $html;
        }
        if (count($items) < 2) return $items[0] ?? '';
        return '<ul class="list-unstyled smartbrowser-selection"><li>' . implode('</li><li>', $items) . '</li></ul>';
    }

    public static function displayData(array $selected): array
    {
        $resource = $selected['resource'];
        $usage = $selected['usage'] ?? [];
        $title = (string) ($selected['displayedName'] ?? $resource['title'] ?? '');
        if (($resource['type'] ?? '') === 'uri' && is_string($usage['link.text'] ?? null) && $usage['link.text'] !== '') $title = $usage['link.text'];
        $address = $selected['effectiveImageAddress'] ?? $selected['effectiveThumbnail'] ?? null;
        if (($resource['type'] ?? '') === 'image' && is_string($usage['ext.address'] ?? null) && $usage['ext.address'] !== '') $address = $usage['ext.address'];
        $mode = $selected['visualPresentation'] ?? null;
        $image = $mode !== 'icon' ? self::safeUrl($address, true) : null;
        $url = self::safeUrl($resource['metadata']['publicUrl'] ?? $resource['metadata']['url'] ?? null);
        $icon = in_array($mode, ['icon', 'both'], true) ? ($selected['effectiveIcon'] ?? $resource['icon'] ?? null) : null;
        if ($mode === null && !$image && ($resource['type'] ?? '') === 'menu-item') $icon = $resource['badgeIcon'] ?? null;
        if (!is_string($icon) || !preg_match('/^[a-zA-Z0-9_-]+(?: [a-zA-Z0-9_-]+)*$/D', $icon)) $icon = null;
        $class = $usage['media.class'] ?? '';
        if (!is_string($class) || !preg_match('/^[a-zA-Z0-9_ -]*$/D', $class)) $class = '';
        return ['selected' => $selected, 'resource' => $resource, 'usage' => $usage, 'title' => $title,
            'url' => $url, 'imageAddress' => $image, 'image' => $image ? [
                'src' => $image, 'alt' => !empty($usage['media.decorative']) ? '' : (string) ($usage['media.alt'] ?? $title),
                'class' => $class, 'loading' => 'lazy', 'data-sb-primary-image' => '1',
            ] : null, 'icon' => $icon, 'caption' => (string) ($usage['media.caption'] ?? ''),
            'target' => (string) ($usage['link.target'] ?? '') === '1' ? '_blank' : null];
    }

    public static function safeUrl(mixed $value, bool $image = false): ?string
    {
        if (!is_string($value) || $value === '') return null;
        $value = html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        if (preg_match('/[\x00-\x20\x7f\\\\<>"\x27]/', $value)) return null;
        if (preg_match('/^([a-z][a-z0-9+.-]*):/i', $value, $match)
            && !in_array(strtolower($match[1]), $image ? ['http', 'https'] : ['http', 'https', 'mailto', 'tel'], true)) return null;
        return $value;
    }

    /** Finalize one visual fragment, after its default or overridden layout. */
    public static function present(string $html, array $selected, array $options = []): string
    {
        if (!empty($selected['unavailable']) || !empty($selected['resource']['unavailable']) || empty($selected['resource']['id'])) return '';
        if (!str_contains($html, 'data-sb-primary-image')) return $html;
        $document = new \DOMDocument('1.0', 'UTF-8');
        $previous = libxml_use_internal_errors(true);
        try {
            $document->loadHTML('<?xml encoding="UTF-8"><div id="sb-output-root">' . $html . '</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_NONET);
        } finally { libxml_clear_errors(); libxml_use_internal_errors($previous); }
        $root = $document->getElementById('sb-output-root');
        if (!$root) return $html;
        $images = (new \DOMXPath($document))->query('.//img[@data-sb-primary-image]', $root);
        if ($images->length !== 1) return $html;
        $image = $images->item(0);
        if ($image->getAttribute('data-sb-image-presentation') === 'server') return $html;
        $baseline = $root->cloneNode(true);
        $app = Factory::getApplication();
        try {
            $dispatcher = $app->getDispatcher();
            PluginHelper::importPlugin('content', null, true, $dispatcher);
            PluginHelper::importPlugin('smartvisuals', null, true, $dispatcher);
            $event = new Event('onSmartBrowserPrepareImagePresentation', [
                'imageElement' => $image,
                'context' => ['resource' => $selected['resource'], 'selection' => $selected['selection'] ?? null,
                    'usage' => $selected['usage'] ?? [], 'resolvedImage' => $selected['effectiveThumbnailResource'] ?? $selected['resource'],
                    'imageAddress' => self::displayData($selected)['imageAddress'], 'imageUrl' => $image->getAttribute('src'),
                    'purpose' => ($options['purpose'] ?? '') === 'preview' ? 'preview' : 'output', 'isReadOnly' => true],
            ]);
            $dispatcher->dispatch($event->getName(), $event);
        } catch (\Throwable $error) {
            $root = $baseline;
            $image = (new \DOMXPath($document))->query('.//img[@data-sb-primary-image]', $root)->item(0);
            Log::add('A SmartBrowser image-presentation provider failed; original output restored.', Log::WARNING, 'com_smartbrowser');
        }
        $image->setAttribute('data-sb-image-presentation', 'server');
        $result = '';
        foreach ($root->childNodes as $node) $result .= $document->saveHTML($node);
        return $result;
    }
}
