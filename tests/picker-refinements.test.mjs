import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { nextTick } from 'vue';
import { columnCatalog } from '../resources/js/core/columnCatalog.js';
import { createCollectionState } from '../resources/js/core/collectionState.js';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('column catalog deduplicates identical sources even when an adapter uses different IDs', () => {
  const columns = columnCatalog({ columns:[{id:'uri',label:'URL',source:'metadata.url'}], infoFields:[
    {label:'URL',source:'metadata.url'}, {label:'Type',source:'metadata.uriTypeLabel',sortField:'uriTypeLabel'},
  ] }, 'direct-links');
  assert.equal(columns.filter(column=>column.source === 'metadata.url').length, 1);
  assert.equal(columns.find(column=>column.source === 'metadata.uriTypeLabel').sortField, 'uriTypeLabel');
});
test('grid sorting retains all declared fields including fields for hidden columns', () => {
  const body = read('resources/js/components/ResourceToolbar.vue').match(/const effectiveSortFields = computed\(\(\) => \{([\s\S]*?)\n\}\);/)[1];
  const fields = new Function('props','defaultSortFields',body)({
    sortFields:[{id:'title'},{id:'url'},{id:'uriTypeLabel'}], columns:[{id:'title'}], hiddenColumns:['url','uriTypeLabel'],
  }, []);
  assert.deepEqual(fields.map(field=>field.id), ['title','url','uriTypeLabel']);
  assert.ok(read('resources/js/components/SmartBrowserApp.vue').includes(':columns="availableColumns"'));
});
test('compact collection view choice is remembered without persisting selection or ordering', async () => {
  const previous = globalThis.window;
  const saved = new Map();
  globalThis.window = {localStorage:{getItem:key=>saved.get(key),setItem:(key,value)=>saved.set(key,value)}};
  const create = () => createCollectionState({config:{adapter:'articles',layout:'compact',items:[]},
    api:{collection:async ids=>({identifiers:ids,resources:[]})},notify(){}});
  let first, second;
  try {
    first = create();
    assert.equal(first.browser.state.activeView, 'details');
    first.browser.state.activeView = 'grid';
    await nextTick();
    second = create();
    assert.equal(second.browser.state.activeView, 'grid');
    assert.deepEqual(second.getItems(), []);
    assert.equal(saved.get('supjx.smartbrowser.collection.view'), 'grid');
    const component = read('resources/js/components/CollectionView.vue');
    assert.ok(component.includes(':is="state.activeView === \'details\' ? ResourceDetails : ResourceGrid"'));
    assert.ok(component.indexOf('v-for="view in views"') > component.indexOf('</template>'));
  } finally { first?.destroy();second?.destroy();globalThis.window=previous; }
});
test('collection view storage restrictions do not break editing', () => {
  const previous = globalThis.window;
  globalThis.window = {get localStorage(){throw new Error('Storage blocked');}};
  const model = createCollectionState({config:{adapter:'articles',layout:'compact',items:[]},api:{},notify(){}});
  try { assert.equal(model.browser.state.activeView,'details'); }
  finally {model.destroy();globalThis.window=previous;}
});
test('toolbar cancellation closes only its Picker instance and returns no selection', async () => {
  const dialogs = [], listeners = new Map();
  const document = {currentScript:null,addEventListener:(name,handler)=>listeners.set(handler,name),removeEventListener:(name,handler)=>listeners.delete(handler),
    body:{appendChild(){}},createElement(){
      const frame = {contentWindow:{}};const events = new Map();
      const dialog = {frame,querySelector:()=>frame,addEventListener:(name,handler)=>events.set(name,handler),
        close(){events.get('close')?.();},remove(){this.removed=true;},showModal(){}};
      dialogs.push(dialog);return dialog;
    }};
  const window = {location:{href:'https://example.test/index.php'},SmartBrowserMediaValue:{selectionLocation:()=>({})},SmartBrowserDialogDismiss:{install(){}}};
  runInNewContext(read('package/component/media/js/picker.js'),{window,document,URL,Joomla:{getOptions:()=>({})}});
  let notified = 0;
  const first = window.SmartBrowserPicker.open({onSelect(){notified++;}});
  const second = window.SmartBrowserPicker.open();
  const context = index => window.SmartBrowserPicker.context(new URL(dialogs[index].frame.src).searchParams.get('pickerInstance'),dialogs[index].frame.contentWindow);
  context(0).cancel();
  assert.equal(await first,null);assert.equal(notified,0);
  assert.equal(context(0),null);assert.ok(context(1));assert.ok(!dialogs[1].removed);
  context(1).cancel();assert.equal(await second,null);assert.equal(listeners.size,0);
  const actions = read('resources/js/components/ResourceActions.vue');
  assert.ok(actions.indexOf('class="btn btn-outline-secondary resource-picker-cancel"') > actions.indexOf('resource-batch-toggle'));
  assert.ok(actions.indexOf('resource-picker-cancel') < actions.indexOf('class="resource-filter-buttons"'));
  assert.ok(!read('package/component/media/js/picker.js').includes('class="btn-close"'));
});
