import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createCollectionState, collectionIdentifiers } from '../resources/js/core/collectionState.js';
import ResourceApi from '../resources/js/services/ResourceApi.js';
const resource = id => ({ id, title: id, kind: 'item', type: 'article', metadata: {}, capabilities: { edit: true } });
const result = ids => ({ identifiers: ids, resources: ids.map(resource), actions: [], presentation: {} });
const model = (options = {}, api = { collection: async ids => result(ids) }, notify = () => {}) => createCollectionState({ config: { adapter: 'articles', items: ['article:2', 'article:1'], ...options }, api, notify });

test('collections reuse browser selection, preserve host order and isolate instances', async () => {
  const changes = [], a = model({}, undefined, detail => changes.push(detail));
  const b = model({ adapter: 'media', items: ['local-images:/one.png'] });
  await a.refresh(); await b.refresh();
  assert.deepEqual(a.resources.value.map(r => r.id), ['article:2', 'article:1']);
  a.browser.toggle(a.resources.value[0]);
  assert.deepEqual(a.browser.state.selectedIds, ['article:2']);
  assert.deepEqual(b.browser.state.selectedIds, []);
  a.remove(['article:2']);
  assert.deepEqual(a.getItems(), ['article:1']);
  assert.deepEqual(b.getItems(), ['local-images:/one.png']);
  assert.equal(changes[0].reason, 'remove');
  assert.equal(changes[0].adapter, 'articles');
  a.destroy(); b.destroy();
});
test('collection ordering uses existing direction contract and never mutates Joomla resource order', async () => {
  const requests = [], changes = [];
  const a = model({}, { collection: async (ids, options) => {
    requests.push(options);
    return options?.operation === 'reorder' ? { items: [...ids].reverse() } : result(ids);
  } }, detail => changes.push(detail));
  await a.refresh();
  a.browser.state.sortBy = 'collectionOrder'; a.browser.state.sortDirection = 'desc';
  a.browser.toggle(a.browser.state.items[0]);
  await a.move('up');
  assert.equal(requests[1].direction, 'down');
  assert.equal(requests[1].operation, 'reorder');
  assert.deepEqual(a.getItems(), ['article:1', 'article:2']);
  assert.equal(changes[0].reason, 'reorder');
  a.browser.state.sortBy = 'title'; await a.move('up');
  assert.equal(requests.length, 2);
  a.destroy();
});
test('read-only and independently disabled remove/ordering cannot modify collection membership', async () => {
  for (const config of [{ readOnly: true }, { allowRemove: false, allowOrdering: false }]) {
    const a = model(config);
    await a.refresh(); a.remove(['article:2']); await a.move('down');
    assert.deepEqual(a.getItems(), ['article:2', 'article:1']);
    assert.equal(a.resources.value[0].selectable, false);
    a.destroy();
  }
});
test('missing references remain removable and external picker resources are accepted', async () => {
  const a = model({}, { collection: async ids => ({ ...result(ids), resources: ids.map(id => ({ ...resource(id), unavailable: true, title: 'Unavailable' })) }) });
  await a.setItems([{ id: 'article:9' }, { id: 'article:9' }, { id: 'article:3' }]);
  assert.deepEqual(a.getItems(), ['article:9', 'article:3']);
  assert.equal(a.browser.state.sortBy, 'collectionOrder');
  assert.equal(a.browser.state.sortDirection, 'asc');
  assert.equal(a.resources.value[0].capabilities.collectionRemove, true);
  a.remove(['article:9']); assert.deepEqual(a.getItems(), ['article:3']);
  a.destroy();
  assert.throws(() => collectionIdentifiers([{}]));
});
test('late resolve/reorder responses never overwrite newer external selections or destroyed instances', async () => {
  const pending = [];
  const a = model({}, { collection: ids => new Promise(resolve => pending.push({ ids, resolve })), destroy() {} });
  const first = a.refresh(), second = a.setItems(['article:8']);
  pending[1].resolve(result(pending[1].ids)); await second;
  pending[0].resolve(result(pending[0].ids)); await first;
  assert.deepEqual(a.getItems(), ['article:8']);
  const last = a.refresh(); a.destroy(); pending[2].resolve(result(['article:99'])); await last;
  assert.deepEqual(a.getItems(), ['article:8']);
});
test('request teardown aborts in-flight collection transports', async () => {
  const previous = globalThis.Joomla;
  let aborted = false;
  globalThis.Joomla = { request: () => ({ abort() { aborted = true; } }) };
  try {
    const api = new ResourceApi({});
    const request = api.request(new URL('https://example.test/'));
    api.destroy();
    await assert.rejects(request, /cancelled/);
    assert.equal(aborted, true); assert.equal(api.pending.size, 0);
  } finally { globalThis.Joomla = previous; }
});
test('public embedded API has no browser mount or singleton instance assumptions', async () => {
  const source = await readFile(new URL('../resources/js/collection.js', import.meta.url), 'utf8');
  const view = await readFile(new URL('../resources/js/components/CollectionView.vue', import.meta.url), 'utf8');
  assert.match(source, /new WeakMap/); assert.match(source, /export function mountCollection/);
  for (const method of ['setItems', 'getItems', 'refresh', 'destroy']) assert.match(source, new RegExp(method));
  assert.match(source, /smartbrowser:collection-change/);
  assert.doesNotMatch(view, /ResourceTree|ResourceBreadcrumb|browseRoot/);
  for (const component of ['ResourceGrid', 'ResourceDetails', 'ResourceOrderingControls']) assert.match(view, new RegExp(component));
});
