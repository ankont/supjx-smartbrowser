import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import ResourceApi from '../resources/js/services/ResourceApi.js';

test('each supported adapter has independent administrator and frontend defaults', async () => {
  const config = await readFile(new URL('../package/component/admin/config.xml', import.meta.url), 'utf8');
  const support = await readFile(new URL('../package/component/admin/src/Support/BrowserViewSupport.php', import.meta.url), 'utf8');
  const controller = await readFile(new URL('../package/component/admin/src/Controller/ApiController.php', import.meta.url), 'utf8');
  const options = await readFile(new URL('../package/component/admin/src/Support/ContextOptions.php', import.meta.url), 'utf8');
  const menuItem = await readFile(new URL('../package/component/site/tmpl/dashboard/default.xml', import.meta.url), 'utf8');
  const english = await readFile(new URL('../package/component/admin/language/en-GB/com_smartbrowser.ini', import.meta.url), 'utf8');
  assert.match(config, /<fieldset name="context"/);
  assert.match(config, /<fieldset name="context_admin" label="COM_SMARTBROWSER_OPTIONS_CONTEXT_ADMIN">/);
  assert.match(config, /<fieldset name="context_site" label="COM_SMARTBROWSER_OPTIONS_CONTEXT_SITE">/);
  assert.match(english, /^COM_SMARTBROWSER_CONFIGURATION=/m);
  for (const adapter of ['categories', 'tags', 'menus']) {
    for (const client of ['admin', 'site']) assert.match(config, new RegExp(`name="context_${adapter}_${client}"[^>]*default="0"`));
  }
  assert.match(options, /\['categories', 'tags', 'menus'\]/);
  assert.match(options, /'context_' \. \$adapterId \. \(\$site \? '_site' : '_admin'\)/);
  assert.match(support, /getBool\('showContextResources', ContextOptions::enabled\(\$adapterId, \$this->app->isClient\('site'\)\)\)/);
  assert.match(controller, /getBool\('showContextResources', ContextOptions::enabled\(\$adapter->getId\(\), \$this->app->isClient\('site'\)\)\)/);
  assert.match(menuItem, /name="showContextResources"[^>]*default=""/);
  assert.match(menuItem, /value="">COM_SMARTBROWSER_USE_GLOBAL/);
});

test('API always sends explicit context preference, including false', async () => {
  const originalJoomla = globalThis.Joomla;
  const urls = [];
  globalThis.Joomla = { request: ({ url, onSuccess }) => { urls.push(new URL(url)); onSuccess('{"success":true,"data":{}}'); } };
  try {
    const api = new ResourceApi({ apiBaseUrl: 'https://example.test/index.php?option=com_smartbrowser&format=json', adapter: 'categories', showContextResources: false });
    await api.getResources('content:root');
    api.options.showContextResources = true;
    await api.getResources('content:root');
    assert.deepEqual(urls.map((url) => url.searchParams.get('showContextResources')), ['0', '1']);
  } finally {
    globalThis.Joomla = originalJoomla;
  }
});
