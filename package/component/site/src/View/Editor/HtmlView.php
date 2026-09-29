<?php
namespace SuperSoft\Component\Smartbrowser\Site\View\Editor;
use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use SuperSoft\Component\Smartbrowser\Administrator\Support\SiteAuthentication;
use SuperSoft\Component\Smartbrowser\Site\Service\FrontendEditorService;
defined('_JEXEC') or die;
final class HtmlView extends BaseHtmlView
{
    public $editorForm = null;
    public $editorTitle = '';
    public $resourceType = '';
    public $resourceId = 0;
    public string $menuItemType = '';
    public $editorComplete = false;
    public string $editorError = '';

    public function display($tpl = null): void
    {
        $app = Factory::getApplication();
        if ($app->getIdentity()->guest) {
            $app->redirect(SiteAuthentication::loginUrl());
            $app->close();
        }
        $app->getLanguage()->load('com_smartbrowser', JPATH_ADMINISTRATOR, null, true);
        $this->editorComplete = $app->getInput()->getBool('done');
        $this->resourceType = $app->getInput()->getCmd('type');
        $this->resourceId = $app->getInput()->getInt('id');
        if (!$this->editorComplete) {
            $service = new FrontendEditorService($app);
            $this->editorForm = $service->getForm($this->resourceType, $this->resourceId);
            $failure = $app->getUserState('com_smartbrowser.editor.failure');
            $app->setUserState('com_smartbrowser.editor.failure', null);
            if (is_array($failure) && ($failure['type'] ?? '') === $this->resourceType && (int) ($failure['id'] ?? -1) === $this->resourceId) {
                $this->editorError = (string) ($failure['message'] ?? '');
                if (is_array($failure['data'] ?? null)) $this->editorForm->bind($failure['data']);
            }
            $this->editorTitle = $service->title($this->resourceType, $this->resourceId);
            if ($this->resourceType === 'menu-item') {
                $selectedType = $app->getInput()->getBool('menuTypeSelected') ? $app->getInput()->getCmd('selectedType') : '';
                $this->menuItemType = $selectedType !== '' ? $selectedType : $service->storedMenuItemType($this->resourceId);
            }
        }
        HTMLHelper::_('behavior.keepalive');
        HTMLHelper::_('behavior.formvalidator');
        $this->getDocument()->getWebAssetManager()
            ->useStyle('com_smartbrowser.editor')
            ->useScript('com_smartbrowser.editor-fields');
        parent::display($tpl);
    }
}
