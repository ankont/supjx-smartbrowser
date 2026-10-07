<?php
define('_JEXEC', 1);
require __DIR__ . '/../package/component/admin/src/Adapter/ResourceAdapterInterface.php';
require __DIR__ . '/../package/component/admin/src/Adapter/BrowseRootAwareInterface.php';
require __DIR__ . '/../package/component/admin/src/Adapter/MediaAdapter.php';
$class = new ReflectionClass(\SuperSoft\Component\Smartbrowser\Administrator\Adapter\MediaAdapter::class);
$adapter = $class->newInstanceWithoutConstructor();
$method = $class->getMethod('icon');
foreach ([['image/png', '', 'file-image'], ['video/mp4', '', 'file-video'], ['audio/mpeg', '', 'file-audio'], ['application/pdf', '', 'file-pdf'], ['application/msword', '', 'file-word'], ['application/vnd.ms-excel', '', 'file-excel'], ['application/vnd.ms-powerpoint', '', 'file-powerpoint'], ['application/zip', '', 'file-archive'], ['text/html', '', 'file-code'], ['text/plain', '', 'file-alt'], ['application/octet-stream', 'docx', 'file-word'], ['application/octet-stream', 'pdf', 'file-pdf'], ['', 'zip', 'file-archive'], ['', 'unknown', 'file']] as [$mime, $extension, $expected]) {
    if ($method->invoke($adapter, $mime, $extension) !== 'fas fa-' . $expected) throw new RuntimeException('Wrong file type icon: ' . $mime . '/' . $extension);
}
echo "Media file icon vocabulary and generic MIME fallback OK\n";
