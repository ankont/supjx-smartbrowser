import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import createBrowserState from '../resources/js/core/createBrowserState.js';

test('a scoped menu root supplies its own filter option without looking up menu item zero', async () => {
  const adapter = await readFile(new URL('../package/component/admin/src/Adapter/MenuAdapter.php', import.meta.url), 'utf8');
  assert.match(adapter, /'options' => array_merge\([\s\S]*\$this->scopedMenus\(\)/);
  assert.match(adapter, /private function scopedMenus\(\): array[\s\S]*str_starts_with\(\$this->browseRoot, 'menu:'\)[\s\S]*\$this->menu\(substr\(\$this->browseRoot, 5\)\)/);
});

test('featured navigation reuses flat articles and the existing Joomla manager link', async () => {
  const plugin = await readFile(new URL('../package/plugins/system/smartbrowserintegration/src/Extension/Smartbrowserintegration.php', import.meta.url), 'utf8');
  const support = await readFile(new URL('../package/component/admin/src/Support/BrowserViewSupport.php', import.meta.url), 'utf8');
  const manager = await readFile(new URL('../package/component/admin/src/Support/ManagerUrlProvider.php', import.meta.url), 'utf8');
  assert.match(plugin, /\$query\['filter'\]\['featured'\] \?\? ''/);
  assert.match(plugin, /if \(\$featured\) return .*'flat-articles'/);
  assert.match(plugin, /\$adapter === 'flat-articles'.*featuredOnly=1/);
  assert.match(support, /'initialFilters' => \$featuredOnly \? \['featured' => '1'\]/);
  assert.match(support, /ManagerUrlProvider::for\(\$this->app, \$adapterId, \$featuredOnly\)/);
  assert.match(manager, /\$adapter === 'flat-articles' && \$featuredOnly[\s\S]*view=articles&filter\[featured\]=1/);
});

test('hidden component menu uses the Joomla menu visibility parameter', async () => {
  const plugin = await readFile(new URL('../package/plugins/system/smartbrowserintegration/src/Extension/Smartbrowserintegration.php', import.meta.url), 'utf8');
  assert.match(plugin, /hide_component_menu[\s\S]*\$item->getParams\(\)->set\('menu_show', 0\)/);
  assert.doesNotMatch(plugin, /unset\(\$items\[/);
});

test('featured entry overrides a previous flat article filter for that navigation', async () => {
  const originalWindow = globalThis.window;
  globalThis.window = {
    location: { href: 'https://example.test/administrator/index.php?option=com_smartbrowser&adapter=flat-articles' },
    history: { replaceState() {} },
  };
  let requestedFilters;
  try {
    const browser = createBrowserState({
      options: { roots: [{ id: 'flat-articles:root' }], initialNode: 'flat-articles:root', initialFilters: { featured: '1' } },
      api: { getResources: async (_node, options) => { requestedFilters = { ...options.filters }; return { nodes: [], items: [], contextItems: [], breadcrumb: [], actions: [], presentation: { filters: [] } }; } },
      persistence: { load: (defaults) => ({ ...defaults, filters: { featured: '0' } }), save() {} },
      viewRegistry: { has: () => true },
    });
    await browser.load();
    assert.equal(requestedFilters.featured, '1');
  } finally {
    globalThis.window = originalWindow;
  }
});
