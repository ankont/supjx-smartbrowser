import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { allocateVisualId, visualVariableRules, createVisualStyleRegistry } from '../resources/js/core/visualStyleVariables.js';

const layers = [{ asset: 'base', box: { x: 25, y: 25, width: 50, height: 50 }, style: 'center', z: 1 }];
const flush = () => new Promise(resolve => queueMicrotask(resolve));

test('crop presentation uses scoped variables without changing the image layer box', () => {
  const image = { ...layers[0], asset: 'image', crop: { x: -12.5, y: -25, width: 125, height: 166.6667 } };
  const css = visualVariableRules(allocateVisualId(), [image], 180);
  assert.match(css, /--sb-visual-x: 25%;/);
  assert.match(css, /--sb-crop-x: -12.5%;/);
  assert.match(css, /--sb-crop-height: 166.667%;/);
  assert.doesNotMatch(visualVariableRules(allocateVisualId(), layers, 180), /--sb-crop-/);
});

test('visual variables generate scoped numeric CSS, never element style attributes', async () => {
  const id = allocateVisualId();
  const css = visualVariableRules(id, layers, 180);
  assert.match(css, /--sb-visual-x: 25%;/);
  assert.match(css, /--sb-visual-font-size: 90px;/);
  assert.throws(() => visualVariableRules('unsafe"]', layers, 180));
  const component = await readFile(new URL('../resources/js/components/ResourceVisual.vue', import.meta.url), 'utf8');
  assert.doesNotMatch(component, /:style=|statusHeight|measureStatuses|statusSpace/);
  const browserCss = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  for (const key of ['x', 'y', 'width', 'height', 'level', 'font-size']) assert.ok(browserCss.includes('var(--sb-visual-' + key));
});

test('one shared variable stylesheet batches updates and removes unmounted visuals', async () => {
  const attached = [];
  const doc = {
    head: { append(sheet) { attached.push(sheet); } },
    createElement() { return { dataset: {}, textContent: '', remove() { attached.splice(attached.indexOf(this), 1); } }; },
  };
  const registry = createVisualStyleRegistry(doc);
  const a = allocateVisualId(), b = allocateVisualId();
  registry.update(a, layers, 180);
  registry.update(b, layers, 24);
  await flush();
  assert.equal(attached.length, 1);
  assert.ok(attached[0].textContent.includes(a));
  assert.ok(attached[0].textContent.includes(b));
  registry.update(a, [{ ...layers[0], box: { ...layers[0].box, x: 0 } }], 200);
  registry.remove(b);
  await flush();
  assert.match(attached[0].textContent, /--sb-visual-x: 0%;/);
  assert.ok(!attached[0].textContent.includes(b));
  registry.remove(a);
  await flush();
  assert.equal(attached.length, 0);
});
