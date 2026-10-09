import test from 'node:test';
import assert from 'node:assert/strict';
import { effectScope } from 'vue';
import { collectionEntries, referenceKey, resourceKey } from '../resources/js/core/selectionIdentity.js';
import { createCollectionState } from '../resources/js/core/collectionState.js';
import createBrowserState from '../resources/js/core/createBrowserState.js';
import { createSelectionUsage } from '../resources/js/core/selectionUsage.js';

const entry = (adapter, id = 'resource:1', usage = {}) => ({ selection: { adapter, id }, usage });
const resource = item => ({ id: item.selection.id, selection: item.selection, adapter: item.selection.adapter,
  selectionKey: referenceKey(item.selection), title: item.selection.adapter, type: 'article', kind: 'item', capabilities: { edit: true },
  selectionCapabilities: [{ key: 'example.label', type: 'string', editor: 'text', default: '' }] });

test('canonical collection identity includes adapter, strips resolved data and deduplicates only identical references', () => {
  const a = entry('articles'), b = entry('categories');
  assert.notEqual(referenceKey(a.selection), referenceKey(b.selection));
  assert.deepEqual(collectionEntries([a, b, a]), [a, b]);
  assert.deepEqual(collectionEntries([{ ...a, title: 'transient', image: 'transient' }]), [a]);
  assert.throws(() => collectionEntries([a, b], { homogeneous: true }));
  assert.throws(() => collectionEntries([a], { allowedAdapters: ['media'] }));
});

test('mixed collection uses the existing selection and ordering API, preserving independent usage and instances', async () => {
  const initial = [entry('articles', 'resource:1', { 'example.label': 'Article' }), entry('categories', 'resource:1', { 'example.label': 'Category' })];
  const requests = [], events = [];
  const api = { collection: async (items, options) => {
    requests.push(options);
    return options.operation === 'reorder' ? { items: [...items].reverse() } : { items, resources: items.map(resource) };
  } };
  const a = createCollectionState({ config: { items: initial }, api, notify: detail => events.push(detail) });
  const b = createCollectionState({ config: { items: initial, readOnly: true }, api, notify() {} });
  await a.refresh(); await b.refresh();
  a.browser.toggle(a.resources.value[0]);
  a.browser.state.sortBy = 'collectionOrder';
  await a.move('down');
  assert.deepEqual(requests.at(-1).selection, [referenceKey(initial[0].selection)]);
  assert.deepEqual(a.getItems(), [...initial].reverse());
  assert.deepEqual(b.getItems(), initial);
  a.remove([referenceKey(initial[0].selection)]);
  assert.deepEqual(a.getItems(), [initial[1]]);
  assert.equal(events.at(-1).reason, 'remove');
  a.destroy(); b.destroy();
});

test('homogeneous collections reject foreign additions, allow replacement after clearing, and remain opt-in', async () => {
  const model = createCollectionState({ config: { referenceItems: true, homogeneous: true, items: [entry('articles')] },
    api: { collection: async items => ({ items, resources: items.map(resource) }) }, notify() {} });
  await model.refresh();
  await assert.rejects(model.addItems([entry('media')]), /one adapter/);
  assert.deepEqual(model.getItems(), [entry('articles')]);
  await model.setItems([]); await model.addItems([entry('media')]);
  assert.deepEqual(model.getItems(), [entry('media')]); model.destroy();
});

test('usage-only updates keep selection/order controls stable without re-resolving resources', async () => {
  let requests = 0;
  const model = createCollectionState({ config: { referenceItems: true, items: [entry('articles')] },
    api: { collection: async items => { requests++; return { items, resources: items.map(resource) }; } }, notify() {} });
  await model.refresh(); model.browser.toggle(model.resources.value[0]);
  await model.setItems([entry('articles', 'resource:1', { 'example.label': 'Changed' })]);
  assert.equal(requests, 1); assert.equal(model.browser.state.selectedIds.length, 1);
  assert.equal(model.getItems()[0].usage['example.label'], 'Changed');
  model.destroy();
});

test('adapter browsing retains existing selection and focus, with homogeneous constraint applied only to additions', async () => {
  const oldWindow = globalThis.window;
  globalThis.window = { location: { href: 'https://example.test/' }, history: { replaceState() {} } };
  try {
    for (const homogeneous of [false, true]) {
      const scope = effectScope();
      const retained = entry('articles');
      const cached = resource(retained);
      const browser = scope.run(() => createBrowserState({
        options: { adapter: 'categories', mode: 'select', multiple: true, roots: [], actions: [],
          pickerContext: { collectionMode: true, homogeneous, getCollectionSnapshot: () => ({ items: [retained], resources: { [referenceKey(retained.selection)]: cached } }) } },
        api: { getResources: async () => ({ nodes: [], items: [{ id: 'resource:1', type: 'article', kind: 'item', selectable: true }], breadcrumb: [], actions: [] }) },
        persistence: { load: defaults => defaults, save() {} }, viewRegistry: { has: () => true },
      }));
      await browser.load('category:1');
      const next = browser.resources.value[0];
      assert.equal(next.selection.adapter, 'categories');
      assert.deepEqual(browser.state.selectedIds, [referenceKey(retained.selection)]);
      browser.focus(next); assert.equal(browser.focusedResource.value.id, 'resource:1');
      browser.toggle(next);
      assert.equal(browser.state.selectedIds.length, homogeneous ? 1 : 2);
      assert.equal(browser.focusedResource.value.selection.adapter, 'categories');
      await browser.load('category:2');
      assert.equal(browser.selection.value[0].selection.adapter, 'articles');
      browser.state.selectedIds = [];
      browser.toggle(browser.resources.value[0]);
      assert.equal(browser.state.selectedIds.length, 1);
      scope.stop();
    }
  } finally { globalThis.window = oldWindow; }
});

test('usage is scoped to canonical items, including unavailable references', async () => {
  const a = resource(entry('articles')), b = resource(entry('categories'));
  const missing = { ...resource(entry('media')), unavailable: true };
  const usage = createSelectionUsage({ profile: { 'example.label': {} }, initialUsage: { [resourceKey(missing)]: { 'example.label': 'Retained' } } });
  usage.set(a, 'example.label', 'A'); usage.set(b, 'example.label', 'B');
  const result = await usage.validate([a, b, missing]);
  assert.equal(result.valid, true);
  assert.deepEqual(result.usage, { [resourceKey(a)]: { 'example.label': 'A' }, [resourceKey(b)]: { 'example.label': 'B' }, [resourceKey(missing)]: { 'example.label': 'Retained' } });
});
