import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { effectScope } from 'vue';
import createBrowserState from '../resources/js/core/createBrowserState.js';
import { referenceKey } from '../resources/js/core/selectionIdentity.js';
import { createSelectionUsage } from '../resources/js/core/selectionUsage.js';

test('stateless URI adapter preserves canonical references and rejects unsafe destinations', () => {
  const result=spawnSync('php',['tests/direct-links.php'],{encoding:'utf8'});
  assert.equal(result.status,0,result.stdout+result.stderr);
});
const setup=(items=[],multiple=true,homogeneous=false) => {
  const scope=effectScope();
  const options={ adapter:'direct-links',selectionState:true,mode:'select',multiple,selectionTarget:'item',roots:[],actions:[],
    pickerContext:{collectionMode:true,homogeneous,getCollectionSnapshot:()=>({items,resources:{}})} };
  const api={options:{},getResources:async()=>({nodes:[],items:[],breadcrumb:[],presentation:{selectionScoped:true}})};
  const browser=scope.run(()=>createBrowserState({options,api,persistence:{load:value=>value,save(){}},viewRegistry:{has:()=>true}}));
  return {browser,scope,api};
};
const resource=id=>({id,adapter:'direct-links',kind:'item',type:'uri',parentId:'direct-links:web',title:id,selectable:true});
test('local replacement preserves ordered position, prevents duplicates and removes the orphan identity', () => {
  const {browser,scope}=setup();
  try {
    const a=browser.replaceSelectionResource(resource('uri:a'));
    const b=browser.replaceSelectionResource(resource('uri:b'));
    const edited=browser.replaceSelectionResource(resource('uri:c'),a);
    assert.deepEqual(browser.state.selectedIds,[referenceKey({adapter:'direct-links',id:'uri:c'}),b.selectionKey]);
    assert.equal(browser.state.selectedResources[a.selectionKey],undefined);
    assert.throws(()=>browser.replaceSelectionResource(resource('uri:b'),edited),/DUPLICATE/);
    assert.throws(()=>browser.replaceSelectionResource(resource('uri:b')),/DUPLICATE/);
  } finally {scope.stop();}
});

test('URI label changes retain order and usage identity while duplicate destinations stay forbidden', () => {
  const {browser,scope}=setup();
  try {
    const first=browser.replaceSelectionResource({...resource('uri:YWJj.b25l'), uniquenessId:'uri:YWJj'});
    const second=browser.replaceSelectionResource(resource('uri:ZGVm'));
    assert.throws(()=>browser.replaceSelectionResource({...resource('uri:YWJj.dHdv'), uniquenessId:'uri:YWJj'}), /DUPLICATE/);
    const renamed=browser.replaceSelectionResource({...resource('uri:YWJj.dHdv'), uniquenessId:'uri:YWJj'}, first);
    assert.deepEqual(browser.state.selectedIds, [renamed.selectionKey, second.selectionKey]);
    assert.equal(browser.state.virtualResources[first.selectionKey], undefined);
  } finally {scope.stop();}
});
test('single creation replaces selection; homogeneous constraints prevent selection but not creation', () => {
  const initial=[{selection:{adapter:'articles',id:'article:42'},usage:{}}];
  for (const [multiple,homogeneous] of [[false,false],[true,true]]) {
    const {browser,scope}=setup(initial,multiple,homogeneous);
    try {
      assert.equal(browser.canAddSelection('direct-links','uri'), !multiple);
      assert.equal(browser.canCreateSelectionResource('uri'), true);
      browser.state.presentation={selectionScoped:true}; browser.state.selectedNode='direct-links:web';
      const created=browser.replaceSelectionResource(resource('uri:a'));
      assert.equal(browser.state.selectedIds.length,1);
      assert.equal(browser.state.selectedIds[0], multiple ? referenceKey(initial[0].selection) : created.selectionKey);
      assert.equal(browser.resources.value[0].selectable, !multiple);
      if (multiple) { browser.toggle(browser.resources.value[0]); assert.equal(browser.state.selectedIds[0], referenceKey(initial[0].selection)); }
    }
    finally {scope.stop();}
  }
  const {browser,scope}=setup(initial,true,false);
  try { assert.equal(browser.canAddSelection('direct-links','uri'),true); browser.replaceSelectionResource(resource('uri:a')); assert.equal(browser.state.selectedIds.length,2); }
  finally {scope.stop();}
});

test('selection-scoped grids retain deselected resources until explicit deletion; usage transfers without orphan state', async () => {
  const {browser,scope,api}=setup();
  try {
    browser.state.presentation={selectionScoped:true}; browser.state.selectedNode='direct-links:web';
    const a=browser.replaceSelectionResource(resource('uri:a'));
    assert.equal(browser.resources.value.length,1);
    assert.equal(api.options.selectionItems()[0].selection.id,'uri:a');
    browser.state.selectedNode='direct-links:mail'; assert.equal(browser.resources.value.length,0);
    browser.state.selectedNode='direct-links:web';
    const definitions=[{key:'visual.iconOverride',type:'string',editor:'text',default:null}];
    a.selectionCapabilities=definitions;
    const usage=createSelectionUsage({profile:{'visual.iconOverride':{}}});
    usage.set(a,'visual.iconOverride','fas fa-book');
    const saved={...usage.get(a)};
    const next=browser.replaceSelectionResource({...resource('uri:new'),selectionCapabilities:definitions},a);
    for(const definition of usage.definitions(next)) usage.set(next,definition.key,saved[definition.key]);
    usage.forget(a);
    assert.equal(usage.get(next)['visual.iconOverride'],'fas fa-book');
    browser.toggle(next); assert.equal(browser.resources.value.length,1);
    assert.equal(browser.selection.value.length,0);
    assert.equal(api.options.selectionItems().length,1);
    browser.deleteVirtualResources([next]); assert.equal(browser.resources.value.length,0);
    assert.equal(api.options.selectionItems().length,0);
  } finally {scope.stop();}
});
