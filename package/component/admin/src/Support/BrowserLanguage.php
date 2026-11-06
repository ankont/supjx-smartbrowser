<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

use Joomla\CMS\Factory;
use Joomla\CMS\Language\Language;
use Joomla\CMS\Language\Text;

defined('_JEXEC') or die;

/** Missing browser labels may come from administrator without replacing site strings. */
final class BrowserLanguage
{
    public static function text(string $key): string
    {
        $language = Factory::getApplication()->getLanguage();
        if ($language->hasKey($key)) return Text::_($key);
        static $fallbacks = [];
        $tag = $language->getTag();
        if (!isset($fallbacks[$tag])) {
            $fallback = new Language($tag);
            $fallback->load('joomla', JPATH_ADMINISTRATOR);
            $fallback->load('lib_joomla', JPATH_ADMINISTRATOR);
            $fallbacks[$tag] = $fallback;
        }
        return $fallbacks[$tag]->_($key);
    }

    public static function script(string $key): void
    {
        Text::script($key);
        if (!Factory::getApplication()->getLanguage()->hasKey($key)) {
            Factory::getApplication()->getDocument()->addScriptOptions('joomla.jtext', [$key => self::text($key)]);
        }
    }
}
