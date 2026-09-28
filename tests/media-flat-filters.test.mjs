import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import MediaActionDriver from '../resources/js/adapters/MediaActionDriver.js';

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('media filters use the same grouped matching in regular and flat views', async () => {
  const [media, flat] = await Promise.all([
    source('package/component/admin/src/Adapter/MediaAdapter.php'),
    source('package/component/admin/src/Adapter/FlatHierarchyAdapter.php'),
  ]);
  for (const id of ['type', 'mime', 'extension', 'created', 'modified', 'size', 'dimensions']) {
    assert.match(media, new RegExp(`'id' => '${id}'`));
  }
  assert.match(media, /self::matchesFilters\(\$normalized/);
  assert.match(flat, /MediaAdapter::matchesFilters\(\$resource/);
  assert.match(flat, /MediaAdapter::facetOptions\(\$resources/);
  assert.match(flat, /\$traversalOptions\['filters'\] = \[\]/);
});

test('flat root resets its filters and media preview exposes save, copy and download', async () => {
  const [app, driver, details] = await Promise.all([
    source('resources/js/components/SmartBrowserApp.vue'),
    source('resources/js/adapters/MediaActionDriver.js'),
    source('resources/js/components/ResourceDetails.vue'),
  ]);
  assert.match(app, /flatActive && nodeId === state\.selectedNode && nodeId === state\.roots\[0\]\?\.id/);
  assert.match(app, /await clearFilters\(\)/);
  assert.match(driver, /data-action="save"/);
  assert.match(driver, /data-action="apply"/);
  assert.match(driver, /data-action="copy"/);
  assert.doesNotMatch(driver, /data-action="rename"/);
  assert.match(driver, /data-action="download"/);
  assert.match(driver, /data-tab="metadata"/);
  assert.match(driver, /data-action="cancel"[\s\S]*data-action="download"/);
  assert.match(details, /column\.format === 'mediaType'/);
});

test('media rename uses Joomla cursor icon and info panel leaves room for item menus', async () => {
  const [media, css] = await Promise.all([
    source('package/component/admin/src/Adapter/MediaAdapter.php'),
    source('package/component/media/css/smartbrowser.css'),
  ]);
  assert.match(media, /'COM_SMARTBROWSER_RENAME', 'fa fa-i-cursor'/);
  assert.match(css, /\.resource-browser-grid \{[\s\S]*?flex: 1 1 0;[\s\S]*?min-width: 0;/);
  assert.match(css, /\.smartbrowser-preview-tab \{[^}]*overflow: auto;/);
});

test('media preview separates the final extension from the bare filename', () => {
  const driver = new MediaActionDriver(null, null, null, null);
  assert.deepEqual(driver.splitFilename('archive.tar.gz'), ['archive.tar', 'gz']);
  assert.deepEqual(driver.splitFilename('.htaccess'), ['.htaccess', '']);
  assert.deepEqual(driver.splitFilename('README'), ['README', '']);
});

test('media preview uses the editor toolbar labels loaded for browser JavaScript', async () => {
  const [driver, browser] = await Promise.all([
    source('resources/js/adapters/MediaActionDriver.js'),
    source('package/component/admin/src/Support/BrowserViewSupport.php'),
  ]);
  for (const key of ['JSAVE', 'JAPPLY', 'JSAVEASCOPY']) {
    assert.match(driver, new RegExp(`this\\.escapeTranslated\\('${key}'\\)`));
    assert.match(browser, new RegExp(`'${key}'`));
  }
  assert.match(browser, /foreach \(\$this->languageKeys\(\) as \$key\) Text::script\(\$key\)/);
});
