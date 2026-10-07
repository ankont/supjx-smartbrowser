import assert from 'node:assert/strict';
import test from 'node:test';
import { effectScope, nextTick } from 'vue';
import { readFile } from 'node:fs/promises';
import { applicableCapabilities, createSelectionUsage, normalizeReference, valueError } from '../resources/js/core/selectionUsage.js';
import createBrowserState from '../resources/js/core/createBrowserState.js';

const image = id => ({ id, kind: 'item', type: 'image', selectable: true, focusable: true, bulkSelectable: true, selectionCapabilities: [
  { key: 'media.alt', type: 'string', editor: 'text', default: '', validation: { maxLength: 100 } },
  { key: 'media.decorative', type: 'boolean', editor: 'boolean', default: false },
  { key: 'media.loading', type: 'string', editor: 'select', default: 'auto', options: [{ value: 'auto' }, { value: 'lazy' }, { value: 'eager' }] },
] });
const pdf = id => ({ id, kind: 'item', type: 'document', selectionCapabilities: [
  { key: 'media.thumbnailOverride', type: 'resource', editor: 'resource', default: null, picker: { adapter: 'media', selectionTarget: 'item', allowedResourceTypes: ['image'] } },
] });

test('capabilities intersect the profile per resource, with no media-specific core cases', async () => {
  const resource = image('file:1');
  assert.deepEqual(applicableCapabilities(resource), []);
  assert.deepEqual(applicableCapabilities(resource, { 'other.unknown': {}, 'media.alt': false }), []);
  const definitions = applicableCapabilities(resource, { 'media.alt': { required: true, default: 'Label', presentation: 'secondary' } });
  assert.equal(definitions.length, 1);
  assert.equal(definitions[0].default, 'Label');
  assert.equal(definitions[0].required, true);
  assert.equal(definitions[0].presentation, 'secondary');
  assert.deepEqual(applicableCapabilities(pdf('file:2'), { 'media.alt': {} }), []);
  assert.deepEqual(applicableCapabilities({ ...resource, unavailable: true }, { 'media.alt': {} }), []);
  const core = await readFile(new URL('../resources/js/core/selectionUsage.js', import.meta.url), 'utf8');
  assert.doesNotMatch(core, /media\.|application\/pdf|article|excerpt/);
});

test('initial usage wins over profile defaults and stays isolated without mutating resources', async () => {
  const a = image('file:a'), b = image('file:b');
  const original = JSON.stringify(a);
  const model = createSelectionUsage({ profile: { 'media.alt': { default: 'Default' }, 'media.loading': {} }, initialUsage: { [a.id]: { 'media.alt': 'Existing', 'ignored.key': 'Ignored' } } });
  assert.equal(model.get(a)['media.alt'], 'Existing');
  assert.equal(model.get(b)['media.alt'], 'Default');
  model.set(a, 'media.alt', 'Changed'); model.set(a, 'ignored.key', 'Cannot add');
  assert.equal(model.get(b)['media.alt'], 'Default');
  const returned = model.get(a); returned['media.alt'] = 'Cannot mutate';
  const result = await model.validate([b, a]);
  assert.equal(result.valid, true);
  assert.equal(result.usage[a.id]['media.alt'], 'Changed');
  assert.equal(result.usage[a.id]['ignored.key'], undefined);
  assert.equal(JSON.stringify(a), original);
  assert.equal(createSelectionUsage({ profile: { 'media.alt': {} } }).get(a)['media.alt'], '');
});

test('generic validation supports required, type, options and non-weakening profile constraints', async () => {
  const model = createSelectionUsage({ profile: { 'media.alt': { required: true, constraints: { maxLength: 4 } }, 'media.loading': {} } });
  const resource = image('a');
  assert.equal((await model.validate([resource])).valid, false);
  for (const value of ['    ', 4, 'Long label']) {
    model.set(resource, 'media.alt', value);
    assert.equal((await model.validate([resource])).valid, false);
  }
  model.set(resource, 'media.alt', 'OK'); model.set(resource, 'media.loading', 'invalid');
  assert.equal((await model.validate([resource])).valid, false);
  model.set(resource, 'media.loading', 'eager');
  assert.equal((await model.validate([resource])).valid, true);
  assert.ok(valueError({ type: 'number', validation: { min: 1, max: 5, integer: true } }, 2.5));
  assert.ok(valueError({ type: 'boolean' }, 'false'));
  assert.ok(valueError({ type: 'string', validation: { pattern: '^a+$' } }, 'b'));
  assert.ok(valueError({ type: 'string', validation: { maxLength: 3 }, policy: { constraints: { maxLength: 100 } } }, '1234'));
});

test('PDF thumbnail references resolve through the adapter and return identity only', async () => {
  const calls = [];
  let resolved = image('files:/cover.jpg');
  const model = createSelectionUsage({ profile: { 'media.thumbnailOverride': {} }, resolveReference: async (ref, constraint) => { calls.push({ ref, constraint }); return resolved; } });
  const a = pdf('file:a'), b = pdf('file:b');
  model.set(a, 'media.thumbnailOverride', { adapter: 'media', id: 'files:/cover.jpg', title: 'Not retained', html: '<img>' });
  const result = await model.validate([a, b]);
  assert.equal(result.valid, true);
  assert.deepEqual(result.usage[a.id]['media.thumbnailOverride'], { adapter: 'media', id: 'files:/cover.jpg' });
  assert.equal(result.usage[b.id]['media.thumbnailOverride'], null);
  assert.equal(calls[0].constraint.allowedResourceTypes[0], 'image');
  for (const invalid of [{ ...resolved, type: 'document' }, { ...resolved, kind: 'node' }, { ...resolved, unavailable: true }, { ...resolved, selectable: false }]) {
    resolved = invalid;
    assert.equal((await model.validate([a])).valid, false);
  }
  model.set(a, 'media.thumbnailOverride', { adapter: 'articles', id: 'article:1' });
  assert.equal((await model.validate([a])).valid, false);
  model.set(a, 'media.thumbnailOverride', null);
  assert.equal((await model.validate([a])).valid, true);
  assert.equal(normalizeReference({ adapter: 'media', id: 'a', image: 'url' }).image, undefined);
});

test('other adapters and custom editors use the same contracts', async () => {
  const resource = { id: 'article:1', selectionCapabilities: [{ key: 'example.label', type: 'string', editor: 'textarea', default: 'Article label' }, { key: 'example.rating', type: 'number', editor: 'example.rating', default: 2 }] };
  const profile = { 'example.label': {}, 'example.rating': { presentation: 'secondary' } };
  const missing = createSelectionUsage({ profile });
  assert.equal((await missing.validate([resource])).valid, false);
  const model = createSelectionUsage({ profile, editors: { 'example.rating': { validate: value => value > 3 ? 'Invalid' : null } } });
  assert.equal((await model.validate([resource])).valid, true);
  model.set(resource, 'example.rating', 5);
  assert.equal((await model.validate([resource])).valid, false);
});

test('profile selection stays ordered across navigation, and focus does not select', async () => {
  globalThis.window = { location: { href: 'https://example.test/index.php' }, history: { replaceState() {} } };
  globalThis.Joomla = { renderMessages() {} };
  const a = image('file:a'), b = image('file:b');
  const defaults = { mode: 'select', multiple: true, roots: [{ id: 'root' }], actions: [], selectionTarget: 'item' };
  const saves = [];
  const scope = effectScope();
  const browser = scope.run(() => createBrowserState({ options: { ...defaults, pickerContext: { selectionProfile: { 'media.alt': {} } } },
    api: { getResources: async id => ({ nodes: [], items: id === 'second' ? [b] : [a], actions: [], breadcrumb: [] }) },
    persistence: { load: value => ({ ...value, showInfo: false }), save: state => saves.push(state.showInfo) }, viewRegistry: { has: () => true } }));
  await browser.load(); browser.focus(browser.resources.value[0]);
  assert.equal(browser.selection.value.length, 0);
  browser.toggle(browser.resources.value[0]); await browser.load('second'); browser.toggle(browser.resources.value[0]);
  assert.deepEqual(browser.selection.value.map(resource => resource.id), [a.id, b.id]);
  assert.equal(browser.state.showInfo, false);
  await nextTick(); assert.ok(saves.every(value => value === false)); scope.stop();
  const legacyScope = effectScope();
  const legacy = legacyScope.run(() => createBrowserState({ options: { ...defaults, pickerContext: { selectionProfile: {} } }, api: { getResources: async () => ({ nodes: [], items: [a], actions: [], breadcrumb: [] }) }, persistence: { load: value => value, save() {} }, viewRegistry: { has: () => true } }));
  await legacy.load(); legacy.toggle(legacy.resources.value[0]); await legacy.load();
  assert.equal(legacy.selection.value.length, 0); legacyScope.stop();
});
