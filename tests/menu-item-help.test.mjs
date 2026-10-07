import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('SmartBrowser menu item options have translated help in both Joomla catalogues', async () => {
  const xml = await readFile(new URL('../package/component/site/tmpl/dashboard/default.xml', import.meta.url), 'utf8');
  const fields = ['display_mode', 'adapter', 'mode', 'browseRoot', 'showContextResources', 'defaultView', 'showAdapterSwitcher'];
  const keys = fields.map((name) => {
    const field = xml.match(new RegExp(`<field name="${name}"[^>]+>`))?.[0];
    assert.ok(field, `Missing ${name} field`);
    const key = field.match(/description="([A-Z_]+)"/)?.[1];
    assert.ok(key, `Missing ${name} description`);
    return key;
  });
  for (const locale of ['en-GB', 'el-GR']) {
    for (const catalogue of ['com_smartbrowser.ini', 'com_smartbrowser.sys.ini']) {
      const ini = await readFile(new URL(`../package/component/admin/language/${locale}/${catalogue}`, import.meta.url), 'utf8');
      for (const key of keys) assert.match(ini, new RegExp(`^${key}=".+"$`, 'm'));
    }
  }
});
