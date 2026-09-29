import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('component Options group editors, grid sizes, then reset in one display tab', async () => {
  const config = await readFile(new URL('../package/component/admin/config.xml', import.meta.url), 'utf8');
  const tab = config.match(/<fieldset name="preferences"[^>]*>([\s\S]*?)<\/fieldset>\s*<fieldset name="context"/);
  assert.ok(tab);
  assert.ok(tab[1].indexOf('name="preferences_editors"') < tab[1].indexOf('name="preferences_display"'));
  assert.ok(tab[1].indexOf('name="preferences_editors"') < tab[1].indexOf('name="preferences_grid"'));
  assert.ok(tab[1].indexOf('name="preferences_grid"') < tab[1].indexOf('name="preferences_display"'));
  for (const size of ['sm', 'md', 'lg', 'xl']) {
    assert.match(config, new RegExp(`name="grid_width_${size}" type="gridwidth" parentclass="sb-grid-width-row" filter="integer"`));
  }
  for (const name of ['editor_admin', 'editor_site', 'preferences_reset_token']) {
    assert.equal((config.match(new RegExp(`name="${name}"`, 'g')) || []).length, 1);
  }
  assert.ok(config.indexOf('name="preferences"') < config.indexOf('name="context"'));
  assert.ok(config.indexOf('name="context"') < config.indexOf('name="integration"'));
  assert.ok(config.indexOf('name="integration"') < config.indexOf('name="permissions"'));
});

test('grid width options reach each zoom level without overriding saved zoom', async () => {
  const [support, app, css, state] = await Promise.all([
    readFile(new URL('../package/component/admin/src/Support/BrowserViewSupport.php', import.meta.url), 'utf8'),
    readFile(new URL('../resources/js/components/SmartBrowserApp.vue', import.meta.url), 'utf8'),
    readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8'),
    readFile(new URL('../resources/js/core/createBrowserState.js', import.meta.url), 'utf8'),
  ]);
  assert.match(support, /'gridWidths' => \$gridWidths/);
  assert.match(app, /--sb-grid-\$\{size\}/);
  for (const size of ['sm', 'md', 'lg', 'xl']) assert.match(css, new RegExp(`\\.resource-browser-grid\\.size-${size} \\{[^}]*--sb-grid-${size}`));
  assert.match(state, /viewOptions: \{ gridSize: 'md'/);
});

test('grid width fields show a live full-width tile preview below label and control', async () => {
  const [field, script, css] = await Promise.all([
    readFile(new URL('../package/component/admin/src/Field/GridwidthField.php', import.meta.url), 'utf8'),
    readFile(new URL('../package/component/media/js/grid-width-preview.js', import.meta.url), 'utf8'),
    readFile(new URL('../package/component/media/css/grid-width-preview.css', import.meta.url), 'utf8'),
  ]);
  assert.match(field, /extends NumberField/);
  assert.match(field, /parent::getInput\(\)/);
  assert.match(field, /data-sb-grid-width/);
  assert.match(field, /sb-grid-width-preview-tile/);
  assert.match(script, /document\.addEventListener\('input'/);
  assert.match(script, /--sb-grid-preview-side', `\$\{width\}px`/);
  assert.doesNotMatch(script, /width \/ 5/);
  assert.match(css, /\.control-group\.sb-grid-width-row \{[^}]*display: grid;[^}]*grid-template-columns: max-content minmax\(0, 1fr\);/s);
  assert.match(css, /\.sb-grid-width-control \{[^}]*display: contents;/s);
  assert.match(css, /\.sb-grid-width-input \{[^}]*grid-column: 2;[^}]*grid-row: 1;/s);
  assert.match(css, /\.sb-grid-width-preview \{[^}]*inline-size: 100%;/s);
  assert.match(css, /\.sb-grid-width-preview \{[^}]*grid-column: 1 \/ -1;[^}]*grid-row: 2;/s);
  assert.match(css, /width: var\(--sb-grid-preview-side, 120px\);/);
  assert.match(css, /height: var\(--sb-grid-preview-side, 120px\);/);
  assert.match(css, /font-size: 3\.75rem;/);
});
