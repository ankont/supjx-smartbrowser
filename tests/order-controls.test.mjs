import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const source = async (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('ordering controls cover grid and details, reverse direction for descending views', async () => {
  const app = await source('../resources/js/components/SmartBrowserApp.vue');
  const toolbar = await source('../resources/js/components/ResourceToolbar.vue');
  assert.match(app, /\['details', 'grid'\]\.includes\(state\.activeView\)/);
  assert.match(app, /state\.sortBy === state\.presentation\.orderingField/);
  assert.match(app, /state\.sortDirection === 'desc' \? \(direction === 'up' \? 'down' : 'up'\)/);
  assert.match(app, /String\(state\.filters\.featured \?\? ''\) !== '1'/);
  assert.match(app, /options\.adapter === 'featured-articles'/);
  assert.match(app, /api\.execute\('reorder', ids, \{ direction: canonicalDirection \}\)/);
  assert.match(toolbar, /v-if="reorderVisible"/);
  assert.ok(toolbar.indexOf('v-if="reorderVisible"') < toolbar.indexOf("$emit('invert-selection')"));
  assert.match(toolbar, /fields\.push\(\{ id: props\.orderingField, label: 'JGRID_HEADING_ORDERING' \}\)/);
  assert.match(toolbar, /const columnOrder = \(props\.columns \|\| \[\]\)\.flatMap/);
  assert.match(toolbar, /const rank = \(id\) => id === props\.orderingField \? -1/);
});

test('all ordered adapters use native Joomla reorder with permission checks', async () => {
  const service = await source('../package/component/admin/src/Support/OrderingService.php');
  const content = await source('../package/component/admin/src/Adapter/ContentAdapter.php');
  const menu = await source('../package/component/admin/src/Adapter/MenuAdapter.php');
  assert.match(service, /\$model->reorder\(\[\$id\], \$direction === 'up' \? -1 : 1\)/);
  for (const type of ['article', 'category', 'tag', 'menu-item']) assert.match(service, new RegExp(`'${type}' => \\[`, 's'));
  assert.match(service, /capabilities'\]\['reorder'\]/);
  assert.match(content, /'reorder' => \$canFeature/);
  assert.match(menu, /'reorder' => \$identity->authorise\('core\.edit\.state'/);
  for (const adapter of ['ArticleCollectionAdapter', 'CategoryAdapter', 'TagAdapter', 'MenuAdapter']) {
    const code = await source(`../package/component/admin/src/Adapter/${adapter}.php`);
    assert.match(code, /new OrderingService\(\$this->app\)/);
  }
});

test('featured adapter uses Joomla frontpage order, not article category order', async () => {
  const adapter = await source('../package/component/admin/src/Adapter/FeaturedArticleAdapter.php');
  const service = await source('../package/component/admin/src/Support/FeaturedOrderingService.php');
  const model = await source('../package/component/admin/src/Model/FeaturedOrderModel.php');
  const registry = await source('../package/component/admin/src/Adapter/AdapterRegistry.php');
  assert.match(adapter, /\$options\['filters'\]\['featured'\] = '1'/);
  assert.match(adapter, /\$filter\['id'\] !== 'featured'/);
  assert.match(adapter, /\$result\['presentation'\]\['orderingField'\] = 'ordering'/);
  assert.match(adapter, /#__content_frontpage/);
  assert.match(service, /#__content_frontpage/);
  assert.match(service, /new FeaturedOrderModel\(/);
  assert.match(model, /extends FeatureModel/);
  assert.match(model, /core\.edit\.state.*com_content\.article\./);
  assert.match(service, /OrderingSteps::movedIds/);
  assert.match(registry, /'featured-articles' => new FeaturedArticleAdapter/);
});
