import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

test('Home Dashboard provides an authorised third-party SmartBrowser shortcut', () => {
  assert.match(execFileSync('php', ['tests/dashboard-icon.php'], { encoding: 'utf8' }), /context and ACL OK/);
});

test('native menu replacements do not require an integration URL flag', async () => {
  const plugin = await readFile(new URL('../package/plugins/system/smartbrowserintegration/src/Extension/Smartbrowserintegration.php', import.meta.url), 'utf8');
  assert.match(plugin, /&mode=manage'/);
  assert.doesNotMatch(plugin, /&integrated=/);
});

test('integrated browser Options target the original Joomla component and its ACL', async () => {
  const view = await readFile(new URL('../package/component/admin/src/View/Browser/HtmlView.php', import.meta.url), 'utf8');
  assert.match(view, /IntegrationOptions::browserEnabled/);
  assert.doesNotMatch(view, /getBool\('integrated'/);
  for (const component of ['com_content', 'com_tags', 'com_menus', 'com_users', 'com_media']) {
    assert.match(view, new RegExp(`=> '${component}'`));
  }
  assert.match(view, /authorise\('core\.options', \$component\)/);
  assert.match(view, /ToolbarHelper::preferences\(\$component\)/);
  assert.doesNotMatch(view, /enabled\('hide_component_menu'\)/);
  assert.match(view, /customButton\('smartbrowser-options'\)/);
  assert.match(view, /sb-options-icon[\s\S]*aria-label=[\s\S]*icon-sb-brand/);
  assert.match(view, /customButton\('smartbrowser-actions'\)/);
  assert.match(view, /COM_CONTENT_ARTICLES_TITLE/);
  assert.match(view, /COM_CATEGORIES_CATEGORIES_TITLE/);
  assert.match(view, /COM_MENUS_VIEW_ITEMS_MENU_TITLE/);
  assert.match(view, /ToolbarHelper::title\(\$title, \$icon\)/);
});

test('browser integration follows enabled settings only in backend management', () => {
  assert.match(execFileSync('php', ['tests/integration-options.php'], { encoding: 'utf8' }), /settings and client boundaries OK/);
});

test('two Options links share the right side of the toolbar', async () => {
  const css = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  assert.match(css, /joomla-toolbar-button\.ms-auto \+ joomla-toolbar-button\.ms-auto/);
});
