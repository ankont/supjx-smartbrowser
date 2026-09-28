<?php

namespace SuperSoft\Component\Smartbrowser\Administrator\Dispatcher;

use Joomla\CMS\Access\Exception\NotAllowed;
use Joomla\CMS\Dispatcher\ComponentDispatcher;

defined('_JEXEC') or die;

final class Dispatcher extends ComponentDispatcher
{
    protected function checkAccess(): void
    {
        if (!$this->app->getIdentity()->authorise('core.manage', 'com_smartbrowser')) {
            throw new NotAllowed($this->app->getLanguage()->_('JERROR_ALERTNOAUTHOR'), 403);
        }
    }
}
