<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Support;

use Joomla\CMS\Application\CMSApplicationInterface;
use Joomla\CMS\Router\Route;
use Joomla\CMS\Uri\Uri;

defined('_JEXEC') or die;

final class AdministratorRoute
{
    public static function link(CMSApplicationInterface $app, string $url): string
    {
        return $app->isClient('administrator')
            ? Route::_($url, false)
            : Uri::root() . 'administrator/' . ltrim($url, '/');
    }
}
