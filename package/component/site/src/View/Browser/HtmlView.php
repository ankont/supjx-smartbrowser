<?php
namespace SuperSoft\Component\Smartbrowser\Site\View\Browser;
use Joomla\CMS\Factory;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use SuperSoft\Component\Smartbrowser\Administrator\Support\BrowserViewSupport;
defined('_JEXEC') or die;
final class HtmlView extends BaseHtmlView {
    public function display($tpl = null): void {
        (new BrowserViewSupport(Factory::getApplication()))->prepare($this->getDocument());
        parent::display($tpl);
    }
}
