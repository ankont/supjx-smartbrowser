<?php

define('_JEXEC', 1);
require __DIR__ . '/../package/component/admin/src/Support/MediaBatchRunner.php';

$class = new ReflectionClass(\SuperSoft\Component\Smartbrowser\Administrator\Support\MediaBatchRunner::class);
$runner = $class->newInstanceWithoutConstructor();
$data = $class->getMethod('portableZip')->invoke($runner, ['folder/' => '', 'folder/hello.txt' => 'hello']);

if (substr($data, 0, 4) !== "PK\x03\x04" || substr($data, -22, 4) !== "PK\x05\x06") {
    throw new RuntimeException('Invalid ZIP structure');
}

$path = tempnam(sys_get_temp_dir(), 'smartbrowser-zip-test-');
try {
    file_put_contents($path, $data);
    if (class_exists(ZipArchive::class)) {
        $zip = new ZipArchive();
        if ($zip->open($path) !== true || $zip->getFromName('folder/hello.txt') !== 'hello') {
            throw new RuntimeException('ZIP contents could not be read');
        }
        $zip->close();
    }
    echo "Portable ZIP structure OK\n";
} finally {
    unlink($path);
}
