import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
test('selection and browser share view-specific Columns and Sort controls without expanded toolbar rows', async () => {
  const [selection, toolbar, picker, popup] = await Promise.all([
    'CollectionView', 'ResourceToolbar', 'ResourceColumnPicker', 'ResourceToolbarPopover',
  ].map(name => read(`resources/js/components/${name}.vue`)));
  assert.match(selection, /ResourceColumnPicker v-if="config.selectedResources && state.activeView === 'details'"/);
  assert.match(selection, /ResourceSortControls v-if="state.activeView === 'grid'/);
  assert.match(toolbar, /ResourceColumnPicker/);
  assert.match(toolbar, /ResourceSortControls/);
  assert.doesNotMatch(selection, /sb-collection-column-choices|resource-search-control/);
  assert.doesNotMatch(toolbar, /resource-toolbar-expanded/);
  assert.match(picker, /column.defaultVisible !== false/);
  assert.match(picker, /column.id === 'title' \|\| column.id === 'name'/);
  assert.match(popup, /popover="inlineMode \? undefined : 'auto'"/);
  assert.match(popup, /event.key !== 'Escape' \|\| !open.value/);
  assert.match(popup, /ResizeObserver/);
});

test('disabling stored ordering hides its sort choice/header without disabling view sorting', async () => {
  const selection = await read('resources/js/components/CollectionView.vue');
  assert.match(selection, /:default-value="config.allowOrdering === false \? null : 'collectionOrder'"/);
  assert.match(selection, /:ordering-field="config.allowOrdering === false \? undefined : 'collectionOrder'"/);
  assert.match(selection, /config.allowOrdering === false && value === 'collectionOrder'\) state.sortBy = 'title'/);
  assert.match(selection, /ResourceSortControls[^>]+:fields="sortFields"/);
});

test('sort expands away from its aligned trigger and selection ordering follows Replace', async () => {
  const selection = await read('resources/js/components/CollectionView.vue');
  const sort = await read('resources/js/components/ResourceSortControls.vue');
  const popup = await read('resources/js/components/ResourceToolbarPopover.vue');
  const css = await read('package/component/media/css/smartbrowser.css');
  assert.match(sort, /icon="fas fa-signal"/);
  assert.match(selection, /@click="collectionSort.open\(\)"><span class="fas fa-sort"/);
  assert.match(selection, /id: 'collectionSort', label: 'COM_SMARTBROWSER_COLLECTION_SORT', icon: 'fas fa-sort'/);
  assert.doesNotMatch(selection, /fa-signal/);
  assert.match(selection, /ResourceSortControls[^>]+alignment="start"/);
  assert.match(css, /\.resource-toolbar-popup.is-inline.is-aligned-start \{ flex-direction: row-reverse; \}/);
  assert.match(popup, /focus\(\{ preventScroll: true \}\)/);
  const template = selection.slice(0, selection.indexOf('</template>'));
  assert.ok(template.indexOf('<ResourceOrderingControls') > template.indexOf('v-if="replaceAction"'));
  assert.ok(template.indexOf('@click="collectionSort.open()"') > template.indexOf('<ResourceOrderingControls'));
});

test('external Selection Views receive advanced Sort translations from the shared language keys', async () => {
  const support = await read('package/component/admin/src/Support/BrowserViewSupport.php');
  const shared = support.slice(support.indexOf('public function languageKeys()'));
  for (const key of ['COM_SMARTBROWSER_BATCH_SORT', 'COM_SMARTBROWSER_BATCH_EXTRACT', 'COM_SMARTBROWSER_BATCH_EXTRACT_DELETE']) {
    assert.ok(shared.includes(`'${key}'`), key);
    for (const language of ['en-GB', 'el-GR']) assert.match(await read(`package/component/admin/language/${language}/com_smartbrowser.ini`), new RegExp(`${key}="[^"\\r\\n]+"`));
  }
  assert.match(await read('package/component/admin/src/Support/CollectionViewSupport.php'), /->languageKeys\(\)/);
});
