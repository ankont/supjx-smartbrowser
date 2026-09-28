import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('flat location columns expose the immediate node and full path tooltip', async () => {
  const [flat, categories, articles, menus, list, grid] = await Promise.all([
    source('package/component/admin/src/Adapter/FlatHierarchyAdapter.php'),
    source('package/component/admin/src/Adapter/FlatCategoryAdapter.php'),
    source('package/component/admin/src/Adapter/FlatArticleAdapter.php'),
    source('package/component/admin/src/Adapter/MenuAdapter.php'),
    source('resources/js/components/ResourceDetails.vue'),
    source('resources/js/components/ResourceGrid.vue'),
  ]);
  for (const adapter of [flat, categories, articles]) {
    assert.match(adapter, /COM_SMARTBROWSER_LOCATION/);
    assert.match(adapter, /locationPath/);
  }
  assert.doesNotMatch(menus.match(/'columns' => \[[\s\S]*?\],\s*'gridFields'/)?.[0] || '', /'id' => 'menu'|'id' => 'parent'/);
  assert.match(list, /column\.id === 'location'/);
  assert.match(list, /resource\.metadata\?\.locationPath/);
  assert.match(list, /scope="row" :title="resource\.title"/);
  assert.match(grid, /COM_SMARTBROWSER_NAME'\)}: \$\{resource\.title\}/);
});
