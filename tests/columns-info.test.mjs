import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import PersistenceService from '../resources/js/services/PersistenceService.js';
import { iconForField } from '../resources/js/core/fieldIcons.js';

test('column visibility is saved with the other browser preferences', () => {
  const data = new Map();
  const storage = { getItem: (key) => data.get(key), setItem: (key, value) => data.set(key, value) };
  const persistence = new PersistenceService(storage, 'columns');
  persistence.save({ selectedNode: 'root', activeView: 'details', viewOptions: {}, hiddenColumns: ['author', 'dates'], filters: {} });
  assert.deepEqual(persistence.load({}).hiddenColumns, ['author', 'dates']);
});

test('info icons cover column metadata rather than falling back to info', () => {
  for (const source of ['stateLabel', 'access', 'languageKey', 'tags', 'author', 'locationPath', 'url', 'id', 'width', 'size', 'mimeType', 'extension']) {
    assert.notEqual(iconForField({ source: `metadata.${source}` }), 'fas fa-info', source);
  }
});

test('details columns have a selector and separate view-mode group', async () => {
  const toolbar = await readFile(new URL('../resources/js/components/ResourceToolbar.vue', import.meta.url), 'utf8');
  const app = await readFile(new URL('../resources/js/components/SmartBrowserApp.vue', import.meta.url), 'utf8');
  assert.match(toolbar, /resource-column-picker/);
  assert.match(toolbar, /resource-mode-controls/);
  assert.match(toolbar, /pointerdown', closeColumnsOutside/);
  assert.match(app, /:columns="visibleColumns"/);
});

test('info presents content hierarchies instead of navigation location', async () => {
  const panel = await readFile(new URL('../resources/js/components/ResourceInfoPanel.vue', import.meta.url), 'utf8');
  const content = await readFile(new URL('../package/component/admin/src/Adapter/ContentAdapter.php', import.meta.url), 'utf8');
  assert.match(panel, /metadata\.categoryPath/);
  assert.match(panel, /metadata\.tagPaths/);
  assert.match(panel, /!\['metadata\.locationPath'/);
  assert.match(content, /'categoryPath' => implode/);
  assert.match(content, /'tagPaths'\] = implode/);
});
