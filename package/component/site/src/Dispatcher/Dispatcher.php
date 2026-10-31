<?php
namespace SuperSoft\Component\Smartbrowser\Site\Dispatcher;
use Joomla\CMS\Dispatcher\ComponentDispatcher;
use SuperSoft\Component\Smartbrowser\Administrator\Support\SiteAuthentication;
defined('_JEXEC') or die;
final class Dispatcher extends ComponentDispatcher {
    protected function checkAccess(): void {
        // The preview view enforces either native public policy or a scoped management grant.
        if ($this->input->getCmd('view') === 'preview' && $this->input->getCmd('task') === '' && $this->input->getCmd('format', 'html') === 'html') return;
        if (!$this->app->getIdentity()->guest) return;
        if ($this->input->getCmd('format') === 'json' || str_starts_with($this->input->getCmd('task'), 'api.')) return;
        $this->app->redirect(SiteAuthentication::loginUrl());
        $this->app->close();
    }
}
