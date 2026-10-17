import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveResourceVisual } from '../resources/js/core/resourceVisual.js';

const settings = { items: { rules: [
  { asset: 'image', style: 'center', size: 'large', priority: 1 },
  { asset: 'identity', style: 'badge', position: 'bottom-right', anchor: 'center', size: 'small', priority: 2 },
  { asset: 'base', style: 'corner', position: 'top-left', size: 'small', priority: 3 },
] } };

test('items compose independent thumbnail, thematic badge and configured type icon', () => {
  const resource = { kind: 'item', typeIcon: 'fas fa-newspaper', icon: 'fas fa-calendar', image: 'images/article.jpg' };
  const layers = resolveResourceVisual(resource, { settings }).layers;
  assert.equal(layers.length, 3);
  assert.equal(layers.find(layer => layer.asset === 'base').icon, 'fas fa-newspaper');
  assert.equal(layers.find(layer => layer.asset === 'identity').icon, 'fas fa-calendar');
  assert.equal(layers.find(layer => layer.asset === 'image').src, resource.image);
  const explicit = resolveResourceVisual({ ...resource, badgeIcon: 'fas fa-book' }, { settings }).layers;
  assert.equal(explicit.find(layer => layer.asset === 'identity').icon, 'fas fa-book');
});

test('items without thematic data do not duplicate the type icon', () => {
  const layers = resolveResourceVisual({ kind: 'item', typeIcon: 'fas fa-newspaper', icon: 'fas fa-newspaper' }, { settings }).layers;
  assert.deepEqual(layers.map(layer => layer.asset), ['base']);
});
