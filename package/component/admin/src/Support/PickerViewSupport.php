<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

use Joomla\CMS\Application\CMSApplicationInterface;
use Joomla\CMS\Uri\Uri;

defined('_JEXEC') or die;

final class PickerViewSupport
{
    public static function prepare(CMSApplicationInterface $app, object $document): void
    {
        $base = $app->isClient('administrator') ? Uri::root() . 'administrator/' : Uri::root();
        $document->addScriptOptions('com_smartbrowser.picker', ['url' => $base . 'index.php?option=com_smartbrowser&view=browser']);
        $document->getWebAssetManager()->useStyle('com_smartbrowser.app')->useScript('com_smartbrowser.picker');
    }
}
