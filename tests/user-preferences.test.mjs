import test from 'node:test';
import assert from 'node:assert/strict';
import { createUserPreferenceStorage } from '../resources/js/core/userPreferences.js';
import { execFileSync } from 'node:child_process';
test('server preferences validate bounded UI values and bind writes to the authenticated actor', () => {
  assert.match(execFileSync('php', ['tests/user-preferences.php'], { encoding: 'utf8' }), /authenticated-actor binding OK/);
});
const storage = () => { const values = new Map(); return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key), key: index => [...values.keys()][index] ?? null, get length() { return values.size; } }; };
const create = (backing, userId, generation, values, send) => createUserPreferenceStorage({ storage: backing, context: { userId, generation, values }, send, schedule: () => 1 });

test('UI state persists locally and to the user, with isolated accounts and remote restoration', async () => {
  const backing = storage(), remote = {};
  const preferences = create(backing, 1, 'a', {}, async ({ changes }) => Object.assign(remote, changes));
  preferences.setItem('supjx.smartbrowser.articles', '{"showInfo":true}');
  preferences.setItem('myplugin.selection.single-layout', '{"listOpen":false}');
  assert.equal(preferences.getItem('supjx.smartbrowser.articles'), '{"showInfo":true}');
  await preferences.flush();
  assert.equal(remote['myplugin.selection.single-layout'], '{"listOpen":false}');
  assert.equal(create(backing, 2, 'a', {}, async () => {}).getItem('supjx.smartbrowser.articles'), null);
  assert.equal(create(storage(), 1, 'a', remote, async () => {}).getItem('supjx.smartbrowser.articles'), '{"showInfo":true}');
});

test('reset generations cover every UI key and discard stale offline patches', async () => {
  const backing = storage();
  const preferences = create(backing, 1, 'a', {}, async () => { throw new Error('offline'); });
  for (const key of ['supjx.smartbrowser.articles', 'smartbrowser.editorMaximized', 'smartbrowser.pickerMaximized', 'smartbrowser.displayMode', 'custom.selection']) preferences.setItem(key, 'old');
  await preferences.flush();
  const reset = create(backing, 1, 'b', {}, async () => {});
  assert.equal(reset.length, 0);
  reset.setItem('custom.selection', 'new');
  await reset.flush();
  assert.equal(reset.getItem('custom.selection'), 'new');
});

test('unsent preferences survive reload and stale tabs cannot repopulate a reset profile', async () => {
  const backing = storage();
  const offline = create(backing, 1, 'a', {}, async () => { throw new Error('offline'); });
  offline.setItem('custom.selection', 'remember'); await offline.flush();
  const sent = [];
  const restored = create(backing, 1, 'a', {}, async payload => sent.push(payload));
  assert.equal(restored.getItem('custom.selection'), 'remember'); await restored.flush(); assert.equal(sent.length, 1);
  const stale = create(backing, 1, 'a', {}, async () => { throw Object.assign(new Error('reset'), { status: 409 }); });
  stale.setItem('custom.selection', 'stale'); await stale.flush();
  stale.setItem('custom.selection', 'still stale');
  assert.equal(stale.getItem('custom.selection'), null);
});

test('an old in-flight tab cannot erase the new reset generation cache', async () => {
  const backing = storage(); let reject;
  const old = create(backing, 1, 'a', {}, () => new Promise((_, fail) => { reject = fail; }));
  old.setItem('custom.selection', 'old'); const request = old.flush();
  const fresh = create(backing, 1, 'b', {}, async () => {}); fresh.setItem('custom.selection', 'new');
  reject(Object.assign(new Error('reset'), { status: 409 })); await request;
  old.setItem('custom.selection', 'stale');
  assert.equal(fresh.getItem('custom.selection'), 'new');
});

test('blocked local storage does not break the view or prevent saving user preferences', async () => {
  const blocked = { getItem() { throw Error('blocked'); }, setItem() { throw Error('quota'); }, removeItem() { throw Error('blocked'); }, get length() { throw Error('blocked'); } };
  const patches = [];
  const preferences = create(blocked, 1, 'a', {}, async payload => patches.push(payload));
  preferences.setItem('custom.selection', 'details');
  assert.equal(preferences.getItem('custom.selection'), 'details');
  await preferences.flush(); assert.equal(patches[0].changes['custom.selection'], 'details');
});
