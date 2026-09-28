<?php
namespace SuperSoft\Component\Smartbrowser\Site\Dispatcher;
use Joomla\CMS\Dispatcher\ComponentDispatcher;
use SuperSoft\Component\Smartbrowser\Administrator\Support\SiteAuthentication;
defined('_JEXEC') or die;
final class Dispatcher extends ComponentDispatcher {
    protected function checkAccess(): void {
        if (!$this->app->getIdentity()->guest) return;
        if ($this->input->getCmd('format') === 'json' || str_starts_with($this->input->getCmd('task'), 'api.')) return;
        $this->app->redirect(SiteAuthentication::loginUrl());
        $this->app->close();
    }
}
