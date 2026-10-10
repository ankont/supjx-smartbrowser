import test from 'node:test';
import assert from 'node:assert/strict';
import MediaActionDriver from '../resources/js/adapters/MediaActionDriver.js';

class Element {
  constructor(tag) { this.tag = tag; this.children = []; this.listeners = {}; this.value = ''; }
  append(...children) { this.children.push(...children); }
  appendChild(child) { this.append(child); }
  addEventListener(name, callback) { (this.listeners[name] ||= []).push(callback); }
  emit(name) { for (const callback of this.listeners[name] || []) callback({ preventDefault() {} }); }
  set innerHTML(value) { this.value = value.replaceAll('&amp;', '&'); }
  reportValidity() { return true; }
  showModal() { this.open = true; }
  close() { this.open = false; this.emit('close'); }
  remove() { this.removed = true; }
  focus() { this.focused = true; }
  select() { this.selected = true; }
}

test('shared action dialogs return submitted values and cancel safely on close or owner disposal', async () => {
  const oldDocument = globalThis.document, oldWindow = globalThis.window;
  const nodes = [];
  globalThis.document = { body: new Element('body'), createElement(tag) { const node = new Element(tag); nodes.push(node); return node; } };
  globalThis.window = {};
  const driver = new MediaActionDriver({}, {}, async () => {}, key => key === 'JTOOLBAR_SAVE' ? 'Save &amp; Close' : key);
  try {
    const rename = driver.actionDialog({ title: 'Rename', value: 'before' });
    const dialog = [...driver.dialogs][0], form = dialog.children[0];
    const input = nodes.find(node => node.tag === 'input'); input.value = 'after';
    assert.equal(nodes.find(node => node.type === 'submit').textContent, 'Save & Close');
    form.emit('submit'); assert.equal(await rename, 'after'); assert.equal(driver.dialogs.size, 0);
    const confirmation = driver.actionDialog({ title: 'Delete', message: '<unsafe text>', destructive: true });
    const confirmDialog = [...driver.dialogs][0];
    assert.equal(confirmDialog.children[0].children[1].textContent, '<unsafe text>');
    confirmDialog.close(); assert.equal(await confirmation, null);
    const pending = driver.actionDialog({ title: 'Delete', message: 'Confirm' });
    driver.destroy(); assert.equal(await pending, null);
    assert.equal(await driver.actionDialog({ title: 'Deleted owner' }), null);
  } finally { globalThis.document = oldDocument; globalThis.window = oldWindow; }
});
