import test from 'node:test';
import assert from 'node:assert/strict';
import { lockPageScroll } from '../resources/js/core/pageScrollLock.js';

function document(parent) {
  const element = () => {
    const classes = new Set();
    return { classes, classList: { contains: key => classes.has(key), add: key => classes.add(key), remove: key => classes.delete(key) } };
  };
  return { documentElement: element(), body: element(), defaultView: { frameElement: parent ? { ownerDocument: parent } : null } };
}
test('nested and overlapping modal locks release independently and idempotently', () => {
  const host = document();
  const frame = document(host);
  const releaseFirst = lockPageScroll(frame);
  const releaseSecond = lockPageScroll(host);
  releaseFirst();
  releaseFirst();
  assert.equal(frame.body.classes.size, 0);
  assert.ok(host.body.classes.has('sb-modal-scroll-locked'));
  releaseSecond();
  assert.equal(host.body.classes.size, 0);
});
test('preexisting locks are preserved', () => {
  const host = document();
  host.body.classes.add('sb-modal-scroll-locked');
  lockPageScroll(host)();
  assert.ok(host.body.classes.has('sb-modal-scroll-locked'));
  assert.equal(host.documentElement.classes.size, 0);
});
