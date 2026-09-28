<?php
namespace SuperSoft\Component\Smartbrowser\Site\Controller;
use Joomla\CMS\Component\ComponentHelper;
use Joomla\CMS\Filter\InputFilter;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\Controller\BaseController;
use Joomla\CMS\Router\Route;
use Joomla\CMS\Session\Session;
use Joomla\CMS\Uri\Uri;
use SuperSoft\Component\Smartbrowser\Site\Service\FrontendEditorService;
defined('_JEXEC') or die;
final class EditorController extends BaseController
{
    public function save(): void
    {
        if (!Session::checkToken()) throw new \RuntimeException(Text::_('JINVALID_TOKEN'), 403);
        $type = $this->input->getCmd('type');
        $id = $this->input->getInt('id');
        $apply = $this->input->post->getCmd('editorAction') === 'apply';
        $copy = $type === 'article' && $id > 0 && $this->input->post->getCmd('editorAction') === 'copy';
        $data = $this->input->post->get('jform', [], 'array');
        foreach (['parent_id', 'menutype'] as $key) {
            if (isset($data[$key])) $this->input->set($key, $data[$key]);
        }
        try {
            $savedId = (new FrontendEditorService($this->app))->save($type, $id, $data, $copy);
            $url = ($apply || $copy)
                ? $this->editorUrl($type, $savedId, $data)
                : $this->completionUrl($type);
            $this->setRedirect($url, Text::_('COM_SMARTBROWSER_FRONTEND_EDITOR_SAVED'));
        } catch (\Throwable $error) {
            $this->app->enqueueMessage($error->getMessage(), 'error');
            $this->setRedirect($this->editorUrl($type, $id, $data));
        }
    }

    public function cancel(): void
    {
        if (!Session::checkToken()) throw new \RuntimeException(Text::_('JINVALID_TOKEN'), 403);
        if ($this->input->getCmd('type') === 'menu-item') (new FrontendEditorService($this->app))->clearMenuItemState();
        $this->setRedirect($this->completionUrl($this->input->getCmd('type'), true));
    }

    public function setMenuType(): void
    {
        if (!Session::checkToken()) throw new \RuntimeException(Text::_('JINVALID_TOKEN'), 403);

        $data = $this->input->post->get('jform', [], 'array');
        $selection = json_decode(base64_decode($this->input->post->getString('menuTypeSelection')));
        if (!$selection || empty($selection->title)) throw new \InvalidArgumentException(Text::_('COM_SMARTBROWSER_ERROR_INVALID_RESOURCE'), 400);
        $parentId = $this->input->post->getInt('editorParentId', 1);
        $menuType = $this->input->post->getCmd('editorMenuType');
        if (empty($data['menutype'])) $data['menutype'] = $menuType;
        if (empty($data['parent_id']) || (int) $data['parent_id'] === 1) $data['parent_id'] = $parentId;
        $this->input->set('parent_id', (int) $data['parent_id']);
        $this->input->set('menutype', (string) $data['menutype']);
        (new FrontendEditorService($this->app))->getForm('menu-item', (int) ($selection->id ?? 0));

        $type = (string) $selection->title;
        $specialTypes = ['alias', 'separator', 'url', 'heading', 'container'];
        if (!in_array($type, $specialTypes, true)) {
            $type = 'component';
            if (!empty($selection->request->option)) {
                $selection->request->option = InputFilter::getInstance()->clean($selection->request->option, 'CMD');
                $data['component_id'] = ComponentHelper::getComponent($selection->request->option)->id;
                $this->app->setUserState('com_menus.edit.item.link', 'index.php?' . Uri::buildQuery((array) $selection->request));
            }
        } else {
            $data['component_id'] = 0;
            if ($type === 'alias') $this->app->setUserState('com_menus.edit.item.link', 'index.php?Itemid=');
        }

        unset($data['request']);
        $data['type'] = $type;
        $data['link'] = $this->app->getUserState('com_menus.edit.item.link');
        $this->app->setUserState('com_menus.edit.item.type', $type);
        $this->app->setUserState('com_menus.edit.item.data', $data);

        $url = 'index.php?option=com_smartbrowser&view=editor&layout=modal' . ($this->input->getBool('sbpage') ? '' : '&tmpl=component') . '&type=menu-item&menuTypeSelected=1&id=' . (int) ($selection->id ?? 0) . '&selectedType=' . rawurlencode($type);
        if ($this->input->getBool('sbpage')) $url .= '&sbpage=1';
        foreach (['parent_id', 'menutype'] as $key) if (!empty($data[$key])) $url .= '&' . $key . '=' . rawurlencode((string) $data[$key]);
        $this->setRedirect(Route::_($url, false));
    }

    private function completionUrl(string $type, bool $cancelled = false): string
    {
        return Route::_('index.php?option=com_smartbrowser&view=editor&layout=modal' . ($this->input->getBool('sbpage') ? '' : '&tmpl=component') . '&done=1&type=' . $type . ($cancelled ? '&cancelled=1' : '') . ($this->input->getBool('sbpage') ? '&sbpage=1' : ''), false);
    }

    private function editorUrl(string $type, int $id, array $data): string
    {
        $url = 'index.php?option=com_smartbrowser&view=editor&layout=modal' . ($this->input->getBool('sbpage') ? '' : '&tmpl=component') . '&type=' . rawurlencode($type) . '&id=' . $id;
        if ($this->input->getBool('sbpage')) $url .= '&sbpage=1';
        foreach (['parent_id', 'menutype'] as $key) {
            if (!empty($data[$key])) $url .= '&' . $key . '=' . rawurlencode((string) $data[$key]);
        }
        return Route::_($url, false);
    }
}
