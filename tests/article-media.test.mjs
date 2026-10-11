import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import createBrowserState from '../resources/js/core/createBrowserState.js';
import { collectionEntries } from '../resources/js/core/selectionIdentity.js';
import vm from 'node:vm';

test('native article storage bridge preserves slots, usage and unsupported legacy values', () => {
  assert.match(execFileSync('php', ['tests/article-media-selection.php'], { encoding: 'utf8' }), /bridge and bounded collections OK/);
  assert.match(execFileSync('php', ['tests/media-selection-capabilities.php'], { encoding: 'utf8' }), /selection capabilities OK/);
  const admin = readFileSync('package/component/site/tmpl/editor/article-admin.php', 'utf8');
  const site = readFileSync('package/component/site/tmpl/editor/article-site.php', 'utf8');
  for (const layout of [admin, site]) assert.ok(layout.includes("require __DIR__ . '/article-media.php'"));
  const bridge = readFileSync('resources/js/article-media.js', 'utf8');
  assert.match(bridge, /if \(request !== generation\) return/);
  assert.match(bridge, /if \(pending \|\| failed\)/);
  const partial = readFileSync('package/component/site/tmpl/editor/article-media.php', 'utf8');
  assert.match(partial, /<input type="hidden" data-sb-value value=/);
  assert.doesNotMatch(partial, /name="[^"]*selection/);
});

test('image selection retains and refreshes the native preview wrapper', async () => {
  let change, previews = 0;
  const upload = {}, toolbarButtons = [];
  let observeChanges;
  class MutationObserver { constructor(callback) { observeChanges = callback; } observe() {} disconnect() {} }
  const events = [], hidden = [];
  const media = { classList: { add() {} }, querySelectorAll: () => [upload], updatePreview: () => previews++, dispatchEvent: event => events.push(event) };
  const names = ['image_intro', 'image_intro_alt', 'image_intro_alt_empty', 'image_intro_caption', 'float_intro'];
  const fields = Object.fromEntries(names.map(name => [name, {
    tagName: 'INPUT', type: name.endsWith('_empty') ? 'checkbox' : 'text', value: 'original',
    closest: selector => selector === 'joomla-field-media' ? media : { classList: { add() {} }, setAttribute: () => hidden.push(name) },
    dispatchEvent() {},
  }]));
  const form = { elements: { namedItem: name => fields[/\[([^\]]+)\]$/.exec(name)[1]] }, addEventListener() {} };
  const selection = { adapter: 'media', id: 'local-files:/images/photo.jpg' };
  const input = { form, value: JSON.stringify({ items: [{ selection }] }), addEventListener: (_, fn) => { change = fn; } };
  const root = { dataset: { sbArticleMedia: JSON.stringify({ group: 'images', role: 'intro' }), sbField: '{}' }, querySelector: () => input };
  class ResourceApi { async collection() { return { resources: [{ selection }] }; } }
  class CustomEvent extends Event { constructor(type, options) { super(type, options); this.detail = options.detail; } }
  vm.runInNewContext(readFileSync('resources/js/article-media.js', 'utf8').replace(/^import .*;\s*/gm, '').replace(/^export /gm, ''), {
    mountSelectionField: () => ({ addToolbarButton: button => { if (!toolbarButtons.includes(button)) toolbarButtons.push(button); } }), ResourceApi, JSON, Map, Event, CustomEvent, MutationObserver,
    document: { querySelectorAll: () => [root] },
    window: { addEventListener() {}, SmartBrowserMediaValue: { format: () => 'images/photo.jpg' } },
    Joomla: { renderMessages() {} },
  });
  assert.deepEqual(hidden, names.slice(1), 'The native image control group must remain visible');
  assert.deepEqual(toolbarButtons, [upload], 'Move the actual upload button, retaining its handlers');
  observeChanges();
  assert.equal(toolbarButtons.length, 1, 'Late initialization must not duplicate the upload control');
  await change();
  assert.equal(previews, 1);
  assert.equal(media.validatedUrl, 'images/photo.jpg');
  assert.equal(events[0].detail.value, 'images/photo.jpg');
  input.value = '{"items":[]}';
  await change();
  assert.equal(previews, 2);
  assert.equal(media.validatedUrl, '');
});

test('maximum selections applies to ordinary selection, select-all, inversion and entry validation', () => {
  const browser = createBrowserState({ options: { roots: [{ id: 'root' }], mode: 'select', multiple: true, maxSelections: 3 }, api: {},
    persistence: { load: defaults => defaults, save() {} }, viewRegistry: { has: () => true } });
  const items = [1, 2, 3, 4].map(id => ({ id: `item:${id}`, kind: 'item', type: 'uri', selectable: true, title: String(id) }));
  browser.state.items = items;
  items.forEach(item => browser.toggle(item));
  assert.equal(browser.state.selectedIds.length, 3);
  browser.state.selectedIds = [];
  browser.selectAll();
  assert.equal(browser.state.selectedIds.length, 3);
  browser.selectAll();
  assert.equal(browser.state.selectedIds.length, 0, 'A full bounded selection must still toggle off');
  browser.state.selectedIds = [];
  browser.invertSelection();
  assert.equal(browser.state.selectedIds.length, 3);
  const refs = items.map(item => ({ selection: { adapter: 'direct-links', id: item.id } }));
  assert.throws(() => collectionEntries(refs, { maxSelections: 3 }), /limit/);
  assert.equal(collectionEntries(refs.slice(0, 3), { maxSelections: 3 }).length, 3);
});

test('editor bridge writes only native fields, preserves target zero and ignores stale resolution', async () => {
  const listeners = {}, formListeners = {}, requests = [], messages = [];
  const mapping = { group: 'urls', slots: ['a', 'b', 'c'] };
  const fields = Object.fromEntries(mapping.slots.flatMap(slot => ['url', 'text', 'target'].map(kind => {
    const name = kind === 'text' ? `url${slot}text` : `${kind}${slot}`;
    return [name, { tagName: 'INPUT', type: 'text', value: 'original', closest: () => ({ setAttribute() {} }), dispatchEvent() {} }];
  })));
  const form = { elements: { namedItem: name => fields[/\[([^\]]+)\]$/.exec(name)[1]] }, addEventListener: (name, fn) => { formListeners[name] = fn; } };
  const input = { value: '', form, addEventListener: (name, fn) => { listeners[name] = fn; } };
  const root = { dataset: { sbArticleMedia: JSON.stringify(mapping), sbField: '{}' }, querySelector: () => input };
  class ResourceApi { collection() { return new Promise((resolve, reject) => requests.push({ resolve, reject })); } }
  const source = readFileSync('resources/js/article-media.js', 'utf8').replace(/^import .*;\s*/gm, '').replace(/^export /gm, '');
  vm.runInNewContext(source, { mountSelectionField() {}, ResourceApi, JSON, Map, Event,
    document: { querySelectorAll: () => [root], querySelector: () => null },
    window: { addEventListener() {} }, Joomla: { Text: { _: key => key }, renderMessages: message => messages.push(message) } });
  assert.equal(fields.urla.value, 'original', 'Opening must not rewrite native slots');
  const entry = uri => ({ selection: { adapter: 'direct-links', id: uri }, usage: { 'link.text': 'Name', 'link.target': '0' } });
  const resolve = (request, uri) => request.resolve({ resources: [{ selection: entry(uri).selection, metadata: { url: uri }, type: 'uri' }] });
  input.value = JSON.stringify({ items: [entry('/old')] });
  const old = listeners.change();
  let blocked = false;
  formListeners.submit({ preventDefault: () => { blocked = true; } });
  assert.equal(blocked, true, 'Pending metadata must block save');
  input.value = JSON.stringify({ items: [entry('/new')] });
  const next = listeners.change();
  resolve(requests[1], '/new'); await next;
  resolve(requests[0], '/old'); await old;
  assert.equal(fields.urla.value, '/new');
  assert.equal(fields.urlatext.value, 'Name');
  assert.equal(fields.targeta.value, '0');
  assert.equal(fields.urlb.value, '');
  input.value = JSON.stringify({ items: [entry('/bad')] });
  const failed = listeners.change(); requests[2].reject(new Error('Unavailable')); await failed;
  blocked = false; formListeners.submit({ preventDefault: () => { blocked = true; } });
  assert.equal(blocked, true);
  assert.equal(fields.urla.value, '/new', 'Failed lookup must not erase stored native values');
  formListeners.reset();
  blocked = false; formListeners.submit({ preventDefault: () => { blocked = true; } });
  assert.equal(blocked, false);
});
