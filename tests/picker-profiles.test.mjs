import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
const source = await readFile(new URL('../package/component/media/js/picker.js', import.meta.url), 'utf8');

function fixture() {
  const dialogs = [], listeners = new Set();
  const document = {
    addEventListener(name, callback) { listeners.add(callback); }, removeEventListener(name, callback) { listeners.delete(callback); }, body: { appendChild() {} },
    createElement() {
      const events = new Map(), frame = { contentWindow: {} }, buttons = new Map();
      const dialog = { frame, events, buttons, querySelector(selector) { if (selector === 'iframe') return frame; if (!buttons.has(selector)) buttons.set(selector, { addEventListener(name, fn) { this[name] = fn; } }); return buttons.get(selector); },
        addEventListener(name, fn) { events.set(name, fn); }, showModal() {}, close() { events.get('close')?.(); }, remove() { this.removed = true; } };
      dialogs.push(dialog); return dialog;
    },
  };
  const window = { location: { href: 'https://example.test/index.php' }, SmartBrowserMediaValue: { selectionLocation: () => ({}) }, SmartBrowserDialogDismiss: { install(dialog, dirty, close) { dialog.dismiss = close; } } };
  vm.runInNewContext(source, { window, document, URL, Joomla: { getOptions: () => ({}) } });
  const id = dialog => new URL(dialog.frame.src).searchParams.get('pickerInstance');
  const send = (dialog, resources, usage = {}) => [...listeners].forEach(listener => listener({ detail: { pickerInstance: id(dialog), resources, usage } }));
  return { picker: window.SmartBrowserPicker, dialogs, listeners, id, send };
}

test('legacy result and nested instance isolation preserve single/multiple selection', async () => {
  const f = fixture();
  const outer = f.picker.open({ multiple: true, adapter: 'articles' });
  const inner = f.picker.open({ adapter: 'media', allowedResourceTypes: ['image'] });
  f.send(f.dialogs[1], [{ id: 'file:1', type: 'document' }]);
  assert.equal(f.listeners.size, 2);
  const image = { id: 'file:2', type: 'image', metadata: { mimeType: 'image/png' } };
  f.send(f.dialogs[1], [image]);
  assert.equal((await inner).id, image.id);
  assert.equal(f.dialogs[0].removed, undefined);
  assert.equal(f.listeners.size, 1);
  f.send(f.dialogs[0], [{ id: 'article:2', type: 'article' }, { id: 'article:1', type: 'article' }]);
  assert.deepEqual(Array.from(await outer, resource => resource.id), ['article:2', 'article:1']);
  assert.equal(f.listeners.size, 0);
});

test('usage result is opt-in, initial context is copied and restricted to the owning iframe', async () => {
  const f = fixture();
  const profile = { 'media.alt': { required: true } };
  const result = f.picker.open({ resultFormat: 'usage', selectionProfile: profile, initialUsage: { 'file:1': { 'media.alt': 'Saved' } }, initialSelection: ['file:1'] });
  const dialog = f.dialogs[0];
  profile['media.alt'].required = false;
  assert.equal(f.picker.context(f.id(dialog), {}), null);
  const context = f.picker.context(f.id(dialog), dialog.frame.contentWindow);
  assert.equal(context.selectionProfile['media.alt'].required, true);
  assert.equal(context.initialUsage['file:1']['media.alt'], 'Saved');
  assert.equal(context.initialSelection[0], 'file:1');
  f.send(dialog, [{ id: 'file:1', type: 'image' }], { 'file:1': { 'media.alt': 'Changed' }, 'file:other': { 'media.alt': 'Not selected' } });
  const envelope = await result;
  assert.equal(envelope.selection.id, 'file:1');
  assert.equal(envelope.selection.usage, undefined);
  assert.equal(envelope.usage['file:1']['media.alt'], 'Changed');
  assert.equal(envelope.usage['file:other'], undefined);
  assert.equal(f.picker.context(f.id(dialog), dialog.frame.contentWindow), null);
});

test('profile usage envelope preserves identity and removes listeners on native close', async () => {
  const f = fixture();
  const result = f.picker.open({ resultFormat: 'usage', selectionProfile: { 'media.alt': {} }, initialSelection: ['file:1'] });
  const dialog = f.dialogs[0], instance = f.id(dialog);
  assert.equal(f.picker.context(instance, {}), null);
  dialog.close();
  assert.equal(await result, null);
  assert.equal(f.listeners.size, 0);
  assert.equal(f.picker.context(instance, dialog.frame.contentWindow), null);
});

test('custom editor and preview action registrations are generic and removable', () => {
  const f = fixture();
  const unEditor = f.picker.registerUsageEditor('example.editor', { mount() {}, validate() {} });
  const unAction = f.picker.registerPreviewAction({ id: 'example.action', label: 'Action', run() {} });
  assert.throws(() => f.picker.registerUsageEditor('example.editor', { mount() {} }));
  assert.throws(() => f.picker.registerPreviewAction({ id: 'bad', run() {} }));
  f.picker.open();
  const dialog = f.dialogs[0];
  const context = f.picker.context(f.id(dialog), dialog.frame.contentWindow);
  assert.ok(context.editors['example.editor']);
  assert.equal(context.previewActions.length, 1);
  unEditor(); unAction();
  assert.equal(f.picker.context(f.id(dialog), dialog.frame.contentWindow).previewActions.length, 0);
  dialog.dismiss();
});

test('invalid profile inputs fail before any host listeners are installed', async () => {
  const f = fixture();
  await assert.rejects(f.picker.open({ selectionProfile: [] }));
  await assert.rejects(f.picker.open({ initialSelection: 'file:1' }));
  await assert.rejects(f.picker.open({ url: 'http://[' }));
  assert.equal(f.listeners.size, 0);
});
