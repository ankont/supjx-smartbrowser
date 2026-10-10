<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

defined('_JEXEC') or die;

final class DirectLinkUri
{
    public static function webAddress(string $input, string $mode, string $siteRoot): string
    {
        $uri = self::normalize('web', $input);
        if (!in_array($mode, ['auto', 'absolute', 'relative'], true)) throw new \InvalidArgumentException('Invalid address mode.', 400);
        $root = parse_url(self::normalize('web', $siteRoot));
        $parts = parse_url($uri);
        // HTTP/HTTPS are representations of the same site, not read-access grants.
        $port = static fn ($value) => isset($value['port']) && $value['port'] !== (($value['scheme'] ?? '') === 'https' ? 443 : 80) ? $value['port'] : null;
        $internal = !isset($parts['host']) || (strtolower($parts['host']) === strtolower($root['host'] ?? '')
            && $port($parts) === $port($root));
        if (isset($parts['host']) && ($mode === 'absolute' || $mode === 'auto' && !$internal)) return $uri;
        $path = $parts['path'] ?? '';
        if (!isset($parts['host']) && !str_starts_with($path, '/')) $path = rtrim($root['path'] ?? '/', '/') . '/' . $path;
        if (str_starts_with($path, '//')) $path = '/.' . $path;
        $relative = ($path ?: '/') . (isset($parts['query']) ? '?' . $parts['query'] : '') . (isset($parts['fragment']) ? '#' . $parts['fragment'] : '');
        return self::normalize('web', $mode === 'absolute'
            ? $root['scheme'] . '://' . $root['host'] . (isset($root['port']) ? ':' . $root['port'] : '') . $relative : $relative);
    }

    public static function joomlaPath(string $option, string $view, string $id): string
    {
        if (!preg_match('/^com_[a-z0-9_]+$/D', $option) || !preg_match('/^[a-z][a-z0-9_]*$/D', $view)
            || ($id !== '' && (!ctype_digit($id) || strlen($id) > 10 || (float) $id > 2147483647))) throw new \InvalidArgumentException('Invalid Joomla path.', 400);
        return 'index.php?' . http_build_query(['option'=>$option, 'view'=>$view] + ($id === '' ? [] : ['id'=>(string) (int) $id]), '', '&', PHP_QUERY_RFC3986);
    }

    public static function joomlaParts(string $uri): ?array
    {
        if (parse_url($uri, PHP_URL_PATH) !== 'index.php') return null;
        parse_str((string) parse_url($uri, PHP_URL_QUERY), $parts);
        if (!is_string($parts['option'] ?? null) || !is_string($parts['view'] ?? null) || !is_string($parts['id'] ?? '')) return null;
        try { return self::joomlaPath($parts['option'], $parts['view'], $parts['id'] ?? '') === $uri ? $parts : null; }
        catch (\InvalidArgumentException $error) { return null; }
    }
    public static function normalize(string $type, string $input): string
    {
        $input = trim($input);
        if ($input === '' || strlen($input) > 1400 || preg_match('//u', $input) !== 1 || preg_match('/[\x00-\x1f\x7f<>"\x27\\\\]/', $input)) throw new \InvalidArgumentException('Invalid URI.', 400);
        if ($type === 'mail') {
            $email = preg_replace('/^mailto:/i', '', $input);
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) throw new \InvalidArgumentException('Invalid e-mail.', 400);
            [$local, $domain] = explode('@', $email, 2);
            return 'mailto:' . $local . '@' . strtolower($domain);
        }
        if ($type === 'tel') {
            $number = preg_replace('/[ ().-]/', '', preg_replace('/^tel:/i', '', $input));
            if (!preg_match('/^\+?[0-9]{3,20}$/D', $number)) throw new \InvalidArgumentException('Invalid telephone.', 400);
            return 'tel:' . $number;
        }
        if ($type === 'fragment') {
            $fragment = rawurldecode(ltrim($input, '#'));
            if ($fragment === '' || preg_match('/[\x00-\x20\x7f<>"\x27\\\\]/', $fragment)) throw new \InvalidArgumentException('Invalid fragment.', 400);
            return '#' . rawurlencode($fragment);
        }
        if ($type !== 'web' || preg_match('/[\x00-\x20\x7f<>"\x27\\\\]/', rawurldecode($input)) || preg_match('/%(?![a-fA-F0-9]{2})/', $input)) throw new \InvalidArgumentException('Invalid web URI.', 400);
        $parts = parse_url($input);
        if ($parts === false || str_starts_with($input, '//') || str_starts_with($input, '#')) throw new \InvalidArgumentException('Invalid web URI.', 400);
        if (isset($parts['scheme'])) {
            $scheme = strtolower($parts['scheme']);
            if (!in_array($scheme, ['http', 'https'], true) || !filter_var($input, FILTER_VALIDATE_URL)
                || isset($parts['user']) || isset($parts['pass'])) throw new \InvalidArgumentException('Unsafe URI scheme.', 400);
            return $scheme . '://' . strtolower($parts['host']) . (isset($parts['port']) ? ':' . $parts['port'] : '')
                . ($parts['path'] ?? '/') . (isset($parts['query']) ? '?' . $parts['query'] : '') . (isset($parts['fragment']) ? '#' . $parts['fragment'] : '');
        }
        if (isset($parts['host']) || preg_match('/^[^\/]*:/', $input)) throw new \InvalidArgumentException('Unsafe relative URI.', 400);
        return $input;
    }

    public static function reference(string $type, string $input, string $name = ''): array
    {
        $uri = self::normalize($type, $input);
        if (strlen($uri) > 1400) throw new \InvalidArgumentException('URI too large.', 400);
        $id = 'uri:' . rtrim(strtr(base64_encode($uri), '+/', '-_'), '=');
        $name = trim($name);
        if (strlen($name) > 256 || preg_match('//u', $name) !== 1 || preg_match('/[\x00-\x1f\x7f<>]/', $name)) throw new \InvalidArgumentException('Invalid link name.', 400);
        if ($name !== '') $id .= '.' . rtrim(strtr(base64_encode($name), '+/', '-_'), '=');
        if (strlen($id) > 2048) throw new \InvalidArgumentException('URI too large.', 400);
        return ['adapter' => 'direct-links', 'id' => $id];
    }

    public static function decode(string $id): array
    {
        if (!preg_match('/^uri:([a-zA-Z0-9_-]+)(?:\.([a-zA-Z0-9_-]+))?$/D', $id, $matches) || strlen($id) > 2048) throw new \InvalidArgumentException('Invalid URI reference.', 400);
        $uri = base64_decode(strtr($matches[1], '-_', '+/'), true);
        if (!is_string($uri)) throw new \InvalidArgumentException('Invalid URI reference.', 400);
        $type = str_starts_with($uri, 'mailto:') ? 'mail' : (str_starts_with($uri, 'tel:') ? 'tel' : (str_starts_with($uri, '#') ? 'fragment' : 'web'));
        if (self::reference($type, $uri, self::name($id))['id'] !== $id) throw new \InvalidArgumentException('Noncanonical URI reference.', 400);
        if ($type === 'web' && self::joomlaParts($uri) !== null) $type = 'joomla';
        return [$type, $uri];
    }

    public static function name(string $id): string
    {
        $suffix = explode('.', $id, 2)[1] ?? '';
        $name = base64_decode(strtr($suffix, '-_', '+/'), true);
        if ($name === false) throw new \InvalidArgumentException('Invalid link name.', 400);
        return $name;
    }

    public static function telephone(string $input, string $prefix): string
    {
        $number = self::normalize('tel', $input);
        if (str_starts_with($number, 'tel:00')) return self::normalize('tel', '+' . substr($number, 6));
        if ($prefix === '' || str_starts_with($number, 'tel:+')) return $number;
        if (!preg_match('/^\+[1-9][0-9]{0,2}$/D', $prefix)) throw new \InvalidArgumentException('Invalid country prefix.', 400);
        return self::normalize('tel', $prefix . substr($number, 4));
    }
}
