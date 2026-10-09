import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { effectiveIcon, lightweightImage, thumbnailCapabilities } from '../resources/js/core/lightweightVisual.js';
import { createSelectionUsage } from '../resources/js/core/selectionUsage.js';

test('decorative dependency clears alt in initial/current usage and validation results', async () => {
  const resource = { id: 'image:1', selectionCapabilities: [
    { key: 'media.alt', type: 'string', editor: 'text', default: '', disabledWhen: { key: 'media.decorative', equals: true }, inactiveValue: '' },
    { key: 'media.decorative', type: 'boolean', editor: 'boolean', default: false },
  ] };
  const usage = createSelectionUsage({ profile: { 'media.alt': { required: true }, 'media.decorative': {} }, initialUsage: { 'image:1': { 'media.alt': 'Old description', 'media.decorative': true } } });
  assert.equal(usage.get(resource)['media.alt'], '');
  usage.set(resource, 'media.decorative', false);
  usage.set(resource, 'media.alt', 'New description');
  assert.equal(usage.get(resource)['media.alt'], 'New description');
  usage.set(resource, 'media.decorative', true);
  assert.equal((await usage.validate([resource])).valid, true);
  assert.equal((await usage.validate([resource])).usage['image:1']['media.alt'], '');
});

test('lightweight representation uses existing thumbnails, posters and image fallback without composites', () => {
  assert.equal(lightweightImage({ thumbnail: 'cover.jpg', image: 'native.jpg' }), 'cover.jpg');
  assert.equal(lightweightImage({ type: 'video', metadata: { poster: 'poster.jpg', url: 'movie.mp4' } }), 'poster.jpg');
  assert.equal(lightweightImage({ type: 'document', metadata: { url: 'file.pdf' } }), '');
  assert.equal(lightweightImage({ type: 'image', metadata: { url: 'photo.jpg' } }), 'photo.jpg');
  assert.equal(lightweightImage({ unavailable: true, image: 'private.jpg' }), '');
});
test('generic thumbnail metadata preserves reference validation, initial values and resource identity', async () => {
  const definition = { key: 'example.cover', type: 'resource', editor: 'resource', visualRole: 'thumbnail', picker: { adapter: 'media', allowedResourceTypes: ['image'] } };
  const resource = { id: 'document:1', selectionCapabilities: [definition] };
  const usage = createSelectionUsage({ profile: { 'example.cover': {} }, initialUsage: { 'document:1': { 'example.cover': { adapter: 'media', id: 'image:2' } } }, resolveReference: async () => ({ type: 'image' }) });
  assert.equal(thumbnailCapabilities(usage.definitions(resource)).length, 1);
  assert.deepEqual((await usage.validate([resource])).usage['document:1']['example.cover'], { adapter: 'media', id: 'image:2' });
  usage.set(resource, 'example.cover', null);
  assert.equal((await usage.validate([resource])).usage['document:1']['example.cover'], null);
  assert.equal(resource.id, 'document:1');
});
test('Info visual stays separate from card/full preview and uses the existing dispatcher', () => {
  const info = readFileSync(new URL('../resources/js/components/ResourceInfoPanel.vue', import.meta.url), 'utf8');
  const visual = readFileSync(new URL('../resources/js/components/LightweightResourceVisual.vue', import.meta.url), 'utf8');
  assert.ok(!info.includes('<ResourceVisual'));
  assert.ok(!/<(?:iframe|video|audio)\b/.test(visual));
  assert.ok(visual.includes("$emit('preview')"));
  assert.ok(visual.includes('initialSelection:'));
  assert.ok(visual.includes('fas fa-eye'));
  assert.ok(visual.includes("props.editable ? thumbnailDefinitions.value.filter(definition => definition.presentation !== 'hidden') : []"));
  assert.ok(info.includes(':editable="tab === \'usage\'"'));
  assert.ok(info.includes("available ? preferredTab.value : 'info'"));
  assert.ok(info.includes("selectTab('info')"));
  assert.ok(visual.indexOf('  </div>') < visual.indexOf('class="resource-lightweight-actions'), 'Actions are outside the image surface');
  assert.ok(visual.includes('resource-lightweight-preview-action'));
  const css = readFileSync(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  const general = css.match(/\.resource-lightweight-visual \{([^}]+)\}/)[1];
  assert.ok(general.includes('height: 150px'));
  assert.ok(!/(?:^|;)\s*width:/.test(general));
  assert.ok(general.includes('background: transparent'));
  assert.match(css, /\.resource-lightweight-preview-action \{ inset-inline-start: 4px; inset-inline-end: auto;/);
  assert.match(css, /\.resource-info-panel\.showing-usage \.resource-lightweight-visual \{[^}]*width: 144px; height: 112px/);
});

test('effective icons preserve native CSS class identity independently of thumbnails', () => {
  const resource = { icon: 'fas fa-newspaper', image: 'native.jpg' };
  assert.equal(effectiveIcon(resource), 'fas fa-newspaper');
  assert.equal(effectiveIcon(resource, { 'visual.iconOverride': 'fas fa-book' }), 'fas fa-book');
  assert.equal(lightweightImage(resource), 'native.jpg');
  assert.equal(effectiveIcon(resource, { 'visual.iconOverride': '<script>' }), 'fas fa-newspaper');
  assert.equal(effectiveIcon({ unavailable: true }, { 'visual.iconOverride': 'fas fa-book' }), '');
});
