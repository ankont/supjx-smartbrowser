import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('details table can contract in any layout without losing menu-button breathing room', async () => {
  const css = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  assert.match(css, /\.resource-details-view \{[\s\S]*?overflow-x: hidden;/);
  assert.match(css, /\.resource-details-view \.table \{[\s\S]*?min-width: 0;/);
  assert.doesNotMatch(css, /\.resource-browser\.info-open \.resource-details-view \.table/);
  assert.match(css, /\.resource-details-view \.resource-row-actions \{[\s\S]*?padding: 0 7px;/);
});
