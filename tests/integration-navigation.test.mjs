import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import createBrowserState from '../resources/js/core/createBrowserState.js';

test('a scoped menu root supplies its own filter option without looking up menu item zero', async () => {
  const adapter = await readFile(new URL('../package/component/admin/src/Adapter/MenuAdapter.php', import.meta.url), 'utf8');
  assert.match(adapter, /'options' => array_merge\([\s\S]*\$this->scopedMenus\(\)/);
  assert.match(adapter, /private function scopedMenus\(\): array[\s\S]*str_starts_with\(\$this->browseRoot, 'menu:'\)[\s\S]*\$this->menu\(substr\(\$this->browseRoot, 5\)\)/);
});

test('featured navigation has its own integration toggle and native Joomla manager link', async () => {
  const plugin = await readFile(new URL('../package/plugins/system/smartbrowserintegration/src/Extension/Smartbrowserintegration.php', import.meta.url), 'utf8');
  const support = await readFile(new URL('../package/component/admin/src/Support/BrowserViewSupport.php', import.meta.url), 'utf8');
  const manager = await readFile(new URL('../package/component/admin/src/Support/ManagerUrlProvider.php', import.meta.url), 'utf8');
  const config = await readFile(new URL('../package/component/admin/config.xml', import.meta.url), 'utf8');
  assert.match(plugin, /\$query\['filter'\]\['featured'\] \?\? ''/);
  assert.match(plugin, /if \(\$featured\) return .*get\('replace_featured_articles', 0\) \? 'featured-articles'/);
  assert.match(plugin, /'com_content:articles' => \['articles', 'replace_articles'\]/);
  assert.match(plugin, /\$replacements = \['replace_articles', 'replace_featured_articles'/);
  assert.match(config, /name="replace_featured_articles"[^>]*default="0"/);
  assert.match(support, /\$adapterId = 'featured-articles'/);
  assert.match(support, /'defaultSortBy' => \$adapterId === 'featured-articles' \? 'ordering'/);
  assert.match(manager, /'featured-articles' => 'index\.php\?option=com_content&view=featured'/);
});

test('hidden component menu uses the Joomla menu visibility parameter', async () => {
  const plugin = await readFile(new URL('../package/plugins/system/smartbrowserintegration/src/Extension/Smartbrowserintegration.php', import.meta.url), 'utf8');
  assert.match(plugin, /hide_component_menu[\s\S]*\$item->getParams\(\)->set\('menu_show', 0\)/);
  assert.doesNotMatch(plugin, /unset\(\$items\[/);
});

test('featured entry has independent sorting defaults and no mutable featured filter', async () => {
  const originalWindow = globalThis.window;
  globalThis.window = {
    location: { href: 'https://example.test/administrator/index.php?option=com_smartbrowser&adapter=featured-articles' },
    history: { replaceState() {} },
  };
  let requestedFilters;
  try {
    const browser = createBrowserState({
      options: { roots: [{ id: 'featured-articles:root' }], initialNode: 'featured-articles:root', defaultSortBy: 'ordering', defaultSortDirection: 'asc' },
      api: { getResources: async (_node, options) => { requestedFilters = { ...options.filters }; return { nodes: [], items: [], contextItems: [], breadcrumb: [], actions: [], presentation: { filters: [], sortFields: [{ id: 'ordering' }] } }; } },
      persistence: { load: (defaults) => defaults, save() {} },
      viewRegistry: { has: () => true },
    });
    await browser.load();
    assert.equal(requestedFilters.featured, undefined);
    assert.equal(browser.state.sortBy, 'ordering');
  } finally {
    globalThis.window = originalWindow;
  }
});

test('new articles inherit their category or tag node in both editor clients', async () => {
  const paths = [
    'package/component/admin/src/Adapter/ArticleAdapter.php',
    'package/component/admin/src/Adapter/CategoryAdapter.php',
    'package/component/admin/src/Adapter/TagAdapter.php',
    'package/component/admin/src/Adapter/ArticlesByTagAdapter.php',
    'package/component/admin/src/Adapter/ContentAdapter.php',
    'package/component/admin/src/Support/EditorRoute.php',
    'package/component/site/src/Service/FrontendEditorService.php',
    'package/plugins/system/smartbrowserintegration/src/Extension/Smartbrowserintegration.php',
  ];
  const [articles, categories, tags, byTag, content, route, frontend, plugin] = await Promise.all(
    paths.map((path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')),
  );
  assert.match(articles, /task=article\.add&catid=/);
  assert.match(categories, /task=article\.add&catid=/);
  assert.match(tags, /task=article\.add&sbTagId=/);
  assert.match(byTag, /\['createChild', 'newArticle'\]/);
  assert.match(content, /'newArticle' => \$id !== null && \$this->canCreateArticle\(\)/);
  assert.match(route, /'catid', 'sbTagId', 'sbGroupId'/);
  assert.match(route, /'com_content:article\.add' => \['article', 'modal', 'com_content\.edit\.article\.data'\]/);
  assert.match(route, /\$app->setUserState\(\$stateKey, null\)/);
  assert.match(route, /\$query\['view'\] = \$view/);
  assert.match(route, /http_build_query\(\$query, '', '&', PHP_QUERY_RFC3986\)/);
  assert.match(frontend, /\$form->setValue\('tags', null, \[\$this->app->getInput\(\)->getInt\('sbTagId'\)\]\)/);
  assert.match(plugin, /onContentPrepareData' => 'prefillArticleContext'/);
  assert.match(plugin, /\$event->updateData\(\$data\)/);
});

test('new child resources and users inherit the current node in both clients', async () => {
  const [route, users, frontend, template] = await Promise.all([
    'package/component/admin/src/Support/EditorRoute.php',
    'package/component/admin/src/Adapter/UsersAdapter.php',
    'package/component/site/src/Service/FrontendEditorService.php',
    'package/component/site/tmpl/editor/modal.php',
  ].map((path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')));
  for (const form of ['com_categories:category.add', 'com_tags:tag.add', 'com_menus:item.add', 'com_users:user.add']) {
    assert.ok(route.includes(form));
  }
  assert.match(route, /com_menus\.edit\.item\.parent_id/);
  assert.match(route, /\['groups' => \[\(int\) \$query\['sbGroupId'\]\]\]/);
  assert.match(users, /'newUser'.*'currentNode' => true/);
  assert.match(users, /\$url \.= '&sbGroupId=' \. \$groupId/);
  assert.match(frontend, /in_array\(\$type, \['category', 'tag'\], true\)/);
  assert.match(frontend, /setFieldAttribute\('parent_id', 'parent', 'true'\)/);
  assert.match(frontend, /setFieldAttribute\('parent_id', 'extension', 'com_content'\)/);
  assert.match(frontend, /\$form->setValue\('groups', null, \[\$groupId\]\)/);
  assert.match(template, /access\.usergroups', 'jform\[groups\]'/);
});

test('menu selection is the first publishing field in the frontend menu editor', async () => {
  const template = await readFile(new URL('../package/component/site/tmpl/editor/modal.php', import.meta.url), 'utf8');
  const field = "$renderField('menutype')";
  const publishing = template.indexOf("'smartbrowser-publishing', Text::_('JGLOBAL_FIELDSET_PUBLISHING')", template.indexOf("$this->resourceType === 'menu-item') : ?>", template.indexOf('smartbrowser-editor-menu-link')));
  assert.equal(template.split(field).length - 1, 1);
  assert.ok(publishing > template.indexOf('smartbrowser-editor-menu-link'));
  assert.ok(template.indexOf(field) > publishing);
  assert.ok(template.indexOf(field) < template.indexOf("$renderField($name); ?>", publishing));
});
