<?php
define('_JEXEC', 1);
require __DIR__ . '/../package/component/admin/src/Support/MediaSelectionCapabilities.php';
use SuperSoft\Component\Smartbrowser\Administrator\Support\MediaSelectionCapabilities;
function check($value, $message) { if (!$value) throw new RuntimeException($message); }
$images = MediaSelectionCapabilities::forResource(false, 'image/png');
check(array_column($images, 'key') === ['media.alt', 'media.decorative', 'media.loading', 'media.thumbnailOverride'], 'Image capabilities');
check($images[2]['default'] === 'auto' && array_column($images[2]['options'], 'value') === ['auto', 'lazy', 'eager'], 'Loading strategy');
$pdf = MediaSelectionCapabilities::forResource(false, 'application/pdf');
check($images[3] === $pdf[0], 'Image and PDF share the same thumbnail override contract');
check(count($pdf) === 1 && $pdf[0]['key'] === 'media.thumbnailOverride', 'PDF capability');
check($pdf[0]['type'] === 'resource' && $pdf[0]['default'] === null && $pdf[0]['picker']['allowedResourceTypes'] === ['image'], 'PDF reference contract');
check(MediaSelectionCapabilities::forResource(true, 'image/png') === [] && MediaSelectionCapabilities::forResource(false, 'application/zip') === [], 'Unsupported resource capabilities');
echo "Resource-dependent image/PDF selection capabilities OK\n";
