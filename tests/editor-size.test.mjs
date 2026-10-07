import assert from 'node:assert/strict';
import test from 'node:test';
import { createEditorSize } from '../resources/js/core/editorSize.js';

function fixture(storage) {
  const classes = new Set();
  const attributes = {};
  const listeners = new Map();
  const icon = {};
  const dialog = { ownerDocument: { defaultView: { localStorage: storage } }, classList: { toggle(name, enabled) { enabled ? classes.add(name) : classes.delete(name); } } };
  const button = { setAttribute(name, value) { attributes[name] = value; }, querySelector() { return icon; }, addEventListener(name, listener) { listeners.set(name, listener); }, removeEventListener(name, listener) { if (listeners.get(name) === listener) listeners.delete(name); } };
  return { dialog, button, classes, attributes, icon, listeners };
}

test('editor size toggles, persists separately and restores on reopening', () => {
  const values = new Map([['smartbrowser.displayMode', 'wide']]);
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  const first = fixture(storage);
  const controller = createEditorSize(first.dialog, first.button, key => key);
  assert.equal(first.attributes['aria-pressed'], 'false');
  first.listeners.get('click')();
  assert.ok(first.classes.has('is-maximized'));
  assert.equal(first.icon.className, 'fas fa-compress');
  assert.equal(first.button.title, 'COM_SMARTBROWSER_EDITOR_RESTORE');
  assert.equal(values.get('smartbrowser.displayMode'), 'wide');
  const second = fixture(storage);
  createEditorSize(second.dialog, second.button, key => key);
  assert.ok(second.classes.has('is-maximized'));
  second.listeners.get('click')();
  assert.equal(second.attributes['aria-pressed'], 'false');
  assert.ok(first.classes.has('is-maximized'), 'Other open editors must not change');
  controller.destroy();
  assert.equal(first.listeners.size, 0);
});

test('editor size works when storage access is blocked', () => {
  const view = fixture();
  Object.defineProperty(view.dialog.ownerDocument.defaultView, 'localStorage', { get() { throw new Error('Blocked'); } });
  createEditorSize(view.dialog, view.button, key => key);
  view.listeners.get('click')();
  assert.ok(view.classes.has('is-maximized'));
  view.listeners.get('click')();
  assert.equal(view.classes.size, 0);
});

test('iframe reload rebinds the toolbar button without losing size or listeners', () => {
  const view = fixture({ getItem: () => 'true' });
  const controller = createEditorSize(view.dialog, null, key => key);
  assert.ok(view.classes.has('is-maximized'));
  controller.bind(view.button);
  assert.equal(view.attributes['aria-pressed'], 'true');
  controller.bind(null);
  assert.equal(view.listeners.size, 0);
  const next = fixture();
  controller.bind(next.button);
  assert.equal(next.attributes['aria-pressed'], 'true');
  next.listeners.get('click')();
  assert.equal(view.classes.size, 0);
  controller.destroy();
  assert.equal(next.listeners.size, 0);
});
