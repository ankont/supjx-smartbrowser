<?php
namespace Joomla\CMS\Plugin {
    final class PluginHelper {
        public static bool $enabled = true;
        public static function isEnabled($group, $name): bool { return self::$enabled; }
    }
}
namespace SuperSoftJx\Plugin\Content\SmartCrop\Helper {
    final class SmartCropHelper {
        public static function getFocalPointAndScale($uri): ?array {
            if (str_contains($uri, 'invalid')) return null;
            return ['ratio' => '4:3', 'left_pct' => -12.5, 'top_pct' => -25, 'width_pct' => 125, 'height_pct' => 166.6667];
        }
    }
}
namespace {
    define('_JEXEC', 1);
    require __DIR__ . '/../package/component/admin/src/Support/ResourceVisualDecorator.php';
    use SuperSoft\Component\Smartbrowser\Administrator\Support\ResourceVisualDecorator;
    use Joomla\CMS\Plugin\PluginHelper;
    $image = 'https://example.test/a.png#joomlaImage://local-a.png?crop=0.1,0.15,0.8,0.6&ratio=4:3';
    $base = ['items' => [['id' => 'article:1', 'image' => $image]]];
    function check($condition): void { if (!$condition) throw new \RuntimeException('Crop regression'); }
    $resource = ResourceVisualDecorator::apply($base, [])['items'][0];
    check($resource['imageCrop']['source'] === $image);
    check($resource['imageCrop']['ratio'] === 4 / 3);
    check($resource['imageCrop']['x'] === -12.5);
    $base['items'][0] = $resource;
    $replacement = ResourceVisualDecorator::apply($base, ['article:1' => ['image' => 'https://example.test/b.png']])['items'][0];
    check(!isset($replacement['imageCrop']));
    PluginHelper::$enabled = false;
    check(!isset(ResourceVisualDecorator::apply($base, [])['items'][0]['imageCrop']));
    PluginHelper::$enabled = true;
    $base['items'][0]['image'] = $image . '&invalid=1';
    check(!isset(ResourceVisualDecorator::apply($base, [])['items'][0]['imageCrop']));
    echo "Optional crop presentation, replacement and disabled/invalid fallback OK\n";
}
