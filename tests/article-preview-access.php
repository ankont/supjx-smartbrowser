<?php
namespace SuperSoft\Component\Smartbrowser\Administrator\Support {
    class SmartAuthorsAccess {
        public static function canEditArticle($app, $user, $article) { return $user->edit; }
        public static function canManageArticleState($app, $user, $article) { return $user->state; }
    }
}
namespace {
    define('_JEXEC', 1);
    require __DIR__ . '/../package/component/admin/src/Support/ArticlePreview.php';
    use SuperSoft\Component\Smartbrowser\Administrator\Support\ArticlePreview as Preview;
    $token = Preview::issue(43, 7, 'test-secret', 1000);
    if (Preview::verify($token, 43, 'test-secret', 1001) !== 7) throw new RuntimeException('Valid grant rejected');
    foreach ([[$token, 44, 'test-secret', 1001], [$token, 43, 'other-secret', 1001], [$token, 43, 'test-secret', 1301], [$token, 43, 'test-secret', 999], [$token . '0', 43, 'test-secret', 1001]] as $args) {
        try { Preview::verify(...$args); throw new RuntimeException('Invalid grant accepted'); } catch (RuntimeException $error) { if ($error->getCode() !== 403) throw $error; }
    }
    $user = new class {
        public bool $guest = false, $block = false, $edit = false, $state = false, $manage = false;
        public function authorise($action, $asset = '') { return $action === 'core.manage' && $this->manage; }
        public function getAuthorisedViewLevels() { return [1]; }
    };
    $article = (object) ['id' => 43, 'access' => 1]; $app = (object) [];
    if (Preview::allowed($app, $user, $article)) throw new RuntimeException('Read-only viewer granted privileged preview');
    $user->edit = true;
    if (!Preview::allowed($app, $user, $article)) throw new RuntimeException('Editor denied preview');
    foreach (['guest', 'block'] as $flag) { $user->$flag = true; if (Preview::allowed($app, $user, $article)) throw new RuntimeException('Blocked/guest preview granted'); $user->$flag = false; }
    $article->access = 9;
    if (Preview::allowed($app, $user, $article)) throw new RuntimeException('Access-level restriction bypassed');
    echo "Article preview grants, expiry, tampering and management ACL OK\n";
}
