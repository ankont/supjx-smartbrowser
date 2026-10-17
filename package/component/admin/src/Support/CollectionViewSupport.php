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
        $app->getLanguage()->load('com_content', JPATH_ADMINISTRATOR, null, true);
        foreach (['JGLOBAL_USE_GLOBAL', 'JBROWSERTARGET_PARENT', 'JBROWSERTARGET_NEW', 'JBROWSERTARGET_POPUP', 'JBROWSERTARGET_MODAL'] as $key) Text::script($key);
        foreach (['COM_CONTENT_FIELD_IMAGE_CAPTION_LABEL', 'COM_CONTENT_FIELD_IMAGE_CLASS_LABEL', 'COM_CONTENT_FIELD_URLA_LINK_TEXT_LABEL', 'COM_CONTENT_URL_FIELD_BROWSERNAV_LABEL'] as $key) Text::script($key);
        foreach ((new BrowserViewSupport($app))->languageKeys() as $key) Text::script($key);
        foreach (['TITLE', 'UNAVAILABLE', 'REMOVE', 'EMPTY'] as $key) Text::script('COM_SMARTBROWSER_COLLECTION_' . $key);
        Text::script('COM_SMARTBROWSER_LOADING');
        Text::script('COM_SMARTBROWSER_NO_IMAGE_SELECTED');
        Text::script('COM_SMARTBROWSER_LINK_TEXT');
        Text::script('COM_SMARTBROWSER_RESIZE_INFO');
        Text::script('COM_SMARTBROWSER_SCROLL_BACK');
        Text::script('COM_SMARTBROWSER_SCROLL_FORWARD');
        Text::script('COM_SMARTBROWSER_PREVIOUS_RESOURCE');
        Text::script('COM_SMARTBROWSER_NEXT_RESOURCE');
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
        (new ResourceVisualDecorator($app))->preparePreviews($document);
        return $options;
    }
}
