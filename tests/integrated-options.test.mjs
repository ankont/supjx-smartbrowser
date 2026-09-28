import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('native menu replacements mark browser navigation as integrated', async () => {
  const plugin = await readFile(new URL('../package/plugins/system/smartbrowserintegration/src/Extension/Smartbrowserintegration.php', import.meta.url), 'utf8');
  assert.match(plugin, /&mode=manage&integrated=1/);
});

test('integrated browser Options target the original Joomla component and its ACL', async () => {
  const view = await readFile(new URL('../package/component/admin/src/View/Browser/HtmlView.php', import.meta.url), 'utf8');
  assert.match(view, /getBool\('integrated', false\)/);
  for (const component of ['com_content', 'com_tags', 'com_menus', 'com_users', 'com_media']) {
    assert.match(view, new RegExp(`=> '${component}'`));
  }
  assert.match(view, /authorise\('core\.options', \$component\)/);
  assert.match(view, /ToolbarHelper::preferences\(\$component\)/);
  assert.match(view, /get\('hide_component_menu', 0\)/);
  assert.match(view, /ToolbarHelper::preferences\('com_smartbrowser', alt: 'COM_SMARTBROWSER_OPTIONS_BUTTON'\)/);
  assert.ok(view.indexOf("ToolbarHelper::preferences('com_smartbrowser', alt:") < view.indexOf('ToolbarHelper::preferences($component)'));
  assert.match(view, /COM_CONTENT_ARTICLES_TITLE/);
  assert.match(view, /COM_CATEGORIES_CATEGORIES_TITLE/);
  assert.match(view, /COM_MENUS_VIEW_ITEMS_MENU_TITLE/);
  assert.match(view, /ToolbarHelper::title\(\$title, \$icon\)/);
});

test('two Options links share the right side of the toolbar', async () => {
  const css = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  assert.match(css, /joomla-toolbar-button\.ms-auto \+ joomla-toolbar-button\.ms-auto/);
});
