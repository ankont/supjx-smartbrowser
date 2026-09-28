import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('grid item menu keeps end alignment unless it crosses the browser view edge', async () => {
  const grid = await readFile(new URL('../resources/js/components/ResourceGrid.vue', import.meta.url), 'utf8');
  const css = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  assert.match(grid, /menu\?\.getBoundingClientRect\(\)\.left < view\.getBoundingClientRect\(\)\.left \+ 4/);
  assert.match(grid, /menuMaxWidth\.value = view \? Math\.max\(0, Math\.min\(360, view\.clientWidth - 8, window\.innerWidth - 20\)\)/);
  assert.match(css, /\.resource-browser-grid \.resource-item-menu\.align-start\s*\{[^}]*inset-inline-start: 4px;[^}]*inset-inline-end: auto;/);
});
