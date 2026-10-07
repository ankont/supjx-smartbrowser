import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultResourceAction, resourcePreviewAction } from '../resources/js/core/defaultResourceAction.js';
import { itemMenuActions } from '../resources/js/core/itemMenuActions.js';

const edit = { id: 'edit', requiresSelection: true };
const item = { kind: 'item', actionable: true, activatable: true, selectable: true };
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
