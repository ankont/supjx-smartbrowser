import assert from 'node:assert/strict';
import test from 'node:test';
import createBrowserState from '../resources/js/core/createBrowserState.js';
import { readFile } from 'node:fs/promises';

test('action menus stack above the browser toolbar in picker layouts', async () => {
  const css = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  const actionsLayer = css.match(/\.resource-actions-area \{[^}]*\}/s)?.[0] || '';
  const toolbarLayer = css.match(/\.resource-toolbar \{[^}]*\}/s)?.[0] || '';
  assert.match(actionsLayer, /position: relative;/);
  assert.ok(Number(actionsLayer.match(/z-index: (\d+);/)?.[1]) > Number(toolbarLayer.match(/z-index: (\d+);/)?.[1]));
});

test('invert selection toggles only visible selectable resources', () => {
  const browser = createBrowserState({
    options: { roots: [{ id: 'root' }], mode: 'manage' },
    api: {},
    persistence: { load: (defaults) => defaults, save: () => {} },
    viewRegistry: { has: () => true },
  });
  browser.state.nodes = [
    { id: 'one', kind: 'node', title: 'One', selectable: true },
    { id: 'two', kind: 'node', title: 'Two', selectable: true },
  ];
  browser.state.contextItems = [{ id: 'context', kind: 'item', title: 'Context' }];
  browser.state.selectedIds = ['one', 'hidden'];
  browser.invertSelection();
  assert.deepEqual(browser.state.selectedIds, ['hidden', 'two']);
});

test('picker flat view is available, while manager navigation follows application', async () => {
  const app = await readFile(new URL('../resources/js/components/SmartBrowserApp.vue', import.meta.url), 'utf8');
  const actions = await readFile(new URL('../resources/js/components/ResourceActions.vue', import.meta.url), 'utf8');
  assert.match(app, /flatAvailable = \['articles', 'categories', 'tags', 'articles-by-tag', 'menus', 'users', 'media'\]/);
  assert.match(app, /adapter: options\.adapter\.replace\(\/\^flat-\/, ''\)/);
  assert.match(app, /:manager-new-tab="options\.application === 'site'"/);
  assert.match(actions, /:target="managerNewTab \? '_blank' : undefined"/);
});

test('info panel localizes wildcard language and decorates labels', async () => {
  const panel = await readFile(new URL('../resources/js/components/ResourceInfoPanel.vue', import.meta.url), 'utf8');
  const details = await readFile(new URL('../resources/js/components/ResourceDetails.vue', import.meta.url), 'utf8');
  const css = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  assert.match(panel, /:class="fieldIcon\(field\)"/);
  assert.match(panel, /rawFieldValue\(field\) === '\*'/);
  assert.match(panel, /resource-info-identifier/);
  assert.match(details, /column\.format === 'language' && value === '\*'/);
  assert.match(details, /resource\.metadata\.language === '\*'[^>]*resource-language-all fas fa-asterisk/);
  assert.match(panel, /rawFieldValue\(field\) === '\*'[^>]*resource-language-all fas fa-asterisk/);
  assert.match(css, /\.resource-language-all \{[^}]*background: #4b9dd0;[^}]*border-radius: 50%;/s);
});
