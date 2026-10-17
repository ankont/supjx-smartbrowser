import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { selectionPaths, selectedPresentation, selectionUri, selectionPanelPosition, selectionColumns, canAddSelection } from '../resources/js/core/selectedPresentation.js';
import { createResourceClickGuard } from '../resources/js/core/resourceClickGuard.js';
import { createCollectionState } from '../resources/js/core/collectionState.js';
import { referenceKey } from '../resources/js/core/selectionIdentity.js';
const read = path => readFileSync(path, 'utf8');

test('selection position hints belong to gallery navigation rather than resource titles', () => {
  const info = read('resources/js/components/ResourceInfoPanel.vue');
  assert.ok(!info.includes('selectionPosition'));
  assert.match(info, /class="sb-reference-readonly" readonly aria-readonly="true"/);
  const view = read('resources/js/components/CollectionView.vue');
  assert.ok(!view.includes(':selection-position'));
  assert.match(view, /activeIndex > 0" aria-hidden="true">{{ activeIndex }}/);
  assert.match(view, /aria-hidden="true">{{ activeIndex \+ 2 }}/);
});
test('Joomla selection controls validate presentation settings independently of storage', () => {
  assert.match(execFileSync('php', ['tests/selected-resource-config.php'], { encoding: 'utf8' }), /options OK/);
});

test('selection projection keeps adapter paths, custom thumbnail and status without browser metadata columns', () => {
  const resource = { id: 'article:1', title: 'Article', type: 'article', effectiveThumbnail: '/cover.jpg', metadata: { categoryPath: 'Library / Sources', tagPaths: ['Grade / A', 'Theme / B'], mimeType: 'text/html', size: 500 }, infoFields: [
    { source: 'metadata.categoryPath', label: 'Category' }, { source: 'metadata.tagPaths', label: 'Tags' }, { source: 'metadata.size', label: 'Size' },
  ] };
  assert.deepEqual(selectionPaths(resource).map(path => path.value), ['Library / Sources', ['Grade / A', 'Theme / B']]);
  const projected = selectedPresentation(resource);
  assert.equal(projected.image, '/cover.jpg');
  assert.equal(projected.selectionPath, 'article:1');
  assert.deepEqual(selectionColumns.map(column => column.id), ['title', 'selectionPath', 'status']);
  assert.equal(selectionPaths({ id: 'uri:123', metadata: {} })[0].value, 'uri:123');
});

test('Add respects single selection, read-only and multiple limit', () => {
  const config = { multiple: false, onAdd() {} };
  assert.equal(canAddSelection(config, 0), true);
  assert.equal(canAddSelection(config, 1), false);
  assert.equal(canAddSelection({ ...config, readOnly: true }, 0), false);
  assert.equal(canAddSelection({ ...config, multiple: true, maxSelections: 3 }, 2), true);
  assert.equal(canAddSelection({ ...config, multiple: true, maxSelections: 3 }, 3), false);
});
test('panel placement respects explicit top/bottom and adapts side panels to the control width', () => {
  assert.equal(selectionPanelPosition('auto', 1000), 'right');
  assert.equal(selectionPanelPosition('auto', 500), 'bottom');
  assert.equal(selectionPanelPosition('top', 300), 'top');
  assert.equal(selectionPanelPosition('bottom', 1000), 'bottom');
  assert.equal(selectionPanelPosition('left', 900), 'left');
  assert.equal(selectionPanelPosition('right', 900), 'right');
  assert.equal(selectionPanelPosition('left', 300), 'bottom');
});
test('media URI uses the native formatter once instead of concatenating unrelated paths', () => {
  globalThis.SmartBrowserMediaValue = { format(resource, representation) { assert.equal(representation, 'joomla'); return 'images/photo.jpg#joomlaImage://local-images/photo.jpg?width=100'; } };
  try {
    const resource = { adapter: 'media', type: 'image', id: 'local-images:/photo.jpg', parentId: 'local-images:/', metadata: { url: 'https://site.test/images/photo.jpg' } };
    assert.equal(selectionUri(resource), 'images/photo.jpg#joomlaImage://local-images/photo.jpg?width=100');
    assert.equal(selectedPresentation(resource).selectionPath, selectionUri(resource));
  } finally { delete globalThis.SmartBrowserMediaValue; }
});
test('external toolbar belongs to the items region, while Information visuals reuse ResourceVisual', () => {
  const view = read('resources/js/components/CollectionView.vue');
  assert.ok(view.indexOf('class="sb-selected-items"') < view.indexOf('<header class="resource-toolbar sb-collection-toolbar">'));
  assert.match(read('resources/js/components/LightweightResourceVisual.vue'), /ResourceVisual v-if="!contentOnly"/);
  assert.doesNotMatch(read('resources/js/components/ResourceGrid.vue'), /selectionPresentation/);
  assert.doesNotMatch(read('package/component/media/css/smartbrowser.css'), /resource-column-label > \.fas \{ display: none/);
});
test('all published asset URLs and ESM imports are versioned together', () => {
  const version = JSON.parse(read('package.json')).version;
  const registry = JSON.parse(read('package/component/media/joomla.asset.json'));
  assert.equal(registry.version, version);
  assert.ok(registry.assets.every(asset => asset.version === version));
  assert.match(read('package/component/media/js/selection-field.js'), new RegExp('\\?v=' + version.replaceAll('.', '\\.')));
});

test('double-click guard rejects a different target after the first click but keeps keyboard activation', () => {
  const guard = createResourceClickGuard();
  guard.click('a', { detail: 1 });
  guard.click('b', { detail: 2 });
  assert.equal(guard.accepts('b', { type: 'dblclick' }), false);
  assert.equal(guard.accepts('a', { type: 'dblclick' }), true);
  assert.equal(guard.accepts('b', { type: 'keydown' }), true);
});

test('external usage updates notify without resolving again, preserve siblings and unknown stored usage', async () => {
  const entries = ['article:1', 'article:2'].map(id => ({ selection: { adapter: 'articles', id }, usage: { 'example.label': id, 'example.retained': 'Retain' } }));
  let requests = 0;
  const changes = [];
  const api = { async collection(items) { requests++; return { items, resources: items.map(entry => ({ ...entry.selection, selection: entry.selection, selectionKey: referenceKey(entry.selection), metadata: {}, title: entry.selection.id })) }; } };
  const model = createCollectionState({ config: { referenceItems: true, items: entries }, api, notify: detail => changes.push(detail) });
  await model.refresh();
  const revision = model.revision.value;
  model.setUsage(model.resources.value[0], { ...entries[0].usage, 'example.label': 'Updated' });
  assert.equal(requests, 1);
  assert.ok(model.revision.value > revision);
  assert.equal(model.getItems()[0].usage['example.retained'], 'Retain');
  assert.equal(model.getItems()[1].usage['example.label'], 'article:2');
  assert.equal(changes[0].reason, 'usage');
  await model.setItems(model.getItems().map(entry => ({ ...entry, usage: { ...entry.usage, 'example.label': 'Caller change' } })));
  assert.equal(requests, 1);
  assert.equal(model.getItems()[0].usage['example.label'], 'Caller change');
  model.destroy();
});

test('shared hosts use the same information and preview renderer, with explicit visibility and separate full-width/label options', () => {
  const app = read('resources/js/components/SmartBrowserApp.vue');
  const view = read('resources/js/components/CollectionView.vue');
  const panel = read('resources/js/components/ResourceInfoPanel.vue');
  assert.match(app, /const showInfo = computed\(\(\) => hasUsageProfile \|\| pickerContext\?\.initialInfoOpen === true \? pickerInfoOpen.value : state.showInfo\)/);
  assert.doesNotMatch(app, /forceUsageInfo.value \|\|/);
  assert.match(view, /ResourceInfoPanel/);
  assert.match(view, /ResizeObserver/);
  assert.match(view, /selectionUseData \|\| 'readonly'/);
  assert.match(panel, /!selectionOnly && hasUsage/);
  assert.match(panel, /content-only="showUsage"/);
  assert.match(panel, /overlay-context="showUsage \? previewContext : null"/);
  assert.match(panel, /values="showUsage \? usageValues : \{\}"/);
  const field = read('resources/js/selection-field.js');
  assert.match(field, /config.showLabel === false/);
  assert.match(field, /config.fullWidth === true/);
  assert.match(read('resources/js/components/LightweightResourceVisual.vue'), /confirmLabel: props.t\('COM_SMARTBROWSER_USE_THUMBNAIL'\)/);
});
