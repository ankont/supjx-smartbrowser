import test from 'node:test';
import assert from 'node:assert/strict';
import { createCollectionPicker } from '../resources/js/core/collectionPicker.js';
import { referenceKey } from '../resources/js/core/selectionIdentity.js';

const entry = (id, usage = {}) => ({ selection: { adapter: 'articles', id: `article:${id}` }, usage });
function setup(overrides = {}) {
  let items = [entry(1, { 'ext.example.data': { keep: true } }), entry(2)];
  const calls = [], changes = [], options = [];
  const model = { revision: { value: 0 }, browser: { state: {} }, getItems: () => structuredClone(items),
    async setItems(next, detail) { items = structuredClone(next); this.revision.value++; changes.push(detail); } };
  const config = { adapter: 'articles', allowedAdapters: ['articles'], multiple: true, selectionTarget: 'item', maxSelections: 4, ...overrides };
  let result = { items: [entry(3)] }, disposed = false;
  const picker = createCollectionPicker({ config, model,
    api: { async collection(next) { calls.push(next); return { resources: next.map(item => ({ ...item.selection, selection: item.selection, selectionKey: referenceKey(item.selection), type: 'article', kind: 'item' })) }; } },
    open: async value => { options.push(value); return typeof result === 'function' ? result() : result; }, isDisposed: () => disposed });
  return { picker, config, model, options, changes, calls, result: value => { result = value; }, dispose: () => { disposed = true; } };
}

test('shared Add opens empty, appends new identities and emits one complete selection change', async () => {
  const f = setup();
  const before = f.model.getItems();
  f.result({ items: [entry(1), entry(3)] });
  await f.picker.add();
  assert.deepEqual(f.options[0].initialCollection, []);
  assert.equal(f.options[0].maxSelections, 2);
  assert.deepEqual(f.model.getItems(), [...before, entry(3)]);
  assert.equal(f.changes.length, 1);
  assert.equal(f.changes[0].reason, 'add');
});

test('shared Replace opens the full selection, focuses the current reference and commits the returned order', async () => {
  const f = setup();
  f.result({ items: [entry(2), entry(3)] });
  await f.picker.editSelection({ selection: entry(2).selection, id: 'article:2', parentId: 'category:9' });
  assert.equal(f.options[0].initialCollection.length, 2);
  assert.deepEqual(f.options[0].initialFocus, entry(2).selection);
  assert.equal(f.options[0].initialInfoOpen, true);
  assert.equal(f.options[0].multiple, true);
  assert.equal(f.options[0].initialNode, 'category:9');
  assert.deepEqual(f.model.getItems(), [entry(2), entry(3)]);
  assert.equal(f.changes[0].reason, 'replace');
});

test('cancellation, disposed collections and readonly collections do not commit', async () => {
  const f = setup(); f.result(null); await f.picker.add(); assert.equal(f.changes.length, 0);
  f.dispose(); await f.picker.add(); assert.equal(f.options.length, 1);
  const readonly = setup({ readOnly: true }); await readonly.picker.add(); assert.equal(readonly.options.length, 0);
});

test('stale, disallowed and over-limit results leave the current selection untouched', async () => {
  const f = setup(); const before = f.model.getItems();
  f.result(() => { f.model.revision.value++; return { items: [entry(3)] }; });
  await assert.rejects(f.picker.add(), /Selection changed/);
  f.result({ items: [{ selection: { adapter: 'media', id: 'image:1' }, usage: {} }] });
  await assert.rejects(f.picker.add(), /Invalid/);
  f.result({ items: [entry(3), entry(4), entry(5)] });
  await assert.rejects(f.picker.add(), /limit/);
  assert.deepEqual(f.model.getItems(), before);
  assert.equal(f.changes.length, 0);
});
