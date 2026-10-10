<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

use Joomla\CMS\Application\CMSApplicationInterface;
use Joomla\CMS\Language\Text;
use Joomla\Component\Media\Administrator\Model\ApiModel;
use SuperSoft\Component\Smartbrowser\Administrator\Adapter\MediaAdapter;

defined('_JEXEC') or die;

final class MediaBatchRunner
{
    public function __construct(private readonly CMSApplicationInterface $app, private readonly MediaAdapter $adapter, private readonly ApiModel $api)
    {
    }

    public function run(array $selection, array $payload): array
    {
        if (!$selection) $this->invalid();
        if (!empty($payload['extract'])) {
            if (!empty($payload['rename']) || !empty($payload['zip']) || ($payload['placement'] ?? 'none') !== 'none') $this->invalid();
            return $this->extract($selection, !empty($payload['deleteArchive']));
        }
        $rename = !empty($payload['rename']);
        $placement = (string) ($payload['placement'] ?? 'none');
        $zip = !empty($payload['zip']);
        if (!in_array($placement, ['none', 'move', 'copy'], true) || (!$rename && $placement === 'none' && !$zip)) $this->invalid();
        $identity = $this->app->getIdentity();
        if ($rename && $placement === 'none' && !$identity->authorise('core.edit', 'com_media')) $this->denied();
        if ($placement === 'copy' && !$identity->authorise('core.create', 'com_media')) $this->denied();

        $paths = array_values(array_unique(array_map('strval', $selection)));
        $this->adapter->assertBrowseScope($paths);
        foreach ($paths as $id) $this->adapter->getResource($id);
        foreach ($paths as $left) {
            foreach ($paths as $right) {
                if ($left !== $right && str_starts_with($right, rtrim($left, '/') . '/')) $this->invalid();
            }
        }
        $destination = '';
        if ($placement !== 'none') {
            $destination = (string) ($payload['destination'] ?? '');
            $this->adapter->assertBrowseScope([$destination]);
            if (($this->adapter->getResource($destination)['kind'] ?? '') !== 'node') $this->invalid();
            [$targetAdapter] = $this->split($destination);
            if ($placement === 'move') {
                foreach ($paths as $id) {
                    [$sourceAdapter] = $this->split($id);
                    if ($sourceAdapter !== $targetAdapter && (!$identity->authorise('core.create', 'com_media') || !$identity->authorise('core.delete', 'com_media'))) {
                        $this->denied();
                    }
                }
            }
            foreach ($paths as $id) {
                [$sourceAdapter] = $this->split($id);
                if ($sourceAdapter !== $targetAdapter && $this->isFolder($id)) {
                    throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_CROSS_PROVIDER_FOLDER'), 400);
                }
            }
            if ($rename || $placement === 'move') {
                foreach ($paths as $id) {
                    [$sourceAdapter] = $this->split($id);
                    if ($sourceAdapter === $targetAdapter && !$identity->authorise('core.edit', 'com_media')) $this->denied();
                }
            }
        }

        $result = [];
        foreach ($paths as $index => $id) {
            [$sourceAdapter, $sourcePath] = $this->split($id);
            $renamedDuringCopy = false;
            if ($placement !== 'none') {
                [$targetAdapter, $targetPath] = $this->split($destination);
                if ($sourceAdapter === $targetAdapter && ($targetPath === $sourcePath || str_starts_with($targetPath, rtrim($sourcePath, '/') . '/'))) $this->invalid();
                $newPath = rtrim($targetPath, '/') . '/' . basename($sourcePath);
                if ($sourceAdapter !== $targetAdapter) {
                    $name = $rename ? $this->renamed(basename($sourcePath), $this->isFolder($id), $index, $payload) : basename($sourcePath);
                    $newPath = $this->copy($sourceAdapter, $sourcePath, $targetAdapter, $targetPath, $name);
                    $id = $targetAdapter . ':' . $newPath;
                    $this->adapter->getResource($id);
                    $renamedDuringCopy = $rename;
                    if ($placement === 'move') $this->api->delete($sourceAdapter, $sourcePath);
                } elseif ($placement === 'move') {
                    $id = $sourceAdapter . ':' . $this->api->move($sourceAdapter, $sourcePath, $newPath, false);
                } else {
                    $id = $targetAdapter . ':' . $this->copy($sourceAdapter, $sourcePath, $targetAdapter, $targetPath);
                }
                [, $sourcePath] = $this->split($id);
            }
            if ($rename && !$renamedDuringCopy) {
                [$resultAdapter] = $this->split($id);
                $name = $this->renamed(basename($sourcePath), $this->isFolder($id), $index, $payload);
                if ($name !== basename($sourcePath)) {
                    $sourcePath = $this->api->move($resultAdapter, $sourcePath, rtrim(dirname($sourcePath), '/') . '/' . $name, false);
                    $id = $resultAdapter . ':' . $sourcePath;
                }
            }
            $result[] = $id;
        }

        $response = ['updated' => $result];
        if ($zip) $response['download'] = $this->zip($result, (string) ($payload['zipName'] ?? 'selection.zip'));
        return $response;
    }

    private function extract(array $selection, bool $deleteArchive): array
    {
        $identity = $this->app->getIdentity();
        if (!$identity->authorise('core.create', 'com_media') || $deleteArchive && !$identity->authorise('core.delete', 'com_media')) $this->denied();
        if (!class_exists(\ZipArchive::class)) throw new \RuntimeException('ZIP extension is not available', 501);
        if (count($selection) !== 1) $this->invalid();
        $id = (string) reset($selection); $this->adapter->assertBrowseScope([$id]);
        $resource = $this->adapter->getResource($id);
        if (empty($resource['capabilities']['extract']) || (int) ($resource['metadata']['size'] ?? 0) > 20 * 1024 * 1024) $this->invalid();
        [$provider, $path] = $this->split($id);
        $parent = dirname($path); $folder = pathinfo($path, PATHINFO_FILENAME);
        if (!$folder || str_starts_with($folder, '.') || str_contains($folder, ':')) $this->invalid();
        $destination = rtrim($parent, '/') . '/' . $folder;
        $this->adapter->assertBrowseScope([$provider . ':' . $destination]);
        foreach ($this->children($provider, $parent) as $child) if (strcasecmp((string) $child->name, $folder) === 0) {
            throw new \InvalidArgumentException('Extraction folder already exists', 409);
        }
        $content = $this->contents($provider, $path);
        if (strlen($content) > 20 * 1024 * 1024) $this->invalid();
        $file = tempnam(sys_get_temp_dir(), 'smartbrowser-zip-');
        if ($file === false) throw new \RuntimeException('Could not create temporary ZIP', 500);
        $zip = new \ZipArchive(); $opened = false; $created = false; $complete = false;
        try {
            if (file_put_contents($file, $content) !== strlen($content) || $zip->open($file, \ZipArchive::CHECKCONS) !== true) $this->invalid();
            $opened = true; $entries = [];
            if ($zip->numFiles > 1000) $this->invalid();
            for ($index = 0; $index < $zip->numFiles; $index++) {
                $entry = $zip->statIndex($index); if (!$entry) $this->invalid();
                $opsys = 0; $attributes = 0;
                $zip->getExternalAttributesIndex($index, $opsys, $attributes);
                $entry['symlink'] = $opsys === 3 && (($attributes >> 16) & 0170000) === 0120000;
                $entry['index'] = $index; $entries[] = $entry;
            }
            $entries = ZipEntries::validate($entries);
            $name = $this->api->createFolder($provider, $folder, $parent, false);
            $destination = rtrim($parent, '/') . '/' . $name; $created = true;
            $directories = ['' => $destination];
            foreach ($entries as $entry) {
                $parts = explode('/', rtrim($entry['name'], '/')); $filename = array_pop($parts);
                if (str_ends_with($entry['name'], '/')) $parts[] = $filename;
                $relative = ''; $directory = $destination;
                foreach ($parts as $part) {
                    $relative .= ($relative ? '/' : '') . $part;
                    if (!isset($directories[$relative])) {
                        $name = $this->api->createFolder($provider, $part, $directory, false);
                        $directories[$relative] = $directory . '/' . $name;
                    }
                    $directory = $directories[$relative];
                }
                if (str_ends_with($entry['name'], '/')) continue;
                $data = $zip->getFromIndex($entry['index']);
                if (!is_string($data) || strlen($data) !== (int) $entry['size']) $this->invalid();
                // Native provider upload validation remains authoritative; never extract paths directly.
                $this->api->createFile($provider, $filename, $directory, $data, false);
            }
            $complete = true;
            if ($deleteArchive) $this->api->delete($provider, $path);
            return ['updated' => [$provider . ':' . $destination], 'deleted' => $deleteArchive ? [$id] : []];
        } catch (\Throwable $error) {
            if ($created && !$complete) { try { $this->api->delete($provider, $destination); } catch (\Throwable) {} }
            throw $error;
        } finally {
            if ($opened) $zip->close();
            @unlink($file);
        }
    }

    private function copy(string $sourceAdapter, string $source, string $targetAdapter, string $parent, ?string $targetName = null): string
    {
        $name = $targetName ?? basename($source);
        if ($this->isFolder($sourceAdapter . ':' . $source)) {
            $created = $this->api->createFolder($targetAdapter, $name, $parent, false);
            $newPath = rtrim($parent, '/') . '/' . $created;
            try {
                foreach ($this->children($sourceAdapter, $source) as $child) {
                    [, $path] = $this->split((string) $child->path);
                    $this->copy($sourceAdapter, $path, $targetAdapter, $newPath);
                }
            } catch (\Throwable $error) {
                try { $this->api->delete($targetAdapter, $newPath); } catch (\Throwable) {}
                throw $error;
            }
            return $newPath;
        }
        $created = $this->api->createFile($targetAdapter, $name, $parent, $this->contents($sourceAdapter, $source), false);
        return rtrim($parent, '/') . '/' . $created;
    }

    private function zip(array $ids, string $name): array
    {
        $name = basename(str_replace('\\', '/', trim($name)));
        if ($name === '' || $name === '.' || $name === '..') $this->invalid();
        if (!str_ends_with(strtolower($name), '.zip')) $name .= '.zip';
        if (!class_exists(\ZipArchive::class)) {
            $entries = [];
            foreach ($ids as $id) {
                [$adapter, $path] = $this->split($id);
                $this->collectZipEntries($entries, $adapter, $path, basename($path));
            }
            return ['name' => $name, 'content' => base64_encode($this->portableZip($entries))];
        }
        $file = tempnam(sys_get_temp_dir(), 'smartbrowser-');
        if ($file === false) throw new \RuntimeException('Could not create ZIP', 500);
        $zip = new \ZipArchive();
        $opened = false;
        try {
            if ($zip->open($file, \ZipArchive::OVERWRITE) !== true) throw new \RuntimeException('Could not create ZIP', 500);
            $opened = true;
            foreach ($ids as $id) {
                [$adapter, $path] = $this->split($id);
                $this->addToZip($zip, $adapter, $path, basename($path));
            }
            $zip->close();
            $opened = false;
            return ['name' => $name, 'content' => base64_encode((string) file_get_contents($file))];
        } finally {
            if ($opened) $zip->close();
            @unlink($file);
        }
    }

    private function addToZip(\ZipArchive $zip, string $adapter, string $path, string $entry): void
    {
        if ($this->isFolder($adapter . ':' . $path)) {
            $zip->addEmptyDir($entry);
            foreach ($this->children($adapter, $path) as $child) {
                [, $childPath] = $this->split((string) $child->path);
                $this->addToZip($zip, $adapter, $childPath, $entry . '/' . basename($childPath));
            }
        } else {
            $zip->addFromString($entry, $this->contents($adapter, $path));
        }
    }

    private function collectZipEntries(array &$entries, string $adapter, string $path, string $entry): void
    {
        if ($this->isFolder($adapter . ':' . $path)) {
            $entries[$entry . '/'] = '';
            foreach ($this->children($adapter, $path) as $child) {
                [, $childPath] = $this->split((string) $child->path);
                $this->collectZipEntries($entries, $adapter, $childPath, $entry . '/' . basename($childPath));
            }
        } else {
            $entries[$entry] = $this->contents($adapter, $path);
        }
    }

    private function portableZip(array $entries): string
    {
        if (count($entries) > 65535) throw new \RuntimeException('Too many ZIP entries', 413);
        $body = '';
        $directory = '';
        $time = 0;
        $date = 33;
        foreach ($entries as $name => $data) {
            $size = strlen($data);
            $offset = strlen($body);
            if ($size > 0xffffffff || $offset > 0xffffffff) throw new \RuntimeException('ZIP exceeds 4 GB', 413);
            $crc = crc32($data);
            $nameLength = strlen($name);
            $body .= pack('VvvvvvVVVvv', 0x04034b50, 20, 0x0800, 0, $time, $date, $crc, $size, $size, $nameLength, 0) . $name . $data;
            $directory .= pack('VvvvvvvVVVvvvvvVV', 0x02014b50, 20, 20, 0x0800, 0, $time, $date, $crc, $size, $size, $nameLength, 0, 0, 0, 0, str_ends_with($name, '/') ? 0x10 : 0, $offset) . $name;
        }
        $count = count($entries);
        return $body . $directory . pack('VvvvvVVv', 0x06054b50, 0, 0, $count, $count, strlen($directory), strlen($body), 0);
    }

    private function children(string $adapter, string $path): array
    {
        return $this->api->getFiles($adapter, $path, ['search' => null, 'recursive' => false]);
    }

    private function contents(string $adapter, string $path): string
    {
        $encoded = $this->api->getFile($adapter, $path, ['content' => true])->content ?? null;
        $contents = is_string($encoded) ? base64_decode($encoded, true) : false;
        if ($contents === false) throw new \RuntimeException('Could not read media file', 500);
        return $contents;
    }

    private function isFolder(string $id): bool
    {
        return ($this->adapter->getResource($id)['kind'] ?? '') === 'node';
    }

    private function renamed(string $name, bool $folder, int $index, array $payload): string
    {
        $dot = $folder ? false : strrpos($name, '.');
        $stem = $dot !== false && $dot > 0 ? substr($name, 0, $dot) : $name;
        $ext = $dot !== false && $dot > 0 ? substr($name, $dot) : '';
        $find = (string) ($payload['find'] ?? '');
        if ($find !== '') $stem = str_replace($find, (string) ($payload['replace'] ?? ''), $stem);
        $sequence = !empty($payload['number']) ? '-' . str_pad((string) (max(1, (int) ($payload['startAt'] ?? 1)) + $index), 2, '0', STR_PAD_LEFT) : '';
        $name = (string) ($payload['prefix'] ?? '') . $stem . (string) ($payload['suffix'] ?? '') . $sequence . $ext;
        if ($name === '' || $name === '.' || $name === '..' || str_contains($name, '/') || str_contains($name, '\\')) $this->invalid();
        return $name;
    }

    private function split(string $id): array
    {
        $parts = explode(':', $id, 2);
        if (count($parts) !== 2 || $parts[0] === '' || !str_starts_with($parts[1], '/') || in_array('..', explode('/', $parts[1]), true)) $this->invalid();
        return $parts;
    }

    private function invalid(): never
    {
        throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
    }

    private function denied(): never
    {
        throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
    }
}
