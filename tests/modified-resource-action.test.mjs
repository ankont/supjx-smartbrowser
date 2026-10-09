import test from 'node:test';
import assert from 'node:assert/strict';
import { modifiedResourceAction, defaultResourceAction } from '../resources/js/core/defaultResourceAction.js';
import { itemMenuActions } from '../resources/js/core/itemMenuActions.js';
const node = { kind: 'node', navigable: true, actionable: true, selectable: true };
const edit = { id: 'edit', requiresSelection: true };
const preview = { id: 'preview', requiresSelection: true };
test('nodes open normally, Ctrl edits in manage and selects in selection subject to constraints', () => {
  assert.equal(defaultResourceAction(node, 'manage', [edit], () => true).id, 'browseOpen');
  assert.equal(modifiedResourceAction(node, 'manage', [edit, preview], () => true), edit);
  assert.equal(modifiedResourceAction(node, 'manage', [edit], () => false), null);
  assert.equal(modifiedResourceAction(node, 'select', [], () => false, 'both').id, 'pickerSelect');
  assert.equal(modifiedResourceAction(node, 'select', [], () => false, 'item'), null);
  assert.equal(modifiedResourceAction({ ...node, selectable: false }, 'select', [], () => false), null);
  assert.equal(modifiedResourceAction(node, 'readonly', [edit], () => true), null);
  assert.equal(modifiedResourceAction({ ...node, kind: 'item' }, 'manage', [edit, preview], () => true), preview);
});
test('menus show default once in bold and distinct modified selection/action once in italics', () => {
  const primary = defaultResourceAction(node, 'select', [], () => true);
  const modified = modifiedResourceAction(node, 'select', [], () => true);
  const actions = itemMenuActions([], node, () => true, primary, modified);
  assert.deepEqual(actions.map(action => action.id), ['browseOpen', 'pickerSelect']);
  assert.equal(actions[0].isDefault, true); assert.equal(actions[1].isModified, true);
  const managed = itemMenuActions([edit], node, () => true, primary, edit);
  assert.equal(managed.filter(action => action.id === 'edit').length, 1);
});
