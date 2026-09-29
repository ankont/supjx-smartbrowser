<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Adapter;

use Joomla\CMS\Application\CMSApplicationInterface;
use Joomla\CMS\Component\ComponentHelper;
use Joomla\CMS\Language\Text;
use Joomla\Component\Media\Administrator\Model\ApiModel;
use Joomla\Component\Media\Administrator\Model\MediaModel;
use SuperSoft\Component\Smartbrowser\Administrator\Support\MediaBatchRunner;

defined('_JEXEC') or die;

final class MediaAdapter implements ResourceAdapterInterface, BrowseRootAwareInterface
{
    private ApiModel $apiModel;
    private MediaModel $mediaModel;
    private ?string $browseRoot = null;

    public function __construct(private readonly CMSApplicationInterface $app)
    {
        $this->apiModel   = new ApiModel();
        $this->mediaModel = new MediaModel();
    }

    public function getId(): string
    {
        return 'media';
    }

    public function getRoots(): array
    {
        if ($this->browseRoot) {
            $resource = $this->getResource($this->browseRoot);
            return [[...$resource, 'type' => 'root', 'parentId' => null, 'visible' => true]];
        }

        return $this->getNaturalRoots();
    }

    private function getNaturalRoots(): array
    {
        $roots = [];

        foreach ($this->mediaModel->getProviders() as $provider) {
            foreach ($provider->adapterNames as $adapterName) {
                $id      = $provider->name . '-' . $adapterName . ':/';
                $roots[] = [
                    'id'           => $id,
                    'title'        => $adapterName,
                    'subtitle'     => $provider->displayName,
                    'type'         => 'root',
                    'icon'         => 'icon-folder-open',
                    'hasChildren'  => true,
                    'capabilities' => $this->capabilities(true),
                    'metadata'     => ['provider' => $provider->name],
                ];
            }
        }

        return $roots;
    }

    public function getResources(string $nodeId, array $options = []): array
    {
        $this->assertBrowseScope([$nodeId]);
        [$adapter, $path] = $this->splitId($nodeId);
        $rawItems = $this->withAllMediaTypes(fn () => $this->apiModel->getFiles($adapter, $path, [
            'url'       => true,
            'content'   => false,
            'search'    => $options['search'] ?? null,
            'recursive' => false,
        ]));

        $nodes = [];
        $items = [];
        $allItems = [];

        foreach ($rawItems as $rawItem) {
            $normalized = $this->normalize($rawItem);

            if ($normalized['kind'] === 'node') {
                $nodes[] = $normalized;
            } else {
                $allItems[] = $normalized;
                if (self::matchesFilters($normalized, $options['filters'] ?? [], (string) $this->app->get('offset', 'UTC'))) $items[] = $normalized;
            }
        }

        return [
            'nodeId'     => $nodeId,
            'nodes'      => $nodes,
            'items'      => $items,
            'breadcrumb' => $this->getBreadcrumb($nodeId),
            'actions'    => $this->getActions([]),
            'presentation' => $this->presentation($allItems),
        ];
    }

    public function getResource(string $resourceId, array $options = []): array
    {
        $this->assertBrowseScope([$resourceId]);
        [$adapter, $path] = $this->splitId($resourceId);

        if ($path === '/') {
            foreach ($this->getNaturalRoots() as $root) {
                if ($root['id'] === $resourceId) {
                    return [...$root, 'kind' => 'node', 'role' => 'primary'];
                }
            }
            throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        }

        return $this->normalize($this->withAllMediaTypes(fn () => $this->apiModel->getFile($adapter, $path, [
            'url'     => (bool) ($options['url'] ?? true),
            'content' => (bool) ($options['content'] ?? false),
        ])));
    }

    public function getBreadcrumb(string $nodeId): array
    {
        $this->assertBrowseScope([$nodeId]);
        [$adapter, $path] = $this->splitId($nodeId);
        $boundaryPath = '/';
        if ($this->browseRoot) [, $boundaryPath] = $this->splitId($this->browseRoot);
        $boundaryId = $adapter . ':' . $boundaryPath;
        $boundaryTitle = $boundaryPath === '/' ? $this->rootTitle($adapter) : basename($boundaryPath);
        $crumbs = [['id' => $boundaryId, 'title' => $boundaryTitle]];
        $cursor = rtrim($boundaryPath, '/');
        $relativePath = $boundaryPath === '/' ? $path : substr($path, strlen(rtrim($boundaryPath, '/')));

        foreach (array_values(array_filter(explode('/', trim($relativePath, '/')))) as $part) {
            $cursor  .= '/' . $part;
            $crumbs[] = ['id' => $adapter . ':' . $cursor, 'title' => $part];
        }

        return $crumbs;
    }

    public function configureBrowseRoot(?string $browseRoot): void
    {
        if ($browseRoot === null || $browseRoot === '') {
            $this->browseRoot = null;
            return;
        }
        if (!str_contains($browseRoot, ':')) {
            $roots = $this->getRoots();
            if (count($roots) !== 1) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
            [$adapter] = $this->splitId($roots[0]['id']);
            $browseRoot = $adapter . ':' . (str_starts_with($browseRoot, '/') ? $browseRoot : '/' . $browseRoot);
        }
        [$adapter, $path] = $this->splitId($browseRoot);
        $candidate = $adapter . ':' . $path;
        $resource = $path === '/'
            ? $this->rootResource($candidate)
            : $this->normalize($this->withAllMediaTypes(fn () => $this->apiModel->getFile($adapter, $path, ['url' => true, 'content' => false])));
        if ($resource['kind'] !== 'node') throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        $this->browseRoot = $candidate;
    }

    private function rootResource(string $candidate): array
    {
        foreach ($this->getNaturalRoots() as $root) {
            if ($root['id'] === $candidate) return [...$root, 'kind' => 'node', 'role' => 'primary'];
        }

        throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
    }

    public function getBrowseRoot(): ?string { return $this->browseRoot; }

    public function getInitialNode(?string $candidate = null): string
    {
        $fallback = $this->browseRoot ?: ($this->getRoots()[0]['id'] ?? '');
        if (!$candidate) return $fallback;
        try {
            $this->assertBrowseScope([$candidate]);
            return $candidate;
        } catch (\Throwable) {
            return $fallback;
        }
    }

    public function assertBrowseScope(array $resourceIds): void
    {
        if (!$this->browseRoot) return;
        [$rootAdapter, $rootPath] = $this->splitId($this->browseRoot);
        $prefix = rtrim($rootPath, '/') . '/';
        foreach ($resourceIds as $resourceId) {
            if ((string) $resourceId === '') continue;
            [$adapter, $path] = $this->splitId((string) $resourceId);
            if ($adapter !== $rootAdapter || ($path !== $rootPath && !str_starts_with($path, $prefix))) {
                throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
            }
        }
    }

    public function getActions(array $selection = []): array
    {
        $canCreate = $this->app->getIdentity()->authorise('core.create', 'com_media');
        $canEdit   = $this->app->getIdentity()->authorise('core.edit', 'com_media');
        $canDelete = $this->app->getIdentity()->authorise('core.delete', 'com_media');

        return array_values(array_filter([
            $canCreate ? $this->action('upload', 'COM_SMARTBROWSER_ACTION_UPLOAD', 'icon-upload', 'node', true, false) : null,
            $canCreate ? $this->action('createNode', 'COM_SMARTBROWSER_ACTION_CREATE_FOLDER', 'icon-folder-plus', 'node', false, false) : null,
            $this->action('preview', 'COM_SMARTBROWSER_ACTION_PREVIEW', 'icon-eye', 'item', false, true, false, true),
            $canEdit ? $this->action('rename', 'COM_SMARTBROWSER_RENAME', 'fa fa-i-cursor', 'resource', false, true, true) : null,
            $canDelete ? $this->action('delete', 'JACTION_DELETE', 'icon-trash', 'selection', false, true) : null,
            $this->action('download', 'COM_SMARTBROWSER_ACTION_DOWNLOAD', 'icon-download', 'item', false, true, false, true),
            $this->action('share', 'COM_SMARTBROWSER_ACTION_SHARE', 'icon-share-alt', 'item', false, true, false, true),
        ]));
    }

    public function executeAction(string $action, array $selection, array $payload = []): mixed
    {
        return match ($action) {
            'batchFolders' => $this->batchFolderOptions($selection),
            'batch'      => $this->withAllMediaTypes(fn () => (new MediaBatchRunner($this->app, $this, $this->apiModel))->run($selection, $payload)),
            'createNode' => $this->createNode($payload),
            'upload'     => $this->upload($payload),
            'rename'     => $this->rename($selection, $payload),
            'copy'       => $this->copy($selection, $payload),
            'delete'     => $this->delete($selection),
            'preview', 'share' => $this->getResource($this->requireOne($selection), ['url' => true]),
            'download'   => $this->getResource($this->requireOne($selection), ['url' => true, 'content' => true]),
            default      => throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_UNKNOWN_ACTION'), 400),
        };
    }

    private function batchFolderOptions(array $selection): array
    {
        if ($selection === []) return [];
        $this->assertBrowseScope($selection);
        $roots = $this->getRoots();
        $folderAdapter = null;
        foreach ($selection as $id) {
            if (($this->getResource((string) $id)['kind'] ?? '') !== 'node') continue;
            [$adapter] = $this->splitId((string) $id);
            if ($folderAdapter !== null && $folderAdapter !== $adapter) return [];
            $folderAdapter = $adapter;
        }
        if ($folderAdapter !== null) {
            $roots = array_values(array_filter($roots, static fn (array $root): bool => str_starts_with($root['id'], $folderAdapter . ':')));
        }
        $options = [];
        $visited = [];
        $stack = [];
        foreach (array_reverse($roots) as $root) $stack[] = [$root['id'], $root['title'], $root['title'], 0];
        $this->withAllMediaTypes(function () use (&$stack, &$options, &$visited): void {
            while ($stack) {
                [$id, $title, $pathTitle, $depth] = array_pop($stack);
                if (isset($visited[$id])) continue;
                $visited[$id] = true;
                $options[] = ['value' => $id, 'label' => str_repeat('- ', $depth) . $title, 'path' => $pathTitle];
                [$adapter, $path] = $this->splitId($id);
                $children = array_values(array_filter($this->apiModel->getFiles($adapter, $path, [
                    'search' => null, 'recursive' => false, 'url' => false, 'content' => false,
                ]), static fn (object $item): bool => $item->type === 'dir'));
                usort($children, static fn (object $left, object $right): int => strnatcasecmp($left->name, $right->name));
                foreach (array_reverse($children) as $child) {
                    $stack[] = [$child->path, $child->name, $pathTitle . ' / ' . $child->name, $depth + 1];
                }
            }
        });
        return $options;
    }

    private function createNode(array $payload): array
    {
        $this->assertAllowed('core.create');
        [$adapter, $path] = $this->splitId((string) ($payload['nodeId'] ?? ''));
        $name = $this->apiModel->createFolder($adapter, (string) ($payload['name'] ?? ''), $path, false);

        return $this->getResource($adapter . ':' . rtrim($path, '/') . '/' . $name);
    }

    private function upload(array $payload): array
    {
        $this->assertAllowed('core.create');
        [$adapter, $path] = $this->splitId((string) ($payload['nodeId'] ?? ''));
        $content = base64_decode((string) ($payload['content'] ?? ''), true);

        if ($content === false) {
            throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_UPLOAD'), 400);
        }

        $maxSizeMb = (float) ComponentHelper::getParams('com_media')->get('upload_maxsize', 0);
        $maxBytes = $maxSizeMb * 1024 * 1024;

        if ($maxBytes > 0 && strlen($content) > $maxBytes) {
            throw new \RuntimeException(Text::sprintf('COM_SMARTBROWSER_ERROR_UPLOAD_TOO_LARGE', $maxSizeMb), 413);
        }

        $name = $this->withAllMediaTypes(fn () => $this->apiModel->createFile(
            $adapter,
            (string) ($payload['name'] ?? ''),
            $path,
            $content,
            (bool) ($payload['override'] ?? false)
        ));

        return $this->getResource($adapter . ':' . rtrim($path, '/') . '/' . $name);
    }

    private function rename(array $selection, array $payload): array
    {
        $this->assertAllowed('core.edit');
        $id = $this->requireOne($selection);
        [$adapter, $path] = $this->splitId($id);
        $parent = str_replace('\\', '/', dirname($path));
        $newPath = $adapter . ':' . rtrim($parent, '/') . '/' . (string) ($payload['name'] ?? '');
        $movedPath = $this->apiModel->move($adapter, $path, substr($newPath, strlen($adapter) + 1), false);

        return $this->getResource($adapter . ':' . $movedPath);
    }

    private function copy(array $selection, array $payload): array
    {
        $this->assertAllowed('core.create');
        $id = $this->requireOne($selection);
        $resource = $this->getResource($id, ['content' => true]);
        if (($resource['kind'] ?? '') !== 'item') throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        $content = base64_decode((string) ($resource['metadata']['content'] ?? ''), true);
        if ($content === false) throw new \RuntimeException(Text::_('JERROR_AN_ERROR_HAS_OCCURRED'), 500);
        [$adapter, $path] = $this->splitId($id);
        $name = trim((string) ($payload['name'] ?? ''));
        if ($name === '' || $name === $resource['title']) {
            $extension = pathinfo($resource['title'], PATHINFO_EXTENSION);
            $stem = $extension === '' ? $resource['title'] : substr($resource['title'], 0, -(strlen($extension) + 1));
            $name = $stem . '-copy' . ($extension === '' ? '' : '.' . $extension);
        }
        $parent = str_replace('\\', '/', dirname($path));
        $created = $this->withAllMediaTypes(fn () => $this->apiModel->createFile($adapter, $name, $parent, $content, false));
        return $this->getResource($adapter . ':' . rtrim($parent, '/') . '/' . $created);
    }

    private function delete(array $selection): array
    {
        $this->assertAllowed('core.delete');

        foreach ($selection as $id) {
            [$adapter, $path] = $this->splitId((string) $id);
            $this->withAllMediaTypes(fn () => $this->apiModel->delete($adapter, $path));
        }

        return ['deleted' => array_values($selection)];
    }

    private function normalize(object $resource): array
    {
        $isNode = $resource->type === 'dir';
        $mime   = (string) ($resource->mime_type ?? '');
        $image  = !$isNode && str_starts_with($mime, 'image/') ? (string) ($resource->url ?? $resource->thumb ?? '') : null;

        return [
            'id'           => (string) $resource->path,
            'title'        => (string) $resource->name,
            'subtitle'     => $isNode ? null : $mime,
            'parentId'     => $this->parentId((string) $resource->path),
            'kind'         => $isNode ? 'node' : 'item',
            'type'         => $isNode ? 'folder' : $this->mediaType($mime),
            'icon'         => $isNode ? 'icon-folder' : $this->icon($mime),
            'image'        => $image,
            'status'       => null,
            'selectable'   => true,
            'navigable'    => $isNode,
            'hasChildren'  => $isNode,
            'capabilities' => $this->capabilities($isNode),
            'metadata'     => [
                'id'           => (string) $resource->path,
                'parentPath' => (string) $this->parentId((string) $resource->path),
                'size'         => (int) ($resource->size ?? 0),
                'width'        => (int) ($resource->width ?? 0),
                'height'       => (int) ($resource->height ?? 0),
                'created'      => $resource->create_date ?? null,
                'modified'     => $resource->modified_date ?? null,
                'mimeType'     => $mime,
                'type'         => $isNode ? 'folder' : $this->mediaType($mime),
                'extension'    => $resource->extension ?? null,
                'url'          => $resource->url ?? null,
                'content'      => $resource->content ?? null,
            ],
        ];
    }

    private function capabilities(bool $isNode): array
    {
        $identity = $this->app->getIdentity();

        return [
            'open'       => $isNode,
            'preview'    => !$isNode,
            'upload'     => $isNode && $identity->authorise('core.create', 'com_media'),
            'createNode' => $isNode && $identity->authorise('core.create', 'com_media'),
            'rename'     => $identity->authorise('core.edit', 'com_media'),
            'copy'       => !$isNode && $identity->authorise('core.create', 'com_media'),
            'delete'     => $identity->authorise('core.delete', 'com_media'),
            'download'   => !$isNode,
            'share'      => !$isNode,
        ];
    }

    private function presentation(array $resources = []): array
    {
        return [
            'sortFields' => [
                ['id' => 'title', 'label' => 'COM_SMARTBROWSER_NAME'],
                ['id' => 'type', 'label' => 'COM_SMARTBROWSER_FILE_TYPE'],
                ['id' => 'size', 'label' => 'COM_SMARTBROWSER_SIZE'],
                ['id' => 'extension', 'label' => 'COM_SMARTBROWSER_EXTENSION'],
                ['id' => 'dimension', 'label' => 'COM_SMARTBROWSER_DIMENSIONS'],
                ['id' => 'created', 'label' => 'COM_SMARTBROWSER_DATE_CREATED'],
                ['id' => 'modified', 'label' => 'COM_SMARTBROWSER_DATE_MODIFIED'],
            ],
            'columns' => [
                ['id' => 'title', 'label' => 'COM_SMARTBROWSER_NAME', 'source' => 'title'],
                ['id' => 'type', 'label' => 'COM_SMARTBROWSER_FILE_TYPE', 'source' => 'type', 'format' => 'mediaType', 'headerIcon' => 'icon-file-alt'],
                ['id' => 'size', 'label' => 'COM_SMARTBROWSER_SIZE'],
                ['id' => 'dimension', 'label' => 'COM_SMARTBROWSER_DIMENSIONS'],
                ['id' => 'dates', 'dateGroup' => true, 'fields' => [
                    ['id' => 'created', 'label' => 'COM_SMARTBROWSER_DATE_CREATED', 'source' => 'metadata.created', 'format' => 'date'],
                    ['id' => 'modified', 'label' => 'COM_SMARTBROWSER_DATE_MODIFIED', 'source' => 'metadata.modified', 'format' => 'date'],
                ]],
                ['id' => 'extension', 'label' => 'COM_SMARTBROWSER_EXTENSION', 'source' => 'metadata.extension', 'headerIcon' => 'icon-tag'],
            ],
            'infoFields' => [
                ['label' => 'COM_SMARTBROWSER_DATE_CREATED', 'source' => 'metadata.created', 'format' => 'date'],
                ['label' => 'COM_SMARTBROWSER_DATE_MODIFIED', 'source' => 'metadata.modified', 'format' => 'date'],
                ['label' => 'COM_SMARTBROWSER_DIMENSIONS', 'source' => 'metadata.width', 'format' => 'dimensions', 'kinds' => ['item']],
                ['label' => 'COM_SMARTBROWSER_SIZE', 'source' => 'metadata.size', 'format' => 'size', 'kinds' => ['item']],
                ['label' => 'COM_SMARTBROWSER_MIME_TYPE', 'source' => 'metadata.mimeType', 'kinds' => ['item']],
                ['label' => 'COM_SMARTBROWSER_EXTENSION', 'source' => 'metadata.extension', 'kinds' => ['item']],
            ],
            'filters' => [[
                'id' => 'type', 'label' => 'COM_SMARTBROWSER_FILE_TYPE', 'type' => 'select', 'default' => '',
                'options' => [
                    ['value' => '', 'label' => 'COM_SMARTBROWSER_SELECT_FILE_TYPE'],
                    ['value' => 'image', 'label' => 'COM_SMARTBROWSER_IMAGES'],
                    ['value' => 'document', 'label' => 'COM_SMARTBROWSER_DOCUMENTS'],
                    ['value' => 'video', 'label' => 'COM_SMARTBROWSER_VIDEOS'],
                    ['value' => 'audio', 'label' => 'COM_SMARTBROWSER_AUDIO'],
                ],
            ], [
                'id' => 'mime', 'label' => 'COM_SMARTBROWSER_MIME_TYPE', 'type' => 'select', 'default' => '',
                'options' => self::facetOptions($resources, 'mimeType', 'COM_SMARTBROWSER_SELECT_MIME_TYPE'),
            ], [
                'id' => 'extension', 'label' => 'COM_SMARTBROWSER_EXTENSION', 'type' => 'select', 'default' => '',
                'options' => self::facetOptions($resources, 'extension', 'COM_SMARTBROWSER_SELECT_EXTENSION'),
            ], [
                'id' => 'created', 'label' => 'COM_SMARTBROWSER_DATE_CREATED', 'type' => 'select', 'default' => '', 'options' => self::dateOptions('COM_SMARTBROWSER_SELECT_CREATED'),
            ], [
                'id' => 'modified', 'label' => 'COM_SMARTBROWSER_DATE_MODIFIED', 'type' => 'select', 'default' => '', 'options' => self::dateOptions('COM_SMARTBROWSER_SELECT_MODIFIED'),
            ], [
                'id' => 'size', 'label' => 'COM_SMARTBROWSER_SIZE', 'type' => 'select', 'default' => '', 'options' => [
                    ['value' => '', 'label' => 'COM_SMARTBROWSER_SELECT_SIZE'],
                    ['value' => 'small', 'label' => 'COM_SMARTBROWSER_SIZE_SMALL'],
                    ['value' => 'medium', 'label' => 'COM_SMARTBROWSER_SIZE_MEDIUM'],
                    ['value' => 'large', 'label' => 'COM_SMARTBROWSER_SIZE_LARGE'],
                    ['value' => 'veryLarge', 'label' => 'COM_SMARTBROWSER_SIZE_VERY_LARGE'],
                ],
            ], [
                'id' => 'dimensions', 'label' => 'COM_SMARTBROWSER_DIMENSIONS', 'type' => 'select', 'default' => '', 'options' => [
                    ['value' => '', 'label' => 'COM_SMARTBROWSER_SELECT_DIMENSIONS'],
                    ['value' => 'none', 'label' => 'COM_SMARTBROWSER_DIMENSIONS_NONE'],
                    ['value' => 'small', 'label' => 'COM_SMARTBROWSER_DIMENSIONS_SMALL'],
                    ['value' => 'medium', 'label' => 'COM_SMARTBROWSER_DIMENSIONS_MEDIUM'],
                    ['value' => 'large', 'label' => 'COM_SMARTBROWSER_DIMENSIONS_LARGE'],
                    ['value' => 'veryLarge', 'label' => 'COM_SMARTBROWSER_DIMENSIONS_VERY_LARGE'],
                ],
            ]],
        ];
    }

    public static function facetOptions(array $resources, string $field, string $placeholder): array
    {
        $values = [];
        foreach ($resources as $resource) {
            $value = (string) ($resource['metadata'][$field] ?? '');
            if ($value !== '') $values[$value] = $value;
        }
        natcasesort($values);
        return array_merge([['value' => '', 'label' => $placeholder]], array_map(
            static fn (string $value): array => ['value' => $value, 'label' => $value], array_values($values)
        ));
    }

    private static function dateOptions(string $placeholder): array
    {
        $options = [['value' => '', 'label' => $placeholder]];
        foreach (['today', 'past_week', 'past_1month', 'past_3month', 'past_6month', 'past_year', 'post_year', 'never'] as $range) {
            $options[] = ['value' => $range, 'label' => 'COM_SMARTBROWSER_DATE_' . strtoupper($range)];
        }
        return $options;
    }

    public static function matchesFilters(array $resource, array $filters, string $timezone = 'UTC'): bool
    {
        if (($resource['kind'] ?? '') !== 'item') return true;
        foreach (['type' => 'type', 'mime' => 'mimeType', 'extension' => 'extension'] as $filter => $field) {
            $value = (string) ($filters[$filter] ?? '');
            $actual = $field === 'type' ? ($resource['type'] ?? '') : ($resource['metadata'][$field] ?? '');
            if ($value !== '' && $value !== 'all' && $value !== (string) $actual) return false;
        }
        $size = (int) ($resource['metadata']['size'] ?? 0);
        $sizeGroup = match (true) {
            $size < 102400 => 'small', $size < 1048576 => 'medium', $size < 10485760 => 'large', default => 'veryLarge',
        };
        if (($filters['size'] ?? '') !== '' && $filters['size'] !== $sizeGroup) return false;
        $width = (int) ($resource['metadata']['width'] ?? 0);
        $height = (int) ($resource['metadata']['height'] ?? 0);
        $longest = max($width, $height);
        $dimensionGroup = match (true) {
            !$width || !$height => 'none', $longest < 640 => 'small', $longest < 1600 => 'medium',
            $longest < 3000 => 'large', default => 'veryLarge',
        };
        if (($filters['dimensions'] ?? '') !== '' && $filters['dimensions'] !== $dimensionGroup) return false;
        foreach (['created', 'modified'] as $field) {
            if (!self::matchesDate((string) ($resource['metadata'][$field] ?? ''), (string) ($filters[$field] ?? ''), $timezone)) return false;
        }
        return true;
    }

    private static function matchesDate(string $value, string $range, string $timezone): bool
    {
        if ($range === '') return true;
        if ($range === 'never') return $value === '' || str_starts_with($value, '0000-00-00');
        if ($value === '' || str_starts_with($value, '0000-00-00')) return false;
        try {
            $date = new \DateTimeImmutable($value, new \DateTimeZone('UTC'));
            $zone = new \DateTimeZone($timezone);
            $now = new \DateTimeImmutable('now', $zone);
            $start = $range === 'today' ? $now->setTime(0, 0) : $now->modify(match ($range) {
                'past_week' => '-7 days', 'past_1month' => '-1 month', 'past_3month' => '-3 months',
                'past_6month' => '-6 months', 'past_year', 'post_year' => '-1 year', default => '-100 years',
            });
            if (!in_array($range, ['today', 'past_week', 'past_1month', 'past_3month', 'past_6month', 'past_year', 'post_year'], true)) return false;
            return $range === 'post_year' ? $date < $start : $date >= $start && $date <= $now;
        } catch (\Exception) {
            return false;
        }
    }

    private function withAllMediaTypes(callable $callback): mixed
    {
        $input = $this->app->getInput();
        $previous = $input->getString('mediatypes', '');
        $input->set('mediatypes', '0,1,2,3');

        try {
            return $callback();
        } finally {
            $input->set('mediatypes', $previous);
        }
    }

    private function action(string $id, string $label, string $icon, string $scope, bool $primary = false, bool $requiresSelection = false, bool $single = false, bool $itemsOnly = false): array
    {
        return compact('id', 'label', 'icon', 'scope', 'primary', 'requiresSelection', 'single', 'itemsOnly');
    }

    private function splitId(string $id): array
    {
        $parts = explode(':', $id, 2);

        if (count($parts) !== 2 || $parts[0] === '') {
            throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        }

        $path = str_replace('\\', '/', $parts[1] === '' ? '/' : $parts[1]);
        if (in_array('..', explode('/', $path), true)) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        $path = '/' . ltrim(preg_replace('#/+#', '/', $path), '/');

        return [$parts[0], $path];
    }

    private function parentId(string $id): ?string
    {
        [$adapter, $path] = $this->splitId($id);

        if ($path === '/') {
            return null;
        }

        $parent = str_replace('\\', '/', dirname($path));

        return $adapter . ':' . ($parent === '/' || $parent === '.' ? '/' : $parent);
    }

    private function rootTitle(string $adapter): string
    {
        foreach ($this->getRoots() as $root) {
            if (str_starts_with($root['id'], $adapter . ':')) {
                return $root['title'];
            }
        }

        return $adapter;
    }

    private function mediaType(string $mime): string
    {
        return match (true) {
            str_starts_with($mime, 'image/') => 'image',
            str_starts_with($mime, 'video/') => 'video',
            str_starts_with($mime, 'audio/') => 'audio',
            default => 'document',
        };
    }

    private function icon(string $mime): string
    {
        return match ($this->mediaType($mime)) {
            'image' => 'fas fa-file-image',
            'video' => 'fas fa-file-video',
            'audio' => 'fas fa-file-audio',
            default => 'fas fa-file',
        };
    }

    private function requireOne(array $selection): string
    {
        if (count($selection) !== 1) {
            throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_SINGLE_SELECTION_REQUIRED'), 400);
        }

        return (string) reset($selection);
    }

    private function assertAllowed(string $permission): void
    {
        if (!$this->app->getIdentity()->authorise($permission, 'com_media')) {
            throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
        }
    }
}
