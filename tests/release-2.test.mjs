import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
const read = path => readFile(new URL('../' + path, import.meta.url), 'utf8');

test('image picker starts at the selected filesystem without hiding other roots', async () => {
  const window = { location: { href: 'https://example.test/administrator/index.php' }, SmartBrowserMediaValue: { selectionLocation: value => value ? { node: 'local-files:/photos', resourceId: 'local-files:/photos/a.jpg' } : {} }, SmartBrowserDialogDismiss: { install() {} } };
  const frames = [];
  const document = { addEventListener() {}, removeEventListener() {}, body: { appendChild() {} }, createElement() {
    const frame = {}; frames.push(frame);
    return { querySelector: selector => selector === 'iframe' ? frame : { addEventListener() {} }, addEventListener() {}, showModal() {}, close() {}, remove() {} };
  } };
  vm.runInNewContext(await read('package/component/media/js/picker.js'), { window, document, URL, Joomla: { getOptions: () => ({}) } });
  window.SmartBrowserPicker.open({ initialNode: 'local-images:/', allowedResourceTypes: ['image'] });
  const initial = new URL(frames[0].src);
  assert.equal(initial.searchParams.get('node'), 'local-images:/');
  assert.equal(initial.searchParams.has('browseRoot'), false);
  assert.equal(initial.searchParams.get('allowedResourceTypes'), 'image');
  window.SmartBrowserPicker.open({ initialNode: 'local-images:/', initialValue: 'selected' });
  assert.equal(new URL(frames[1].src).searchParams.get('node'), 'local-files:/photos');
  const field = await read('package/component/media/js/media-field.js');
  assert.match(field, /initialNode: resolveBrowseRoot/);
  assert.doesNotMatch(field, /browseRoot:/);
});

test('fallback picker assets include dismiss and the native asset registry', async () => {
  const plugin = await read('package/plugins/system/smartbrowserintegration/src/Extension/Smartbrowserintegration.php');
  assert.match(plugin, /addExtensionRegistryFile\('com_smartbrowser'\)/);
  assert.match(plugin, /registerScript\('com_smartbrowser.picker'[^\n]+\['core', 'com_smartbrowser.dialog-dismiss', 'com_smartbrowser.media-value'\]/);
});

test('upgrade is gated before 2.0 and registered in the component manifest', async () => {
  const installer = await read('package/component/script.php');
  assert.match(installer, /version_compare\(\$manifest\['version'\], '2.0.0', '<'\)/);
  assert.match(installer, /if \(!\$this->upgradeVisuals \|\| \$type !== 'update'\)/);
  assert.match(await read('package/component/smartbrowser.xml'), /<scriptfile>script.php<\/scriptfile>/);
});

test('tree roots use adapter symbols and breadcrumb starts with a closed node', async () => {
  assert.match(await read('resources/js/components/ResourceTree.vue'), /resource-tree-root-icon" :class="adapter.icon"/);
  assert.match(await read('resources/js/components/ResourceBreadcrumb.vue'), /v-if="index === 0" :class="rootIcon"/);
  assert.match(await read('resources/js/components/SmartBrowserApp.vue'), /:root-icon="openNodeIcon"/);
  const registry = await read('package/component/admin/src/Adapter/AdapterRegistry.php');
  for (const icon of ['photo-video', 'book-open', 'boxes', 'hashtag', 'users']) assert.ok(registry.includes('fas fa-' + icon));
});
