import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { itemMenuActions } from '../resources/js/core/itemMenuActions.js';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('native permanent deletion preflights all selected states/ACL and ZIP entries reject traversal and bombs', () => {
  const result = spawnSync('php', ['tests/resource-maintenance.php'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
test('permanent Delete is separate from Restore and hidden for non-trashed item menus', () => {
  const actions = [{id:'trash',requiresSelection:true,exclusiveGroup:'trashState'}, {id:'restore',requiresSelection:true,exclusiveGroup:'trashState'}, {id:'delete',requiresSelection:true,trashedOnly:true}];
  const available = (action, [resource]) => Boolean(resource.capabilities?.[action.id]);
  const active = { actionable:true,status:1,capabilities:{trash:true} };
  const trashed = { actionable:true,status:-2,capabilities:{restore:true,delete:true} };
  assert.deepEqual(itemMenuActions(actions,active,available).map(action=>action.id),['trash']);
  assert.deepEqual(itemMenuActions(actions,trashed,available).map(action=>action.id),['restore','delete']);
  assert.deepEqual(itemMenuActions(actions,{...trashed,capabilities:{delete:true}},available).map(action=>action.id),['restore','delete']);
});
test('single Picker hides row and header checkboxes, multiple and manage keep them', () => {
  assert.ok(read('resources/js/components/SmartBrowserApp.vue').includes(':selection-controls="options.mode !== \'select\' || options.multiple"'));
  for (const view of ['ResourceGrid','ResourceDetails']) assert.ok(read(`resources/js/components/${view}.vue`).includes('v-if="selectionControls && canSelectResource(resource)"'));
});
test('trashed Articles retain category navigation and Direct Links have one URL info field', () => {
  assert.ok(read('package/component/admin/src/Adapter/ArticleAdapter.php').includes("$stateFilter === 'trashed'"));
  const links = read('package/component/admin/src/Adapter/DirectLinksAdapter.php');
  assert.ok(links.includes("'mail'=>'fas fa-at'"));
  assert.ok(!links.includes("'source'=>'metadata.uri']"));
});
test('ZIP extraction uses provider writes without overwrite and optional deletion only after completion', () => {
  const runner = read('package/component/admin/src/Support/MediaBatchRunner.php');
  assert.ok(!runner.includes('extractTo('));
  assert.ok(runner.includes('ZipEntries::validate($entries)'));
  assert.ok(runner.includes('$this->api->createFile($provider, $filename, $directory, $data, false)'));
  assert.ok(runner.indexOf('$complete = true;') < runner.indexOf('if ($deleteArchive) $this->api->delete'));
});
test('batch persisted sorting keeps featured ordering separate and uses the view sort definitions', () => {
  const runner = read('package/component/admin/src/Support/BatchRunner.php');
  assert.ok(runner.includes("$adapter->getId() === 'featured-articles'"));
  assert.ok(runner.includes('new FeaturedOrderingService'));
  assert.ok(runner.includes('new OrderingService'));
  assert.ok(read('package/component/admin/src/Support/OrderingService.php').includes("$adapter->getCollectionPresentation()['sortFields']"));
});
