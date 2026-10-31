<?php
namespace SuperSoft\Component\Smartbrowser\Site\View\Mediaeditor;

use Joomla\CMS\Factory;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use Joomla\CMS\Session\Session;
use Joomla\CMS\Language\Text;
use SuperSoft\Component\Smartbrowser\Administrator\Adapter\AdapterRegistry;

defined('_JEXEC') or die;

/** Hosts Joomla's media-action plugins; all writes go through the scoped Media adapter. */
class HtmlView extends BaseHtmlView
{
    public $form;
    public $file;
    public $useCoreUI = true;

    public function display($tpl = null): void
    {
        $app = Factory::getApplication();
        if ($app->getIdentity()->guest) throw new \RuntimeException(Text::_('JERROR_ALERTNOAUTHOR'), 403);
        $app->getLanguage()->load('com_media', JPATH_ADMINISTRATOR);
        $app->getLanguage()->load('com_smartbrowser', JPATH_ADMINISTRATOR);
        $input = $app->getInput();
        $adapter = (new AdapterRegistry($app))->get('media', $input->getString('browseRoot') ?: null);
        $this->file = $adapter->editableFile($input->getString('path'));
        if ($this->file['kind'] !== 'image') throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_FILE_EDITOR_INVALID_IMAGE'), 400);
        $wa = $this->getDocument()->getWebAssetManager();
        $wa->getRegistry()->addExtensionRegistryFile('com_media');
        $wa->useScript('core')->useStyle('com_media.mediamanager');
        $this->form = (new \Joomla\Component\Media\Administrator\Model\FileModel())->getForm([], false);
        if (!$this->form || !$this->form->getFieldsets()) throw new \RuntimeException(Text::_('COM_SMARTBROWSER_FILE_EDITOR_NO_TOOLS'), 501);
        $this->getDocument()->addScriptOptions('com_media', [
            'uploadPath' => preg_replace_callback('/\.[^.]+$/', static fn ($match) => strtolower($match[0]), $this->file['resource']['id']),
            'contents' => $this->file['content'], 'csrfToken' => Session::getFormToken(),
        ]);
        $this->getDocument()->addScriptOptions('com_smartbrowser.imageEditor', [
            'engine' => $wa->getAsset('script', 'com_media.edit-images')->getUri(true),
        ]);
        parent::display($tpl);
    }
}
