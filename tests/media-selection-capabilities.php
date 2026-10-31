<?php
define('_JEXEC', 1);
require __DIR__ . '/../package/component/admin/src/Support/MediaSelectionCapabilities.php';
require __DIR__ . '/../package/component/admin/src/Support/ResourceDescriptor.php';
use SuperSoft\Component\Smartbrowser\Administrator\Support\MediaSelectionCapabilities;
function check($value, $message) { if (!$value) throw new RuntimeException($message); }
$images = MediaSelectionCapabilities::forResource(false, 'image/png');
check(array_column($images, 'key') === ['media.caption', 'media.class', 'media.figureClass', 'media.alt', 'media.decorative', 'media.loading'], 'Image capabilities');
check($images[5]['default'] === 'auto' && array_column($images[5]['options'], 'value') === ['auto', 'lazy', 'eager'], 'Loading strategy');
$pdf = \SuperSoft\Component\Smartbrowser\Administrator\Support\ResourceDescriptor::visualCapabilities();
check(array_column($pdf, 'key') === ['visual.presentation', 'visual.thumbnailOverride', 'visual.iconOverride'], 'Generic visual capabilities');
check($pdf[1]['type'] === 'resource' && $pdf[1]['default'] === null && $pdf[1]['picker']['allowedResourceTypes'] === ['image'], 'PDF reference contract');
check(MediaSelectionCapabilities::forResource(true, 'image/png') === [] && MediaSelectionCapabilities::forResource(false, 'application/zip') === [], 'Unsupported resource capabilities');
foreach (['text/plain', 'application/pdf', 'application/zip'] as $mime) {
    $resource = \SuperSoft\Component\Smartbrowser\Administrator\Support\ResourceDescriptor::complete([
        'id' => 'local-files:/file', 'type' => 'document', 'kind' => 'item', 'metadata' => ['mimeType' => $mime],
        'selectionCapabilities' => MediaSelectionCapabilities::forResource(false, $mime),
    ]);
    check(in_array('visual.thumbnailOverride', array_column($resource['selectionCapabilities'], 'key'), true), 'Non-image resource lacks generic thumbnail: ' . $mime);
}
echo "Resource-dependent image/PDF selection capabilities OK\n";
$article = ['id' => 'article:1', 'title' => 'Original title', 'type' => 'article', 'kind' => 'item'];
$complete = \SuperSoft\Component\Smartbrowser\Administrator\Support\ResourceDescriptor::complete($article);
check(in_array('article.displayedName', array_column($complete['selectionCapabilities'], 'key'), true), 'Article displayed name capability missing');
check(\SuperSoft\Component\Smartbrowser\Administrator\Support\ResourceDescriptor::displayedName($article, ['article.displayedName' => ' Temporary ']) === 'Temporary', 'Displayed name override');
check(\SuperSoft\Component\Smartbrowser\Administrator\Support\ResourceDescriptor::displayedName($article, ['article.displayedName' => ' ']) === 'Original title', 'Resolved title fallback');
check($article['title'] === 'Original title', 'Presentation changed article');
$article['metadata']['publicUrl'] = '/article.html';
$linked = \SuperSoft\Component\Smartbrowser\Administrator\Support\ResourceDescriptor::complete($article);
check(in_array('link.text', array_column($linked['selectionCapabilities'], 'key'), true) && in_array('link.target', array_column($linked['selectionCapabilities'], 'key'), true), 'Public resources lack generic link usage');
