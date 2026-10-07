import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolveResourceVisual } from '../resources/js/core/resourceVisual.js';
test('all hierarchy families keep their own breadcrumb identity and folder open state', async () => {
  const read = name => readFile(new URL(`../package/component/admin/src/Adapter/${name}.php`, import.meta.url), 'utf8');
  const content = await read('ContentAdapter');
  assert.match(content, /'id' => 'tag:'[^\n]*'kind' => 'node', 'type' => 'tag', 'icon' => 'fas fa-tag'/);
  assert.match(await read('UsersAdapter'), /'id' => 'user-group:'[^\n]*'icon' => 'fas fa-users-rectangle'/);
  assert.match(await read('UsersAdapter'), /'type' => 'root', 'icon' => 'fas fa-users'/);
  assert.match(await read('MenuAdapter'), /'type' => 'menu', 'icon' => 'fas fa-diagram-predecessor'/);
  assert.match(await read('MenuAdapter'), /\.\.\.\$this->normalizeItem\(\$item\)/);
  assert.match(await read('MediaAdapter'), /'kind' => 'node', 'icon' => 'fas fa-folder'/);
  for (const name of ['FlatArticleAdapter', 'FlatCategoryAdapter', 'FlatHierarchyAdapter']) assert.match(await read(name), /'kind' => 'node', 'type' => 'root'/);
  assert.match(await read('FeaturedArticleAdapter'), /\$breadcrumb\[0\]\['icon'\] = 'fas fa-star';/);
  for (const icon of ['fas fa-folder', 'fas fa-box', 'fas fa-users-rectangle', 'fas fa-list', 'fas fa-tag', 'fas fa-tags', 'fas fa-users', 'fas fa-star', 'fas fa-file-alt']) {
    const result = resolveResourceVisual({ kind: 'node', icon }, { settings: { rules: [{ asset: 'base', style: 'center', size: 'medium' }] }, open: true, compact: true });
    assert.equal(result.layers[0].icon, ({ 'fas fa-folder': 'fas fa-folder-open', 'fas fa-box': 'fas fa-box-open', 'fas fa-users-rectangle': 'fas fa-users-viewfinder', 'fas fa-tag': 'fas fa-tags' })[icon] || icon);
  }
});
test('category breadcrumbs provide folder metadata rather than falling back to a file', async () => {
  const source = await readFile(new URL('../package/component/admin/src/Adapter/ContentAdapter.php', import.meta.url), 'utf8');
  assert.match(source, /'id' => 'category:'[^\n]*'kind' => 'node', 'type' => 'category', 'icon' => 'fas fa-box'/);
  const rules = [{ asset: 'base', style: 'center', size: 'medium' }, { asset: 'identity', style: 'badge', position: 'bottom-right', size: 'small', anchor: 'center' }];
  const resource = { kind: 'node', type: 'category', icon: 'fas fa-folder', badgeIcon: 'fas fa-book' };
  for (const settings of [{ rules }, {}]) {
    const open = resolveResourceVisual(resource, { settings, open: true, compact: true });
    assert.equal(open.layers.find(layer => layer.asset === 'base').icon, 'fas fa-folder-open');
    assert.equal(open.layers.find(layer => layer.asset === 'identity').icon, 'fas fa-book');
    assert.equal(resolveResourceVisual(resource, { settings, compact: true }).layers.find(layer => layer.asset === 'base').icon, 'fas fa-folder');
  }
});
