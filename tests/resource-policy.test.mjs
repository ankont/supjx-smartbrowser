import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import createBrowserState from '../resources/js/core/createBrowserState.js';
import { asContextualResource, canActOnResource, canBulkSelectResource, canFocusResource, canSelectResource } from '../resources/js/core/resourcePolicy.js';

test('Article adapters share a ContentAdapter base and MediaAdapter stays independent', async () => {
  const article = await readFile(new URL('../package/component/admin/src/Adapter/ArticleAdapter.php', import.meta.url), 'utf8');
  const collection = await readFile(new URL('../package/component/admin/src/Adapter/ArticleCollectionAdapter.php', import.meta.url), 'utf8');
  const media = await readFile(new URL('../package/component/admin/src/Adapter/MediaAdapter.php', import.meta.url), 'utf8');
  const registry = await readFile(new URL('../package/component/admin/src/Adapter/AdapterRegistry.php', import.meta.url), 'utf8');
  assert.match(article, /class ArticleAdapter extends ArticleCollectionAdapter/);
  assert.match(collection, /abstract class ArticleCollectionAdapter extends ContentAdapter/);
  assert.match(media, /class MediaAdapter implements ResourceAdapterInterface/);
  assert.doesNotMatch(registry, /new ContentAdapter/);
});

test('CategoryAdapter is a registered ContentAdapter and contextual provider', async () => {
  const category = await readFile(new URL('../package/component/admin/src/Adapter/CategoryAdapter.php', import.meta.url), 'utf8');
  const registry = await readFile(new URL('../package/component/admin/src/Adapter/AdapterRegistry.php', import.meta.url), 'utf8');
  assert.match(category, /class CategoryAdapter extends ContentAdapter implements ContextResourceProviderInterface/);
  assert.match(category, /'nodes' => \$nodes[\s\S]*'items' => \[\]/);
  assert.match(category, /empty\(\$options\['showContextResources'\]\)/);
  assert.match(category, /'sortBy' => 'ordering'[\s\S]*'sortDirection' => 'asc'/);
  assert.match(registry, /'categories' => new CategoryAdapter/);
  assert.match(registry, /'id' => 'categories'/);
});

test('Category mutations validate resource type and ACL capabilities', async () => {
  const category = await readFile(new URL('../package/component/admin/src/Adapter/CategoryAdapter.php', import.meta.url), 'utf8');
  assert.match(category, /assertCategoryAction\(\$selection, \$action\)/);
  assert.match(category, /str_starts_with\(\(string\) \$resourceId, 'category:'\)/);
  assert.match(category, /empty\(\$resource\['capabilities'\]\[\$action\]\)/);
});

test('TagAdapter is registered as a ContentAdapter with Tag primary resources', async () => {
  const tag = await readFile(new URL('../package/component/admin/src/Adapter/TagAdapter.php', import.meta.url), 'utf8');
  const content = await readFile(new URL('../package/component/admin/src/Adapter/ContentAdapter.php', import.meta.url), 'utf8');
  const registry = await readFile(new URL('../package/component/admin/src/Adapter/AdapterRegistry.php', import.meta.url), 'utf8');
  assert.match(tag, /class TagAdapter extends ContentAdapter implements ContextResourceProviderInterface/);
  assert.match(tag, /protected const ROOT_ID = 'tags:root'/);
  assert.match(tag, /'nodes' => \$nodes[\s\S]*'items' => \[\]/);
  assert.match(content, /'selectable' => \$managed, 'navigable' => true/);
  assert.match(registry, /'tags' => new TagAdapter/);
  assert.match(registry, /'id' => 'tags'/);
  assert.doesNotMatch(registry, /new ContentAdapter/);
});

test('Tag contextual Articles use exact core tag filtering and contextual policy', async () => {
  const tag = await readFile(new URL('../package/component/admin/src/Adapter/TagAdapter.php', import.meta.url), 'utf8');
  const content = await readFile(new URL('../package/component/admin/src/Adapter/ContentAdapter.php', import.meta.url), 'utf8');
  assert.match(tag, /empty\(\$options\['showContextResources'\]\)/);
  assert.match(tag, /getArticlesByTag\(\$tagId/);
  assert.doesNotMatch(tag, /includeChildren|contentitem_tag_map|descendant.*Article/i);
  assert.match(content, /setState\('filter\.tag', \(string\) \(\$filters\['tag'\]/);
  assert.match(content, /'role' => 'contextual'/);
  assert.match(content, /'focusable' => true/);
  assert.match(content, /'selectable' => false/);
  assert.match(content, /'bulkSelectable' => false/);
});

test('Tag hierarchy and mutations use Joomla nested table/model APIs with ACL checks', async () => {
  const tag = await readFile(new URL('../package/component/admin/src/Adapter/TagAdapter.php', import.meta.url), 'utf8');
  const content = await readFile(new URL('../package/component/admin/src/Adapter/ContentAdapter.php', import.meta.url), 'utf8');
  assert.match(content, /getTree\(\$this->tagRootId\(\)\)/);
  assert.match(content, /getPath\(\$tagId\)/);
  assert.match(content, /createModel\('Tag', 'Administrator'/);
  assert.match(content, /'com_tags\.tag\.' \. \$id/);
  assert.match(tag, /empty\(\$resource\['capabilities'\]\[\$action\]\)/);
});

test('FlatArticleAdapter has one flat root and reusable category-aware Article presentation', async () => {
  const flat = await readFile(new URL('../package/component/admin/src/Adapter/FlatArticleAdapter.php', import.meta.url), 'utf8');
  const collection = await readFile(new URL('../package/component/admin/src/Adapter/ArticleCollectionAdapter.php', import.meta.url), 'utf8');
  const registry = await readFile(new URL('../package/component/admin/src/Adapter/AdapterRegistry.php', import.meta.url), 'utf8');
  assert.match(flat, /class FlatArticleAdapter extends ArticleCollectionAdapter/);
  assert.match(flat, /'nodes' => \[\]/);
  assert.match(flat, /getAllArticles\(\$options/);
  assert.match(flat, /articlePresentation\(true, true, false\)/);
  assert.match(flat, /'newArticle'.*'COM_SMARTBROWSER_NEW_ARTICLE'/);
  assert.match(flat, /authorise\('core\.create', 'com_content'\)/);
  assert.match(flat, /task=article\.add/);
  assert.match(flat, /executeArticleAction\(\$action, \$selection, true\)/);
  assert.match(collection, /\['id' => 'category', 'label' => 'COM_SMARTBROWSER_CATEGORY', 'source' => 'metadata\.category'\]/);
  assert.match(collection, /'id' => 'category', 'label' => 'COM_SMARTBROWSER_CATEGORY', 'type' => 'select'/);
  assert.match(registry, /'flat-articles' => new FlatArticleAdapter/);
});

test('ArticlesByTagAdapter reuses Tag hierarchy and loads direct-tag Articles as primary resources', async () => {
  const adapter = await readFile(new URL('../package/component/admin/src/Adapter/ArticlesByTagAdapter.php', import.meta.url), 'utf8');
  const content = await readFile(new URL('../package/component/admin/src/Adapter/ContentAdapter.php', import.meta.url), 'utf8');
  const registry = await readFile(new URL('../package/component/admin/src/Adapter/AdapterRegistry.php', import.meta.url), 'utf8');
  assert.match(adapter, /class ArticlesByTagAdapter extends ArticleCollectionAdapter/);
  assert.match(adapter, /getTagChildren\(\$nodeId/);
  assert.match(adapter, /getTagBreadcrumb\(\$nodeId\)/);
  assert.match(adapter, /'items' => \$tagId \? \$this->getArticlesByTag\(\$tagId/);
  assert.match(adapter, /articlePresentation\(true, true, false, false\)/);
  assert.match(adapter, /executeArticleAction\(\$action, \$articleSelection, true\)/);
  assert.match(adapter, /tagRootResource\(\)/);
  assert.match(adapter, /tagAdapter\(\)->executeAction/);
  assert.doesNotMatch(adapter, /ContextResourceProviderInterface|contextItems|includeChildren|contentitem_tag_map/);
  assert.match(content, /\$options\['filters'\]\['tag'\] = \(string\) \$tagId/);
  assert.match(registry, /'articles-by-tag' => new ArticlesByTagAdapter/);
});

test('adapter persistence remains namespaced by concrete adapter id', async () => {
  const main = await readFile(new URL('../resources/js/main.js', import.meta.url), 'utf8');
  assert.match(main, /options\.browseRoot[\s\S]*`supjx\.smartbrowser\.\$\{options\.adapter\}\.\$\{options\.browseRoot\}`/);
  assert.match(main, /: `supjx\.smartbrowser\.\$\{options\.adapter\}`/);
});

test('browseRoot is an opaque optional adapter contract enforced by the API', async () => {
  const contract = await readFile(new URL('../package/component/admin/src/Adapter/BrowseRootAwareInterface.php', import.meta.url), 'utf8');
  const controller = await readFile(new URL('../package/component/admin/src/Controller/ApiController.php', import.meta.url), 'utf8');
  const api = await readFile(new URL('../resources/js/services/ResourceApi.js', import.meta.url), 'utf8');
  assert.match(contract, /configureBrowseRoot\(\?string \$browseRoot\)/);
  assert.match(contract, /getInitialNode\(\?string \$candidate/);
  assert.match(contract, /assertBrowseScope\(array \$resourceIds\)/);
  assert.match(controller, /\$adapter->assertBrowseScope\(\$scopeIds\)/);
  assert.match(api, /searchParams\.set\('browseRoot', this\.options\.browseRoot\)/);
  assert.doesNotMatch(controller, /category:|tag:|com_content|com_tags/);
});

test('Content browseRoot scopes hierarchy, relative breadcrumbs, and flat Article queries', async () => {
  const content = await readFile(new URL('../package/component/admin/src/Adapter/ContentAdapter.php', import.meta.url), 'utf8');
  const flat = await readFile(new URL('../package/component/admin/src/Adapter/FlatArticleAdapter.php', import.meta.url), 'utf8');
  assert.match(content, /categoryWithinBrowseRoot/);
  assert.match(content, /tagWithinBrowseRoot/);
  assert.match(content, /\$crumbs = \[\];/);
  assert.match(content, /queryArticles\(\$options, \$scopeIds\)/);
  assert.match(flat, /hasVisibleBrowseHierarchy\(\): bool[\s\S]*return false/);
});

test('Media browseRoot enforces provider and segment-safe path boundaries', async () => {
  const media = await readFile(new URL('../package/component/admin/src/Adapter/MediaAdapter.php', import.meta.url), 'utf8');
  assert.match(media, /implements ResourceAdapterInterface, BrowseRootAwareInterface/);
  assert.match(media, /\$adapter !== \$rootAdapter/);
  assert.match(media, /!str_starts_with\(\$path, \$prefix\)/);
  assert.match(media, /in_array\('\.\.', explode\('\/', \$path\), true\)/);
});

test('Media provider roots are resolved without fetching an empty-name media item', async () => {
  const media = await readFile(new URL('../package/component/admin/src/Adapter/MediaAdapter.php', import.meta.url), 'utf8');
  assert.match(media, /if \(\$path === '\/'\)/);
  assert.match(media, /\? \$this->rootResource\(\$candidate\)/);
  assert.match(media, /private function getNaturalRoots\(\): array/);
});

test('loading clears interaction state and resets inaccessible persisted nodes', async () => {
  const state = await readFile(new URL('../resources/js/core/createBrowserState.js', import.meta.url), 'utf8');
  assert.match(state, /state\.selectedIds = \[\];[\s\S]*state\.focusedId = null;[\s\S]*api\.getResources/);
  assert.match(state, /nodeId !== options\.initialNode && \[403, 404\]\.includes\(error\.status\)/);
  assert.match(state, /await load\(options\.initialNode\)/);
});

test('empty synthetic hierarchies do not render an empty tree container', async () => {
  const tree = await readFile(new URL('../resources/js/components/ResourceTree.vue', import.meta.url), 'utf8');
  assert.match(tree, /v-if="adapter\.id !== activeAdapter \|\| treeHasContent"/);
  assert.match(tree, /root\.visible !== false[\s\S]*branch\(root\)\.length > 0 \|\| props\.nodes\.length > 0/);
  assert.doesNotMatch(tree, /flat-articles/);
});

test('category filters use the shared Joomla Article model state', async () => {
  const content = await readFile(new URL('../package/component/admin/src/Adapter/ContentAdapter.php', import.meta.url), 'utf8');
  assert.match(content, /\$filteredCategoryId = \$categoryId \?\? \(int\) \(\$filters\['category'\]/);
  assert.match(content, /setState\('filter\.category_id', \$filteredCategoryId\)/);
  assert.match(content, /function categoryOptions\(bool \$batchDestination = false\): array/);
});

test('details status indicators stay contained and wrap when needed', async () => {
  const details = await readFile(new URL('../resources/js/components/ResourceDetails.vue', import.meta.url), 'utf8');
  const css = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  assert.match(details, /'resource-status-group': column\.format === 'status'/);
  assert.match(css, /\.resource-status-group\s*\{[\s\S]*flex-wrap: wrap/);
  assert.match(css, /\.resource-details-view \.resource-column-status\s*\{[\s\S]*overflow: hidden/);
});

test('status overlays use Joomla Font Awesome glyphs at compact metrics', async () => {
  const css = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  assert.match(css, /fa-solid-900\.woff2/);
  assert.match(css, /SmartBrowser Font Awesome 6 Free/);
  assert.match(css, /status-success[^}]+content: "\\f00c"/s);
  assert.match(css, /status-muted[^}]+content: "\\f00d"/s);
  assert.match(css, /overlay-featured\.tone-warning[^}]+content: "\\f005"/s);
  assert.match(css, /\.resource-status-icon \{[^}]*width: 20px[^}]*height: 20px[^}]*font-size: 9\.6px/s);
});

test('editor modal closes after Joomla leaves the edit form', async () => {
  const driver = await readFile(new URL('../resources/js/adapters/MediaActionDriver.js', import.meta.url), 'utf8');
  assert.match(driver, /iframe\.addEventListener\('load'/);
  assert.match(driver, /form#adminForm/);
  assert.match(driver, /!isEditLocation \|\| !hasEditorForm/);
  assert.match(driver, /dialog\.addEventListener\('close',[\s\S]*await this\.reload\(\)/);
});

test('contextual resources remain focusable but never expose actions', () => {
  const resource = asContextualResource({ id: 'demo:1', kind: 'item', focusable: true, selectable: false, bulkSelectable: false, actionable: true, capabilities: { edit: true } });
  assert.equal(resource.role, 'contextual');
  assert.equal(resource.focusable, true);
  assert.equal(resource.selectable, false);
  assert.equal(resource.bulkSelectable, false);
  assert.equal(resource.actionable, false);
  assert.deepEqual(resource.capabilities, {});
  assert.equal(resource.activatable, false);
  assert.equal(resource.interactiveOverlays, false);
  assert.equal(canFocusResource(resource), true);
  assert.equal(canSelectResource(resource), false);
  assert.equal(canBulkSelectResource(resource), false);
  assert.equal(canActOnResource(resource), false);
});

test('contextual resources render but never enter single or bulk selection', async () => {
  globalThis.window = { location: { href: 'http://localhost/administrator/' }, history: { replaceState() {} } };
  globalThis.Joomla = { renderMessages() {} };
  const primary = { id: 'item:1', kind: 'item', title: 'Primary', selectable: true, capabilities: {} };
  const contextual = { id: 'item:2', kind: 'item', title: 'Context', focusable: true, selectable: false, bulkSelectable: false, actionable: true, capabilities: { edit: true } };
  const browser = createBrowserState({
    options: { roots: [{ id: 'root' }], actions: [], selectionTarget: 'both', multiple: true },
    api: { getResources: async () => ({ nodes: [], items: [primary], contextItems: [contextual], breadcrumb: [], actions: [] }) },
    persistence: { load: (defaults) => defaults, save() {} },
    viewRegistry: { has: () => true },
  });
  await browser.load('root');
  assert.equal(browser.resources.value.length, 2);
  assert.equal(browser.selectableResources.value.length, 1);
  browser.toggle(browser.resources.value[1]);
  assert.deepEqual(browser.state.selectedIds, []);
  assert.equal(browser.state.focusedId, 'item:2');
  assert.equal(browser.focusedResource.value.id, 'item:2');
  assert.equal(browser.resources.value[1].actionable, false);
  assert.deepEqual(browser.resources.value[1].capabilities, {});
  browser.selectAll();
  assert.deepEqual(browser.state.selectedIds, ['item:1']);
});

test('select all uses bulkSelectable independently from click selection', async () => {
  globalThis.window = { location: { href: 'http://localhost/administrator/' }, history: { replaceState() {} } };
  globalThis.Joomla = { renderMessages() {} };
  const browser = createBrowserState({
    options: { roots: [{ id: 'root' }], actions: [], selectionTarget: 'both', multiple: true },
    api: { getResources: async () => ({
      nodes: [],
      items: [
        { id: 'item:single', kind: 'item', title: 'Single only', selectable: true, bulkSelectable: false },
        { id: 'item:bulk', kind: 'item', title: 'Bulk', selectable: true, bulkSelectable: true },
      ],
      contextItems: [], breadcrumb: [], actions: [],
    }) },
    persistence: { load: (defaults) => defaults, save() {} },
    viewRegistry: { has: () => true },
  });
  await browser.load('root');
  browser.toggle(browser.resources.value[0]);
  assert.deepEqual(browser.state.selectedIds, ['item:single']);
  assert.equal(browser.focusedResource.value.id, 'item:single');
  browser.selectAll();
  assert.deepEqual(browser.state.selectedIds, ['item:single', 'item:bulk']);
});

test('primary search and sorting leave contextual provider order intact', async () => {
  globalThis.window = { location: { href: 'http://localhost/administrator/' }, history: { replaceState() {} } };
  globalThis.Joomla = { renderMessages() {} };
  const browser = createBrowserState({
    options: { roots: [{ id: 'root' }], actions: [], selectionTarget: 'both', multiple: true },
    api: { getResources: async () => ({
      nodes: [{ id: 'category:1', kind: 'node', title: 'Matching category', selectable: true }],
      items: [],
      contextItems: [
        { id: 'article:2', kind: 'item', title: 'Zulu context' },
        { id: 'article:1', kind: 'item', title: 'Alpha context' },
      ],
      breadcrumb: [], actions: [], presentation: { sortFields: [{ id: 'title' }] },
    }) },
    persistence: { load: (defaults) => ({ ...defaults, sortBy: 'title', sortDirection: 'asc' }), save() {} },
    viewRegistry: { has: () => true },
  });
  browser.state.search = 'matching';
  await browser.load('root');
  assert.deepEqual(browser.resources.value.map(({ id }) => id), ['category:1', 'article:2', 'article:1']);
});

test('both generic views expose contextual rendering without adapter checks', async () => {
  for (const file of ['ResourceGrid.vue', 'ResourceDetails.vue']) {
    const source = await readFile(new URL(`../resources/js/components/${file}`, import.meta.url), 'utf8');
    assert.match(source, /isContextualResource/);
    assert.doesNotMatch(source, /article.*contextual|contextual.*article/i);
    assert.doesNotMatch(source, /v-if="!isContextualResource\(resource\)"/);
    assert.match(source, /itemActions\(resource\)\.length/);
  }
});

test('Info panel is driven by focusedResource', async () => {
  const app = await readFile(new URL('../resources/js/components/SmartBrowserApp.vue', import.meta.url), 'utf8');
  assert.match(app, /:resource="focusedResource"/);
  assert.doesNotMatch(app, /:resource="selection\[/);
});

test('MenuAdapter keeps hierarchy separate from lazily resolved contextual content', async () => {
  const adapter = await readFile(new URL('../package/component/admin/src/Adapter/MenuAdapter.php', import.meta.url), 'utf8');
  const registry = await readFile(new URL('../package/component/admin/src/Menu/Resolver/MenuItemResolverRegistry.php', import.meta.url), 'utf8');
  const adapters = await readFile(new URL('../package/component/admin/src/Adapter/AdapterRegistry.php', import.meta.url), 'utf8');
  assert.match(adapter, /class MenuAdapter implements ResourceAdapterInterface, BrowseRootAwareInterface, ContextResourceProviderInterface/);
  assert.match(adapter, /'nodes' => \$children,[\s\S]*'items' => \[\]/);
  assert.match(adapter, /resolverRegistry\(\)->resolve/);
  assert.match(adapter, /\(int\) \$item->parent_id === \$parentId/);
  assert.match(adapter, /\$item->lft < \(int\) \$root->lft|\(int\) \$item->lft < \(int\) \$root->lft/);
  assert.match(registry, /MAX_ALIAS_DEPTH/);
  assert.match(registry, /in_array\(\$id, \$visited, true\)/);
  assert.match(adapters, /'menus' => new MenuAdapter/);
});

test('Menu item resolvers cover core types without a MenuAdapter conditional chain', async () => {
  const menu = await readFile(new URL('../package/component/admin/src/Adapter/MenuAdapter.php', import.meta.url), 'utf8');
  const resolverFiles = [
    'SingleArticleResolver.php', 'CategoryArticlesResolver.php', 'FeaturedArticlesResolver.php',
    'TaggedArticlesResolver.php', 'UrlMenuItemResolver.php', 'AliasMenuItemResolver.php',
    'StaticMenuItemResolver.php', 'GenericComponentResolver.php',
  ];
  for (const file of resolverFiles) {
    const source = await readFile(new URL(`../package/component/admin/src/Menu/Resolver/${file}`, import.meta.url), 'utf8');
    assert.match(source, /implements MenuItemResolverInterface/);
  }
  assert.doesNotMatch(menu, /if\s*\([^)]*com_content|switch\s*\([^)]*type/);
});

test('Alias resolver delegates content only and protects cycles', async () => {
  const alias = await readFile(new URL('../package/component/admin/src/Menu/Resolver/AliasMenuItemResolver.php', import.meta.url), 'utf8');
  const registry = await readFile(new URL('../package/component/admin/src/Menu/Resolver/MenuItemResolverRegistry.php', import.meta.url), 'utf8');
  assert.match(alias, /aliasoptions/);
  assert.match(alias, /resolveAlias/);
  assert.match(alias, /'aliasOf' => \$targetId/);
  assert.doesNotMatch(alias, /children|parent_id|lft|rgt/);
  assert.match(registry, /alias-cycle/);
});

test('Menu contextual resources reuse Content article normalization and remain non-selectable', async () => {
  const content = await readFile(new URL('../package/component/admin/src/Adapter/ContentAdapter.php', import.meta.url), 'utf8');
  const context = await readFile(new URL('../package/component/admin/src/Menu/Resolver/MenuItemResolutionContext.php', import.meta.url), 'utf8');
  const category = await readFile(new URL('../package/component/admin/src/Menu/Resolver/CategoryArticlesResolver.php', import.meta.url), 'utf8');
  assert.match(content, /public function resolveArticles\(/);
  assert.match(content, /public function asContextualArticles\(/);
  assert.match(context, /content->asContextualArticles/);
  assert.match(category, /resolveCategoryScopeIds/);
  assert.doesNotMatch(category, /'type'\s*=>\s*'category'/);
});

test('resource actions require an explicit capability and support generic URL commands', async () => {
  const driver = await readFile(new URL('../resources/js/adapters/MediaActionDriver.js', import.meta.url), 'utf8');
  assert.match(driver, /capabilities\?\.\[action\.id\] === true/);
  assert.match(driver, /resource\?\.command === 'openUrl'/);
  assert.match(driver, /resource\?\.command === 'copyText'/);
});

test('static Menu Items remain ordered tree nodes but cannot navigate', async () => {
  const adapter = await readFile(new URL('../package/component/admin/src/Adapter/MenuAdapter.php', import.meta.url), 'utf8');
  const tree = await readFile(new URL('../resources/js/components/ResourceTree.vue', import.meta.url), 'utf8');
  assert.match(adapter, /\$isStatic = in_array\(\(string\) \$item->type, \['separator', 'heading'\]/);
  assert.match(adapter, /'kind' => 'node'/);
  assert.match(adapter, /'navigable' => !\$isStatic/);
  assert.match(adapter, /'separator' => 'icon-minus-2'/);
  assert.match(adapter, /'heading' => 'fa-solid fa-bars'/);
  assert.match(adapter, /'nodes' => \$children,[\s\S]*'items' => \[\]/);
  assert.match(tree, /node\.navigable !== false/);
  assert.match(tree, /resource-tree-static/);
});

test('menu cards show Joomla menu type titles and alias on separate lines', async () => {
  const adapter = await readFile(new URL('../package/component/admin/src/Adapter/MenuAdapter.php', import.meta.url), 'utf8');
  const grid = await readFile(new URL('../resources/js/components/ResourceGrid.vue', import.meta.url), 'utf8');
  const css = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  assert.match(adapter, /menuModel\('Menutypes'\)[\s\S]*getTypeOptions\(\)/);
  assert.match(adapter, /MenusHelper::getLinkKey\(\$option->request\)/);
  assert.match(adapter, /'menuItemSummary' => \$typeLabel/);
  assert.match(adapter, /'gridFields' => \[\['source' => 'metadata.menuItemSummary'\]\]/);
  assert.match(grid, /line\('COM_SMARTBROWSER_MENU_ITEM_TYPE', metadata.menuItemType, 'icon-file-alt'\)/);
  assert.match(css, /\.resource-item-identifier \{ font-style: italic; font-weight: 600; \}/);
});

test('content menu resolvers keep category scope for standard and overridden layouts', async () => {
  const category = await readFile(new URL('../package/component/admin/src/Menu/Resolver/CategoryArticlesResolver.php', import.meta.url), 'utf8');
  const featured = await readFile(new URL('../package/component/admin/src/Menu/Resolver/FeaturedArticlesResolver.php', import.meta.url), 'utf8');
  assert.match(category, /if \(\$categoryId < 1\)/);
  assert.doesNotMatch(category, /resolveArticles\([^;]*\[\]\)/);
  assert.match(featured, /resolveCategoryScopeIds/);
  assert.doesNotMatch(featured, /\$query\['layout'\]/);
});

test('unknown component resolver reports provenance without inventing a contextual item', async () => {
  const fallback = await readFile(new URL('../package/component/admin/src/Menu/Resolver/GenericComponentResolver.php', import.meta.url), 'utf8');
  assert.match(fallback, /'resources' => \[\]/);
  assert.doesNotMatch(fallback, /icon-puzzle-piece|openLink|menu-target:/);
});

test('featured category overrides force featured-only Article resolution', async () => {
  const category = await readFile(new URL('../package/component/admin/src/Menu/Resolver/CategoryArticlesResolver.php', import.meta.url), 'utf8');
  assert.match(category, /\$query\['layout'\]/);
  assert.match(category, /'featured'\)\)/);
  assert.match(category, /\$featuredLayout \? 'only'/);
});

test('Menu contextual Article state overlays are passive and do not expose management actions', async () => {
  const context = await readFile(new URL('../package/component/admin/src/Menu/Resolver/MenuItemResolutionContext.php', import.meta.url), 'utf8');
  const adapter = await readFile(new URL('../package/component/admin/src/Adapter/MenuAdapter.php', import.meta.url), 'utf8');
  assert.match(context, /'interactiveOverlays' => false/);
  assert.doesNotMatch(adapter, /\$this->action\('feature'/);
  assert.doesNotMatch(adapter, /\$this->action\('unfeature'/);
  assert.match(adapter, /\$action === 'edit' && str_starts_with\(\$resourceId, 'article:'\)/);
});

test('contextual state overlays remain passive with no item menu', async () => {
  for (const file of ['ResourceGrid.vue', 'ResourceDetails.vue']) {
    const source = await readFile(new URL(`../resources/js/components/${file}`, import.meta.url), 'utf8');
    assert.match(source, /resource\.interactiveOverlays !== false/);
  }
  const api = await readFile(new URL('../package/component/admin/src/Controller/ApiController.php', import.meta.url), 'utf8');
  const content = await readFile(new URL('../package/component/admin/src/Adapter/ContentAdapter.php', import.meta.url), 'utf8');
  assert.match(api, /'role' => 'contextual'[\s\S]*'actionable' => false[\s\S]*'capabilities' => \[\]/);
  assert.match(content, /protected function contextualArticles[\s\S]*'actionable' => false[\s\S]*'capabilities' => \[\]/);
});

test('Menu actions and static menu entries use mapped Joomla icon names', async () => {
  const adapter = await readFile(new URL('../package/component/admin/src/Adapter/MenuAdapter.php', import.meta.url), 'utf8');
  assert.match(adapter, /'openLink'.*'icon-new-tab'/);
  assert.doesNotMatch(adapter, /icon-external-link|icon-header|icon-paragraph-center/);
});

test('UsersAdapter uses User Groups as scoped hierarchy and Users as primary resources', async () => {
  const users = await readFile(new URL('../package/component/admin/src/Adapter/UsersAdapter.php', import.meta.url), 'utf8');
  const registry = await readFile(new URL('../package/component/admin/src/Adapter/AdapterRegistry.php', import.meta.url), 'utf8');
  assert.match(users, /class UsersAdapter implements ResourceAdapterInterface, BrowseRootAwareInterface/);
  assert.match(users, /'nodes' => \$nodes,[\s\S]*'items' => \$groupId > 0 \? \$this->usersForGroup/);
  assert.match(users, /setState\('filter\.group_id', \$groupId\)/);
  assert.doesNotMatch(users, /getAuthorisedGroups|recursive.*membership/i);
  assert.match(users, /'selectable' => false, 'bulkSelectable' => false[\s\S]*'navigable' => true/);
  assert.match(users, /'selectable' => true, 'bulkSelectable' => true[\s\S]*'navigable' => false/);
  assert.match(registry, /'users' => new UsersAdapter/);
  assert.match(registry, /'id' => 'users'/);
});

test('UsersAdapter browseRoot uses User Group nested-set boundaries', async () => {
  const users = await readFile(new URL('../package/component/admin/src/Adapter/UsersAdapter.php', import.meta.url), 'utf8');
  assert.match(users, /groupWithinBrowseRoot/);
  assert.match(users, /\$group->lft >= \(int\) \$root->lft/);
  assert.match(users, /\$group->rgt <= \(int\) \$root->rgt/);
  assert.match(users, /userWithinBrowseRoot/);
  assert.match(users, /#__user_usergroup_map/);
  assert.match(users, /getInitialNode/);
});

test('UsersAdapter keeps its hidden natural root in group breadcrumbs so the tree remains attached', async () => {
  const users = await readFile(new URL('../package/component/admin/src/Adapter/UsersAdapter.php', import.meta.url), 'utf8');
  assert.match(users, /\$crumbs = \$root \? \[\] : \[\[[\s\S]*'id' => self::ROOT_ID[\s\S]*'visible' => false/);
  assert.match(users, /foreach \(\$this->groups\(\) as \$candidate\)[\s\S]*\$crumbs\[\] = \['id' => 'user-group:'/);
});

test('UsersAdapter exposes only an explicit safe User metadata allowlist', async () => {
  const users = await readFile(new URL('../package/component/admin/src/Adapter/UsersAdapter.php', import.meta.url), 'utf8');
  assert.match(users, /'username' => \(string\) \$user->username/);
  assert.match(users, /'registered' => \$user->registerDate/);
  assert.match(users, /'lastVisit' => \$user->lastvisitDate/);
  assert.match(users, /'email' => \(string\) \(\$user->email \?\? ''\)/);
  assert.doesNotMatch(users, /['"](?:password|otpKey|otep|resetCount|requireReset)['"]\s*=>/);
});

test('resource cards show aliases, available language keys, flat article category, and user email without dates', async () => {
  const content = await readFile(new URL('../package/component/admin/src/Adapter/ContentAdapter.php', import.meta.url), 'utf8');
  const articles = await readFile(new URL('../package/component/admin/src/Adapter/ArticleCollectionAdapter.php', import.meta.url), 'utf8');
  const articleTree = await readFile(new URL('../package/component/admin/src/Adapter/ArticleAdapter.php', import.meta.url), 'utf8');
  const flatArticles = await readFile(new URL('../package/component/admin/src/Adapter/FlatArticleAdapter.php', import.meta.url), 'utf8');
  const categories = await readFile(new URL('../package/component/admin/src/Adapter/CategoryAdapter.php', import.meta.url), 'utf8');
  const tags = await readFile(new URL('../package/component/admin/src/Adapter/TagAdapter.php', import.meta.url), 'utf8');
  const users = await readFile(new URL('../package/component/admin/src/Adapter/UsersAdapter.php', import.meta.url), 'utf8');
  const grid = await readFile(new URL('../resources/js/components/ResourceGrid.vue', import.meta.url), 'utf8');
  assert.match(content, /function languageKeySummary/);
  assert.match(content, /Text::_\(\$title\) !== \$title/);
  assert.match(content, /return \$languageKey;/);
  assert.match(content, /'cardSummaryWithCategory'/);
  assert.match(articles, /\$showCategoryGrid \? 'metadata.cardSummaryWithCategory' : 'metadata.cardSummary'/);
  assert.match(articleTree, /articlePresentation\(false, false\)/);
  assert.match(flatArticles, /articlePresentation\(true, true, false\)/);
  for (const adapter of [categories, tags, users]) {
    assert.match(adapter, /'gridFields' => \[\['source' => 'metadata.cardSummary'\]\]/);
    assert.doesNotMatch(adapter, /'gridFields'\s*=>[^\n]*metadata.modified/);
  }
  assert.match(users, /'cardSummary' => implode\("\\n", array_filter\(\[\(string\) \$user->username, \(string\) \(\$user->email/);
  assert.match(grid, /class="resource-item-metadata" :class="\{ 'resource-item-identifier': line.identifier \}"/);
  assert.match(grid, /:class="line.icon" aria-hidden="true"/);
  assert.match(grid, /:title="`\$\{t\(line.label\)\}: \$\{line.value\}`"/);
  assert.match(grid, /line\('COM_SMARTBROWSER_USERNAME', metadata.username, 'icon-user', true\)/);
  assert.match(grid, /line\('JGLOBAL_EMAIL', metadata.email, 'icon-envelope'\)/);
  assert.match(grid, /line\('COM_SMARTBROWSER_MIME_TYPE', metadata.mimeType, 'icon-file-alt'\)/);
  assert.match(grid, /line\('COM_SMARTBROWSER_LANGUAGE_KEY', metadata.languageKey, 'icon-language'\)/);
  assert.match(grid, /line\('COM_SMARTBROWSER_DIMENSIONS', `\$\{metadata.width\} × \$\{metadata.height\}`, 'icon-expand'\)/);
});

test('UsersAdapter delegates state mutations to Joomla UserModel with ACL capabilities', async () => {
  const users = await readFile(new URL('../package/component/admin/src/Adapter/UsersAdapter.php', import.meta.url), 'utf8');
  assert.match(users, /getLanguage\(\)->load\('com_smartbrowser', JPATH_ADMINISTRATOR/);
  assert.match(users, /createModel\('User', 'Administrator'/);
  assert.match(users, /\$model->block\(\$ids, 1\)/);
  assert.match(users, /\$model->block\(\$ids, 0\)/);
  assert.match(users, /\$model->activate\(\$ids\)/);
  assert.match(users, /authorise\('core\.edit\.state', 'com_users'\)/);
  assert.match(users, /Access::check\(\$id, 'core\.admin'\)/);
  assert.match(users, /'block' => \$canState && !\$blocked && \$id !== \(int\) \$identity->id/);
  assert.match(users, /'removeFromGroup' => \$canManage && \$identity->authorise\('core\.edit', 'com_users'\) && \$multipleGroups/);
  assert.match(users, /'delete' => \$canManage && \$identity->authorise\('core\.delete', 'com_users'\)/);
  assert.match(users, /batchUser\(\(int\) \$groups\['user:' \. \$id\], \[\$id\], 'del'\)/);
  assert.match(users, /\$model->delete\(\$ids\)/);
  assert.match(users, /'newUser', 'label' => 'COM_SMARTBROWSER_NEW_USER'/);
});

test('browser exports new action labels to Joomla JavaScript translations', async () => {
  const support = await readFile(new URL('../package/component/admin/src/Support/BrowserViewSupport.php', import.meta.url), 'utf8');
  for (const key of ['COM_SMARTBROWSER_NEW_USER', 'COM_SMARTBROWSER_DELETE', 'COM_SMARTBROWSER_ACTION_CHECKIN']) {
    assert.match(support, new RegExp(`'${key}'`));
  }
});

test('manager navigation follows the application and list status and ID columns retain their shape', async () => {
  const actions = await readFile(new URL('../resources/js/components/ResourceActions.vue', import.meta.url), 'utf8');
  const details = await readFile(new URL('../resources/js/components/ResourceDetails.vue', import.meta.url), 'utf8');
  const css = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  assert.match(actions, /resource-manager-link" :href="managerUrl" :target="managerNewTab \? '_blank' : undefined"/);
  assert.match(details, /const idWidth = computed\(\(\) => Math\.max\(48, 24 \+ 8 \* Math\.max\(1,/);
  assert.match(css, /\.resource-status-icon \{[^}]*flex: 0 0 20px;/s);
});

test('item menus size to content and empty nodes use the active adapter icon', async () => {
  const css = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  const app = await readFile(new URL('../resources/js/components/SmartBrowserApp.vue', import.meta.url), 'utf8');
  const details = await readFile(new URL('../resources/js/components/ResourceDetails.vue', import.meta.url), 'utf8');
  assert.match(css, /\.resource-item-menu \{[^}]*inset-inline-start: auto;[^}]*inset-inline-end: 4px;[^}]*width: max-content;/s);
  assert.match(app, /const adapterIcon = computed\(\(\) => options\.adapters\?\.find/);
  assert.match(details, /column\.format === 'status' && resource\.statusPresentation/);
});

test('User editing follows the shared editor mode', async () => {
  const users = await readFile(new URL('../package/component/admin/src/Adapter/UsersAdapter.php', import.meta.url), 'utf8');
  assert.match(users, /task=user\.edit&id=' \. \$ids\[0\]/);
  assert.match(users, /'command' => 'openEditor', 'url' => EditorRoute::link\(\$this->app, \$url\)/);
  assert.doesNotMatch(users, /openManager|tmpl=component|layout=modal/);
});

test('generic URL actions can explicitly navigate in the current tab', async () => {
  const driver = await readFile(new URL('../resources/js/adapters/MediaActionDriver.js', import.meta.url), 'utf8');
  assert.match(driver, /resource\.target === '_self'[\s\S]*url\.searchParams\.set\('return', window\.btoa\(returnUrl\)\)/);
  assert.match(driver, /const returnUrl = window\.location\.href/);
  assert.match(driver, /resource\.replace\) window\.location\.replace\(url\.toString\(\)\)/);
  assert.match(driver, /else window\.open\(resource\.url, '_blank'/);
});

test('site shell reuses the shared browser bootstrap, API controller, and client bundle', async () => {
  const manifest = await readFile(new URL('../package/component/smartbrowser.xml', import.meta.url), 'utf8');
  const adminView = await readFile(new URL('../package/component/admin/src/View/Browser/HtmlView.php', import.meta.url), 'utf8');
  const siteView = await readFile(new URL('../package/component/site/src/View/Browser/HtmlView.php', import.meta.url), 'utf8');
  const siteApi = await readFile(new URL('../package/component/site/src/Controller/ApiController.php', import.meta.url), 'utf8');
  const siteTemplate = await readFile(new URL('../package/component/site/tmpl/browser/default.php', import.meta.url), 'utf8');
  assert.match(manifest, /<files folder="site">[\s\S]*<folder>src<\/folder>[\s\S]*<folder>tmpl<\/folder>/);
  assert.match(adminView, /new BrowserViewSupport/);
  assert.match(siteView, /new BrowserViewSupport/);
  assert.match(siteApi, /extends \\SuperSoft\\Component\\Smartbrowser\\Administrator\\Controller\\ApiController/);
  assert.match(siteTemplate, /id="smartbrowser-app"/);
  assert.doesNotMatch(siteView, /ToolbarHelper|preferences/);
});

test('shared site bootstrap does not require template-specific icon presets', async () => {
  const support = await readFile(new URL('../package/component/admin/src/Support/BrowserViewSupport.php', import.meta.url), 'utf8');
  assert.doesNotMatch(support, /usePreset\(['"]fontawesome['"]\)/);
  assert.match(support, /useStyle\('com_smartbrowser\.app'\)/);
});

test('shared site bootstrap loads component and administrator language catalogues', async () => {
  const support = await readFile(new URL('../package/component/admin/src/Support/BrowserViewSupport.php', import.meta.url), 'utf8');
  const language = await readFile(new URL('../package/component/admin/language/en-GB/com_smartbrowser.ini', import.meta.url), 'utf8');
  assert.match(support, /load\('joomla', JPATH_ADMINISTRATOR/);
  assert.match(support, /load\('com_smartbrowser', JPATH_ADMINISTRATOR/);
  for (const key of ['COM_SMARTBROWSER_NEW_ARTICLE', 'COM_SMARTBROWSER_CREATE_CHILD_CATEGORY', 'COM_SMARTBROWSER_DATE_CREATED', 'COM_SMARTBROWSER_DATE_MODIFIED']) {
    assert.match(language, new RegExp(`^${key}=`, 'm'));
    assert.match(support, new RegExp(`'${key}'`));
  }
});

test('English and Greek component catalogues have complete matching keys', async () => {
  const english = await readFile(new URL('../package/component/admin/language/en-GB/com_smartbrowser.ini', import.meta.url), 'utf8');
  const greek = await readFile(new URL('../package/component/admin/language/el-GR/com_smartbrowser.ini', import.meta.url), 'utf8');
  const keys = (catalogue) => [...catalogue.matchAll(/^(COM_SMARTBROWSER[A-Z0-9_]*)=/gm)].map((match) => match[1]).sort();
  assert.deepEqual(keys(greek), keys(english));
});

test('filter placeholders use Select wording and filter states use plural labels', async () => {
  const articles = await readFile(new URL('../package/component/admin/src/Adapter/ArticleCollectionAdapter.php', import.meta.url), 'utf8');
  const greek = await readFile(new URL('../package/component/admin/language/el-GR/com_smartbrowser.ini', import.meta.url), 'utf8');
  assert.doesNotMatch(articles, /'active', 'label' => 'COM_SMARTBROWSER_FILTER_ACTIVE'/);
  assert.match(articles, /'active', 'label' => 'COM_SMARTBROWSER_SELECT_STATUS'/);
  assert.match(greek, /^COM_SMARTBROWSER_SELECT_STATUS="- Επιλέξτε Κατάσταση -"$/m);
  assert.match(greek, /^COM_SMARTBROWSER_SELECT_CHECKOUT="- Επιλέξτε Κλείδωμα -"$/m);
  assert.match(greek, /^COM_SMARTBROWSER_FILTER_PUBLISHED="Δημοσιευμένα"$/m);
  assert.match(greek, /^COM_SMARTBROWSER_FILTER_NOT_CHECKED_OUT="Μη κλειδωμένα"$/m);
});

test('adapter names and generic fallback labels are localized', async () => {
  const registry = await readFile(new URL('../package/component/admin/src/Adapter/AdapterRegistry.php', import.meta.url), 'utf8');
  const info = await readFile(new URL('../resources/js/components/ResourceInfoPanel.vue', import.meta.url), 'utf8');
  const grid = await readFile(new URL('../resources/js/components/ResourceGrid.vue', import.meta.url), 'utf8');
  assert.doesNotMatch(registry, /'title' => '(?:Media|Articles|Flat Articles|Categories|Tags|Articles by Tag|Menus|Users)'/);
  assert.match(registry, /Text::_\('COM_SMARTBROWSER_ADAPTER_MEDIA'\)/);
  assert.match(info, /t\('COM_SMARTBROWSER_FOLDER'\)/);
  assert.match(grid, /t\('COM_SMARTBROWSER_ACTIONS'\)/);
});

test('article language metadata renders its flag in details and the generic info panel', async () => {
  const adapter = await readFile(new URL('../package/component/admin/src/Adapter/ArticleCollectionAdapter.php', import.meta.url), 'utf8');
  const info = await readFile(new URL('../resources/js/components/ResourceInfoPanel.vue', import.meta.url), 'utf8');
  assert.match(adapter, /'label' => 'JFIELD_LANGUAGE_LABEL'[\s\S]*?'source' => 'metadata\.language'[\s\S]*?'format' => 'language'/);
  assert.match(info, /field\.format === 'language'/);
  assert.match(info, /resource\.metadata\?\.languageImage/);
});

test('Media folders declare generic navigation semantics for double click and Enter', async () => {
  const media = await readFile(new URL('../package/component/admin/src/Adapter/MediaAdapter.php', import.meta.url), 'utf8');
  const grid = await readFile(new URL('../resources/js/components/ResourceGrid.vue', import.meta.url), 'utf8');
  const details = await readFile(new URL('../resources/js/components/ResourceDetails.vue', import.meta.url), 'utf8');
  assert.match(media, /'navigable'\s*=>\s*\$isNode/);
  assert.match(grid, /@dblclick\.stop="resource\.navigable \? \$emit\('open'/);
  assert.match(details, /@dblclick\.stop="resource\.navigable \? \$emit\('open'/);
});

test('shared shell options preserve frontend browseRoot, select mode, and adapter-scoped API routes', async () => {
  const support = await readFile(new URL('../package/component/admin/src/Support/BrowserViewSupport.php', import.meta.url), 'utf8');
  const app = await readFile(new URL('../resources/js/components/SmartBrowserApp.vue', import.meta.url), 'utf8');
  assert.match(support, /'application' => \$this->app->isClient\('site'\)/);
  assert.match(support, /\['manage', 'select', 'readonly'\]/);
  assert.match(support, /getString\('browseRoot'\)/);
  assert.match(support, /Uri::base\(\) \. 'index\.php\?option=com_smartbrowser&format=json'/);
  assert.match(app, /smartbrowser:select/);
  assert.match(app, /resources: \[\.\.\.selected\]/);
});

test('frontend shell and adapters remain ACL-driven', async () => {
  const dispatcher = await readFile(new URL('../package/component/site/src/Dispatcher/Dispatcher.php', import.meta.url), 'utf8');
  const registry = await readFile(new URL('../package/component/admin/src/Adapter/AdapterRegistry.php', import.meta.url), 'utf8');
  const media = await readFile(new URL('../package/component/admin/src/Adapter/MediaAdapter.php', import.meta.url), 'utf8');
  assert.match(dispatcher, /getIdentity\(\)->guest/);
  assert.match(dispatcher, /SiteAuthentication::loginUrl/);
  assert.doesNotMatch(dispatcher, /core\.manage/);
  assert.match(registry, /core\.edit\.own/);
  assert.match(registry, /getAuthorisedCategories\('com_content'/);
  assert.match(media, /authorise\(\$permission, 'com_media'\)/);
});

test('edit destinations retain administrator forms and use the frontend bridge for site editing', async () => {
  const route = await readFile(new URL('../package/component/admin/src/Support/EditorRoute.php', import.meta.url), 'utf8');
  const content = await readFile(new URL('../package/component/admin/src/Adapter/ContentAdapter.php', import.meta.url), 'utf8');
  const users = await readFile(new URL('../package/component/admin/src/Adapter/UsersAdapter.php', import.meta.url), 'utf8');
  assert.match(route, /!\$app->isClient\('site'\)/);
  assert.match(route, /'com_content' => 'article'/);
  assert.match(route, /com_smartbrowser&view=editor/);
  assert.doesNotMatch(route, /nativeArticleEditLink/);
  assert.match(route, /'&id=' \. \(int\) \(\$query\['id'\] \?\? 0\)/);
  assert.match(content, /EditorRoute::link\(\$this->app/);
  assert.match(users, /EditorRoute::link\(\$this->app/);
});

test('frontend editor bridge reuses Joomla forms and enforces ACL at load and save', async () => {
  const service = await readFile(new URL('../package/component/site/src/Service/FrontendEditorService.php', import.meta.url), 'utf8');
  const controller = await readFile(new URL('../package/component/site/src/Controller/EditorController.php', import.meta.url), 'utf8');
  const view = await readFile(new URL('../package/component/site/src/View/Editor/HtmlView.php', import.meta.url), 'utf8');
  const layout = await readFile(new URL('../package/component/site/tmpl/editor/modal.php', import.meta.url), 'utf8');
  assert.match(service, /createModel\(\$name, 'Administrator'/);
  assert.match(service, /createModel\(\$name, 'Site'/);
  assert.match(service, /'article' => \$this->createSiteModel\('com_content', 'Form'/);
  assert.match(service, /assertAllowed\(\$type, \$id\)/);
  assert.match(service, /authorise\(\$action, \$asset\)/);
  assert.match(service, /getForm\(/);
  assert.match(service, /\$form = \$model->getForm\(\[\], true\)/);
  assert.match(service, /Form::addFormPath\(JPATH_ADMINISTRATOR/);
  assert.match(service, /\['joomla', 'lib_joomla'\]/);
  assert.match(service, /load\(\$extension, JPATH_ADMINISTRATOR/);
  assert.match(service, /validate\(\$form, \$data\)/);
  assert.match(controller, /Session::checkToken\(\)/);
  assert.match(view, /\$editorComplete = false/);
  assert.doesNotMatch(view, /public bool \$done/);
  assert.match(layout, /id="adminForm"/);
  assert.match(layout, /uitab\.startTabSet/);
  assert.match(layout, /\$renderedFields\[\$key\]/);
  assert.match(layout, /\$renderField\('title'\)/);
  assert.match(layout, /\$renderField\('alias'\)/);
  assert.match(layout, /\$renderField\('description'\)/);
  assert.match(layout, /renderControlFields\(\)/);
  assert.doesNotMatch(layout, /<h1/);
});

test('frontend authentication expiry redirects HTML and promotes API or modal login to top level', async () => {
  const dispatcher = await readFile(new URL('../package/component/site/src/Dispatcher/Dispatcher.php', import.meta.url), 'utf8');
  const api = await readFile(new URL('../package/component/admin/src/Controller/ApiController.php', import.meta.url), 'utf8');
  const client = await readFile(new URL('../resources/js/services/ResourceApi.js', import.meta.url), 'utf8');
  const actions = await readFile(new URL('../resources/js/adapters/MediaActionDriver.js', import.meta.url), 'utf8');
  assert.match(dispatcher, /SiteAuthentication::loginUrl/);
  assert.match(api, /authenticationRequired/);
  assert.match(api, /\$status = 401/);
  assert.match(client, /window\.top\.location\.assign/);
  assert.match(actions, /frameUrl\.searchParams\.get\('view'\) === 'login'/);
  assert.match(actions, /form#login-form, \.com-users-login/);
});

test('administrator and site expose a shared ACL-filtered Dashboard model', async () => {
  const admin = await readFile(new URL('../package/component/admin/src/View/Dashboard/HtmlView.php', import.meta.url), 'utf8');
  const site = await readFile(new URL('../package/component/site/src/View/Dashboard/HtmlView.php', import.meta.url), 'utf8');
  const provider = await readFile(new URL('../package/component/admin/src/Support/DashboardProvider.php', import.meta.url), 'utf8');
  const registry = await readFile(new URL('../package/component/admin/src/Adapter/AdapterRegistry.php', import.meta.url), 'utf8');
  assert.match(admin, /new DashboardProvider/);
  assert.match(site, /new DashboardProvider/);
  assert.match(provider, /AdapterRegistry[\s\S]*descriptors\(\)/);
  assert.match(provider, /'adapter' => \$id[\s\S]*'mode' => 'manage'/);
  assert.match(registry, /canUse\(/);
});

test('Dashboard links retain browser invocation parameters without double escaping', async () => {
  const provider = await readFile(new URL('../package/component/admin/src/Support/DashboardProvider.php', import.meta.url), 'utf8');
  const template = await readFile(new URL('../package/component/admin/tmpl/dashboard/default.php', import.meta.url), 'utf8');
  assert.match(provider, /Route::_\([^;]+, false\)/s);
  assert.match(template, /htmlspecialchars\(\$item\['url'\]/);
  assert.doesNotMatch(provider, /&amp;/);
  assert.match(provider, /fromDashboard=1/);
});

test('browser launched from Dashboard exposes a shared return action', async () => {
  const support = await readFile(new URL('../package/component/admin/src/Support/BrowserViewSupport.php', import.meta.url), 'utf8');
  const actions = await readFile(new URL('../resources/js/components/ResourceActions.vue', import.meta.url), 'utf8');
  assert.match(support, /'dashboardUrl' => \$mode === 'manage'/);
  assert.match(actions, /resource-dashboard-link/);
  assert.match(actions, /COM_SMARTBROWSER_BACK_TO_DASHBOARD/);
});

test('browser action bar groups secondary actions and guards backend navigation', async () => {
  const actions = await readFile(new URL('../resources/js/components/ResourceActions.vue', import.meta.url), 'utf8');
  const css = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  const provider = await readFile(new URL('../package/component/admin/src/Support/ManagerUrlProvider.php', import.meta.url), 'utf8');
  assert.match(actions, /v-for="action in directActions"/);
  assert.match(actions, /v-for="action in menuActions"/);
  assert.match(actions, /resource-filter-clear" :disabled="!activeFilterCount"/);
  assert.match(actions, /resource-manager-link" :href="managerUrl" :target="managerNewTab \? '_blank' : undefined" :rel="managerNewTab \? 'noopener noreferrer' : undefined" :title=/);
  assert.match(actions, /<span class="icon-ellipsis-h"/);
  assert.match(actions, /<span class="icon-joomla"/);
  assert.doesNotMatch(actions, /icon-external-link/);
  assert.match(actions, /class="resource-action-menu-item" role="none"/);
  assert.match(css, /resource-action-menu-item:not\(:last-child\) \{ border-bottom: 1px solid #c8d1da/);
  assert.match(css, /resource-action-createChild[^}]+background: #277a53/s);
  assert.match(css, /resource-filter-toggle[^}]+background: #f8f9f3/s);
  assert.doesNotMatch(actions, /btn btn-outline-secondary resource-filter-toggle/);
  assert.match(css, /\.resource-actions \.resource-manager-link > \.icon-joomla[^}]+margin-right: 0;[^}]+margin-inline-end: 0;/s);
  assert.match(provider, /authorise\('core.login.admin'\)/);
  assert.match(provider, /authorise\('core.manage', \$component\)/);
});

test('trash actions and trashed state use distinct SmartBrowser labels', async () => {
  const support = await readFile(new URL('../package/component/admin/src/Support/BrowserViewSupport.php', import.meta.url), 'utf8');
  const greek = await readFile(new URL('../package/component/admin/language/el-GR/com_smartbrowser.ini', import.meta.url), 'utf8');
  const adapters = await Promise.all(['ArticleCollectionAdapter', 'CategoryAdapter', 'TagAdapter', 'MenuAdapter', 'ContentAdapter']
    .map((name) => readFile(new URL(`../package/component/admin/src/Adapter/${name}.php`, import.meta.url), 'utf8')));
  assert.match(greek, /COM_SMARTBROWSER_ACTION_TRASH="Απόσυρση"/);
  assert.match(greek, /COM_SMARTBROWSER_ACTION_UNPUBLISH="Αποδημοσίευση"/);
  assert.match(greek, /COM_SMARTBROWSER_STATE_TRASHED="Σε απόσυρση"/);
  assert.match(greek, /COM_SMARTBROWSER_FILTER_TRASHED="Σε απόσυρση"/);
  for (const key of ['COM_SMARTBROWSER_ACTION_TRASH', 'COM_SMARTBROWSER_ACTION_UNPUBLISH', 'COM_SMARTBROWSER_STATE_TRASHED']) {
    assert.match(support, new RegExp(`'${key}'`));
  }
  for (const adapter of adapters) assert.doesNotMatch(adapter, /JTOOLBAR_TRASH|JTOOLBAR_UNPUBLISH|JTRASHED/);
});

test('frontend editor stacks global fields below the editor with responsive control rows', async () => {
  const layout = await readFile(new URL('../package/component/site/tmpl/editor/modal.php', import.meta.url), 'utf8');
  const css = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  assert.match(layout, /smartbrowser-editor-description/);
  assert.match(layout, /smartbrowser-editor-global-fields/);
  assert.match(css, /smartbrowser-editor-global-fields[^}]+grid-template-columns: minmax\(0, 1fr\)/s);
  assert.match(css, /smartbrowser-editor-global-fields \.control-group[^}]+grid-template-columns: minmax\(180px, 250px\) minmax\(0, 1fr\)/s);
  assert.match(css, /smartbrowser-editor-global-fields :is\(\.control-label, \.controls\)[^}]+float: none[^}]+margin-inline: 0 !important/s);
});

test('frontend menu item editor is responsive and uses a site-side Joomla menu type chooser', async () => {
  const layout = await readFile(new URL('../package/component/site/tmpl/editor/modal.php', import.meta.url), 'utf8');
  const controller = await readFile(new URL('../package/component/site/src/Controller/EditorController.php', import.meta.url), 'utf8');
  const chooser = await readFile(new URL('../package/component/site/src/View/Menutypes/HtmlView.php', import.meta.url), 'utf8');
  const chooserLayout = await readFile(new URL('../package/component/site/tmpl/menutypes/default.php', import.meta.url), 'utf8');
  assert.match(layout, /resourceType === 'menu-item'[\s\S]*smartbrowser-editor-primary[\s\S]*smartbrowser-editor-global-fields/);
  assert.match(layout, /view=menutypes/);
  assert.match(chooser, /createModel\('Menutypes', 'Administrator'/);
  assert.match(chooserLayout, /data-content-type="com_menus\.menutype"/);
  assert.doesNotMatch(chooserLayout, /\/administrator/);
  assert.match(layout, /joomla:content-select-menutype/);
  assert.match(controller, /function setMenuType\(\)/);
  assert.match(controller, /com_menus\.edit\.item\.data/);
  assert.match(controller, /menuTypeSelected=1/);
});

test('existing static menu items retain their stored type in the frontend form', async () => {
  const service = await readFile(new URL('../package/component/site/src/Service/FrontendEditorService.php', import.meta.url), 'utf8');
  const view = await readFile(new URL('../package/component/site/src/View/Editor/HtmlView.php', import.meta.url), 'utf8');
  const controller = await readFile(new URL('../package/component/site/src/Controller/EditorController.php', import.meta.url), 'utf8');
  const layout = await readFile(new URL('../package/component/site/tmpl/editor/modal.php', import.meta.url), 'utf8');
  const picker = await readFile(new URL('../package/component/media/js/editor-fields.js', import.meta.url), 'utf8');
  assert.match(service, /\$id > 0 && !\$this->app->getInput\(\)->getBool\('menuTypeSelected'\)/);
  assert.match(service, /function storedMenuItemType\(int \$id\): string[\s\S]*#__menu[\s\S]*loadResult\(\)/);
  assert.match(service, /empty\(\$data\['type'\]\)[\s\S]*\$data\['type'\] = \$this->storedMenuItemType\(\$id\)/);
  assert.match(service, /in_array\(\$storedType, \['heading', 'url', 'separator', 'alias', 'container'\], true\)[\s\S]*\$form->setValue\('type', null, \$storedType\)/);
  assert.match(service, /\$typeField = \$form->getField\('type'\)[\s\S]*\$typeField->value = \$storedType/);
  assert.match(view, /\$this->menuItemType = \$selectedType !== '' \? \$selectedType : \$service->storedMenuItemType\(\$this->resourceId\)/);
  assert.match(controller, /&selectedType=/);
  assert.match(layout, /data-menu-item-type=/);
  for (const key of ['COM_MENUS_TYPE_HEADING', 'COM_MENUS_TYPE_EXTERNAL_URL', 'COM_MENUS_TYPE_SEPARATOR', 'COM_MENUS_TYPE_ALIAS', 'COM_MENUS_TYPE_CONTAINER']) {
    assert.match(layout, new RegExp(key));
  }
  assert.match(picker, /title\?\.removeAttribute\('name'\)/);
  assert.match(picker, /value\.value = form\.dataset\.menuItemType/);
  assert.match(picker, /form\.dataset\.menuItemTypeTitle\) title\.value = form\.dataset\.menuItemTypeTitle/);
});

test('menu type chooser uses the editor picker instead of a nested Joomla dialog', async () => {
  const picker = await readFile(new URL('../package/component/media/js/editor-fields.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../package/component/media/css/editor.css', import.meta.url), 'utf8');
  assert.match(picker, /source\.searchParams\.get\('view'\) === 'menutypes'/);
  assert.match(picker, /open\(source, \{ kind: 'menu-type'/);
  assert.match(css, /\.com-smartbrowser-editor-picker\.is-menu-type iframe/);
});

test('frontend editor groups tag and menu publishing fields and frames media options', async () => {
  const layout = await readFile(new URL('../package/component/site/tmpl/editor/modal.php', import.meta.url), 'utf8');
  const css = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  assert.match(layout, /smartbrowser-editor-image-row/);
  assert.match(layout, /\['image-intro', 'image-fulltext'\]/);
  assert.match(layout, /resourceType === 'tag'[\s\S]*smartbrowser-publishing[\s\S]*'parent_id', 'published', 'access'/);
  assert.match(layout, /resourceType === 'menu-item'[\s\S]*smartbrowser-publishing[\s\S]*'parent_id', 'menuordering', 'published'/);
  assert.match(css, /smartbrowser-editor-media-grid, \.smartbrowser-editor-fieldsets/);
  assert.match(css, /:is\(input, select, textarea\):disabled/);
  assert.match(layout, /COM_SMARTBROWSER_EDITOR_MENU_BASICS[\s\S]*renderMenuTypeField\(\)[\s\S]*\['request', 'aliasoptions'\][\s\S]*COM_SMARTBROWSER_EDITOR_MENU_LINK/);
});

test('frontend editor picker routes supported Joomla selectors through SmartBrowser', async () => {
  const view = await readFile(new URL('../package/component/site/src/View/Editor/HtmlView.php', import.meta.url), 'utf8');
  const layout = await readFile(new URL('../package/component/site/tmpl/editor/modal.php', import.meta.url), 'utf8');
  const picker = await readFile(new URL('../package/component/media/js/editor-fields.js', import.meta.url), 'utf8');
  assert.match(view, /useScript\('com_smartbrowser\.editor-fields'\)/);
  assert.match(layout, /data-browser-url=/);
  assert.match(layout, /data-editor-url=/);
  for (const adapter of ['categories', 'tags', 'menus', 'users', 'media']) {
    assert.match(picker, new RegExp(`adapter: '${adapter}'`));
  }
  assert.match(picker, /dataset\.buttonAction/);
  assert.match(picker, /smartbrowser:select/);
  assert.match(picker, /\.js-input-value/);
  assert.match(picker, /\.field-user-input/);
  assert.match(picker, /\.setValue\(/);
  assert.match(picker, /smartbrowser-tab-scroll/);
});

test('menu editor resolves core article modal fields from plugin forms', async () => {
  const service = await readFile(new URL('../package/component/site/src/Service/FrontendEditorService.php', import.meta.url), 'utf8');
  const picker = await readFile(new URL('../package/component/media/js/editor-fields.js', import.meta.url), 'utf8');
  assert.match(service, /if \(\$component === 'com_menus'\)[\s\S]*bootComponent\('com_content'\)[\s\S]*FormHelper::addFieldPrefix\('Joomla\\\\Component\\\\Content\\\\Administrator\\\\Field'\)/);
  assert.match(picker, /option === 'com_content'[\s\S]*type: 'article', adapter: 'flat-articles'/);
  assert.match(picker, /\.js-modal-content-select-field/);
});

test('editor-specific styles size nested pickers and keep tab and choice overlays in place', async () => {
  const view = await readFile(new URL('../package/component/site/src/View/Editor/HtmlView.php', import.meta.url), 'utf8');
  const assets = await readFile(new URL('../package/component/media/joomla.asset.json', import.meta.url), 'utf8');
  const css = await readFile(new URL('../package/component/media/css/editor.css', import.meta.url), 'utf8');
  const picker = await readFile(new URL('../package/component/media/js/editor-fields.js', import.meta.url), 'utf8');
  assert.match(view, /useStyle\('com_smartbrowser\.editor'\)/);
  assert.match(assets, /com_smartbrowser\/editor\.css/);
  assert.match(css, /dialog\.com-smartbrowser-editor-picker[^}]+width: min\(1200px/s);
  assert.match(css, /#smartbrowserEditorTabs\[view="tabs"\][^}]+display: flex;[^}]+flex-direction: column;/s);
  assert.match(css, /#smartbrowserEditorTabs\[view="tabs"\] > :not\(\[role="tablist"\]\)[^}]+overflow-y: auto;/s);
  assert.match(css, /\.com-smartbrowser-editor\.container-fluid \{[^}]*padding-top: 72px !important;/s);
  assert.match(css, /smartbrowser-tab-scroll[^}]+position: absolute !important;/s);
  assert.match(css, /choices\.is-open[^}]+z-index/s);
  assert.match(css, /choices\.is-flipped \.choices__list--dropdown[^}]+top: 100%;[^}]+bottom: auto;/s);
  assert.match(css, /js-modal-content-select-field \[data-button-action="select"\][^}]+border-start-end-radius: \.25rem !important;/s);
  assert.match(css, /smartbrowser-editor-tab \.field-calendar \{[^}]*width: min\(100%, 360px\);/s);
  assert.match(css, /field-calendar \.input-group > \.btn \{[^}]*align-items: center;[^}]*justify-content: center;/s);
  assert.match(css, /field-calendar :is\(\.input-group > \.btn, \.calendar-container \.js-btn\):hover[^}]*background-color: #0064d2;/s);
  assert.match(css, /choices\[data-type\*="select"\] \.choices__inner \{[^}]*display: block;/s);
  assert.match(picker, /const revealDropdown = \(choices\) =>/);
});

test('frontend editor cancel bypasses required-field validation', async () => {
  const layout = await readFile(new URL('../package/component/site/tmpl/editor/modal.php', import.meta.url), 'utf8');
  assert.match(layout, /<button type="button" class="btn btn-danger" onclick=/);
  assert.match(layout, /this\.form\.action=.*this\.form\.submit\(\)/);
  assert.doesNotMatch(layout, /formaction=.*editor\.cancel/);
  assert.doesNotMatch(layout, /window\.location\.href=.*cancelUrl/);
});

test('editor dialog has one scroll surface and fixed form actions', async () => {
  const js = await readFile(new URL('../package/component/media/js/smartbrowser.js', import.meta.url), 'utf8');
  const editorCss = await readFile(new URL('../package/component/media/css/editor.css', import.meta.url), 'utf8');
  const browserCss = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  assert.match(js, /className = "smartbrowser-editor", t\.innerHTML = `<iframe/);
  assert.doesNotMatch(js, /smartbrowser-editor-toolbar/);
  assert.match(browserCss, /\.smartbrowser-editor \{[^}]*border-radius: 8px;[^}]*overflow: hidden;/s);
  assert.match(editorCss, /\.smartbrowser-editor-actions \{[^}]*position: fixed;/s);
  assert.match(editorCss, /\.switcher:focus-within \.toggle-outside/);
});

test('browser invocations are adapter-locked unless switching is explicitly enabled', async () => {
  const support = await readFile(new URL('../package/component/admin/src/Support/BrowserViewSupport.php', import.meta.url), 'utf8');
  const menu = await readFile(new URL('../package/component/site/tmpl/dashboard/default.xml', import.meta.url), 'utf8');
  assert.match(support, /getBool\('showAdapterSwitcher', false\)/);
  assert.match(support, /array_filter\(\$adapterDescriptors[\s\S]*\$descriptor\['id'\] === \$adapterId/);
  assert.match(menu, /name="showAdapterSwitcher"[\s\S]*default="0"/);
});

test('integration and editor settings live in component Options, not the Dashboard', async () => {
  const view = await readFile(new URL('../package/component/admin/src/View/Dashboard/HtmlView.php', import.meta.url), 'utf8');
  const config = await readFile(new URL('../package/component/admin/config.xml', import.meta.url), 'utf8');
  const template = await readFile(new URL('../package/component/admin/tmpl/dashboard/default.php', import.meta.url), 'utf8');
  assert.match(view, /ToolbarHelper::preferences\('com_smartbrowser'\)/);
  for (const name of ['hide_component_menu', 'editor_admin', 'editor_site']) assert.match(config, new RegExp(`name="${name}"`));
  assert.doesNotMatch(template, /COM_SMARTBROWSER_INTEGRATION_SETTINGS/);
});

test('site menu item config supports Dashboard and Browser invocations', async () => {
  const xml = await readFile(new URL('../package/component/site/tmpl/dashboard/default.xml', import.meta.url), 'utf8');
  const view = await readFile(new URL('../package/component/site/src/View/Dashboard/HtmlView.php', import.meta.url), 'utf8');
  for (const name of ['display_mode', 'adapter', 'mode', 'browseRoot', 'showContextResources', 'defaultView']) assert.match(xml, new RegExp(`name="${name}"`));
  assert.match(xml, /value="dashboard"/);
  assert.match(xml, /value="browser"/);
  assert.match(xml, /value="readonly"/);
  assert.match(view, /new BrowserViewSupport/);
});

test('generic picker returns normalized selection and enforces configured resource types', async () => {
  const picker = await readFile(new URL('../package/component/media/js/picker.js', import.meta.url), 'utf8');
  const app = await readFile(new URL('../resources/js/components/SmartBrowserApp.vue', import.meta.url), 'utf8');
  const state = await readFile(new URL('../resources/js/core/createBrowserState.js', import.meta.url), 'utf8');
  assert.match(picker, /window\.SmartBrowserPicker/);
  assert.match(picker, /smartbrowser:select/);
  assert.match(picker, /allowedResourceTypes/);
  assert.match(app, /completeSelection\(selection\)/);
  assert.match(app, /resources: \[\.\.\.selected\]/);
  assert.match(state, /selectable: false, bulkSelectable: false/);
});

test('readonly invocation removes actions and is enforced by the API', async () => {
  const support = await readFile(new URL('../package/component/admin/src/Support/BrowserViewSupport.php', import.meta.url), 'utf8');
  const api = await readFile(new URL('../package/component/admin/src/Controller/ApiController.php', import.meta.url), 'utf8');
  const client = await readFile(new URL('../resources/js/services/ResourceApi.js', import.meta.url), 'utf8');
  assert.match(support, /\['manage', 'select', 'readonly'\]/);
  assert.match(client, /searchParams\.set\('mode'/);
  assert.match(api, /getCmd\('mode'\) === 'readonly'/);
  assert.match(api, /JERROR_ALERTNOAUTHOR/);
});

test('optional integration plugin defaults every replacement to disabled', async () => {
  const manifest = await readFile(new URL('../package/component/admin/config.xml', import.meta.url), 'utf8');
  for (const name of ['replace_media_field', 'replace_articles', 'replace_categories', 'replace_tags', 'replace_media', 'replace_menus', 'replace_users']) {
    assert.match(manifest, new RegExp(`name="${name}"[^>]*default="0"`));
  }
});

test('package installs the optional integration plugin without enabling core replacements', async () => {
  const pkg = await readFile(new URL('../pkg_smartbrowser.xml', import.meta.url), 'utf8');
  const build = await readFile(new URL('../build/build.ps1', import.meta.url), 'utf8');
  assert.match(pkg, /type="plugin" id="smartbrowserintegration" group="system"/);
  assert.match(build, /plg_system_smartbrowserintegration\.zip/);
  assert.doesNotMatch(pkg, /<scriptfile>/);
});

test('integration plugin English and Greek catalogues stay in parity', async () => {
  const english = await readFile(new URL('../package/plugins/system/smartbrowserintegration/language/en-GB/plg_system_smartbrowserintegration.ini', import.meta.url), 'utf8');
  const greek = await readFile(new URL('../package/plugins/system/smartbrowserintegration/language/el-GR/plg_system_smartbrowserintegration.ini', import.meta.url), 'utf8');
  const keys = (catalogue) => [...catalogue.matchAll(/^(PLG_SYSTEM_SMARTBROWSERINTEGRATION[A-Z0-9_]*)=/gm)].map((match) => match[1]).sort();
  assert.deepEqual(keys(greek), keys(english));
});

test('administrator manager replacement is runtime-only and preserves forms and original URLs', async () => {
  const plugin = await readFile(new URL('../package/plugins/system/smartbrowserintegration/src/Extension/Smartbrowserintegration.php', import.meta.url), 'utf8');
  const menus = await readFile(new URL('../package/component/admin/src/Adapter/MenuAdapter.php', import.meta.url), 'utf8');
  assert.match(plugin, /onPreprocessMenuItems/);
  assert.match(plugin, /updateItems\(\$items\)/);
  assert.match(plugin, /\$originalLink = \(string\) \$item->link/);
  assert.match(plugin, /\$query\['menutype'\][\s\S]*browseRoot=/);
  assert.match(menus, /str_starts_with\(\$this->browseRoot, 'menu:'\)/);
  assert.match(menus, /return \[\$this->normalizeMenu\(\$this->menu\(substr\(\$this->browseRoot, 5\)\)\)\]/);
  assert.match(plugin, /!empty\(\$query\['task'\]\) \|\| !empty\(\$query\['layout'\]\)/);
  assert.doesNotMatch(plugin, /redirect\(|#__menu|UPDATE\s+/i);
});

test('media field integration maps directory and accepted images into picker constraints', async () => {
  const integration = await readFile(new URL('../package/component/media/js/media-field.js', import.meta.url), 'utf8');
  assert.match(integration, /getAttribute\('root-folder'\)/);
  assert.match(integration, /searchParams\.get\('path'\)/);
  assert.match(integration, /`local-\$\{rootFolder\}:\/`/);
  assert.match(integration, /allowedResourceTypes/);
  assert.match(integration, /\['image'\]/);
  assert.match(integration, /input\.dispatchEvent\(new Event\('change'/);
});

test('media field integration is a component asset loaded after the generic picker', async () => {
  const plugin = await readFile(new URL('../package/plugins/system/smartbrowserintegration/src/Extension/Smartbrowserintegration.php', import.meta.url), 'utf8');
  const assets = await readFile(new URL('../package/component/media/joomla.asset.json', import.meta.url), 'utf8');
  assert.match(plugin, /assetExists\('script', 'com_smartbrowser\.media-field'\)/);
  assert.match(plugin, /registerStyle\('com_smartbrowser\.app', 'com_smartbrowser\/smartbrowser\.css'\)/);
  assert.match(plugin, /useStyle\('com_smartbrowser\.app'\)->useScript/);
  assert.match(plugin, /registerScript\(\s*'com_smartbrowser\.media-field'/);
  assert.match(plugin, /useScript\('com_smartbrowser\.media-field'\)/);
  assert.match(plugin, /catch \(Throwable \$error\)/);
  assert.match(assets, /"name": "com_smartbrowser\.media-field"/);
  assert.match(assets, /"dependencies": \["com_smartbrowser\.picker"\]/);
});

test('picker host is viewport-sized and isolated from the active site menu item', async () => {
  const picker = await readFile(new URL('../package/component/media/js/picker.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  assert.match(picker, /tmpl: 'component'/);
  assert.match(picker, /Itemid: '0'/);
  assert.match(css, /\.smartbrowser-picker \{[^}]*width: min\(1440px, 96vw\)[^}]*height: min\(900px, 94vh\)/s);
});

test('every browser adapter exposes an original Joomla manager escape hatch in manage mode', async () => {
  const provider = await readFile(new URL('../package/component/admin/src/Support/ManagerUrlProvider.php', import.meta.url), 'utf8');
  const support = await readFile(new URL('../package/component/admin/src/Support/BrowserViewSupport.php', import.meta.url), 'utf8');
  for (const adapter of ['media', 'articles', 'flat-articles', 'categories', 'tags', 'articles-by-tag', 'menus', 'users']) assert.match(provider, new RegExp(`'${adapter}' =>`));
  assert.match(support, /\$mode === 'manage' \? ManagerUrlProvider::for/);
});
