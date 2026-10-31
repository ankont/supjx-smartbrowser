<?php
namespace SuperSoft\Component\Smartbrowser\Site\View\Preview;

use Joomla\CMS\Component\ComponentHelper;
use Joomla\CMS\Factory;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;
use Joomla\Event\Priority;
use SuperSoft\Component\Smartbrowser\Administrator\Support\ArticlePreview;
use Joomla\CMS\User\UserFactoryInterface;

defined('_JEXEC') or die;

/** Use the native article model/layout, with presentation-only editing controls disabled. */
final class HtmlView extends BaseHtmlView
{
    public function display($tpl = null): void
    {
        $app = Factory::getApplication();
        $input = $app->getInput();
        $previous = ['option' => $input->getCmd('option'), 'view' => $input->getCmd('view')];
        $id = $input->getInt('id');
        if ($id < 1) throw new \InvalidArgumentException('Invalid article.', 400);
        $app->getLanguage()->load('com_content', JPATH_SITE);
        $factory = $app->bootComponent('com_content')->getMVCFactory();
        $model = $factory->createModel('Article', 'Site', ['ignore_request' => true, 'option' => 'com_content', 'base_path' => JPATH_SITE . '/components/com_content']);
        if (method_exists($model, 'setCurrentUser')) $model->setCurrentUser($app->getIdentity());
        $params = clone ComponentHelper::getParams('com_content');
        $params->set('show_page_heading', 0);
        $originalUser = $app->getIdentity();
        $token = $input->getString('sbPreview');
        $previewUser = null;
        if ($token !== '') {
            $userId = ArticlePreview::verify($token, $id, (string) $app->get('secret'));
            $previewUser = Factory::getContainer()->get(UserFactoryInterface::class)->loadUserById($userId);
        } elseif (!$originalUser->guest) {
            $previewUser = $originalUser;
        }
        if ($previewUser) {
            try { $item = ArticlePreview::item($id, $app, $previewUser, $params); }
            catch (\RuntimeException $error) { if ($token !== '' || $error->getCode() !== 403) throw $error; $item = null; }
            if ($item) {
                $model = new class(['name' => 'Article', 'ignore_request' => true, 'option' => 'com_content']) extends \Joomla\Component\Content\Site\Model\ArticleModel {
                    public object $previewItem;
                    public function getItem($pk = null) { return $this->previewItem; }
                };
                $model->previewItem = $item;
                $model->setCurrentUser($previewUser);
                $app->setHeader('Cache-Control', 'private, no-store', true);
                $app->setHeader('Referrer-Policy', 'no-referrer', true);
                $app->setHeader('X-Robots-Tag', 'noindex, nofollow', true);
            } else $previewUser = null;
        }
        $model->setState('article.id', $id);
        $model->setState('params', $params);
        $hideControls = static function ($event): void {
            if ($event->getArgument('context') !== 'com_content.article') return;
            $event->getArgument('subject')->params?->set('access-edit', false);
            $event->getArgument('params')?->set('access-edit', false);
        };
        $dispatcher = $app->getDispatcher();
        $dispatcher->addListener('onContentPrepare', $hideControls, Priority::LOW);
        try {
            if ($previewUser) $app->loadIdentity($previewUser);
            $input->set('option', 'com_content'); $input->set('view', 'article');
            // ApplicationHelper caches the outer com_smartbrowser option. Explicitly select
            // com_content so Joomla searches the template's article overrides as well.
            $view = $factory->createView('Article', 'Site', 'Html', ['option' => 'com_content', 'base_path' => JPATH_SITE . '/components/com_content']);
            if (method_exists($view, 'setDispatcher')) $view->setDispatcher($dispatcher);
            if (method_exists($view, 'setCurrentUser')) $view->setCurrentUser($app->getIdentity());
            $view->setModel($model, true);
            $view->setDocument($this->getDocument());
            $view->display();
        } finally {
            if ($previewUser) $app->loadIdentity($originalUser);
            $dispatcher->removeListener('onContentPrepare', $hideControls);
            foreach ($previous as $key => $value) $input->set($key, $value);
        }
    }
}
