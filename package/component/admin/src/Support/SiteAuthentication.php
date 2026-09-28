<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support;
use Joomla\CMS\Router\Route;
use Joomla\CMS\Uri\Uri;
defined('_JEXEC') or die;
final class SiteAuthentication
{
    public static function loginUrl(?string $returnUrl = null): string
    {
        return Route::_('index.php?option=com_users&view=login&return=' . base64_encode($returnUrl ?? Uri::getInstance()->toString()), false);
    }
}
