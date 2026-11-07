import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { personalKey, personalPreferences, personalContextItems, nodePreferenceKey, savePersonalPreferences } from '../resources/js/core/personalPreferences.js';
import { browserStateKey } from '../resources/js/services/PersistenceService.js';
import { createNodeHistory } from '../resources/js/core/nodeHistory.js';
import { createUserPreferenceStorage, preferenceStorage } from '../resources/js/core/userPreferences.js';
const memory = () => { const map = new Map(); return { getItem: key => map.get(key) ?? null, setItem: (key, value) => map.set(key, value), removeItem: key => map.delete(key), key: index => [...map.keys()][index] ?? null, get length() { return map.size; } }; };
test('personal preference translations retain UTF-8 Greek and plain ampersands', async () => {
  const server = await readFile(new URL('../package/component/admin/src/Support/UserViewPreferences.php', import.meta.url), 'utf8');
  const required = [...server.matchAll(/'(COM_SMARTBROWSER_PERSONAL_[A-Z_]+)'/g)].map(match => match[1]);
  for (const language of ['en-GB', 'el-GR']) {
    const ini = await readFile(new URL(`../package/component/admin/language/${language}/com_smartbrowser.ini`, import.meta.url), 'utf8');
    const entries = ini.split(/\r?\n/).filter(line => line.startsWith('COM_SMARTBROWSER_PERSONAL_'));
    assert.ok(entries.length > 0);
    const keys = new Set(entries.map(line => line.split('=')[0]));
    for (const key of required) assert.ok(keys.has(key), `Missing ${language} translation: ${key}`);
    assert.equal(new Set(entries.map(line => line.split('=')[0])).size, entries.length);
    for (const entry of entries) {
      assert.doesNotMatch(entry, /\?{2}|\uFFFD|&amp;/);
      if (language === 'el-GR') assert.match(entry.split('=')[1], /[\u0370-\u03ff]/);
    }
  }
});
test('picker appearance and location can have independent scopes, shared across applications', async () => {
  const storage = memory(), a = { adapter: 'media', mode: 'select', viewPreferenceKey: 'pdf', application: 'site' }, b = { ...a, application: 'administrator', viewPreferenceKey: 'thumbnail' };
  assert.notEqual(browserStateKey(a, storage), browserStateKey(b, storage));
  await savePersonalPreferences({ pickerNodeScope: 'adapter' }, storage);
  assert.equal(nodePreferenceKey(a, storage), nodePreferenceKey(b, storage));
  assert.notEqual(browserStateKey(a, storage), browserStateKey(b, storage));
  await savePersonalPreferences({ pickerNodeScope: 'adapter', pickerStateScope: 'adapter' }, storage);
  assert.equal(browserStateKey(a, storage), browserStateKey(b, storage));
  assert.notEqual(browserStateKey(a, storage), browserStateKey({ ...a, mode: 'manage' }, storage));
  assert.equal(browserStateKey({ ...a, adapter: 'flat-media' }, storage), browserStateKey(a, storage));
});
test('personal preferences discard unknown values and report persistence failures', async () => {
  const storage = memory(); storage.setItem(personalKey, '{"editorMode":"unexpected","pickerStateScope":"adapter"}');
  assert.equal(personalPreferences(storage).editorMode, 'inherit');
  assert.equal(personalPreferences(storage).pickerStateScope, 'adapter');
  storage.flush = async () => false;
  await assert.rejects(savePersonalPreferences({}, storage), /PERSONAL_SAVE_FAILED/);
});
test('contextual preferences are independent by resource type and retain older preferences', async () => {
  const storage = memory();
  storage.setItem(personalKey, JSON.stringify({ contextItems: 'show' }));
  const settings = personalPreferences(storage);
  assert.equal(personalContextItems(settings, 'categories'), 'show');
  settings.contextItemsByAdapter.menus = 'hide';
  settings.contextItemsByAdapter.tags = 'inherit';
  await savePersonalPreferences(settings, storage);
  const restored = personalPreferences(storage);
  assert.equal(personalContextItems(restored, 'flat-menus'), 'hide');
  assert.equal(personalContextItems(restored, 'categories'), 'show');
  assert.equal(personalContextItems(restored, 'tags'), 'inherit');
});
test('recent locations alternate on the main button and retain bounded full paths', () => {
  const storage = memory(), key = 'nodes'; const history = createNodeHistory(storage, key);
  const visit = id => history.visit(id, [{ id: 'root', title: 'Root' }, { id, title: id }]);
  visit('a'); visit('b'); visit('c');
  assert.equal(history.back().id, 'b'); visit('b');
  assert.equal(history.back().id, 'c'); visit('c');
  assert.equal(history.back().id, 'b');
  assert.equal(createNodeHistory(storage, key).previous().id, 'c');
  assert.equal(history.entries()[0].title, 'Root » c');
  for (let i = 0; i < 20; i++) visit(String(i));
  assert.equal(history.entries().length, 9);
  assert.equal(createNodeHistory(storage, key, 'unrelated-root').entries().length, 0);
});
test('per-user reset invalidates all keys and old tabs cannot repopulate them', async () => {
  const backing = memory(), sends = [];
  const storage = createUserPreferenceStorage({ storage: backing, context: { userId: 7, generation: 'a', values: {} }, schedule: () => 1, send: async payload => { sends.push(payload); return { generation: 'a:reset' }; } });
  storage.setItem('plugin.layout', 'saved');
  assert.deepEqual(await storage.reset(), { generation: 'a:reset' });
  storage.setItem('plugin.layout', 'stale');
  assert.equal(storage.getItem('plugin.layout'), null);
  assert.equal(await storage.flush(), false);
  assert.equal(sends.length, 1);
  assert.equal(sends[0].operation, 'reset');
});
test('an already open child picker adopts its parent reset instead of restoring stale state', async () => {
  const backing = memory(), context = { userId: 71, generation: 'one', values: {}, apiUrl: '/preferences', csrfToken: 'token' };
  const parent = { localStorage: backing, Joomla: { getOptions: () => context }, setTimeout: () => 1, addEventListener() {}, fetch: async () => ({ ok: true, json: async () => ({ success: true, data: { generation: 'one:reset' } }) }) };
  parent.parent = parent;
  const oldContext = { ...context };
  const child = { ...parent, parent, Joomla: { getOptions: () => oldContext } };
  const before = preferenceStorage(parent); before.setItem('custom.view', 'old');
  const after = await before.reset(); after.setItem('custom.view', 'new');
  assert.equal(preferenceStorage(child).getItem('custom.view'), 'new');
  assert.equal(preferenceStorage(parent).getItem('custom.view'), 'new');
});
test('saving while an automatic patch is in flight waits and sends the subsequent settings', async () => {
  let release; const requests = [];
  const storage = createUserPreferenceStorage({ storage: memory(), context: { userId: 8, generation: 'a', values: {} }, schedule: () => 1, send: payload => { requests.push(payload); return requests.length === 1 ? new Promise(resolve => { release = resolve; }) : Promise.resolve({ saved: true }); } });
  storage.setItem('custom.view', 'grid'); const first = storage.flush();
  const save = savePersonalPreferences({ pickerNodeScope: 'adapter' }, storage);
  release(); await first; await save;
  assert.equal(requests.length, 2);
  assert.equal(JSON.parse(requests[1].changes[personalKey]).pickerNodeScope, 'adapter');
});
