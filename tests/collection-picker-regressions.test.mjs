import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
test('action toolbar binds its single-argument availability callback to the current selection', () => {
  const app = read('resources/js/components/SmartBrowserApp.vue');
  assert.ok(app.includes(':available="action => actionAvailable(action, selection)"'));
  assert.ok(app.includes('@complete="completeSelection(selection)"'));
  assert.ok(read('tests/fixtures/picker-profiles.html').includes("id: 'checkin'"));
});
test('normal browser exports collection language strings to iframe Picker instances', () => {
  const support = read('package/component/admin/src/Support/BrowserViewSupport.php').split('public function languageKeys()')[1];
  for (const suffix of ['TITLE', 'REMOVE', 'EMPTY', 'UNAVAILABLE']) assert.ok(support.includes('COM_SMARTBROWSER_COLLECTION_' + suffix));
});
test('flat views are not adapter descriptors and mixed Picker keeps adapter navigation in flat mode', () => {
  const registry = read('package/component/admin/src/Adapter/AdapterRegistry.php').split('public function descriptors()')[1].split('private function canUse')[0];
  assert.ok(!registry.includes("'id' => 'flat-"));
  const app = read('resources/js/components/SmartBrowserApp.vue');
  assert.ok(app.includes('(!flatActive || collectionMode) && !treeCollapsed'));
  assert.ok(app.includes("'flat-mode': flatActive && !collectionMode"));
});
test('optional generic Add command is in the collection toolbar before Remove, including compact/empty fields', () => {
  const view = read('resources/js/components/CollectionView.vue');
  assert.ok(view.indexOf('v-if="canAdd" class="resource-icon-button"') < view.indexOf('v-if="model.canRemove" class="resource-icon-button"'));
  assert.ok(view.includes("typeof props.config.onAdd === 'function'"));
  assert.ok(view.includes("config.layout !== 'compact' || model.canOrder || canAdd"));
  assert.ok(read('resources/js/selection-field.js').includes('onAdd: () => pick()'));
  assert.ok(!read('package/component/admin/src/Field/SmartbrowserpickerField.php').includes('data-sb-select'));
});
test('collection count is a footer, while Picker has one actionable summary with colon and no duplicate count', () => {
  const view = read('resources/js/components/CollectionView.vue');
  assert.ok(view.includes('<footer v-if="config.showCount !== false"'));
  assert.ok(view.indexOf('<footer') > view.indexOf('<component v-else'));
  const app = read('resources/js/components/SmartBrowserApp.vue');
  assert.ok(app.includes('showCount: false'));
  assert.ok(app.includes("t('COM_SMARTBROWSER_COLLECTION_TITLE') }}:"));
  assert.ok(app.includes('resource-picker-collection-chevron'));
});
test('embedded collection menus escape both scroll containers and removal wording covers single selection', () => {
  const css = read('package/component/media/css/smartbrowser.css');
  assert.match(css, /\.smartbrowser-collection \.resource-browser \{[^}]*overflow: visible/);
  assert.match(css, /\.smartbrowser-collection \.resource-details-view \{[^}]*overflow: visible/);
  assert.match(css, /\.smartbrowser-collection:has\(\.resource-item-menu\) \{[^}]*z-index: 41/);
  assert.match(css, /\.smartbrowser-collection \.resource-browser:has\(\.resource-item-menu\) \{[^}]*z-index: 1/);
  assert.ok(read('package/component/admin/language/el-GR/com_smartbrowser.ini').includes('COM_SMARTBROWSER_COLLECTION_REMOVE="Αφαίρεση"'));
});
