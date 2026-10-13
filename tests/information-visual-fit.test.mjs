import test from 'node:test';
import assert from 'node:assert/strict';
import { fitVisualLayers } from '../resources/js/core/visualStyleVariables.js';

test('adaptive Information visual removes unused height and retains configured layers', () => {
  const fitted = fitVisualLayers([{ asset: 'image', z: 1, box: { x: 0, y: 40, width: 100, height: 20 } },
    { asset: 'base', z: 4, box: { x: 0, y: 40, width: 15, height: 15 } }], 250, 150, true);
  assert.equal(fitted.height, 50);
  assert.equal(fitted.layers[0].box.y, 0);
  assert.equal(fitted.layers[0].box.height, 100);
  assert.equal(fitted.layers[1].z, 4);
});

for (const ratio of [.5, 1, 3]) {
  test(`Information visual preserves aspect ratio ${ratio} in a rectangular host`, () => {
    const box = { x: 20, y: 10, width: 30 * ratio, height: 30 };
    const fitted = fitVisualLayers([{ asset: 'image', box }], 270, 150).layers[0].box;
    assert.ok(Math.abs(fitted.width * 270 / (fitted.height * 150) - ratio) < .00001);
    assert.ok(Math.abs(fitted.x * 2 + fitted.width - 100) < .00001);
    assert.equal(fitted.y, 10);
    assert.equal(fitted.height, 30);
  });
}

test('Information fitting preserves badge position relative to the image', () => {
  const layers = [{ asset: 'image', box: { x: 40, y: 10, width: 20, height: 80 } },
    { asset: 'base', box: { x: 35, y: 75, width: 15, height: 15 } }];
  const fitted = fitVisualLayers(layers, 270, 150).layers;
  assert.ok(fitted[0].box.x > 30);
  assert.ok(fitted[1].box.x > 30);
  assert.ok(fitted[1].box.x < fitted[0].box.x);
  assert.deepEqual(layers[0].box, { x: 40, y: 10, width: 20, height: 80 });
});

test('Information fitting retains full vertical composition and configured paint order', () => {
  const layers = [{ asset: 'image', z: 1, box: { x: 30, y: 40, width: 40, height: 20 } },
    { asset: 'base', z: 3, box: { x: 25, y: 82, width: 15, height: 15 } }];
  const fitted = fitVisualLayers(layers, 270, 150).layers;
  assert.equal(fitted[0].box.y, 40);
  assert.equal(fitted[1].box.y, 82);
  assert.equal(fitted[0].z, 1);
  assert.equal(fitted[1].z, 3);
});
