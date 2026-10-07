import test from 'node:test';
import assert from 'node:assert/strict';
import { createDisplayMode } from '../resources/js/core/displayMode.js';

function fixture(storage) {
  const doc = new EventTarget();
  doc.defaultView = { localStorage: storage };
  class Element extends EventTarget {
    constructor(tagName) { super(); this.tagName = tagName; this.attrs = new Map(); this.children = []; this.ownerDocument = doc; }
    getAttribute(key) { return this.attrs.get(key) ?? null; }
    setAttribute(key, value) { this.attrs.set(key, value); }
    removeAttribute(key) { this.attrs.delete(key); }
    appendChild(node) { if (node.parentElement) node.parentElement.children.splice(node.parentElement.children.indexOf(node), 1); this.children.push(node); node.parentElement = this; }
    replaceWith(node) { const parent = this.parentElement; if (node.parentElement) node.parentElement.children.splice(node.parentElement.children.indexOf(node), 1); parent.children[parent.children.indexOf(this)] = node; node.parentElement = parent; this.parentElement = null; }
    querySelector() { return null; }
  }
  doc.body = new Element('BODY'); doc.documentElement = new Element('HTML');
  doc.createComment = () => new Element('COMMENT'); doc.querySelector = () => null;
  const menu = new Element('NAV'), wrapper = new Element('MAIN'), root = new Element('DIV');
  doc.body.appendChild(menu); doc.body.appendChild(wrapper); wrapper.appendChild(root);
  return { doc, menu, wrapper, root };
}
test('display modes cycle and restore original template attributes and DOM location', () => {
  const { root, wrapper, doc, menu } = fixture(), modes = [];
  wrapper.setAttribute('data-sb-wide-container', 'original'); menu.setAttribute('inert', 'original');
  const controller = createDisplayMode(root, mode => modes.push(mode));
  assert.equal(controller.cycle(), 'wide');
  assert.equal(wrapper.getAttribute('data-sb-wide-container'), '');
  assert.equal(controller.cycle(), 'focus');
  assert.equal(root.parentElement, doc.body); assert.equal(menu.getAttribute('inert'), '');
  assert.equal(controller.cycle(), 'normal');
  assert.equal(root.parentElement, wrapper); assert.equal(menu.getAttribute('inert'), 'original');
  assert.equal(wrapper.getAttribute('data-sb-wide-container'), 'original');
  assert.equal(doc.body.getAttribute('data-sb-focus-page'), null);
  controller.destroy(); assert.deepEqual(modes.slice(0, 3), ['wide', 'focus', 'normal']);
});

test('display preference survives destruction and is restored on the next mount', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  const first = fixture(storage), controller = createDisplayMode(first.root);
  controller.set('focus'); controller.destroy();
  assert.equal(values.get('smartbrowser.displayMode'), 'focus');
  const second = fixture(storage), restored = createDisplayMode(second.root);
  assert.equal(restored.mode, 'focus');
  assert.equal(second.root.parentElement, second.doc.body);
  restored.set('normal'); restored.destroy();
  assert.equal(createDisplayMode(fixture(storage).root).mode, 'normal');
});

test('invalid or inaccessible display storage does not prevent normal operation', () => {
  const invalid = createDisplayMode(fixture({ getItem: () => 'invalid' }).root);
  assert.equal(invalid.mode, 'normal'); invalid.destroy();
  const blocked = fixture();
  Object.defineProperty(blocked.doc.defaultView, 'localStorage', { get() { throw new Error('Blocked'); } });
  const controller = createDisplayMode(blocked.root);
  assert.equal(controller.cycle(), 'wide'); controller.destroy();
  const failing = createDisplayMode(fixture({ getItem() { throw new Error('Blocked'); }, setItem() { throw new Error('Full'); } }).root);
  assert.equal(failing.cycle(), 'wide'); failing.destroy();
});
test('templates can handle the mode event and Escape/destroy restore normal state', () => {
  const { root, wrapper, doc } = fixture();
  const handler = event => event.preventDefault(); root.addEventListener('smartbrowser:display-mode', handler);
  const controller = createDisplayMode(root);
  controller.cycle(); assert.equal(wrapper.getAttribute('data-sb-wide-container'), null);
  root.removeEventListener('smartbrowser:display-mode', handler);
  controller.cycle();
  const escape = new Event('keydown'); Object.defineProperty(escape, 'key', { value: 'Escape' });
  doc.querySelector = () => ({});
  doc.dispatchEvent(escape); assert.equal(controller.mode, 'focus');
  doc.querySelector = () => null;
  doc.dispatchEvent(escape); assert.equal(controller.mode, 'normal'); assert.equal(root.parentElement, wrapper);
  controller.cycle(); controller.cycle(); controller.destroy(); assert.equal(root.parentElement, wrapper);
  doc.dispatchEvent(escape); assert.equal(controller.mode, 'normal');
});
