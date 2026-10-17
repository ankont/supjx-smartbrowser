import test from 'node:test';
import assert from 'node:assert/strict';
import { createVisualOverlays } from '../resources/js/core/visualOverlays.js';
import { previewExtensionContext } from '../resources/js/core/previewExtensionContext.js';
import { metadataValue } from '../resources/js/core/extensionMetadata.js';
import { createSelectionUsage } from '../resources/js/core/selectionUsage.js';

test('visual overlays mount, update, reorder and clean up on applicability, identity and surface changes', () => {
  const calls = [], errors = [], surface = { append(layer) { calls.push(`append:${layer.id}`); } };
  const controller = createVisualOverlays({ createLayer: (_, definition) => ({ id: definition.id, remove() { calls.push(`remove:${this.id}`); } }), report: error => errors.push(error) });
  let context;
  const first = { id: 'example.first', applies: c => c.resource.type === 'image', mount(layer, c) { context = c; calls.push('mount'); return () => calls.push('cleanup'); }, update() { calls.push('update'); }, unmount() { calls.push('unmount'); } };
  const base = { resource: { id: 'one', type: 'image' }, setMetadata() { calls.push('write'); } };
  controller.sync(surface, [first], base, 'one');
  controller.sync(surface, [first], { ...base, address: 'changed' }, 'one');
  assert.ok(calls.includes('update'));
  assert.equal(context.address, 'changed');
  const old = context;
  controller.sync(surface, [first], { ...base, resource: { id: 'two', type: 'image' } }, 'two');
  assert.equal(old.signal.aborted, true);
  assert.throws(() => old.setMetadata('crop', {}));
  controller.sync({ append() {} }, [first], base, 'one');
  controller.sync(surface, [first], { ...base, resource: { id: 'pdf', type: 'document' } }, 'pdf');
  assert.equal(calls.filter(c => c === 'cleanup').length, 3);
  assert.equal(calls.filter(c => c === 'unmount').length, 3);
  controller.destroy();
  assert.equal(errors.length, 0);
});

test('failing overlays do not prevent other plugins from mounting or cleaning up', () => {
  const errors = [], removed = [];
  const controller = createVisualOverlays({ createLayer: (_, d) => ({ remove() { removed.push(d.id); } }), report: e => errors.push(e) });
  const surface = { append() {} };
  let mounted = false;
  controller.sync(surface, [{ id: 'bad', mount() { throw Error('Bad plugin'); } }, { id: 'good', mount() { mounted = true; } }], { resource: { id: 'one' } }, 'one');
  assert.equal(mounted, true);
  controller.destroy();
  assert.deepEqual(removed, ['bad', 'good']);
  assert.equal(errors.length, 1);
});

test('replacing the shared action slot cleans up and remounts overlay actions', () => {
  const surface = { append() {} }, first = {}, second = {};
  const mounts = [], cleanups = [];
  const controller = createVisualOverlays({ createLayer: () => ({ remove() {} }) });
  const definition = { id: 'example.action', mount(layer, context) {
    mounts.push(context.actionsContainer);
    return () => cleanups.push(context.actionsContainer);
  } };
  const context = { resource: { id: 'one' }, actionsContainer: first };
  controller.sync(surface, [definition], context, 'one');
  controller.sync(surface, [definition], { ...context, actionsContainer: second }, 'one');
  assert.deepEqual(mounts, [first, second]);
  assert.deepEqual(cleanups, [first]);
  controller.destroy();
  assert.deepEqual(cleanups, [first, second]);
});

test('extension metadata survives usage validation without opening arbitrary capability properties', async () => {
  const resource = { id: 'image', selectionCapabilities: [] };
  const usage = createSelectionUsage({ initialUsage: { image: { 'ext.smartcrop.crop': { ratio: '4:3' }, 'unknown.value': 'discard' } } });
  assert.deepEqual(usage.get(resource), { 'ext.smartcrop.crop': { ratio: '4:3' } });
  usage.set(resource, 'ext.smartcrop.crop', { ratio: '16:9' });
  const result = await usage.validate([resource]);
  assert.equal(result.usage.image['ext.smartcrop.crop'].ratio, '16:9');
});

test('preview contexts provide isolated metadata reads and reject readonly, stale and unsafe writes', () => {
  const values = {}, base = { isReadOnly: false, getValues: () => values, setValue: (key, value) => { values[key] = value; }, setAddress: value => { values.address = value; } };
  const context = previewExtensionContext(base);
  context.setMetadata('smartcrop.crop', { ratio: '4:3' });
  const data = context.getMetadata('smartcrop.crop'); data.ratio = 'changed';
  assert.equal(context.getMetadata('ext.smartcrop.crop').ratio, '4:3');
  assert.deepEqual(context.getMetadata(), { 'smartcrop.crop': { ratio: '4:3' } });
  context.setAddress('images/crop.png');
  assert.equal(values.address, 'images/crop.png');
  assert.throws(() => context.setAddress('javascript:alert(1)'));
  const readonly = previewExtensionContext({ ...base, isReadOnly: true });
  assert.throws(() => readonly.setMetadata('crop', {}));
  assert.throws(() => readonly.setAddress('image.png'));
  assert.throws(() => readonly.setValue('ext.crop', {}));
  assert.throws(() => previewExtensionContext({ ...base, isCurrent: () => false }).setMetadata('crop', {}));
  assert.throws(() => metadataValue({ invalid: Infinity }));
  assert.throws(() => metadataValue('x'.repeat(65537)));
  const circular = {}; circular.self = circular;
  assert.throws(() => metadataValue(circular));
});
