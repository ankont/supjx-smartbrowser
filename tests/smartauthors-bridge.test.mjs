import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('article permissions use the SmartAuthors helper and native ACL fallback', async () => {
  const access = await source('package/component/admin/src/Support/SmartAuthorsAccess.php');
  for (const method of ['canEditArticle', 'canTrashArticle', 'canChangeState', 'canManageArticleState']) {
    assert.match(access, new RegExp(`SmartAuthorsHelper::${method}\\(`));
  }
  assert.match(access, /PluginHelper::isEnabled\('system', 'smartauthors'\)/);
  assert.match(access, /class_exists\(SmartAuthorsHelper::class\)/);
  assert.doesNotMatch(access, /canTransitionState/);
});

test('draft trash and restore have target-aware UI and model authorization', async () => {
  const [content, actions, model, menu] = await Promise.all([
    source('package/component/admin/src/Adapter/ContentAdapter.php'),
    source('package/component/admin/src/Adapter/ArticleCollectionAdapter.php'),
    source('package/component/admin/src/Model/SmartAuthorsArticleModel.php'),
    source('resources/js/core/itemMenuActions.js'),
  ]);
  assert.match(content, /'restore' => \$state === -2 && \(\$canUnpublish \|\| \$canTrash\)/);
  assert.match(content, /-2 => 'restore'/);
  assert.match(actions, /action\('restore', 'COM_SMARTBROWSER_ACTION_RESTORE'/);
  assert.match(actions, /'restore' => \$this->setState\(\$selection, 0\)/);
  assert.match(model, /public function publish\(&\$pks, \$value = 1\)/);
  assert.match(model, /canChangeArticleState\(\$app, \$user, \$record, \$this->targetState\)/);
  assert.match(actions, /false, false, false, 'trashState'\)/);
  assert.match(menu, /action\.id === 'checkin'/);
});
