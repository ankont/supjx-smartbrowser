<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Uri\Uri;
use Joomla\Component\Media\Administrator\Model\ApiModel;
use Joomla\Component\Media\Administrator\Model\MediaModel;
use Joomla\Plugin\Filesystem\Local\Adapter\LocalAdapter;

defined('_JEXEC') or die;

final class ImageSelectorSupport
{
    public static function prepare(object $document): void
    {
        $app = Factory::getApplication();
        $options = CollectionViewSupport::prepare($document);
        $roots = [];
        $api = new ApiModel();
        foreach ((new MediaModel())->getProviders() as $provider) foreach ($provider->adapterNames as $name) {
            $filesystem = $provider->name . '-' . $name;
            try {
                $adapter = $api->getAdapter($filesystem);
                if (get_class($adapter) === LocalAdapter::class) $roots[] = ['filesystem' => $filesystem, 'url' => rtrim($adapter->getUrl('/'), '/') . '/'];
            } catch (\Throwable $error) { /* Unsupported providers retain native controls. */ }
        }
        $app->getLanguage()->load('plg_fields_smartbrowserpicker', JPATH_ADMINISTRATOR, null, true);
        foreach (['INVALID', 'EDIT', 'SELECT', 'CLEAR'] as $key) Text::script('PLG_FIELDS_SMARTBROWSERPICKER_' . $key);
        $document->addScriptOptions('com_smartbrowser.image-selectors', [...$options,
            'roots' => $roots, 'siteUrl' => Uri::root(),
            'pickerUrl' => Uri::base() . 'index.php?option=com_smartbrowser&view=browser']);
        $assets = $document->getWebAssetManager();
        $assets->useScript('com_smartbrowser.picker');
        $assets->registerScript('com_smartbrowser.image-selectors', 'com_smartbrowser/image-selectors.js', [], ['type' => 'module'], ['core', 'com_smartbrowser.picker']);
        $assets->useScript('com_smartbrowser.image-selectors');
    }
}
