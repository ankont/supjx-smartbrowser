import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { columnCatalog } from '../resources/js/core/columnCatalog.js';
import { resetPreferencesIfNeeded } from '../resources/js/core/resetPreferences.js';

test('info metadata is available as optional columns without changing defaults', () => {
  const columns = columnCatalog({
    columns: [{ id: 'title', label: 'Name', source: 'title' }, { id: 'status', label: 'Status', source: 'metadata.stateLabel' }],
    infoFields: [{ label: 'Alias', source: 'metadata.alias' }, { label: 'Status', source: 'metadata.stateLabel' }],
  }, 'articles');
  assert.equal(columns.find((column) => column.id === 'status').defaultVisible, true);
  assert.equal(columns.find((column) => column.id === 'alias').defaultVisible, false);
  assert.equal(columns.find((column) => column.id === 'categoryPath').defaultVisible, false);
  assert.equal(columns.find((column) => column.id === 'tagPaths').defaultVisible, false);
  assert.equal(columns.filter((column) => column.id === 'status').length, 1);
});

test('preference reset removes only SmartBrowser view state once per saved token', () => {
  const values = new Map([
    ['supjx.smartbrowser.articles', 'old'],
    ['supjx.smartbrowser.ui.articles.', 'old'],
    ['supjx.smartbrowser.editorReturn', '/administrator/'],
    ['joomla.other', 'keep'],
  ]);
  const storage = {
    get length() { return values.size; },
    key: (index) => [...values.keys()][index],
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
  assert.equal(resetPreferencesIfNeeded(storage, 'first'), true);
  assert.equal(values.has('supjx.smartbrowser.articles'), false);
  assert.equal(values.has('supjx.smartbrowser.ui.articles.'), false);
  assert.equal(values.get('supjx.smartbrowser.editorReturn'), '/administrator/');
  assert.equal(values.get('joomla.other'), 'keep');
  values.set('supjx.smartbrowser.articles', 'new');
  assert.equal(resetPreferencesIfNeeded(storage, 'first'), false);
  assert.equal(values.get('supjx.smartbrowser.articles'), 'new');
  assert.equal(resetPreferencesIfNeeded(storage, 'second'), true);
  assert.equal(values.has('supjx.smartbrowser.articles'), false);
});

test('component options expose a reset control and browser token', async () => {
  const config = await readFile(new URL('../package/component/admin/config.xml', import.meta.url), 'utf8');
  const support = await readFile(new URL('../package/component/admin/src/Support/BrowserViewSupport.php', import.meta.url), 'utf8');
  assert.match(config, /name="preferences_reset_token" type="preferencesreset"/);
  assert.match(support, /'preferencesResetToken' =>/);
});
