import test from 'node:test';
import assert from 'node:assert/strict';
import { previewExtensionContext } from '../resources/js/core/previewExtensionContext.js';

function setup(initial = {}, readonly = false, imagePresentations = []) {
  const values = { ...initial };
  const context = previewExtensionContext({ isReadOnly: readonly, overlayRegistry: { imagePresentations }, getValues: () => values,
    getAddress: () => values['ext.address'] ?? 'article:1', getDefaultAddress: () => 'article:1',
    setValue: async (key, value) => { values[key] = value; },
    resetAddress: async () => { values['ext.address'] = null; } });
  return { values, context };
}

test('preview reset delegates extension data to registered providers without interpreting it', async () => {
  const { values, context } = setup({ 'ext.example.effect': { amount: 3 }, 'ext.other.data': { keep: true }, 'article.displayedName': 'Title' }, false, [{
    hasChanges: context => Boolean(context.getMetadata('example.effect')),
    reset: context => context.setMetadata('example.effect', null),
  }]);
  assert.equal(context.hasPreviewChanges(), true);
  await context.resetPreview();
  assert.equal(context.hasPreviewChanges(), false);
  assert.equal(values['ext.example.effect'], null);
  assert.deepEqual(values['ext.other.data'], { keep: true });
  assert.equal(values['article.displayedName'], 'Title');
});

test('preview reset clears thumbnail, icon, presentation and address together', async () => {
  const { context, values } = setup({ 'visual.thumbnailOverride': { adapter: 'media', id: 'image:2' },
    'visual.iconOverride': 'fas fa-star', 'visual.presentation': 'both', 'ext.address': 'cropped-address' });
  assert.equal(context.hasPreviewChanges(), true);
  await context.resetPreview();
  assert.equal(context.hasPreviewChanges(), false);
  assert.ok(Object.values(values).every(value => value === null));
});

test('readonly and stale preview contexts reject reset', async () => {
  await assert.rejects(setup({}, true).context.resetPreview(), /read-only/);
  const context = previewExtensionContext({ isCurrent: () => false });
  await assert.rejects(context.resetPreview(), /no longer active/);
});

test('unregistered extension metadata is never interpreted or removed by preview reset', async () => {
  const { context, values } = setup({ 'ext.unknown.effect': { arbitrary: true } });
  assert.equal(context.hasPreviewChanges(), false);
  await context.resetPreview();
  assert.deepEqual(values['ext.unknown.effect'], { arbitrary: true });
});

test('address-only image changes show reset without thumbnail or SmartCrop metadata', async () => {
  const original = 'images/photo.jpg#joomlaImage://local-images/photo.jpg?width=800&height=600';
  let address = original;
  const context = previewExtensionContext({ getValues: () => ({}), getAddress: () => address,
    getDefaultAddress: () => original, setAddress: value => { address = value; } });
  assert.equal(context.hasPreviewChanges(), false);
  context.setAddress(original + '&crop=0,0,400,300');
  assert.equal(context.hasPreviewChanges(), true);
  await context.resetPreview();
  assert.equal(address, original);
  assert.equal(context.hasPreviewChanges(), false);
});
