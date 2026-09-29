import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('failed frontend saves retain their error and entered values for every editor type', async () => {
  const [controller, view, template] = await Promise.all([
    source('package/component/site/src/Controller/EditorController.php'),
    source('package/component/site/src/View/Editor/HtmlView.php'),
    source('package/component/site/tmpl/editor/modal.php'),
  ]);
  assert.match(controller, /setUserState\('com_smartbrowser\.editor\.failure'/);
  assert.match(view, /\$this->editorForm->bind\(\$failure\['data'\]\)/);
  assert.match(template, /smartbrowser-editor-error.*role="alert"/);
});

test('frontend and iframe editors show an in-progress indicator', async () => {
  const [template, fields, driver] = await Promise.all([
    source('package/component/site/tmpl/editor/modal.php'),
    source('package/component/media/js/editor-fields.js'),
    source('resources/js/adapters/MediaActionDriver.js'),
  ]);
  assert.match(template, /smartbrowser-editor-busy.*role="status"/);
  assert.match(fields, /form\.addEventListener\('submit'/);
  assert.match(driver, /smartbrowser-editor-loading/);
});

test('existing menu editors initialize Joomla model state before applying the real menu item type', async () => {
  const service = await source('package/component/site/src/Service/FrontendEditorService.php');
  assert.match(service, /if \(\$type === 'menu-item' && \$id > 0\) \{\s*\$model->getState\('item\.id'\);\s*\$model->setState\('item\.type', \$this->storedMenuItemType\(\$id\)\);/);
});

test('all frontend saves pass the resource ID in form data like native Joomla controllers', async () => {
  const service = await source('package/component/site/src/Service/FrontendEditorService.php');
  assert.match(service, /\$data\['id'\] = \$id;/);
  assert.match(service, /\$valid\['id'\] = \$id;/);
});
