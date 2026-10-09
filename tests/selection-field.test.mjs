import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { selectionFieldValue, fieldPickerResult } from '../resources/js/core/selectionFieldValue.js';

const value = (adapter, ids, usage = {}) => selectionFieldValue({ version: 1, items: ids.map(id => ({ selection: { adapter, id }, usage: usage[id] || {} })) }, adapter);
test('single image/PDF/article values serialize only normalized references and usage', () => {
  for (const [adapter, id, usage] of [['media', 'local-images:/image.png', { 'media.alt': 'Alt', 'media.decorative': false }],
    ['media', 'local-files:/book.pdf', { 'visual.thumbnailOverride': { adapter: 'media', id: 'local-images:/cover.png' } }], ['articles', 'article:42', {}]]) {
    const result = fieldPickerResult(value(adapter, []), { selection: { id, title: 'Resolved label', image: 'transient.jpg', metadata: { url: 'transient' } }, usage: { [id]: usage } }, adapter, false);
    assert.deepEqual(result.items.map(item => item.selection), [{ adapter, id }]);
    assert.deepEqual(selectionFieldValue(JSON.stringify(result), adapter, false), result);
    assert.ok(!JSON.stringify(result).includes('Resolved label'));
    assert.deepEqual(result.items[0].usage, usage);
  }
});
test('edit one selected resource preserves other usages and ordered positions', () => {
  const current = value('media', ['local-files:/a.pdf', 'local-files:/b.pdf'], { 'local-files:/a.pdf': { 'visual.thumbnailOverride': null }, 'local-files:/b.pdf': { 'visual.thumbnailOverride': { adapter: 'media', id: 'local-images:/b.png' } } });
  const next = fieldPickerResult(current, { selection: { id: 'local-files:/a.pdf' }, usage: { 'local-files:/a.pdf': { 'visual.thumbnailOverride': { adapter: 'media', id: 'local-images:/new.png' } } } }, 'media', true, { adapter: 'media', id: 'local-files:/a.pdf' });
  assert.deepEqual(next.items.map(item => item.selection), current.items.map(item => item.selection));
  assert.deepEqual(next.items[1], current.items[1]);
  const reordered = selectionFieldValue({ ...next, items: [...next.items].reverse() }, 'media');
  assert.equal(reordered.items[0].selection.id, 'local-files:/b.pdf');
  assert.deepEqual(reordered.items[0].usage, next.items[1].usage);
});
test('clear/remove discard orphan usage while corrupt/version/mixed/duplicate values fail safely', () => {
  assert.deepEqual(selectionFieldValue('', 'media'), { version: 1, items: [] });
  assert.deepEqual(value('articles', ['article:1'], { 'article:1': {}, 'article:2': { 'example.label': 'orphan' } }).items[0].usage, {});
  for (const input of ['bad json', JSON.stringify({ version: 99, selection: [], usage: {} }), JSON.stringify(value('articles', ['article:1']))]) assert.throws(() => selectionFieldValue(input, 'media'));
  assert.throws(() => value('media', ['local-images:/a.png', 'local-images:/a.png']));
  assert.throws(() => selectionFieldValue(value('articles', ['article:1', 'article:2']), 'articles', false));
});

test('allowed adapter definitions support mixed values with an optional homogeneous constraint', () => {
  const allowed = ['media', 'articles', 'categories'];
  const empty = selectionFieldValue('', allowed);
  const article = fieldPickerResult(empty, { adapter: 'articles', selection: { id: 'article:1' }, usage: {} }, allowed, false);
  const image = fieldPickerResult(article, { adapter: 'media', selection: { id: 'local-images:/a.png' }, usage: {} }, allowed, false);
  assert.equal(article.items[0].selection.adapter, 'articles'); assert.equal(image.items[0].selection.adapter, 'media');
  const mediaCollection = fieldPickerResult(empty, { adapter: 'media', selection: [{ id: 'local-images:/a.png' }], usage: {} }, allowed, true);
  const mixed = { version: 1, items: [...mediaCollection.items, ...article.items] };
  assert.equal(selectionFieldValue(mixed, allowed).items.length, 2);
  assert.throws(() => selectionFieldValue(mixed, allowed, true, true));
  assert.throws(() => fieldPickerResult(empty, { adapter: 'users', selection: { id: 'user:1' }, usage: {} }, allowed, false));
  assert.equal(fieldPickerResult(selectionFieldValue('', allowed), { adapter: 'categories', selection: [{ id: 'category:2' }], usage: {} }, allowed, true).items[0].selection.adapter, 'categories');
});
test('field consumer delegates all rendering, picking and ordering to existing public APIs', () => {
  const source = readFileSync(new URL('../resources/js/selection-field.js', import.meta.url), 'utf8');
  assert.ok(source.includes('mountCollection('));
  assert.ok(source.includes('window.SmartBrowserPicker.open('));
  assert.ok(source.includes("resultFormat: 'collection'"));
  assert.ok(source.includes('initialCollection:'));
  assert.ok(source.includes('allowedAdapters: adapters'));
  assert.ok(source.includes('multiple: resource ? false : config.multiple'));
  assert.ok(source.includes('collection.destroy()'));
  assert.ok(!source.includes('ResourceVisual') && !source.includes('createSelectionUsage'));
});
