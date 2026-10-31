<?php
define('_JEXEC', 1);
$base = __DIR__ . '/../package/component/admin/src/Adapter/';
foreach (['ResourceAdapterInterface.php', 'BrowseRootAwareInterface.php', 'ReadableResourceAdapterInterface.php', 'ContentAdapter.php'] as $file) require $base . $file;
$method = new ReflectionMethod(\SuperSoft\Component\Smartbrowser\Administrator\Adapter\ContentAdapter::class, 'storedImage');
set_error_handler(static function ($severity, $message, $file, $line) { throw new ErrorException($message, 0, $severity, $file, $line); });
try {
    $intro = 'images/intro.jpg#joomlaImage://local-images/intro.jpg?width=800&crop=keep';
    foreach ([['image_intro'=>$intro, 'image_fulltext'=>'full.jpg'], ['image_intro'=>'', 'image_fulltext'=>'full.jpg']] as $images) {
        $expected = $images['image_intro'] ?: $images['image_fulltext'];
        foreach ([$images, (object) $images, json_encode($images)] as $input) {
            $before = serialize($input);
            if ($method->invoke(null, $input) !== $expected) throw new RuntimeException('Image lost during normalization');
            if (serialize($input) !== $before) throw new RuntimeException('Native image data mutated');
        }
    }
    foreach ([null, false, 42, '', '{bad json', 'null', '[]', 'true', '42', [], (object) [], ['image_intro'=>[]], ['image_fulltext'=>(object) []]] as $input) {
        if ($method->invoke(null, $input) !== '') throw new RuntimeException('Invalid image data accepted');
    }
    if ($method->invoke(null, ['image_intro'=>[], 'image_fulltext'=>'full.jpg']) !== 'full.jpg') throw new RuntimeException('Invalid Intro Image blocked Full Image fallback');
} finally { restore_error_handler(); }
echo "JSON, array and object image normalization, URI preservation, fallback and warning-free invalid inputs OK\n";
