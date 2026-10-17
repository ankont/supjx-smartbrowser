import test from 'node:test';
import assert from 'node:assert/strict';
import { createImagePresentation, declaredAspectRatio } from '../resources/js/core/imagePresentation.js';
function image() {
  const values = new Map();
  return { style: { getPropertyValue: name => values.get(name)?.[0] || '', getPropertyPriority: name => values.get(name)?.[1] || '',
    setProperty: (name, value, priority = '') => values.set(name, [value, priority]), removeProperty: name => values.delete(name) } };
}
const context = { resource: { id: 'article:1' }, isReadOnly: true };

test('CSS aspect ratios are parsed without image or extension metadata', () => {
  for (const [value, expected] of [['16 / 9', 16 / 9], ['1.5', 1.5], ['auto 4 / 3', 4 / 3], ['.5 / 1', .5], ['1e2 / 50', 2]]) assert.equal(declaredAspectRatio(value), expected);
  for (const value of ['', 'auto', '0 / 1', '1 / 0', '-1 / 2', 'NaN', '1 / 2 / 3', 'garbage']) assert.equal(declaredAspectRatio(value), null);
});

test('presentation providers compose disjoint styles, resolve conflicts by order and restore host styles', () => {
  const img = image(), calls = [], errors = [];
  img.style.setProperty('transform', 'original', 'important');
  const controller = createImagePresentation({ report: e => errors.push(e) });
  const provider = (id, order, name) => ({ id, order, styles: [name], apply(image, context) {
    image.style.setProperty(name, id); calls.push(id); assert.equal(context.isReadOnly, true);
    return () => calls.push('remove ' + id);
  } });
  controller.sync(img, [provider('last', 30, 'transform'), provider('filter', 20, 'filter'), provider('first', 10, 'transform')], context);
  assert.deepEqual(calls, ['first', 'filter']);
  controller.destroy();
  assert.deepEqual(calls, ['first', 'filter', 'remove filter', 'remove first']);
  assert.equal(img.style.getPropertyValue('transform'), 'original');
  assert.equal(img.style.getPropertyPriority('transform'), 'important');
  assert.equal(img.style.getPropertyValue('filter'), '');
  assert.equal(errors.length, 0);
});

test('update aborts stale work and cleans up before reapplying; replacement and missing image release styles', () => {
  const controller = createImagePresentation(), first = image(), second = image();
  let retained, applied = 0, cleaned = 0;
  const definition = { id: 'effect', styles: ['opacity'], apply(image, context) {
    retained = context; applied++; image.style.setProperty('opacity', '.5'); return () => cleaned++;
  } };
  controller.sync(first, [definition], { ...context, refresh() {} });
  const old = retained;
  controller.sync(first, [definition], { ...context, values: { changed: true } });
  assert.equal(old.signal.aborted, true); assert.equal(old.getImageElement(), null);
  assert.throws(() => old.refresh(), /no longer active/);
  assert.equal(applied, 2); assert.equal(cleaned, 1);
  controller.sync(second, [definition], context);
  assert.equal(first.style.getPropertyValue('opacity'), '');
  controller.sync(null, [definition], context);
  assert.equal(second.style.getPropertyValue('opacity'), ''); assert.equal(cleaned, 3);
});

test('failed provider rolls back its styles, allowing a fallback; unavailable resources receive none', () => {
  const img = image(), errors = [], controller = createImagePresentation({ report: e => errors.push(e) });
  const bad = { id: 'bad', styles: ['filter'], apply(image) { image.style.setProperty('filter', 'bad'); throw Error('failed'); } };
  const good = { id: 'good', styles: ['filter'], apply(image) { image.style.setProperty('filter', 'good'); } };
  controller.sync(img, [bad, good], context);
  assert.equal(img.style.getPropertyValue('filter'), 'good'); assert.equal(errors.length, 1);
  controller.sync(img, [good], { resource: { id: 'article:1', unavailable: true } });
  assert.equal(img.style.getPropertyValue('filter'), '');
});

test('applicability and generic layout notification do not persist selection data', () => {
  const img = image(), notifications = [], controller = createImagePresentation();
  controller.sync(img, [{ id: 'skip', styles: [], applies: () => false, apply() { throw Error('must not run'); } },
    { id: 'effect', styles: [], apply(image, context) { context.notifyPresentationChange({ reason: 'layout', custom: 42 }); } }],
  { ...context, notifyPresentationChange: detail => notifications.push(detail) });
  assert.equal(notifications[0].custom, 42); assert.equal(notifications[1].phase, 'applied');
  controller.destroy(); assert.equal(notifications[2].phase, 'removed');
});

test('server-presented primary images are not presented twice in JavaScript', () => {
  const img = image(), controller = createImagePresentation();
  img.getAttribute = name => name === 'data-sb-image-presentation' ? 'server' : null;
  controller.sync(img, [{ id: 'never', styles: [], apply() { throw Error('Double presentation'); } }], context);
  controller.destroy();
});
