<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

defined('_JEXEC') or die;

final class VisualOptions
{
    public const ASSETS = ['base', 'identity', 'image'];
    public const STYLES = ['hidden', 'center', 'corner', 'badge'];
    public const SIZES = ['small', 'medium', 'large', 'max'];
    public const SIZE_MODES = ['center', 'corner', 'badge'];
    public const POSITIONS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    public const DEFAULTS = [
        'base' => ['style' => 'center', 'size' => 'medium', 'sizes' => ['center' => 'medium', 'corner' => 'medium', 'badge' => 'small'], 'position' => 'top-left', 'anchor' => 'image'],
        'identity' => ['style' => 'badge', 'size' => 'small', 'sizes' => ['center' => 'medium', 'corner' => 'small', 'badge' => 'small'], 'position' => 'bottom-right', 'anchor' => 'image'],
        'image' => ['style' => 'center', 'size' => 'large', 'sizes' => ['center' => 'large', 'corner' => 'medium', 'badge' => 'small'], 'position' => 'bottom-left', 'anchor' => 'base'],
        'order' => ['base', 'image', 'identity'], 'imageBackground' => 'auto',
    ];

    public static function decode(mixed $value): array
    {
        if (is_string($value)) $value = json_decode($value, true);
        return is_object($value) ? get_object_vars($value) : (is_array($value) ? $value : []);
    }

    private static function canAnchor(array $settings, string $asset, string $target): bool
    {
        $seen = [$asset];
        while ($target !== '') {
            if (in_array($target, $seen, true)) return false;
            $seen[] = $target;
            $target = ($settings[$target]['style'] ?? '') === 'badge' ? $settings[$target]['anchor'] : '';
        }
        return true;
    }

    public static function normalize(array $input): array
    {
        if (isset($input['rules']) && is_array($input['rules'])) {
            $rules = [];
            foreach ($input['rules'] as $rule) {
                $rule = self::decode($rule);
                if (!in_array($rule['asset'] ?? null, self::ASSETS, true)) continue;
                $anchor = $rule['anchor'] ?? 'item';
                if (in_array($anchor, self::ASSETS, true)) {
                    $legacy = $anchor;
                    $anchor = 'item';
                    foreach ($input['rules'] as $candidate) {
                        $candidate = self::decode($candidate);
                        $position = ($candidate['style'] ?? 'center') === 'center' ? 'center' : ($candidate['style'] ?? '') . ':' . ($candidate['position'] ?? 'top-left');
                        if (($candidate['asset'] ?? '') === $legacy && !in_array($candidate['style'] ?? 'center', ['badge', 'hidden'], true)) { $anchor = $position; break; }
                    }
                }
                $regions = [];
                foreach ($input['rules'] as $candidate) {
                    $candidate = self::decode($candidate);
                    if (!in_array($candidate['asset'] ?? '', self::ASSETS, true) || in_array($candidate['style'] ?? 'center', ['badge', 'hidden'], true)) continue;
                    $regions[] = ($candidate['style'] ?? 'center') === 'center' ? 'center' : ($candidate['style'] ?? '') . ':' . ($candidate['position'] ?? 'top-left');
                }
                if (!in_array($anchor, $regions, true)) $anchor = 'item';
                $rules[] = [
                    'asset' => $rule['asset'],
                    'priority' => max(1, (int) ($rule['priority'] ?? (count($rules) + 1))),
                    'style' => in_array($rule['style'] ?? '', ['center', 'corner', 'badge'], true) ? $rule['style'] : 'center',
                    'size' => in_array($rule['size'] ?? '', self::SIZES, true) ? $rule['size'] : 'medium',
                    'position' => in_array($rule['position'] ?? '', self::POSITIONS, true) ? $rule['position'] : 'top-left',
                    'anchor' => $anchor,
                ];
            }
            return ['rules' => $rules];
        }
        if (isset($input['baseMode'])) {
            $styles = ['hidden' => 'hidden', 'center' => 'center', 'behind' => 'corner-large', 'badge' => 'badge', 'corner' => 'corner-large'];
            $input = [
                'base' => ['style' => $styles[$input['baseMode']] ?? null, 'position' => $input['basePosition'] ?? null],
                'identity' => ['style' => $styles[$input['identityMode'] ?? ''] ?? null, 'position' => $input['identityPosition'] ?? null, 'anchor' => ($input['imageMode'] ?? '') === 'center' ? 'image' : 'base'],
                'image' => ['style' => ($input['imageMode'] ?? '') === 'center' ? 'center-large' : ($styles[$input['imageMode'] ?? ''] ?? null), 'position' => 'bottom-left'],
                'imageBackground' => $input['imageBackground'] ?? 'auto',
            ];
        }
        $settings = [];
        foreach (self::ASSETS as $asset) {
            $source = self::decode($input[$asset] ?? []);
            $fallback = self::DEFAULTS[$asset];
            $legacy = [];
            preg_match('/^(center|corner)-(small|medium|large|max)$/', is_string($source['style'] ?? null) ? $source['style'] : '', $legacy);
            $style = $legacy[1] ?? (in_array($source['style'] ?? '', self::STYLES, true) ? $source['style'] : $fallback['style']);
            $modeSizes = [];
            $savedSizes = self::decode($source['sizes'] ?? []);
            foreach (self::SIZE_MODES as $mode) {
                $saved = $savedSizes[$mode] ?? null;
                $oldSize = $legacy[2] ?? ($source['size'] ?? null);
                $modeSizes[$mode] = in_array($saved, self::SIZES, true) ? $saved :
                    (!isset($source['sizes']) && $mode === $style && in_array($oldSize, self::SIZES, true) ? $oldSize : $fallback['sizes'][$mode]);
            }
            $settings[$asset] = [
                'style' => $style, 'sizes' => $modeSizes, 'size' => $modeSizes[$style] ?? $modeSizes['center'],
                'position' => in_array($source['position'] ?? '', self::POSITIONS, true) ? $source['position'] : $fallback['position'],
                'anchor' => in_array($source['anchor'] ?? '', self::ASSETS, true) && $source['anchor'] !== $asset ? $source['anchor'] : $fallback['anchor'],
            ];
        }
        $order = is_array($input['order'] ?? null) ? array_values(array_filter($input['order'], static fn($asset) => is_string($asset) && in_array($asset, self::ASSETS, true))) : self::DEFAULTS['order'];
        $settings['order'] = array_values(array_unique([...$order, ...self::DEFAULTS['order']]));
        $settings['imageBackground'] = in_array($input['imageBackground'] ?? '', ['auto', 'transparent', 'checkerboard'], true) ? $input['imageBackground'] : 'auto';
        foreach (self::ASSETS as $asset) {
            if ($settings[$asset]['style'] === 'badge' && !self::canAnchor($settings, $asset, $settings[$asset]['anchor'])) {
                $settings[$asset]['style'] = 'corner';
                $settings[$asset]['size'] = $settings[$asset]['sizes']['corner'];
            }
        }
        return $settings;
    }

    public static function forAdapter(string $adapterId, object $params): array
    {
        $adapterId = str_starts_with($adapterId, 'flat-') ? substr($adapterId, 5) : $adapterId;
        $global = self::decode($params->get('visual_global', []));
        $override = self::decode($params->get('visual_' . str_replace('-', '_', $adapterId), []));
        $result = [];
        foreach (['nodes', 'items'] as $kind) {
            $sourceGeneral = self::decode($global[$kind] ?? $global);
            $general = self::normalize($sourceGeneral ?: ['rules' => [['asset' => 'base', 'style' => 'center', 'size' => 'medium']]]);
            $specific = self::decode($override[$kind] ?? $override);
            $merged = array_replace_recursive($general, $specific);
            foreach (self::ASSETS as $asset) {
                $source = self::decode($specific[$asset] ?? []);
                if (!isset($source['sizes']) && (isset($source['size']) || preg_match('/^(center|corner)-/', is_string($source['style'] ?? null) ? $source['style'] : ''))) unset($merged[$asset]['sizes']);
            }
            $result[$kind] = ($specific['custom'] ?? false) === true || ($specific['custom'] ?? null) === 1
                ? self::normalize(isset($specific['rules']) || isset($general['rules']) ? $specific : $merged) : $general;
        }
        return $result;
    }
}
