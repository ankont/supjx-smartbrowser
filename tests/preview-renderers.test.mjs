import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createPreviewRenderer } from '../resources/js/core/previewRenderers.js';
import { genericPreviewResource, previewVisuals, selectionPresentation } from '../resources/js/core/lightweightVisual.js';
import { resolveResourceVisual } from '../resources/js/core/resourceVisual.js';

test('one renderer owns the preview, updates without remounting, and aborts stale callbacks on replacement', () => {
  const calls = [], surface = { append() {} };
  const renderer = createPreviewRenderer({ createLayer: () => ({ remove() { calls.push('remove'); } }) });
  let context;
  const first = { id: 'site.first', applies: c => c.resource.type === 'category', mount(_, c) { context = c; calls.push('mount'); return () => calls.push('cleanup'); }, update() { calls.push('update'); } };
  const second = { id: 'site.second', mount() { throw Error('Should not mount'); } };
  const base = { resource: { id: 'category:7', type: 'category' }, setAddress() {} };
  assert.equal(renderer.sync(surface, [first, second], base, 'category:7'), true);
  renderer.sync(surface, [first, second], { ...base, values: { changed: true } }, 'category:7');
  assert.deepEqual(calls, ['mount', 'update']);
  assert.equal(context.values.changed, true);
  renderer.destroy();
  assert.equal(context.signal.aborted, true);
  assert.throws(() => context.setAddress('x'), /no longer active/);
  assert.deepEqual(calls, ['mount', 'update', 'cleanup', 'remove']);
});

test('failing renderers release their content and fall through to another renderer or the generic preview', () => {
  const errors = [], surface = { append() {} }, calls = [];
  const renderer = createPreviewRenderer({ createLayer: () => ({ remove() { calls.push('remove'); } }), report: error => errors.push(error) });
  const bad = { id: 'site.bad', mount() { throw Error('Broken mount'); } };
  const good = { id: 'site.good', mount() { calls.push('mount'); }, update() { throw Error('Broken update'); } };
  const context = { resource: { id: 'tag:2' } };
  assert.equal(renderer.sync(surface, [bad, good], context, 'tag:2'), true);
  assert.equal(renderer.sync(surface, [good], context, 'tag:2'), false);
  assert.equal(errors.length, 2);
  assert.equal(calls.filter(x => x === 'remove').length, 2);
  assert.equal(renderer.sync(surface, [], context, 'tag:2'), false);
});

test('inapplicable renderers do not remount an active lower-priority renderer; mount-only renderers refresh', () => {
  const surface = { append() {} }, calls = [];
  const renderer = createPreviewRenderer({ createLayer: () => ({ remove() {} }) });
  const skipped = { id: 'site.skipped', applies: () => false, mount() { throw Error('Not applicable'); } };
  const active = { id: 'site.active', mount() { calls.push('mount'); return () => calls.push('cleanup'); }, update() { calls.push('update'); } };
  const context = { resource: { id: 'one' } };
  renderer.sync(surface, [skipped, active], context, 'one');
  renderer.sync(surface, [skipped, active], context, 'one');
  assert.deepEqual(calls, ['mount', 'update']);
  renderer.sync(surface, [{ id: 'site.simple', mount() { calls.push('simple'); } }], context, 'one');
  renderer.destroy();
});

test('preview registration is namespaced, ordered, late-observable and removable', () => {
  const window = {};
  vm.runInNewContext(readFileSync('package/component/media/js/picker.js', 'utf8'), { window, document: {}, URL, console });
  const registry = window.SmartBrowserPicker;
  let updates = 0;
  const stop = registry.subscribePreviewRenderers(() => updates++);
  const remove = registry.registerPreviewRenderer({ id: 'site.later', order: 200, mount() {} });
  registry.registerPreviewRenderer({ id: 'site.first', order: 10, mount() {} });
  assert.equal(registry.extensions().previewRenderers.map(d => d.id).join(','), 'site.first,site.later');
  assert.throws(() => registry.registerPreviewRenderer({ id: 'site.first', mount() {} }), /already/);
  assert.throws(() => registry.registerPreviewRenderer({ id: 'invalid', mount() {} }), /namespaced/);
  remove(); registry.unregisterPreviewRenderer('site.first'); stop();
  assert.equal(updates, 4);
});

test('generic preview uses the same resource and configured composition as the selection grid', () => {
  const resource = { type: 'category', kind: 'node', icon: 'fas fa-school', typeIcon: 'fas fa-cube', badgeIcon: 'fas fa-book' };
  const options = { settings: { rules: [
    { asset: 'image', style: 'center', size: 'large', priority: 1 },
    { asset: 'base', style: 'center', size: 'medium', priority: 2 },
    { asset: 'identity', style: 'badge', position: 'bottom-right', anchor: 'center', priority: 3 },
  ] } };
  const fallback = resolveResourceVisual(genericPreviewResource(resource), options);
  assert.equal(fallback.layers.find(layer => layer.asset === 'base').icon, 'fas fa-school');
  assert.equal(fallback.layers.find(layer => layer.asset === 'identity').icon, 'fas fa-book');
  const image = resolveResourceVisual(genericPreviewResource(resource, { 'visual.iconOverride': 'fas fa-heart' }, '/image.png'), options);
  assert.ok(image.layers.some(layer => layer.asset === 'image'));
  assert.ok(!image.layers.some(layer => layer.asset === 'base'));
  assert.equal(image.layers.find(layer => layer.asset === 'identity').icon, 'fas fa-heart');
  assert.equal(image.layers.find(layer => layer.asset === 'identity').position, 'bottom-right');
  for (const mode of [null, 'thumbnail', 'icon', 'both']) {
    const values = { 'visual.presentation': mode, 'visual.iconOverride': 'fas fa-heart' };
    const original = { ...resource, image: '/image.png' };
    assert.deepEqual(resolveResourceVisual(genericPreviewResource(original, values), options),
      resolveResourceVisual(selectionPresentation(original, values), options));
  }
});

test('custom preview renderers receive effective mode, identity, image and crop', () => {
  const resource = { type: 'article', icon: 'fas fa-file', badgeIcon: 'fas fa-book', image: '/cover.png', imageCrop: { ratio: 2 } };
  assert.equal(previewVisuals(resource, { 'visual.presentation': 'icon' }).image, '');
  assert.equal(previewVisuals(resource, { 'visual.presentation': 'thumbnail' }).icon, '');
  const both = previewVisuals(resource, { 'visual.presentation': 'both', 'visual.iconOverride': 'fas fa-heart' });
  assert.equal(both.icon, 'fas fa-heart');
  assert.equal(both.presentation, 'both');
  assert.deepEqual(both.imageCrop, { ratio: 2 });
  assert.equal(both.image, '/cover.png');
});

test('configured icon snapshots and SmartVisuals preview preparation work in both clients', () => {
  for (const file of ['tests/icon-options.php', 'tests/smartvisuals-dispatch.php']) {
    const result = spawnSync('php', [file], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stdout + result.stderr);
  }
});
