import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultResourceAction, resourcePreviewAction, modifiedResourceAction } from '../resources/js/core/defaultResourceAction.js';
import { itemMenuActions } from '../resources/js/core/itemMenuActions.js';

const edit = { id: 'edit', requiresSelection: true };
const item = { kind: 'item', actionable: true, activatable: true, selectable: true };

test('node browsers opt into editing leaves without removing navigation or bypassing permissions', () => {
  const action = { ...edit, defaultOnLeaf: true };
  const leaf = { ...item, kind: 'node', navigable: true, hasChildren: false };
  assert.equal(defaultResourceAction(leaf, 'manage', [action], () => true), action);
  const open = modifiedResourceAction(leaf, 'manage', [action], () => true);
  assert.equal(open.id, 'browseOpen');
  const menu = itemMenuActions([action], leaf, () => true, action, open);
  assert.equal(menu[0].id, 'edit');
  assert.equal(menu.find(entry => entry.id === 'browseOpen').isModified, true);
  for (const resource of [{ ...leaf, hasChildren: true }, { ...leaf, hasChildren: undefined }, { ...leaf, actionable: false }, { ...leaf, activatable: false }, { ...leaf, kind: 'root' }]) {
    assert.equal(defaultResourceAction(resource, 'manage', [action], () => true).id, 'browseOpen');
  }
  assert.equal(defaultResourceAction(leaf, 'manage', [action], () => false).id, 'browseOpen');
  assert.equal(defaultResourceAction(leaf, 'manage', [edit], () => true).id, 'browseOpen', 'Article/media browsers must retain navigation');
  assert.equal(defaultResourceAction(leaf, 'select', [action], () => true).id, 'pickerSelect');
  assert.equal(modifiedResourceAction(leaf, 'select', [action], () => true).id, 'browseOpen');
});

test('node Pickers select eligible leaves independently of edit permission and retain branch navigation', () => {
  const action = { ...edit, defaultOnLeaf: true };
  const leaf = { ...item, kind: 'node', navigable: true, hasChildren: false };
  assert.equal(defaultResourceAction(leaf, 'select', [action], () => false, 'node').id, 'pickerSelect');
  assert.equal(defaultResourceAction(leaf, 'select', [action], () => false, 'both').id, 'pickerSelect');
  for (const resource of [{ ...leaf, hasChildren: true }, { ...leaf, hasChildren: undefined }, { ...leaf, selectable: false }, { ...leaf, activatable: false }]) {
    assert.equal(defaultResourceAction(resource, 'select', [action], () => true, 'node').id, 'browseOpen');
  }
  assert.equal(defaultResourceAction(leaf, 'select', [action], () => true, 'item').id, 'browseOpen');
  assert.equal(defaultResourceAction(leaf, 'select', [edit], () => true, 'node').id, 'browseOpen');
  const primary = defaultResourceAction(leaf, 'select', [action], () => false, 'node');
  const modified = modifiedResourceAction(leaf, 'select', [action], () => false, 'node');
  const menu = itemMenuActions([action], leaf, () => false, primary, modified);
  assert.equal(menu[0].id, 'pickerSelect');
  assert.equal(menu.filter(entry => entry.id === 'browseOpen').length, 1);
});

test('adapter-declared Ctrl action reuses italic menu indication and respects permissions', () => {
  const action = { ...edit, modifiedDefault: true };
  const primary = defaultResourceAction(item, 'select', [action], () => true);
  const secondary = modifiedResourceAction(item, 'select', [action], () => true);
  assert.equal(secondary, action);
  assert.equal(itemMenuActions([action], item, () => true, primary, secondary).find(entry => entry.id === 'edit').isModified, true);
  assert.equal(modifiedResourceAction(item, 'select', [action], () => false), null);
  assert.equal(modifiedResourceAction(item, 'readonly', [action], () => true), null);
  assert.equal(modifiedResourceAction({ ...item, actionable: false }, 'select', [action], () => true), null);
});
test('navigation and picker defaults appear even without adapter context actions', () => {
  const open = defaultResourceAction({ navigable: true }, 'manage', [], () => false);
  assert.equal(open.id, 'browseOpen');
  assert.equal(itemMenuActions([], { navigable: true }, () => true, open)[0].isDefault, true);
  assert.equal(defaultResourceAction(item, 'select', [], () => false).id, 'pickerSelect');
  assert.equal(defaultResourceAction(item, 'select', [], () => false, 'node'), null);
});
test('manage default is permitted edit and is rendered once in bold-default position', () => {
  const action = defaultResourceAction(item, 'manage', [edit], () => true);
  assert.equal(action.id, 'edit');
  assert.deepEqual(itemMenuActions([edit], item, () => true, action), [{ ...edit, isDefault: true }]);
  assert.equal(defaultResourceAction(item, 'manage', [edit], () => false), null);
  assert.equal(defaultResourceAction({ ...item, activatable: false }, 'manage', [edit], () => true), null);
});
test('Ctrl preview is independent of navigation and respects mode and permissions', () => {
  const preview = { id: 'preview', requiresSelection: true };
  assert.equal(resourcePreviewAction({ ...item, navigable: true }, 'manage', [preview], () => true), preview);
  assert.equal(resourcePreviewAction(item, 'select', [preview], () => true), preview);
  assert.equal(resourcePreviewAction(item, 'readonly', [preview], () => true), null);
  assert.equal(resourcePreviewAction(item, 'manage', [preview], () => false), null);
  assert.equal(resourcePreviewAction({ ...item, actionable: false }, 'manage', [preview], () => true), null);
});
