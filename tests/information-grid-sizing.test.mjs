import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { informationVisualLayers, visualVariableRules } from '../resources/js/core/visualStyleVariables.js';

test('Information badge offset reserves layout space and separation from the filename', async () => {
  const css = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  assert.match(css, /\.is-information-visual:has\(\.resource-visual-layer\.asset-image\) \{ padding-bottom: 20px; margin-bottom: 8px; \}/);
  assert.match(css, /\.is-information-visual:has\(\.resource-visual-layer\.asset-image\) \.resource-visual-layer\.asset-base \{ margin-top: 20px; \}/);
});

test('image-anchored badges retain the Grid overhang without clipping', () => {
  const layers = [
    { asset: 'image', src: 'image.png', style: 'center', z: 1, box: { x: 12.5, y: 40, width: 75, height: 20 } },
    { asset: 'base', style: 'badge', anchor: 'center', z: 3, box: { x: 8, y: 55, width: 15, height: 15 } },
  ];
  const view = informationVisualLayers(layers, 270);
  const image = view.layers[0].box, badge = view.layers[1].box;
  const imageBottom = (image.y + image.height) * view.height / 100;
  const badgeBottom = (badge.y + badge.height) * view.height / 100;
  assert.ok(Math.abs(badgeBottom - imageBottom - 18) < .00001);
  assert.ok(badgeBottom <= view.height + .00001);
  assert.equal(view.layers[1].fontHeight, 27);
  assert.equal(view.layers[1].z, 3);
});

test('Information image height adapts without resizing configured Grid icons', () => {
  const make = imageHeight => informationVisualLayers([
    { asset: 'image', src: 'image.png', z: 1, box: { x: 12.5, y: 50 - imageHeight / 2, width: 75, height: imageHeight } },
    { asset: 'base', style: 'badge', z: 3, box: { x: 3, y: 82, width: 15, height: 15 } },
  ], 270);
  const square = make(75), wide = make(15);
  assert.equal(square.height, 180);
  assert.equal(wide.height, 36);
  for (const view of [square, wide]) {
    const image = view.layers[0].box, icon = view.layers[1];
    assert.ok(Math.abs(image.y + image.height / 2 - 50) < .0001);
    assert.equal(icon.fontHeight, 27);
    assert.equal(icon.z, 3);
    assert.equal(icon.box.height * view.height / 100, 27);
    assert.match(visualVariableRules('sbv1', view.layers, view.height), /--sb-visual-font-size: 17.55px/);
  }
});
