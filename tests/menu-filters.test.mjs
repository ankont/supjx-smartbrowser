import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('menus expose menu, access, language and component filters with readable metadata', async () => {
  const [menu, flat, content, app] = await Promise.all([
    source('package/component/admin/src/Adapter/MenuAdapter.php'),
    source('package/component/admin/src/Adapter/FlatHierarchyAdapter.php'),
    source('package/component/admin/src/Adapter/ContentAdapter.php'),
    source('resources/js/components/SmartBrowserApp.vue'),
  ]);
  for (const filter of ['menu', 'access', 'language', 'component']) {
    assert.match(menu, new RegExp(`'id' => '${filter}'`));
    assert.match(flat, new RegExp(`'${filter}'`));
  }
  assert.match(menu, /'access' => \$this->accessLevels\(\)/);
  assert.match(menu, /'languageImage' => \$this->languageImage\(/);
  assert.match(menu, /'componentId' => \(int\) \$item->component_id/);
  assert.match(flat, /unset\(\$traversalOptions\['filters'\]\[\$filter\]\)/);
  assert.match(content, /return \$titles \?: \[Text::_\('COM_SMARTBROWSER_CONTENT_ROOT'\)\]/);
  assert.match(app, /id === 'menu' && value && !options\.browseRoot && options\.adapter === 'menus'/);
  assert.match(app, /url\.searchParams\.set\('flatScope', `menu:\$\{value\}`\)/);
});

test('menu roots follow Joomla menu type ordering rather than titles', async () => {
  const menu = await source('package/component/admin/src/Adapter/MenuAdapter.php');
  assert.match(menu, /from\(\$db->quoteName\('#__menu_types'\)\)[^;]*order\(\[\$db->quoteName\('ordering'\) \. ' ASC', \$db->quoteName\('id'\) \. ' ASC'\]\)/);
});
