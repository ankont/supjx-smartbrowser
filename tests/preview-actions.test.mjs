import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const source = path => readFile(new URL('../' + path, import.meta.url), 'utf8');

test('article and tag previews use native frontend component-only routes with resource permissions', async () => {
  const content = await source('package/component/admin/src/Adapter/ContentAdapter.php');
  const articles = await source('package/component/admin/src/Adapter/ArticleCollectionAdapter.php');
  const tags = await source('package/component/admin/src/Adapter/TagAdapter.php');
  assert.match(content, /command' => 'previewUrl'/);
  assert.match(content, /option=com_content&view=article&id=/);
  assert.match(content, /option=com_tags&view=tag&id=/);
  assert.match(content, /&tmpl=component&Itemid=0/);
  assert.match(content, /resource\['capabilities'\]\['preview'\]/);
  assert.match(content, /getAuthorisedViewLevels/);
  for (const adapter of [articles, tags]) {
    assert.match(adapter, /action\('preview', 'COM_SMARTBROWSER_ACTION_PREVIEW'/);
    assert.match(adapter, /contentPreview\(\$this->requireOne\(\$selection\)\)/);
  }
});
test('content preview is view-only; media editor retains its existing save controls', async () => {
  const driver = await source('resources/js/adapters/MediaActionDriver.js');
  const preview = driver.slice(driver.indexOf('  preview(resource)'), driver.indexOf('  editMedia(resource)'));
  assert.doesNotMatch(preview, /data-action="save"|name="name"|api\.execute/);
  assert.match(preview, /showContentPreview/);
  const editor = driver.slice(driver.indexOf('  editMedia(resource)'));
  assert.match(editor, /data-action="save"/);
  assert.match(editor, /data-action="apply"/);
  assert.match(editor, /data-action="copy"/);
  for (const view of ['ResourceGrid', 'ResourceDetails']) {
    const renderer = await source(`resources/js/components/${view}.vue`);
    assert.match(renderer, /event\?\.ctrlKey \|\| event\?\.metaKey/);
    assert.match(renderer, /props\.previewAction\(resource\)/);
  }
});
