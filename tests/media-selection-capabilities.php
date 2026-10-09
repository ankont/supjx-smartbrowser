<?php
define('_JEXEC', 1);
require __DIR__ . '/../package/component/admin/src/Support/MediaSelectionCapabilities.php';
require __DIR__ . '/../package/component/admin/src/Support/ResourceDescriptor.php';
use SuperSoft\Component\Smartbrowser\Administrator\Support\MediaSelectionCapabilities;
function check($value, $message) { if (!$value) throw new RuntimeException($message); }
$images = MediaSelectionCapabilities::forResource(false, 'image/png');
check(array_column($images, 'key') === ['media.alt', 'media.decorative', 'media.loading'], 'Image capabilities');
check($images[2]['default'] === 'auto' && array_column($images[2]['options'], 'value') === ['auto', 'lazy', 'eager'], 'Loading strategy');
$pdf = \SuperSoft\Component\Smartbrowser\Administrator\Support\ResourceDescriptor::visualCapabilities();
check(count($pdf) === 2 && $pdf[0]['key'] === 'visual.thumbnailOverride' && $pdf[1]['key'] === 'visual.iconOverride', 'Generic visual capabilities');
check($pdf[0]['type'] === 'resource' && $pdf[0]['default'] === null && $pdf[0]['picker']['allowedResourceTypes'] === ['image'], 'PDF reference contract');
check(MediaSelectionCapabilities::forResource(true, 'image/png') === [] && MediaSelectionCapabilities::forResource(false, 'application/zip') === [], 'Unsupported resource capabilities');
echo "Resource-dependent image/PDF selection capabilities OK\n";
