<?php
namespace SuperSoft\Component\Smartbrowser\Site\View\Menutypes;

use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use Joomla\CMS\Object\CMSObject;
use SuperSoft\Component\Smartbrowser\Administrator\Support\SiteAuthentication;

defined('_JEXEC') or die;

final class HtmlView extends BaseHtmlView
{
    public array $types = [];
    public int $recordId = 0;

    public function display($tpl = null): void
    {
        $app = Factory::getApplication();
        if ($app->getIdentity()->guest) {
            $app->redirect(SiteAuthentication::loginUrl());
            $app->close();
        }

        $language = $app->getLanguage();
        foreach (['com_menus', 'com_content', 'com_tags', 'com_contact'] as $extension) {
            $language->load($extension, JPATH_SITE, null, true);
            $language->load($extension, JPATH_ADMINISTRATOR, null, true);
            $language->load($extension . '.sys', JPATH_ADMINISTRATOR, null, true);
        }

        $this->recordId = $app->getInput()->getInt('recordId');
        $model = $app->bootComponent('com_menus')->getMVCFactory()->createModel('Menutypes', 'Administrator', ['ignore_request' => true]);
        $model->setState('client_id', 0);
        $types = $model->getTypeOptions() ?: [];
        $types['COM_MENUS_TYPE_SYSTEM'] = $this->systemTypes();

        foreach ($types as $name => $items) {
            $sorted = [];
            foreach ($items as $item) $sorted[Text::_($item->title)] = $item;
            uksort($sorted, 'strcasecmp');
            $this->types[Text::_($name)] = $sorted;
        }
        uksort($this->types, 'strcasecmp');

        parent::display($tpl);
    }

    private function systemTypes(): array
    {
        $definitions = [
            ['COM_MENUS_TYPE_EXTERNAL_URL', 'url', 'COM_MENUS_TYPE_EXTERNAL_URL_DESC'],
            ['COM_MENUS_TYPE_ALIAS', 'alias', 'COM_MENUS_TYPE_ALIAS_DESC'],
            ['COM_MENUS_TYPE_SEPARATOR', 'separator', 'COM_MENUS_TYPE_SEPARATOR_DESC'],
            ['COM_MENUS_TYPE_HEADING', 'heading', 'COM_MENUS_TYPE_HEADING_DESC'],
        ];
        return array_map(static function (array $definition): CMSObject {
            $item = new CMSObject();
            $item->title = $definition[0];
            $item->type = $definition[1];
            $item->description = $definition[2];
            $item->request = null;
            return $item;
        }, $definitions);
    }
}
