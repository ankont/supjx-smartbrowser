import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const source = async (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('batch dialog applies only selected and enabled operations', async () => {
  const dialog = await source('resources/js/components/ResourceBatchDialog.vue');
  const app = await source('resources/js/components/SmartBrowserApp.vue');
  assert.match(dialog, /:disabled="busy \|\| !canApply" @click="apply"/);
  assert.match(dialog, /article\.changeLanguage \? article\.language : ''/);
  assert.match(dialog, /shared\.changeAccess \? shared\.access : ''/);
  assert.match(dialog, /user\.groupAction === 'remove' \? 'del'/);
  assert.match(app, /api\.execute\('batch', ids, payload\)/);
  assert.match(app, /await load\(\)/);
});

test('Joomla adapters route batch to native models and media follows placement, rename, zip', async () => {
  const runner = await source('package/component/admin/src/Support/BatchRunner.php');
  const media = await source('package/component/admin/src/Support/MediaBatchRunner.php');
  for (const kind of ['articles', 'categories', 'tags', 'menus', 'users']) assert.match(runner, new RegExp(`'${kind}'`));
  assert.match(runner, /\$factory->createModel\('Article', 'Administrator'/);
  assert.match(runner, /\$factory->createModel\('Category', 'Administrator'/);
  assert.match(runner, /\$factory->createModel\('Item', 'Administrator'/);
  assert.match(runner, /private function copyWithIds\(/);
  assert.match(runner, /Closure::bind/);
  assert.match(runner, /\$this->apply\(\$model, \['tag' => \$tagId\], \$ids, \$contexts\)/);
  assert.match(runner, /\$this->removeTags\(\$model, \$kind, \$ids, \$removeTags\)/);
  assert.match(runner, /\$helper->unTagItem\(\$id, \$table, \$tagIds\)/);
  assert.doesNotMatch(runner, /tag_addremove/);
  assert.match(runner, /'flip_ordering' => 1/);
  assert.match(media, /\$this->renamed\(/);
  assert.match(media, /\$this->copy\(/);
  assert.match(media, /\$this->copy\(\$sourceAdapter, \$sourcePath, \$targetAdapter, \$targetPath, \$name\)/);
  assert.match(media, /if \(\$placement === 'move'\) \$this->api->delete\(\$sourceAdapter, \$sourcePath\)/);
  assert.match(media, /COM_SMARTBROWSER_ERROR_CROSS_PROVIDER_FOLDER/);
  assert.match(media, /\$response\['download'\] = \$this->zip\(/);
  assert.match(media, /assertBrowseScope/);
  assert.ok(media.indexOf("if ($placement !== 'none') {", media.indexOf('$result = [];')) < media.indexOf('if ($rename && !$renamedDuringCopy) {', media.indexOf('$result = [];')));
  const dialog = await source('resources/js/components/ResourceBatchDialog.vue');
  assert.ok(dialog.indexOf('id: \'placement\'') < dialog.indexOf('id: \'rename\''));
});

test('media batch destination uses scoped folder options in regular and flat views', async () => {
  const dialog = await source('resources/js/components/ResourceBatchDialog.vue');
  const media = await source('package/component/admin/src/Adapter/MediaAdapter.php');
  const flat = await source('package/component/admin/src/Adapter/FlatHierarchyAdapter.php');
  assert.match(dialog, /<ResourceFancySelect v-else v-model="media\.destination" :options="folderOptions"/);
  assert.match(dialog, /api\.execute\('batchFolders', items\.value\.map/);
  assert.match(dialog, /folderOptions\.value\.some\(\(option\) => option\.value === media\.destination\)/);
  assert.match(media, /'batchFolders' => \$this->batchFolderOptions\(\$selection\)/);
  assert.match(media, /\$this->assertBrowseScope\(\$selection\)/);
  assert.match(media, /\$this->withAllMediaTypes\(function \(\) use \(&\$stack/);
  assert.match(media, /\$folderAdapter = null/);
  assert.match(media, /if \(\$folderAdapter !== null\)/);
  assert.match(flat, /return \$this->source->executeAction\(\$action, \$selection, \$payload\)/);
});

test('tags expose language flags and tag parent is a plain single choice', async () => {
  const content = await source('package/component/admin/src/Adapter/ContentAdapter.php');
  const editor = await source('package/component/site/tmpl/editor/modal.php');
  const css = await source('package/component/media/css/smartbrowser.css');
  assert.match(content, /'languageImage' => \$this->languageImageForCode\(\(string\) \(\$tag->language/);
  assert.match(content, /private \?array \$languageImages = null/);
  assert.match(editor, /data-resource-type="<\?php echo \$this->escape\(\$this->resourceType\)/);
  assert.match(css, /data-resource-type="tag"\] joomla-field-fancy-select:has\(#jform_parent_id\) \.choices__button_joomla \{ display: none; \}/);
});

test('ZIP extension is fixed and menu placement uses one destination selector', async () => {
  const dialog = await source('resources/js/components/ResourceBatchDialog.vue');
  assert.match(dialog, /<span class="input-group-text">\.zip<\/span>/);
  assert.match(dialog, /zipName: 'selection'/);
  assert.match(dialog, /zipName: bareZipName\.value/);
  assert.match(dialog, /v-model="shared\.menuDestination" :options="menuDestinationOptions"/);
  assert.match(dialog, /shared\.menuDestination\.lastIndexOf\('\.'\)/);
  assert.doesNotMatch(dialog, /v-model="shared\.menuParent"/);
});
