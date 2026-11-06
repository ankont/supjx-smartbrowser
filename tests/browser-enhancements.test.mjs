import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import MediaActionDriver from '../resources/js/adapters/MediaActionDriver.js';

test('default browsing states include archives but never force trashed resources into a default view', () => {
  assert.match(execFileSync('php', ['tests/browser-defaults.php'], { encoding: 'utf8' }), /exclude trashed OK/);
});

test('Options place background inside Thumbnail options and reset help in its own group', () => {
  const xml = readFileSync('package/component/admin/config.xml', 'utf8');
  assert.match(xml, /name="image_background" fieldset="thumbnail_options"/);
  assert.doesNotMatch(xml, /name="context"[^>]*description=/);
  assert.match(xml, /name="preferences_display"[^>]*description="COM_SMARTBROWSER_RESET_PREFERENCES_DESC"/);
  for (const state of ['published', 'unpublished', 'archived', 'trashed']) assert.match(xml, new RegExp(`name="default_${state}" type="radio" layout="joomla.form.field.radio.switcher"`));
});

test('successful media uploads select all new files after refreshing the view', async () => {
  const previous = globalThis.Joomla;
  globalThis.Joomla = { renderMessages() {} };
  try {
    for (const collectionMode of [false, true]) {
      const state = { busy: false, selectedNode: 'local-images:/', selectedIds: ['old'] };
      const api = { options: { adapter: 'media', pickerContext: { collectionMode } }, execute: async (action, ids, payload) => ({ id: `local-images:/${payload.name}` }) };
      const driver = new MediaActionDriver(api, state, async () => { state.selectedIds = []; }, key => key);
      driver.read = async () => 'encoded';
      await driver.uploadFiles([{ name: 'a.png' }, { name: 'b.png' }]);
      const expected = ['local-images:/a.png', 'local-images:/b.png'].map(id => collectionMode ? JSON.stringify(['media', id]) : id);
      assert.deepEqual(state.selectedIds, expected);
      assert.equal(state.focusedId, expected[1]);
      assert.deepEqual(state.revealIds, expected);
      assert.equal(state.busy, false);
    }
  } finally { globalThis.Joomla = previous; }
});

test('Paste has no nested form or item context-menu command and embedded controls load Cancel', () => {
  const view = readFileSync('resources/js/components/CollectionView.vue', 'utf8');
  assert.doesNotMatch(view, /<form/);
  assert.doesNotMatch(view, /id: 'collectionImport'/);
  assert.match(view, /type="button"[^>]*@click="importAddressText"/);
  assert.match(readFileSync('package/component/admin/src/Support/CollectionViewSupport.php', 'utf8'), /'JCANCEL'/);
});

test('upload selection and reveal respect single selection and caller limits', async () => {
  const previous = globalThis.Joomla;
  globalThis.Joomla = { renderMessages() {} };
  try {
    for (const options of [
      { mode: 'select', multiple: false },
      { mode: 'select', multiple: true, maxSelections: 1 },
      { mode: 'select', multiple: true, pickerContext: { maxSelections: 1 } },
    ]) {
      const state = { selectedNode: 'local-images:/' };
      const api = { options, execute: async (action, ids, payload) => ({ id: payload.name }) };
      const driver = new MediaActionDriver(api, state, async () => {}, key => key);
      driver.read = async () => 'encoded';
      await driver.uploadFiles([{ name: 'first.png' }, { name: 'second.png' }]);
      assert.deepEqual(state.selectedIds, ['first.png']);
      assert.deepEqual(state.revealIds, ['first.png']);
      assert.equal(state.focusedId, 'first.png');
    }
  } finally { globalThis.Joomla = previous; }
});
