<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

defined('_JEXEC') or die;

final class ZipEntries
{
    public static function validate(array $entries): array
    {
        if (!$entries || count($entries) > 1000) throw new \InvalidArgumentException('Invalid or oversized ZIP archive', 400);
        $seen = []; $total = 0;
        foreach ($entries as $entry) {
            $name = (string) ($entry['name'] ?? '');
            $decoded = rawurldecode($name);
            $parts = explode('/', rtrim($name, '/'));
            if (!$name || strlen($name) > 1024 || count($parts) > 32 || preg_match('//u', $name) !== 1 || preg_match('/[\x00-\x1f\x7f\\\\:]/', $decoded)
                || str_starts_with($name, '/') || preg_match('#(?:^|/)\.#', $decoded)
                || in_array('', $parts, true) || isset($seen[strtolower(rtrim($name, '/'))])) {
                throw new \InvalidArgumentException('Unsafe or duplicate ZIP path', 400);
            }
            $seen[strtolower(rtrim($name, '/'))] = true;
            $extension = strtolower(pathinfo($name, PATHINFO_EXTENSION));
            if (in_array($extension, ['php','php3','php4','php5','php7','php8','phtml','phar','cgi','pl','py','sh','bat','cmd','exe','dll','asp','aspx','jsp','shtml'], true)
                || !empty($entry['encryption_method']) || !empty($entry['symlink'])) {
                throw new \InvalidArgumentException('Unsafe ZIP entry', 400);
            }
            $size = (int) ($entry['size'] ?? 0); $compressed = (int) ($entry['comp_size'] ?? 0);
            $total += $size;
            if ($size < 0 || $compressed < 0 || $size > 20 * 1024 * 1024 || $total > 100 * 1024 * 1024
                || $size > max(1, $compressed) * 200) throw new \InvalidArgumentException('ZIP expansion limit exceeded', 413);
        }
        foreach ($entries as $entry) {
            $parts = explode('/', rtrim($entry['name'], '/'));
            array_pop($parts); $parent = '';
            foreach ($parts as $part) {
                $parent .= ($parent ? '/' : '') . $part;
                foreach ($entries as $candidate) if (strcasecmp(rtrim($candidate['name'], '/'), $parent) === 0 && !str_ends_with($candidate['name'], '/')) {
                    throw new \InvalidArgumentException('Conflicting ZIP paths', 400);
                }
            }
        }
        return $entries;
    }
}
