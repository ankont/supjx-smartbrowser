import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeVisualSettings, toVisualRules, selectVisualRules, resolveResourceVisual, visualAnchorRegions } from '../resources/js/core/resourceVisual.js';
const rules = toVisualRules({ rules: [
  { asset: 'image', style: 'center', size: 'max' },
  { asset: 'base', style: 'center', size: 'medium' },
  { asset: 'base', style: 'corner', position: 'top-left', size: 'small' },
  { asset: 'identity', style: 'badge', position: 'bottom-right', size: 'small', anchor: 'center' },
] });
const resource = { kind: 'node', icon: 'fas fa-folder', badgeIcon: 'fas fa-book', image: 'test.png' };
test('explicit display layers do not affect rule fallback selection', () => {
  const input = toVisualRules({ rules: [
    { asset: 'base', style: 'corner', size: 'small', priority: 3 },
    { asset: 'base', style: 'center', size: 'medium', priority: 2 },
    { asset: 'image', style: 'center', size: 'max', priority: 1 },
  ] });
  const full = resolveResourceVisual(resource, { settings: { rules: input } });
  assert.equal(full.layers.find(layer => layer.asset === 'base').style, 'corner');
  assert.equal(full.layers.find(layer => layer.asset === 'base').z, 3);
  const missing = resolveResourceVisual(resource, { settings: { rules: input }, allowImage: false });
  assert.equal(missing.layers[0].style, 'center');
  assert.equal(missing.layers[0].z, 2);
});
test('per-asset priority selects centered fallback without changing paint order', () => {
  const input = toVisualRules({ rules: [
    { asset: 'base', style: 'corner', size: 'small', priority: 3 },
    { asset: 'image', style: 'center', size: 'max', priority: 1 },
    { asset: 'base', style: 'center', size: 'medium', priority: 2 },
  ] });
  const full = resolveResourceVisual(resource, { settings: { rules: input } });
  assert.equal(full.layers.find(layer => layer.asset === 'base').style, 'corner');
  assert.ok(full.layers.find(layer => layer.asset === 'base').z > full.layers.find(layer => layer.asset === 'image').z);
  const missing = resolveResourceVisual(resource, { settings: { rules: input }, allowImage: false });
  assert.equal(missing.layers[0].style, 'center');
  assert.equal(missing.layers[0].box.width, 50);
  assert.deepEqual(toVisualRules({ rules: input }), input);
});
test('ordered rules reserve assets and positions only when successfully selected', () => {
  assert.deepEqual(selectVisualRules(rules, { base: true, image: true, identity: true }).map(r => r.ruleIndex), [0, 2, 3]);
  assert.deepEqual(selectVisualRules(rules, { base: true, identity: true }).map(r => r.ruleIndex), [1, 3]);
  const full = resolveResourceVisual(resource, { settings: { rules } });
  assert.equal(full.layers.find(r => r.asset === 'base').style, 'corner');
  assert.equal(full.layers.find(r => r.asset === 'image').box.width, 100);
  const fallback = resolveResourceVisual(resource, { settings: { rules }, imageFailed: true });
  assert.equal(fallback.layers.find(r => r.asset === 'base').box.width, 50);
  assert.equal(fallback.layers.find(r => r.asset === 'base').style, 'center');
  assert.ok(full.layers[0].z > full.layers[1].z);
});
test('rule positions distinguish style and all corners, while duplicate assets are suppressed', () => {
  const input = toVisualRules({ rules: [
    { asset: 'base', style: 'corner', position: 'top-left' },
    { asset: 'image', style: 'corner', position: 'top-right' },
    { asset: 'identity', style: 'badge', position: 'top-left' },
    { asset: 'base', style: 'center' },
  ] });
  assert.equal(selectVisualRules(input, { base: true, image: true, identity: true }).length, 3);
});
test('empty compositions remain empty and preview availability does not mutate settings', () => {
  assert.deepEqual(resolveResourceVisual(resource, { settings: { rules: [] } }).layers, []);
  assert.deepEqual(resolveResourceVisual(resource, { settings: { rules }, availableAssets: { base: false, image: false, identity: false } }).layers, []);
  assert.equal(rules.length, 4);
  assert.deepEqual(normalizeVisualSettings({ rules }), { rules });
  assert.deepEqual(normalizeVisualSettings(normalizeVisualSettings({ rules })), { rules });
});
test('badge follows the center fallback, and image transparency is global', () => {
  const visual = resolveResourceVisual(resource, { settings: { rules }, allowImage: false, background: 'checkerboard' });
  assert.equal(visual.background, 'checkerboard');
  const badge = visual.layers.find(r => r.asset === 'identity');
  assert.equal(badge.box.x, 64.5);
  assert.equal(badge.box.y, 64.5);
});
test('old asset anchors migrate to regions and frame retains the full square', () => {
  const composition = [
    { asset: 'base', style: 'corner', position: 'top-left', size: 'medium' },
    { asset: 'identity', style: 'badge', position: 'bottom-right', size: 'small', anchor: 'base' },
  ];
  const anchored = resolveResourceVisual(resource, { settings: { rules: composition } });
  assert.equal(anchored.layers[0].box.x, 3);
  assert.equal(anchored.layers[1].box.x, 42.5);
  const item = resolveResourceVisual(resource, { settings: { rules: composition.map(rule => ({ ...rule, anchor: 'item' })) } });
  assert.equal(item.layers[1].box.x, 85);
  assert.equal(item.layers[1].box.y, 85);
  assert.equal(toVisualRules({ rules: composition })[1].anchor, 'corner:top-left');
});
test('anchor choices include only configured non-badge regions', () => {
  const configured = [
    { asset: 'image', style: 'center' },
    { asset: 'base', style: 'center' },
    { asset: 'base', style: 'corner', position: 'top-left' },
    { asset: 'identity', style: 'badge', position: 'bottom-right', anchor: 'center' },
  ];
  assert.deepEqual(visualAnchorRegions(configured), ['center', 'corner:top-left']);
  const removed = toVisualRules({ rules: configured.filter(rule => rule.style !== 'center') });
  assert.equal(removed.find(rule => rule.asset === 'identity').anchor, 'item');
});
test('badges overlap their region target inward in every corner, while frame stays unchanged', () => {
  for (const position of ['top-left', 'top-right', 'bottom-left', 'bottom-right']) {
    const rules = [
      { asset: 'base', style: 'center', size: 'medium' },
      { asset: 'identity', style: 'badge', position, size: 'small', anchor: 'center' },
    ];
    const visual = resolveResourceVisual(resource, { settings: { rules } });
    const badge = visual.layers.find(layer => layer.asset === 'identity').box;
    assert.equal(badge.x, position.endsWith('right') ? 64.5 : 20.5);
    assert.equal(badge.y, position.startsWith('bottom') ? 64.5 : 20.5);
    const frame = resolveResourceVisual(resource, { settings: { rules: rules.map(rule => ({ ...rule, anchor: 'item' })) } });
    const framed = frame.layers.find(layer => layer.asset === 'identity').box;
    assert.equal(framed.x, position.endsWith('right') ? 85 : 0);
    assert.equal(framed.y, position.startsWith('bottom') ? 85 : 0);
  }
});
test('compact badges keep their pre-inset anchoring while grid badges overlap inward', () => {
  const rules = [
    { asset: 'base', style: 'center', size: 'small' },
    { asset: 'identity', style: 'badge', position: 'bottom-right', size: 'small', anchor: 'center' },
  ];
  const compact = resolveResourceVisual(resource, { settings: { rules }, compact: true });
  const base = compact.layers.find(layer => layer.asset === 'base').box;
  const badge = compact.layers.find(layer => layer.asset === 'identity').box;
  assert.equal(badge.x, Math.min(100 - badge.width, base.x + base.width - badge.width / 2));
  assert.equal(badge.y, Math.min(100 - badge.height, base.y + base.height - badge.height / 2));
});
test('new settings begin with only a centered base and legacy migration is stable', () => {
  assert.equal(toVisualRules({}).length, 1);
  assert.equal(toVisualRules({})[0].asset, 'base');
  const migrated = toVisualRules({ base: { style: 'corner', sizes: { center: 'medium', corner: 'small' } }, image: { style: 'center', size: 'max' } });
  assert.deepEqual(toVisualRules({ rules: migrated }), migrated);
  assert.equal(migrated.find(r => r.asset === 'base' && r.style === 'center').size, 'medium');
});
