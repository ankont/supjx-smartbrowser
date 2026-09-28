import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('numeric IDs sit near the action button without an oversized fixed gutter', async () => {
  const details = await readFile(new URL('../resources/js/components/ResourceDetails.vue', import.meta.url), 'utf8');
  const css = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  assert.match(details, /idWidth = computed\(\(\) => Math\.max\(48, 24 \+ 8 \*/);
  assert.match(css, /\.resource-details-view tbody \.resource-column-id \{ text-align: end; \}/);
});
