<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

defined('_JEXEC') or die;

/** Server-side reader of the public address syntax. Resolution and access stay in the adapters. */
final class SelectionAddress
{
    private static array $formats = [], $properties = [], $codecs = [];

    public static function registerFormat(string $name, callable $reference): void { self::$formats[$name] = $reference; }
    public static function registerProperty(array $definition): void { self::$properties[$definition['key']] = $definition; }
    public static function registerCodec(string $name, callable $decode): void { self::$codecs[$name] = $decode; }

    public static function parse(string $value): ?array
    {
        if (strlen($value) > 262144 || preg_match('/[\x00-\x1f\x7f]/', $value)) throw new \InvalidArgumentException('Invalid selection address.');
        preg_match_all('/#([a-zA-Z][a-zA-Z0-9]*):\/\//', $value, $matches, PREG_OFFSET_CAPTURE);
        $known = ['joomlaItem', 'joomlaLink', 'joomlaImage', 'joomlaFile', 'joomlaFolder', 'joomlaMedia'];
        for ($i = count($matches[0]) - 1; $i >= 0; $i--) {
            $format = $matches[1][$i][0];
            if (!in_array($format, $known, true) && !isset(self::$formats[$format])) continue;
            $url = substr($value, 0, $matches[0][$i][1]);
            if ($url !== '' && SelectionOutputRenderer::safeUrl($url) === null) throw new \InvalidArgumentException('Invalid address URL.');
            [$locator, $query] = array_pad(explode('?', substr($value, $matches[0][$i][1] + strlen($matches[0][$i][0])), 2), 2, '');
            if (preg_match('/[#\s\\\\]|%(?![a-fA-F0-9]{2})/', $locator . $query)) throw new \InvalidArgumentException('Invalid address locator or encoding.');
            $properties = [];
            foreach ($query === '' ? [] : explode('&', $query) as $pair) {
                [$key, $part] = array_pad(explode('=', $pair, 2), 2, '');
                $key = urldecode($key); $part = urldecode($part);
                if ($key === '' || preg_match('/[\x00-\x1f\x7f]/', $key . $part)) throw new \InvalidArgumentException('Invalid address property.');
                $properties[] = [$key, $part];
            }
            return ['format' => $format, 'url' => $url, 'locator' => $locator, 'properties' => $properties];
        }
        return null; // Ordinary anchors and unknown formats belong to their original consumer.
    }

    public static function reference(array $address): array
    {
        if (isset(self::$formats[$address['format']])) return (self::$formats[$address['format']])($address);
        if ($address['format'] === 'joomlaLink') {
            $url = $address['url'];
            $type = str_starts_with($url, 'mailto:') ? 'mail' : (str_starts_with($url, 'tel:') ? 'tel' : (str_starts_with($url, '#') ? 'fragment' : 'web'));
            $names = array_values(array_filter($address['properties'], static fn ($pair) => $pair[0] === 'name'));
            if ($address['locator'] !== '' || count($names) > 1) throw new \InvalidArgumentException('Invalid link address.');
            return DirectLinkUri::reference($type, $url, $names[0][1] ?? '');
        }
        if ($address['format'] !== 'joomlaItem') return self::mediaReference($address['locator']);
        if (!preg_match('/^(article|category|tag|menu-item|user)\/([1-9][0-9]*)$/D', $address['locator'], $match)) throw new \InvalidArgumentException('Invalid item address.');
        $adapters = ['article' => ['articles', 'featured-articles', 'articles-by-tag'], 'category' => ['categories', 'articles'], 'tag' => ['tags', 'articles-by-tag'], 'menu-item' => ['menus'], 'user' => ['users']][$match[1]];
        $hints = array_values(array_filter($address['properties'], static fn ($pair) => $pair[0] === 'adapter'));
        if (count($hints) > 1 || $hints && !in_array($hints[0][1], $adapters, true)) throw new \InvalidArgumentException('Invalid adapter hint.');
        return ['adapter' => $hints[0][1] ?? $adapters[0], 'id' => $match[1] . ':' . $match[2]];
    }

    public static function decode(string $raw): ?array
    {
        $address = self::parse($raw);
        if (!$address) return null;
        $reference = self::reference($address);
        $resource = ResourceDescriptor::complete(['type' => explode(':', $reference['id'])[0], 'selectionCapabilities' => ResourceDescriptor::linkCapabilities()]);
        $definitions = array_column($resource['selectionCapabilities'], null, 'key');
        foreach (self::$properties as $key => $definition) $definitions[$key] = $definition;
        $usage = []; $claimed = []; $compounds = []; $aliases = [];
        foreach ($definitions as $definition) {
            $name = $definition['address']['name'] ?? $definition['key'];
            $positions = array_keys(array_filter($address['properties'], static fn ($pair) => $pair[0] === $name));
            if (!$positions) continue;
            if (count($positions) !== 1) throw new \InvalidArgumentException('Duplicate address property.');
            $position = $positions[0]; $value = $address['properties'][$position][1];
            $codec = $definition['address']['codec'] ?? null;
            if ($codec) {
                if ($codec !== 'joomlaImage' && !isset(self::$codecs[$codec])) continue;
                if (!preg_match('/^[a-zA-Z][a-zA-Z0-9]*$/D', $value) || isset($aliases[$value])) throw new \InvalidArgumentException('Invalid compound alias.');
                $aliases[$value] = true; $parts = [];
                foreach ($address['properties'] as $index => [$key, $part]) if (str_starts_with($key, $value . '.')) { $parts[] = [substr($key, strlen($value) + 1), $part]; $claimed[$index] = true; }
                $decoded = $codec === 'joomlaImage' ? self::image($parts) : (self::$codecs[$codec])($parts, $definition, $address);
                $usage[$definition['key']] = $decoded['value'];
                if (isset($decoded['preserved'])) $compounds[$definition['key']] = $decoded['preserved'];
            } else {
                if (isset($definition['address']['values'])) {
                    $mapped = array_search($value, $definition['address']['values'], true);
                    if ($mapped === false) throw new \InvalidArgumentException('Invalid address value.');
                    $value = (string) $mapped;
                }
                if (($definition['type'] ?? '') === 'boolean') {
                    if (!in_array($value, ['true', 'false'], true)) throw new \InvalidArgumentException('Invalid boolean.');
                    $value = $value === 'true';
                } elseif (($definition['type'] ?? '') === 'number') {
                    if (!is_numeric($value) || !is_finite((float) $value)) throw new \InvalidArgumentException('Invalid number.');
                    $value = (float) $value;
                }
                $usage[$definition['key']] = $value;
            }
            $claimed[$position] = true;
        }
        $remaining = array_values(array_filter($address['properties'], static fn ($pair, $index) => !isset($claimed[$index]) && !in_array($pair[0], ['adapter', 'mediaType', 'name'], true), ARRAY_FILTER_USE_BOTH));
        $usage['ext.selectionAddress'] = ['format' => $address['format'], 'properties' => $remaining, 'compounds' => $compounds];
        if ($address['format'] === 'joomlaImage') $usage['ext.address'] = $raw;
        return ['selection' => $reference, 'usage' => $usage];
    }

    private static function mediaReference(string $locator): array
    {
        if (!preg_match('/^([a-zA-Z0-9_.-]+)(\/.*)$/D', $locator, $match)) throw new \InvalidArgumentException('Invalid media locator.');
        $path = rawurldecode($match[2]);
        if (preg_match('/[\\\\\x00-\x1f\x7f]/', $path) || array_intersect(explode('/', rawurldecode($path)), ['.', '..'])) throw new \InvalidArgumentException('Invalid media path.');
        return ['adapter' => 'media', 'id' => $match[1] . ':' . $path];
    }

    private static function image(array $parts): array
    {
        $values = []; $parameters = [];
        foreach ($parts as [$key, $value]) {
            if (in_array($key, ['src', 'media'], true)) {
                if (isset($values[$key])) throw new \InvalidArgumentException('Duplicate image component.');
                $values[$key] = $value;
            } else {
                if (!in_array($key, ['width', 'height', 'crop', 'ratio', 'zoom'], true) && !(str_starts_with($key, 'param.') && strlen($key) > 6)) throw new \InvalidArgumentException('Unknown image component.');
                $parameters[] = [str_starts_with($key, 'param.') ? substr($key, 6) : $key, $value];
            }
        }
        if (empty($values['src']) || empty($values['media']) || SelectionOutputRenderer::safeUrl($values['src'], true) === null) throw new \InvalidArgumentException('Invalid compound image.');
        $query = implode('&', array_map(static fn ($pair) => rawurlencode($pair[0]) . '=' . rawurlencode($pair[1]), $parameters));
        return ['value' => self::mediaReference($values['media']), 'preserved' => $values['src'] . '#joomlaImage://' . $values['media'] . ($query !== '' ? '?' . $query : '')];
    }
}
