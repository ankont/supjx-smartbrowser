import test from 'node:test';
import assert from 'node:assert/strict';
import PersistenceService, { browserStateKey } from '../resources/js/services/PersistenceService.js';
import { flatUiStorageKey } from '../resources/js/core/flatViewNavigation.js';

test('management state is shared by the adapter across roots and regular/flat navigation', () => {
  const options = { mode: 'manage', adapter: 'articles', browseRoot: 'category:1' };
  const key = browserStateKey(options);
  assert.equal(browserStateKey({ ...options, adapter: 'flat-articles', browseRoot: 'category:9' }), key);
  assert.notEqual(browserStateKey({ ...options, adapter: 'categories' }), key);
  const values = new Map(), storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  new PersistenceService(storage, key).save({ showInfo: true, activeView: 'details', filters: { state: 'all' } });
  const restored = new PersistenceService(storage, browserStateKey({ ...options, browseRoot: 'category:8' })).load({});
  assert.equal(restored.showInfo, true);
  assert.equal(restored.activeView, 'details');
  assert.deepEqual(restored.filters, { state: 'all' });
  assert.equal(flatUiStorageKey('flat-articles', 'category:8', 'https://test/?flatFromBrowseRoot=category:7', true), flatUiStorageKey('articles', 'category:1', 'https://test/', true));
});

test('picker state is isolated from management and scoped by a stable caller key', () => {
  const options = { mode: 'select', adapter: 'articles', browseRoot: 'category:1' };
  assert.equal(browserStateKey(options), browserStateKey({ ...options, browseRoot: 'category:2' }));
  assert.notEqual(browserStateKey(options), browserStateKey({ ...options, mode: 'manage' }));
  assert.notEqual(browserStateKey({ ...options, viewPreferenceKey: 'intro' }), browserStateKey({ ...options, viewPreferenceKey: 'full' }));
  assert.equal(browserStateKey({ ...options, mode: 'manage', pickerInstance: 'test' }), browserStateKey(options));
});
