import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Selection Remove has a red icon badge with a white minus and a red row only on hover', () => {
  const css = readFileSync('package/component/media/css/smartbrowser.css', 'utf8');
  assert.match(css, /\.resource-action-collectionRemove:not\(:disabled\) > \.fas\s*\{\s*color: #fff;\s*background: #e74c4c;/);
  assert.doesNotMatch(css, /\.resource-item-menu \.resource-action-collectionRemove:not\(:disabled\)\s*\{/);
  assert.match(css, /\.resource-action-collectionRemove:not\(:disabled\):is\(:hover, :focus-visible\)\s*\{[^}]*background: #c93242;/s);
  assert.match(css, /\.resource-icon-button:has\(> \.fa-minus\):not\(:disabled\)\s*\{[^}]*background-color:/s);
});
