import assert from 'node:assert/strict';
import test from 'node:test';
import { itemMenuActions } from '../resources/js/core/itemMenuActions.js';

const actions = [
  { id: 'edit', requiresSelection: true },
  { id: 'publish', requiresSelection: true, exclusiveGroup: 'publication' },
  { id: 'unpublish', requiresSelection: true, exclusiveGroup: 'publication' },
  { id: 'feature', requiresSelection: true, exclusiveGroup: 'featured' },
  { id: 'unfeature', requiresSelection: true, exclusiveGroup: 'featured' },
  { id: 'archive', requiresSelection: true, exclusiveGroup: 'archiveState' },
  { id: 'unarchive', requiresSelection: true, exclusiveGroup: 'archiveState' },
  { id: 'checkin', requiresSelection: true },
];

test('item menu keeps one enabled action from each complementary pair', () => {
  const resource = { actionable: true, overlays: [{ action: 'unpublish' }, { action: 'unfeature' }] };
  const available = (action) => ['edit', 'unpublish', 'unfeature'].includes(action.id);
  assert.deepEqual(itemMenuActions(actions, resource, available).map((action) => action.id), ['edit', 'unpublish', 'unfeature', 'archive']);
});

test('item menu uses the overlay action when a pair is unavailable', () => {
  const resource = { actionable: true, overlays: [{ action: 'unpublish' }, { action: 'feature' }] };
  assert.deepEqual(itemMenuActions(actions, resource, () => false).map((action) => action.id), ['edit', 'unpublish', 'feature', 'archive']);
});

test('archived item offers unarchive instead of disabled archive', () => {
  const resource = { actionable: true, overlays: [{ action: 'unarchive' }] };
  const available = (action) => ['publish', 'unarchive'].includes(action.id);
  assert.deepEqual(itemMenuActions(actions, resource, available).map((action) => action.id), ['edit', 'publish', 'feature', 'unarchive']);
});

test('check-in stays hidden unless available', () => {
  const resource = { actionable: true, overlays: [] };
  assert.equal(itemMenuActions(actions, resource, (action) => action.id === 'checkin').at(-1).id, 'checkin');
  assert.equal(itemMenuActions(actions, resource, () => false).some((action) => action.id === 'checkin'), false);
});

test('user removal and deletion coexist when both are available', () => {
  const userActions = [
    { id: 'removeFromGroup', requiresSelection: true },
    { id: 'delete', requiresSelection: true },
  ];
  const resource = { actionable: true, overlays: [] };
  assert.deepEqual(itemMenuActions(userActions, resource, () => true).map((action) => action.id), ['removeFromGroup', 'delete']);
  assert.deepEqual(itemMenuActions(userActions, resource, (action) => action.id === 'delete').map((action) => action.id), ['delete']);
});

test('trash and restore share one position and follow the item state', () => {
  const paired = [
    { id: 'edit', requiresSelection: true },
    { id: 'trash', requiresSelection: true, exclusiveGroup: 'trashState' },
    { id: 'restore', requiresSelection: true, exclusiveGroup: 'trashState' },
  ];
  const active = { actionable: true, overlays: [] };
  const trashed = { actionable: true, overlays: [{ action: 'restore' }] };

  assert.deepEqual(itemMenuActions(paired, active, (action) => action.id === 'trash').map((action) => action.id), ['edit', 'trash']);
  assert.deepEqual(itemMenuActions(paired, trashed, (action) => action.id === 'restore').map((action) => action.id), ['edit', 'restore']);
  assert.deepEqual(itemMenuActions(paired, trashed, () => false).map((action) => action.id), ['edit', 'restore']);
});
