<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Session\Session;
use Joomla\CMS\Uri\Uri;

defined('_JEXEC') or die;

/** Loads the public embedded API without preparing or mounting a full browser. */
final class CollectionViewSupport
{
    public static function prepare(object $document): array
    {
        $app = Factory::getApplication();
        $app->getLanguage()->load('joomla', JPATH_ADMINISTRATOR, null, true);
        $app->getLanguage()->load('com_smartbrowser', JPATH_ADMINISTRATOR, null, true);
        foreach ((new BrowserViewSupport($app))->languageKeys() as $key) Text::script($key);
        foreach (['TITLE', 'UNAVAILABLE', 'REMOVE', 'EMPTY'] as $key) Text::script('COM_SMARTBROWSER_COLLECTION_' . $key);
        Text::script('COM_SMARTBROWSER_LOADING');
        $assets = $document->getWebAssetManager();
        $assets->getRegistry()->addRegistryFile('media/com_smartbrowser/joomla.asset.json');
        $assets->useStyle('com_smartbrowser.app')->useStyle('fontawesome')->useScript('com_smartbrowser.collection');
        $options = [
            'apiBaseUrl' => Uri::base() . 'index.php?option=com_smartbrowser&format=json',
            'csrfToken' => Session::getFormToken(),
            'application' => $app->isClient('site') ? 'site' : 'administrator',
            'editorMode' => 'modal',
        ];
        $document->addScriptOptions('com_smartbrowser.collection', $options);
        return $options;
    }
}
