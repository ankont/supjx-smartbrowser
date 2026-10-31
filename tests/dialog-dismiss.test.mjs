import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

test('SmartBrowser dialogs confirm dirty backdrop and Escape dismissal', async () => {
  const script = await readFile(new URL('../package/component/media/js/dialog-dismiss.js', import.meta.url), 'utf8');
  let discard = false;
  const window = { confirm: () => discard };
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
  discard = true;
  listeners.click({ target: dialog, clientX: 5, clientY: 50 });
  assert.equal(closes, 2);
  discard = false;
  dirty = true;
  listeners.click({ target: dialog, clientX: 5, clientY: 50 });
  assert.equal(closes, 2);
  let prevented = false;
  listeners.cancel({ preventDefault: () => { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(closes, 2);
  dirty = false;
  listeners.cancel({ preventDefault: () => {} });
  assert.equal(closes, 3);
});

test('every dialog creator installs the shared dismissal rule', async () => {
  const files = [
    '../resources/js/adapters/MediaActionDriver.js',
    '../package/component/media/js/picker.js',
    '../package/component/media/js/editor-fields.js',
  ];
  const contents = await Promise.all(files.map((file) => readFile(new URL(file, import.meta.url), 'utf8')));
  assert.equal((contents[0].match(/SmartBrowserDialogDismiss\.install/g) || []).length, 3);
  assert.match(contents[1], /SmartBrowserDialogDismiss\.install/);
  assert.match(contents[2], /SmartBrowserDialogDismiss\.install/);
});

test('form and iframe dirty tracking share actual field and TinyMCE change events', async () => {
  const window = {};
  vm.runInNewContext(await readFile(new URL('../package/component/media/js/dialog-dismiss.js', import.meta.url), 'utf8'), { window });
  const fields = {}, editors = {}, added = {};
  let changes = 0;
  const form = { addEventListener: (name, handler) => { fields[name] = handler; } };
  const editor = { on: (names, handler) => { editors.names = names; editors.handler = handler; } };
  const frame = { contentDocument: { querySelector: () => form }, contentWindow: { tinymce: { editors: [editor], on: (name, handler) => { added[name] = handler; } } } };
  window.SmartBrowserDialogDismiss.watchFrame(frame, () => changes++);
  assert.equal(changes, 0);
  fields.input(); fields.change(); editors.handler();
  assert.equal(changes, 3);
  assert.equal(editors.names, 'input change');
  added.AddEditor({ editor }); editors.handler();
  assert.equal(changes, 4);
});

test('popup editor exit label changes on shared dirty tracking without replacing its icon or button', async () => {
  const script = await readFile(new URL('../package/component/media/js/editor-fields.js', import.meta.url), 'utf8');
  const setup = script.slice(script.indexOf('  const exitLabel'), script.indexOf('  if (form.closest'));
  let dirty;
  const label = { textContent: 'Close', dataset: { dirtyLabel: 'Cancel' } };
  const form = { querySelector: () => label };
  new Function('form', 'window', setup)(form, { SmartBrowserDialogDismiss: { watchForm: (target, callback) => { assert.equal(target, form); dirty = callback; } } });
  assert.equal(label.textContent, 'Close');
  dirty(); assert.equal(label.textContent, 'Cancel');
  dirty(); assert.equal(label.textContent, 'Cancel');
});

test('dynamic Close labels are restricted to component popups, in either Joomla client', async () => {
  const template = await readFile(new URL('../package/component/site/tmpl/editor/modal.php', import.meta.url), 'utf8');
  assert.match(template, /\$popupExitLabel = \$input->getCmd\('tmpl'\) === 'component' && !\$input->getBool\('sbpage'\)/);
  assert.match(template, /if \(\$popupExitLabel\).*data-sb-editor-exit-label/);
  assert.match(template, /Text::_\(\$popupExitLabel \? 'JCLOSE' : 'JCANCEL'\)/);
});
