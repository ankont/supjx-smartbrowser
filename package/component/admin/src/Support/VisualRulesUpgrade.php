<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;
defined('_JEXEC') or die;

final class VisualRulesUpgrade
{
    public static function params(array $params): array
    {
        foreach ($params as $key => $value) {
            if (!str_starts_with($key, 'visual_')) continue;
            $encoded = is_string($value);
            $profile = $encoded ? json_decode($value, true) : $value;
            if (!is_array($profile)) continue;
            $profile = self::profile($profile);
            $params[$key] = $encoded ? json_encode($profile, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR) : $profile;
        }
        return $params;
    }

    private static function profile(array $profile): array
    {
        if (isset($profile['rules']) && is_array($profile['rules'])) {
            // Only the old explicit-layer format needs conversion; new settings are untouched.
            if (array_filter($profile['rules'], static fn($rule) => is_array($rule) && isset($rule['z']))) {
                $rules = [];
                foreach ($profile['rules'] as $index => $rule) {
                    if (!is_array($rule)) continue;
                    $rule['priority'] = $index + 1;
                    $rules[] = ['rule' => $rule, 'layer' => $rule['z'] ?? count($profile['rules']) - $index, 'index' => $index];
                }
                usort($rules, static fn($a, $b) => $b['layer'] <=> $a['layer'] ?: $b['index'] <=> $a['index']);
                $profile['rules'] = array_map(static function ($entry) { unset($entry['rule']['z']); return $entry['rule']; }, $rules);
            }
            return $profile;
        }
        foreach (['nodes', 'items'] as $kind) {
            if (isset($profile[$kind]) && is_array($profile[$kind])) $profile[$kind] = self::profile($profile[$kind]);
        }
        return $profile;
    }
}
