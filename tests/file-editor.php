<?php
namespace Joomla\CMS\Application { interface CMSApplicationInterface {} }
namespace Joomla\CMS\Language { class Text { public static function _($key) { return $key; } } }
namespace Joomla\CMS\Uri { class Uri { public static function root() { return 'https://example.test/'; } } }
namespace Joomla\Component\Media\Administrator\Model {
    class MediaModel {}
    class ApiModel {
        public static string $content = 'original';
        public static int $writes = 0;
        public function getFile($adapter, $path, $options) {
            return (object) ['path' => $adapter . ':' . $path, 'name' => basename($path), 'type' => str_contains($path, '.') ? 'file' : 'dir', 'mime_type' => 'text/plain', 'size' => strlen(self::$content), 'content' => !empty($options['content']) ? base64_encode(self::$content) : null];
        }
        public function updateFile($adapter, $name, $parent, $content) { self::$content = $content; self::$writes++; }
    }
}
namespace {
    define('_JEXEC', 1);
    foreach (['ResourceAdapterInterface', 'BrowseRootAwareInterface', 'ReadableResourceAdapterInterface', 'MediaAdapter'] as $file) require __DIR__ . '/../package/component/admin/src/Adapter/' . $file . '.php';
    foreach (['EditableMedia', 'MediaSelectionCapabilities'] as $file) require __DIR__ . '/../package/component/admin/src/Support/' . $file . '.php';
    use SuperSoft\Component\Smartbrowser\Administrator\Support\EditableMedia;
    use Joomla\Component\Media\Administrator\Model\ApiModel;
    $check = static function ($condition, $message) { if (!$condition) throw new \RuntimeException($message); };
    $reject = static function ($run, $code) use ($check) { try { $run(); } catch (\Throwable $error) { $check($error->getCode() === $code, $error->getMessage()); return; } throw new \RuntimeException('Expected rejection'); };
    $app = new class implements \Joomla\CMS\Application\CMSApplicationInterface {
        public bool $allowed = true;
        public function getIdentity() { return new class($this) { public function __construct(private $app) {} public function authorise($permission, $asset) { return $this->app->allowed; } }; }
        public function getInput() { return new class { public function getString($key, $default = '') { return $default; } public function set($key, $value) {} }; }
    };
    $adapter = new \SuperSoft\Component\Smartbrowser\Administrator\Adapter\MediaAdapter($app);
    $id = 'local-files:/notes.txt';
    $file = $adapter->executeAction('readFile', [$id]);
    $check($file['kind'] === 'text' && base64_decode($file['content']) === 'original', 'Read text');
    $saved = $adapter->executeAction('writeFile', [$id], ['content' => base64_encode('Ελληνικά <script>plain text</script>'), 'revision' => $file['revision']]);
    $check(ApiModel::$writes === 1 && $saved['revision'] !== $file['revision'], 'Save/revision');
    $reject(fn () => $adapter->executeAction('writeFile', [$id], ['content' => base64_encode('stale'), 'revision' => $file['revision']]), 409);
    $reject(fn () => $adapter->executeAction('writeFile', [$id], ['content' => '###', 'revision' => $saved['revision']]), 400);
    $app->allowed = false;
    $reject(fn () => $adapter->executeAction('readFile', [$id]), 403);
    $app->allowed = true;
    $adapter->configureBrowseRoot('local-files:/safe');
    $reject(fn () => $adapter->executeAction('readFile', [$id]), 403);
    $reject(fn () => $adapter->executeAction('readFile', ['local-files:/safe/../outside.txt']), 400);
    foreach (['php', 'html', 'svg', 'js'] as $ext) $check(EditableMedia::kind('file.' . $ext, 'text/plain') === null, 'Active format accepted');
    $reject(fn () => EditableMedia::validate('text', 'text/plain', "binary\0"), 400);
    $reject(fn () => EditableMedia::validate('text', 'text/plain', "\xff"), 400);
    $reject(fn () => EditableMedia::validate('text', 'text/plain', str_repeat('x', 1048577)), 413);
    $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=');
    EditableMedia::validate('image', 'image/png', $png);
    $reject(fn () => EditableMedia::validate('image', 'image/jpeg', $png), 400);
    $reject(fn () => EditableMedia::validate('image', 'image/png', 'not an image'), 400);
    $check(ApiModel::$writes === 1, 'Rejected edits wrote content');
    echo "Scoped file editing, content validation, ACL and revision checks OK\n";
}
