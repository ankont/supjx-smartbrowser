import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { flatRootUrl, flatUiStorageKey, flatViewUrl, regularViewUrl } from '../resources/js/core/flatViewNavigation.js';

test('flat breadcrumb returns to the natural root without losing the regular-view destination', () => {
  const flat = flatViewUrl('https://example.test/index.php?adapter=articles&node=category%3A12', 'articles', 'category:12', null);
  const root = new URL(flatRootUrl(flat, 'content:root'));
  assert.equal(root.searchParams.has('browseRoot'), false);
  assert.equal(root.searchParams.get('flatFromNode'), 'content:root');
  assert.equal(new URL(regularViewUrl(root.toString(), null)).searchParams.get('node'), 'content:root');
});

test('flat breadcrumb respects a constrained root', () => {
  const flat = flatViewUrl('https://example.test/index.php?adapter=articles&browseRoot=category%3A10&node=category%3A12', 'articles', 'category:12', 'category:10');
  const root = new URL(flatRootUrl(flat, 'category:10'));
  assert.equal(root.searchParams.get('browseRoot'), 'category:10');
  assert.equal(root.searchParams.get('flatFromNode'), 'category:10');
  const tags = flatViewUrl('https://example.test/index.php?adapter=tags&node=tag%3A5', 'tags', 'tag:5', null);
  assert.equal(new URL(flatRootUrl(tags, 'tags:root')).searchParams.get('flatScope'), 'tags:root');
});

test('flat and regular article views share UI state despite a scoped flat browse root', () => {
  const regular = 'https://example.test/index.php?adapter=articles&node=category%3A12';
  const flat = flatViewUrl(regular, 'articles', 'category:12', null);
  assert.equal(flatUiStorageKey('articles', null, regular), flatUiStorageKey('flat-articles', 'category:12', flat));
  assert.equal(flatUiStorageKey('articles', null, regular), flatUiStorageKey('articles', null, regularViewUrl(flat, 'category:12')));
});

test('flat view scopes a category and returns to the same adapter and node', () => {
  const start = 'https://example.test/index.php?option=com_smartbrowser&adapter=categories&node=category%3A42';
  const flat = new URL(flatViewUrl(start, 'categories', 'category:42', null));
  assert.equal(flat.searchParams.get('adapter'), 'flat-categories');
  assert.equal(flat.searchParams.get('browseRoot'), 'category:42');
  assert.equal(flat.searchParams.get('node'), 'flat-categories:root');

  const regular = new URL(regularViewUrl(flat.toString(), 'category:42'));
  assert.equal(regular.searchParams.get('adapter'), 'categories');
  assert.equal(regular.searchParams.get('node'), 'category:42');
  assert.equal(regular.searchParams.has('browseRoot'), false);
});

test('flat view retains an existing browse root for the return trip', () => {
  const start = 'https://example.test/index.php?option=com_smartbrowser&adapter=articles&browseRoot=category%3A10&node=category%3A12';
  const flat = flatViewUrl(start, 'articles', 'category:12', 'category:10');
  assert.equal(new URL(flat).searchParams.get('browseRoot'), 'category:12');

  const regular = new URL(regularViewUrl(flat, 'category:12'));
  assert.equal(regular.searchParams.get('adapter'), 'articles');
  assert.equal(regular.searchParams.get('node'), 'category:12');
  assert.equal(regular.searchParams.get('browseRoot'), 'category:10');
});

test('flat view at the natural root covers all articles', () => {
  const flat = new URL(flatViewUrl('https://example.test/index.php?adapter=articles&node=content%3Aroot', 'articles', 'content:root', null));
  assert.equal(flat.searchParams.has('browseRoot'), false);
  assert.equal(new URL(regularViewUrl(flat.toString(), null)).searchParams.get('node'), 'content:root');
});

test('flat categories at the natural root stay categories', () => {
  const flat = new URL(flatViewUrl('https://example.test/index.php?adapter=categories&node=content%3Aroot', 'categories', 'content:root', null));
  assert.equal(flat.searchParams.get('adapter'), 'flat-categories');
  assert.equal(flat.searchParams.get('node'), 'flat-categories:root');
  assert.equal(flat.searchParams.has('browseRoot'), false);
});

test('flat categories expose descendants and their location without articles', async () => {
  const adapter = await readFile(new URL('../package/component/admin/src/Adapter/FlatCategoryAdapter.php', import.meta.url), 'utf8');
  assert.match(adapter, /getChildren\(true\)/);
  assert.match(adapter, /'metadata'\]\['location'\]/);
  assert.match(adapter, /COM_SMARTBROWSER_LOCATION/);
  assert.match(adapter, /'items' => \[\]/);
});

test('other flat views retain their own adapter, scope, and browse boundary', () => {
  for (const [adapter, node] of [
    ['tags', 'tag:5'], ['articles-by-tag', 'tag:5'], ['menus', 'menu:main'],
    ['users', 'user-group:3'], ['media', 'local-images:/photos'],
  ]) {
    const start = `https://example.test/index.php?adapter=${adapter}&node=${encodeURIComponent(node)}`;
    const flat = new URL(flatViewUrl(start, adapter, node, null));
    assert.equal(flat.searchParams.get('adapter'), `flat-${adapter}`);
    assert.equal(flat.searchParams.get('node'), `flat-${adapter}:root`);
    assert.equal(flat.searchParams.get('flatScope'), node);
    const regular = new URL(regularViewUrl(flat.toString(), null));
    assert.equal(regular.searchParams.get('adapter'), adapter);
    assert.equal(regular.searchParams.get('node'), node);
    assert.equal(regular.searchParams.has('flatScope'), false);
  }
});

test('generic flat adapter traverses descendants and keeps actions on the source', async () => {
  const adapter = await readFile(new URL('../package/component/admin/src/Adapter/FlatHierarchyAdapter.php', import.meta.url), 'utf8');
  assert.match(adapter, /while \(\$queue\)/);
  assert.match(adapter, /array_pop\(\$queue\)/);
  assert.match(adapter, /usort\(\$children/);
  assert.match(adapter, /\['metadata'\]\['ordering'\]/);
  assert.match(adapter, /array_reverse\(\$next\)/);
  assert.match(adapter, /'metadata'\]\['parent'\]/);
  assert.match(adapter, /return \$this->source->executeAction\(\$action, \$selection, \$payload\)/);
  assert.match(adapter, /FlatLevels::limit\(\$options\)/);
});

test('flat views expose max levels and restrict results to that depth', async () => {
  const levels = await readFile(new URL('../package/component/admin/src/Adapter/FlatLevels.php', import.meta.url), 'utf8');
  const categories = await readFile(new URL('../package/component/admin/src/Adapter/FlatCategoryAdapter.php', import.meta.url), 'utf8');
  const articles = await readFile(new URL('../package/component/admin/src/Adapter/FlatArticleAdapter.php', import.meta.url), 'utf8');
  const hierarchy = await readFile(new URL('../package/component/admin/src/Adapter/FlatHierarchyAdapter.php', import.meta.url), 'utf8');
  assert.match(levels, /COM_SMARTBROWSER_MAX_LEVELS/);
  assert.match(categories, /\$category->level - \(int\) \$root->level \+ \$firstLevel > \$maxLevels/);
  assert.match(articles, /\$category->level - \$rootLevel \+ \$firstLevel <= \$maxLevels/);
  assert.match(hierarchy, /\$selectedNode = \(string\) \(\$options\['filters'\]\['node'\]/);
  assert.match(hierarchy, /\$level > \$maxLevels/);
  assert.match(hierarchy, /'id' => 'node'[^\n]+\$this->nodeFilterLabel\(\)/);
  assert.match(hierarchy, /'tags', 'articles-by-tag' => 'JTAG'/);
  assert.ok(hierarchy.indexOf("'id' => 'node'") < hierarchy.indexOf("$presentation['filters'][] = FlatLevels::filter()"));
});

test('flat articles stays available without a dashboard tile', async () => {
  const dashboard = await readFile(new URL('../package/component/admin/src/Support/DashboardProvider.php', import.meta.url), 'utf8');
  const registry = await readFile(new URL('../package/component/admin/src/Adapter/AdapterRegistry.php', import.meta.url), 'utf8');
  assert.match(dashboard, /if \(\$id === 'flat-articles'\) continue/);
  assert.match(registry, /'flat-articles' => new FlatArticleAdapter/);
});

test('flat view control follows filters and uses a labelled local icon', async () => {
  const actions = await readFile(new URL('../resources/js/components/ResourceActions.vue', import.meta.url), 'utf8');
  const adapter = await readFile(new URL('../package/component/admin/src/Adapter/FlatArticleAdapter.php', import.meta.url), 'utf8');
  const breadcrumb = await readFile(new URL('../resources/js/components/ResourceBreadcrumb.vue', import.meta.url), 'utf8');
  const css = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  assert.match(actions, /resource-filter-buttons[\s\S]*resource-flat-toggle[\s\S]*resource-manager-link/);
  assert.match(actions, /resource-flat-toggle[^>]*:title="t\('COM_SMARTBROWSER_FLAT_VIEW'\)"[^>]*:aria-label="t\('COM_SMARTBROWSER_FLAT_VIEW'\)"/);
  assert.match(actions, /fas fa-layer-group/);
  assert.match(adapter, /'icon' => \$this->browseRoot \? 'icon-folder' : 'icon-file-alt'/);
  assert.match(breadcrumb, /v-if="crumb.icon"/);
  assert.match(css, /\.resource-actions \.resource-flat-toggle \{[^}]*background: #e8f2fb;/s);
});

test('breadcrumb keeps its root as an icon and tree handle stays outside flat view', async () => {
  const [breadcrumb, app, css, browser] = await Promise.all([
    readFile(new URL('../resources/js/components/ResourceBreadcrumb.vue', import.meta.url), 'utf8'),
    readFile(new URL('../resources/js/components/SmartBrowserApp.vue', import.meta.url), 'utf8'),
    readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8'),
    readFile(new URL('../package/component/admin/src/Support/BrowserViewSupport.php', import.meta.url), 'utf8'),
  ]);
  assert.match(breadcrumb, /const first = items\[0\] \|\| props\.root/);
  assert.match(breadcrumb, /index === 0 && iconOnlyRoot \? crumb\.title/);
  assert.match(breadcrumb, /v-if="index !== 0 \|\| !iconOnlyRoot" class="resource-breadcrumb-title"/);
  assert.match(app, /:icon-only-root="!flatActive && state\.breadcrumb\.length > 1"/);
  assert.match(app, /v-if="!flatActive" type="button" class="resource-sidebar-handle"/);
  assert.match(app, /treeCollapsed = !treeCollapsed/);
  assert.match(css, /\.smartbrowser-layout\.tree-collapsed \{ grid-template-columns: 0 14px minmax\(0, 1fr\); \}/);
  for (const key of ['COM_SMARTBROWSER_HIDE_TREE', 'COM_SMARTBROWSER_SHOW_TREE']) assert.match(browser, new RegExp(`'${key}'`));
});
