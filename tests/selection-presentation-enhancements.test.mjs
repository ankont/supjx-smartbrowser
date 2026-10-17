import test from 'node:test';
import assert from 'node:assert/strict';
import { selectionPresentation, resolveThumbnailResource } from '../resources/js/core/lightweightVisual.js';
import { selectedPresentation, sortSelectionResources, selectionColumnCatalog } from '../resources/js/core/selectedPresentation.js';
import { resolveResourceVisual } from '../resources/js/core/resourceVisual.js';
import { createCollectionState } from '../resources/js/core/collectionState.js';
import { fieldPickerResult } from '../resources/js/core/selectionFieldValue.js';
import { referenceKey } from '../resources/js/core/selectionIdentity.js';

test('displayed article names and visual modes are selection presentation, not resource edits', () => {
  const article = { id: 'article:1', type: 'article', kind: 'item', title: 'Resolved title', icon: 'fas fa-file', image: '/cover.png' };
  const selected = selectionPresentation(article, { 'article.displayedName': ' Temporary title ', 'visual.iconOverride': 'fas fa-book', 'visual.presentation': 'both' });
  assert.equal(selected.title, 'Temporary title');
  assert.equal(article.title, 'Resolved title');
  assert.equal(selectionPresentation(selected, { 'article.displayedName': ' ' }).title, 'Resolved title');
  assert.equal(selectionPresentation({ ...article, type: 'image' }, { 'article.displayedName': 'Ignored' }).title, 'Resolved title');
  for (const [mode, assets] of [['thumbnail', ['image']], ['icon', ['base']], ['both', ['image', 'base']]]) {
    const visual = resolveResourceVisual({ ...selected, visualPresentation: mode });
    assert.deepEqual(visual.layers.map(layer => layer.asset), assets);
  }
  assert.equal(resolveResourceVisual({ ...selected, image: '', visualPresentation: 'thumbnail' }).layers[0].asset, 'base');
  const badge = resolveResourceVisual(selected).layers.find(layer => layer.asset === 'base');
  assert.equal(badge.position, 'bottom-right');
  assert.ok(badge.z > resolveResourceVisual(selected).layers.find(layer => layer.asset === 'image').z);
  const configured = resolveResourceVisual(selected, { settings: { rules: [
    { asset: 'identity', style: 'badge', position: 'top-right', size: 'large' },
  ] } }).layers.find(layer => layer.asset === 'base');
  assert.equal(configured.position, 'top-right');
  assert.equal(configured.size, 'large');
});

test('common selection sorting is stable, missing values stay last, and ID sorting is natural', () => {
  const rows = [{ id: 'article:10', title: 'Same', metadata: { created: '2026-01-02' } }, { id: 'article:2', title: 'Same', metadata: { created: '2026-01-01' } }, { id: 'article:1', title: 'Z', unavailable: true, metadata: {} }].map(selectedPresentation);
  assert.deepEqual(sortSelectionResources(rows, 'selectionId').map(r => r.id), ['article:1', 'article:2', 'article:10']);
  assert.deepEqual(sortSelectionResources(rows, 'title').map(r => r.id), ['article:10', 'article:2', 'article:1']);
  assert.deepEqual(sortSelectionResources(rows, 'created', 'desc').map(r => r.id), ['article:10', 'article:2', 'article:1']);
  assert.ok(selectionColumnCatalog.filter(c => ['created', 'modified', 'selectionId', 'type'].includes(c.id)).every(c => c.defaultVisible === false));
});

test('collection order sorting moves whole entries without native resource mutation or metadata loss', async () => {
  const entries = [2, 1].map(id => ({ selection: { adapter: 'articles', id: `article:${id}` }, usage: { 'article.displayedName': `Name ${id}`, 'visual.thumbnailOverride': { adapter: 'media', id: `local:/cover-${id}.png` }, 'ext.smartcrop.crop': { ratio: `${id}:1` } } }));
  const changes = [];
  const api = { collection: async items => ({ items, resources: items.map(entry => ({ ...entry.selection, selection: entry.selection, selectionKey: referenceKey(entry.selection), title: entry.selection.id, kind: 'item', metadata: {} })) }) };
  const model = createCollectionState({ config: { selectedResources: true, referenceItems: true, items: entries }, api, notify: change => changes.push(change) });
  await model.refresh();
  const keys = [...entries].reverse().map(entry => referenceKey(entry.selection));
  model.reorderItems(keys);
  assert.deepEqual(model.getItems(), [...entries].reverse());
  assert.deepEqual(changes[0].items, [...entries].reverse());
  assert.throws(() => model.reorderItems([keys[0], keys[0]]));
  await model.refresh();
  assert.deepEqual(model.getItems(), [...entries].reverse());
  model.destroy();
});

test('replacement uses caller policy for extension metadata and never leaks unrelated usage capabilities', () => {
  const previous = { selection: { adapter: 'articles', id: 'article:1' }, usage: { 'article.displayedName': 'Old', 'ext.smartcrop.crop': { ratio: '4:3' } } };
  const current = { version: 1, items: [previous] };
  const result = { items: [{ selection: { adapter: 'media', id: 'local:/cover.png' }, usage: {} }] };
  assert.deepEqual(fieldPickerResult(current, result, ['articles', 'media'], false, previous.selection).items[0].usage, {});
  const preserved = fieldPickerResult(current, result, ['articles', 'media'], false, previous.selection, false, true);
  assert.deepEqual(preserved.items[0].usage, { 'ext.smartcrop.crop': { ratio: '4:3' } });
  assert.equal(fieldPickerResult(current, { items: [{ ...previous, usage: {} }] }, ['articles'], false, previous.selection).items[0].usage['ext.smartcrop.crop'].ratio, '4:3');
});

test('effective thumbnail retains adapter crop presentation without changing selected article identity', async () => {
  const thumbnail = { id: 'local:/cover.png', image: '/cover.png', type: 'image', imageCrop: { source: '/cover.png', ratio: 4 / 3 } };
  const resolved = await resolveThumbnailResource({ picker: { allowedResourceTypes: ['image'] } }, { adapter: 'media', id: thumbnail.id }, async () => thumbnail);
  const article = selectedPresentation({ id: 'article:1', type: 'article', title: 'Article', effectiveThumbnail: resolved.image, effectiveThumbnailResource: resolved, imageCrop: resolved.imageCrop });
  assert.equal(article.id, 'article:1');
  assert.equal(article.image, '/cover.png');
  assert.equal(article.imageCrop.ratio, 4 / 3);
});
