<?php
namespace Joomla\CMS\Plugin {
    final class PluginHelper { public static bool $enabled = true; public static function isEnabled($group, $name) { return self::$enabled; } }
}
namespace Joomla\CMS\Component {
    final class ComponentHelper {
        public static array $values = [];
        public static function getParams($name) { return new class { public function get($key, $default = null) { return ComponentHelper::$values[$key] ?? $default; } }; }
    }
}
namespace {
    define('_JEXEC', 1);
    require __DIR__ . '/../package/component/admin/src/Support/IntegrationOptions.php';
    use SuperSoft\Component\Smartbrowser\Administrator\Support\IntegrationOptions as Options;
    foreach ([0, 1] as $global) foreach ([0, 1] as $hide) {
        \Joomla\CMS\Component\ComponentHelper::$values = ['replace_all'=>$global, 'hide_component_menu'=>$hide];
        if (Options::enabled('hide_component_menu') !== (bool) $hide) throw new \RuntimeException('Menu hiding depends on replacement');
    }
    foreach (['articles'=>'replace_articles', 'flat-articles'=>'replace_articles', 'articles-by-tag'=>'replace_articles',
        'featured-articles'=>'replace_featured_articles', 'categories'=>'replace_categories', 'flat-tags'=>'replace_tags',
        'menus'=>'replace_menus', 'flat-menus'=>'replace_menus', 'users'=>'replace_users', 'media'=>'replace_media'] as $adapter=>$key) {
        \Joomla\CMS\Component\ComponentHelper::$values = [$key=>'1'];
        if (!Options::browserEnabled($adapter, true)) throw new \RuntimeException('Enabled adapter not integrated');
        foreach (['select', 'readonly'] as $mode) if (Options::browserEnabled($adapter, true, $mode)) throw new \RuntimeException('Picker/readonly integration changed');
        if (Options::browserEnabled($adapter, false)) throw new \RuntimeException('Frontend integration changed');
        \Joomla\CMS\Component\ComponentHelper::$values = [];
        if (Options::browserEnabled($adapter, true)) throw new \RuntimeException('Disabled integration enabled');
    }
    \Joomla\CMS\Component\ComponentHelper::$values = ['replace_all'=>'1'];
    if (!Options::browserEnabled('flat-menus', true) || Options::browserEnabled('direct-links', true)) throw new \RuntimeException('Replace-all adapter boundary');
    \Joomla\CMS\Plugin\PluginHelper::$enabled = false;
    if (Options::browserEnabled('menus', true)) throw new \RuntimeException('Disabled system plugin changed browser');
    echo "Automatic browser integration settings and client boundaries OK\n";
}
