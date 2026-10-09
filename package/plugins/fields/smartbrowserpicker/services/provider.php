<?php
defined('_JEXEC') or die;

use Joomla\CMS\Extension\PluginInterface;
use Joomla\CMS\Factory;
use Joomla\CMS\Plugin\PluginHelper;
use Joomla\DI\Container;
use Joomla\DI\ServiceProviderInterface;
use SuperSoft\Plugin\Fields\Smartbrowserpicker\Extension\Smartbrowserpicker;

return new class implements ServiceProviderInterface {
    public function register(Container $container): void
    {
        $container->set(PluginInterface::class, static function () {
            $plugin = new Smartbrowserpicker(Factory::getApplication()->getDispatcher(), (array) PluginHelper::getPlugin('fields', 'smartbrowserpicker'));
            $plugin->setApplication(Factory::getApplication());
            return $plugin;
        });
    }
};
