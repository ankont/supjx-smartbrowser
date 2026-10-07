<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

use Joomla\CMS\Application\CMSApplicationInterface;
use Joomla\CMS\Plugin\PluginHelper;
use Joomla\Event\Event;

defined('_JEXEC') or die;

final class ResourceVisualDecorator
{
    private const GROUPS = ['roots', 'nodes', 'items', 'contextItems', 'breadcrumb', 'resources'];
    private const TONES = ['neutral', 'success', 'warning', 'danger', 'info', 'muted', 'expired', 'pending'];

    public function __construct(private readonly CMSApplicationInterface $app)
    {
    }

    public function decorate(array $response, string $adapterId): array
    {
        if (class_exists(IconOptions::class)) {
            foreach (self::GROUPS as $group) {
                foreach ($response[$group] ?? [] as $index => $resource) {
                    if (is_array($resource) && empty($resource['unavailable'])) $response[$group][$index] = IconOptions::resource($resource, $adapterId);
                }
            }
            if (is_array($response['currentResource'] ?? null)) $response['currentResource'] = IconOptions::resource($response['currentResource'], $adapterId);
        }
        $resources = [];

        foreach (self::GROUPS as $group) {
            foreach ($response[$group] ?? [] as $resource) {
                if (!is_array($resource) || empty($resource['id']) || !empty($resource['unavailable'])) continue;
                $id = (string) $resource['id'];
                if (!isset($resources[$id]) || count($resource) > count($resources[$id])) $resources[$id] = $resource;
            }
        }

        $current = $response['currentResource'] ?? null;
        if (is_array($current) && !empty($current['id'])) $resources[(string) $current['id']] = $current;
        if (!$resources) return $response;

        $dispatcher = $this->app->getDispatcher();
        PluginHelper::importPlugin('smartvisuals', null, true, $dispatcher);
        $event = new Event('onSmartVisualsDecorateResources', [
            'resources' => array_values($resources),
            'decorations' => [],
        ]);
        $dispatcher->dispatch($event->getName(), $event);

        return self::apply($response, (array) ($event->getArgument('decorations') ?? []));
    }

    public static function apply(array $response, array $decorations): array
    {
        foreach (self::GROUPS as $group) {
            if (!isset($response[$group]) || !is_array($response[$group])) continue;
            foreach ($response[$group] as &$resource) {
                $resource = self::decorateResource($resource, $decorations);
            }
            unset($resource);
        }

        if (isset($response['currentResource'])) {
            $response['currentResource'] = self::decorateResource($response['currentResource'], $decorations);
        }

        return $response;
    }

    private static function decorateResource(mixed $resource, array $decorations): mixed
    {
        if (!is_array($resource) || !isset($resource['id']) || !empty($resource['unavailable'])) return $resource;
        $decoration = $decorations[(string) $resource['id']] ?? null;
        if (!is_array($decoration)) $decoration = [];

        foreach (['image', 'icon', 'badgeIcon'] as $field) {
            $value = $decoration[$field] ?? null;
            if (!is_string($value) || $value === '') continue;
            if ($field === 'image' && !self::validImage($value)) continue;
            if ($field !== 'image' && !preg_match('/^[a-zA-Z0-9_ -]+$/', $value)) continue;
            $resource[$field] = $value;
        }

        $existing = array_column(is_array($resource['overlays'] ?? null) ? $resource['overlays'] : [], null, 'id');
        foreach (is_array($decoration['badges'] ?? null) ? $decoration['badges'] : [] as $badge) {
            if (!is_array($badge)) continue;
            $id = $badge['id'] ?? null;
            $label = $badge['label'] ?? null;
            $icon = $badge['icon'] ?? null;
            $image = $badge['image'] ?? null;
            if (!is_string($id) || !preg_match('/^[a-z][a-z0-9_-]*$/', $id) || isset($existing[$id])) continue;
            if (!is_string($label) || trim($label) === '') continue;
            $visual = is_string($image) && self::validImage($image) ? ['image' => $image]
                : (is_string($icon) && preg_match('/^[a-zA-Z0-9_ -]+$/', $icon) ? ['icon' => $icon] : []);
            if (!$visual) continue;
            $overlay = ['id' => $id, ...$visual, 'label' => $label, 'tone' => in_array($badge['tone'] ?? '', self::TONES, true) ? $badge['tone'] : 'neutral'];
            $resource['overlays'][] = $overlay;
            $existing[$id] = $overlay;
        }

        unset($resource['imageCrop']);
        $image = $resource['image'] ?? null;
        $helper = 'SuperSoftJx\\Plugin\\Content\\SmartCrop\\Helper\\SmartCropHelper';
        if (is_string($image) && str_contains($image, 'crop=') && class_exists($helper)
            && PluginHelper::isEnabled('content', 'smartcrop')) {
            try {
                $crop = $helper::getFocalPointAndScale($image);
                if ($crop !== null) {
                    $ratio = explode(':', $crop['ratio']);
                    $resource['imageCrop'] = [
                        'source' => $image,
                        'ratio' => (float) $ratio[0] / (float) $ratio[1],
                        'x' => $crop['left_pct'], 'y' => $crop['top_pct'],
                        'width' => $crop['width_pct'], 'height' => $crop['height_pct'],
                    ];
                }
            } catch (\Throwable) {
                // Optional image presentation must not interrupt resource browsing.
            }
        }
        return $resource;
    }

    private static function validImage(string $value): bool
    {
        $scheme = parse_url($value, PHP_URL_SCHEME);
        return trim($value) !== '' && !preg_match('/[\x00-\x20<>"\x27]/', $value)
            && ($scheme === null || (is_string($scheme) && in_array(strtolower($scheme), ['http', 'https'], true)));
    }
}
