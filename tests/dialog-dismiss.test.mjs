import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

test('all SmartBrowser dialogs share clean-only backdrop and Escape dismissal', async () => {
  const script = await readFile(new URL('../package/component/media/js/dialog-dismiss.js', import.meta.url), 'utf8');
  const window = {};
  vm.runInNewContext(script, { window });
  const listeners = {};
  let closes = 0;
  let dirty = false;
  const dialog = {
    addEventListener: (type, listener) => { listeners[type] = listener; },
    getBoundingClientRect: () => ({ left: 10, right: 110, top: 10, bottom: 110 }),
    close: () => { closes++; },
  };
  window.SmartBrowserDialogDismiss.install(dialog, () => dirty);
  listeners.click({ target: dialog, clientX: 50, clientY: 50 });
  assert.equal(closes, 0);
  listeners.click({ target: dialog, clientX: 5, clientY: 50 });
  assert.equal(closes, 1);
  dirty = true;
  listeners.click({ target: dialog, clientX: 5, clientY: 50 });
  assert.equal(closes, 1);
  let prevented = false;
  listeners.cancel({ preventDefault: () => { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(closes, 1);
  dirty = false;
  listeners.cancel({ preventDefault: () => {} });
  assert.equal(closes, 2);
});

test('every dialog creator installs the shared dismissal rule', async () => {
  const files = [
    '../resources/js/adapters/MediaActionDriver.js',
    '../package/component/media/js/picker.js',
    '../package/component/media/js/editor-fields.js',
  ];
  const contents = await Promise.all(files.map((file) => readFile(new URL(file, import.meta.url), 'utf8')));
  assert.equal((contents[0].match(/SmartBrowserDialogDismiss\.install/g) || []).length, 2);
  assert.match(contents[1], /SmartBrowserDialogDismiss\.install/);
  assert.match(contents[2], /SmartBrowserDialogDismiss\.install/);
});
