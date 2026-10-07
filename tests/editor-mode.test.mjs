import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import MediaActionDriver from '../resources/js/adapters/MediaActionDriver.js';

test('frontend page editor keeps a return address and marks the standalone flow', () => {
  const originalWindow = globalThis.window;
  const stored = new Map();
  let destination;
  globalThis.window = {
    location: { href: 'https://example.test/index.php?option=com_smartbrowser&view=browser', assign: (url) => { destination = new URL(url); } },
    sessionStorage: { setItem: (key, value) => stored.set(key, value) },
  };
  try {
    new MediaActionDriver(null, null, null, null, 'page', 'site').openEditor('/index.php?option=com_smartbrowser&view=editor&layout=modal&tmpl=component');
    assert.equal(destination.searchParams.get('sbpage'), '1');
    assert.equal(destination.searchParams.has('tmpl'), false);
    assert.equal(stored.get('supjx.smartbrowser.editorReturn'), globalThis.window.location.href);
  } finally {
    globalThis.window = originalWindow;
  }
});

test('administrator page editor removes modal parameters and supplies Joomla return', () => {
  const originalWindow = globalThis.window;
  let destination;
  globalThis.window = {
    location: { href: 'https://example.test/administrator/index.php?option=com_smartbrowser', assign: (url) => { destination = new URL(url); } },
    btoa,
  };
  try {
    new MediaActionDriver(null, null, null, null, 'page', 'administrator').openEditor('/administrator/index.php?option=com_content&task=article.edit&layout=modal&tmpl=component');
    assert.equal(destination.searchParams.has('layout'), false);
    assert.equal(destination.searchParams.has('tmpl'), false);
    assert.equal(destination.searchParams.get('return'), btoa(globalThis.window.location.href));
  } finally {
    globalThis.window = originalWindow;
  }
});

test('administrator new article opens the native edit layout in page mode', () => {
  const originalWindow = globalThis.window;
  let destination;
  globalThis.window = {
    location: { href: 'https://example.test/administrator/index.php?option=com_smartbrowser', assign: (url) => { destination = new URL(url); } },
    btoa,
  };
  try {
    new MediaActionDriver(null, null, null, null, 'page', 'administrator').openEditor('/administrator/index.php?option=com_content&view=article&layout=modal&tmpl=component&catid=12&sbTagId=34');
    assert.equal(destination.searchParams.get('layout'), 'edit');
    assert.equal(destination.searchParams.has('tmpl'), false);
    assert.equal(destination.searchParams.get('catid'), '12');
    assert.equal(destination.searchParams.get('sbTagId'), '34');
  } finally {
    globalThis.window = originalWindow;
  }
});

test('administrator new child forms retain native edit layouts in page mode', () => {
  const originalWindow = globalThis.window;
  const destinations = [];
  globalThis.window = {
    location: { href: 'https://example.test/administrator/index.php?option=com_smartbrowser', assign: (url) => destinations.push(new URL(url)) },
    btoa,
  };
  try {
    const driver = new MediaActionDriver(null, null, null, null, 'page', 'administrator');
    driver.openEditor('/administrator/index.php?option=com_tags&view=tag&layout=edit&tmpl=component&parent_id=9');
    driver.openEditor('/administrator/index.php?option=com_menus&view=item&layout=modal&tmpl=component&parent_id=14');
    assert.deepEqual(destinations.map((url) => url.searchParams.get('layout')), ['edit', 'edit']);
    assert.deepEqual(destinations.map((url) => url.searchParams.get('parent_id')), ['9', '14']);
  } finally {
    globalThis.window = originalWindow;
  }
});

test('backend menu editor carries a guarded SmartBrowser return through native save', async () => {
  const plugin = await readFile(new URL('../package/plugins/system/smartbrowserintegration/src/Extension/Smartbrowserintegration.php', import.meta.url), 'utf8');
  assert.match(plugin, /onAfterRoute' => 'returnFromMenuEditor'/);
  assert.match(plugin, /in_array\(\$input->getCmd\('task'\), \['item.save', 'item.cancel', 'item.apply', 'item.save2copy'\]/);
  assert.match(plugin, /Uri::isInternal\(\$url\)/);
  assert.match(plugin, /getCmd\('view', 'items'\) === 'items'/);
  assert.match(plugin, /\$app->redirect\(\$url\)/);
  assert.match(plugin, /input.name = \\"sbReturn\\"|input.name = "sbReturn"/);
});

test('integration uses component Options and frontend editor preserves page mode through redirects', async () => {
  const plugin = await readFile(new URL('../package/plugins/system/smartbrowserintegration/src/Extension/Smartbrowserintegration.php', import.meta.url), 'utf8');
  const controller = await readFile(new URL('../package/component/site/src/Controller/EditorController.php', import.meta.url), 'utf8');
  const template = await readFile(new URL('../package/component/site/tmpl/editor/modal.php', import.meta.url), 'utf8');
  const css = await readFile(new URL('../package/component/media/css/editor.css', import.meta.url), 'utf8');
  assert.match(plugin, /ComponentHelper::getParams\('com_smartbrowser'\)/);
  assert.doesNotMatch(plugin, /\$this->params->get\('replace_/);
  assert.match(plugin, /hide_component_menu/);
  assert.match(controller, /getBool\('sbpage'\)/);
  assert.match(controller, /getBool\('sbpage'\) \? '' : '&tmpl=component'/);
  assert.match(template, /supjx\.smartbrowser\.editorReturn/);
  assert.match(template, /getBool\('sbpage'\) \? ' is-page'/);
  assert.match(css, /\.com-smartbrowser-editor\.is-page \.smartbrowser-editor-actions \{\s*position: static/);
  assert.match(css, /\.com-smartbrowser-editor\.is-page\.container-fluid:has\(#smartbrowserEditorTabs\[view="tabs"\]\) \{\s*height: auto/);
});
