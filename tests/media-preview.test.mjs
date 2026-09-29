import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { previewKind } from '../resources/js/adapters/MediaActionDriver.js';

test('only browser-viewable media gets an embedded preview', () => {
  const file = (mimeType) => ({ metadata: { mimeType, url: '/media/example' } });
  assert.equal(previewKind(file('image/png')), 'image');
  assert.equal(previewKind(file('application/pdf')), 'pdf');
  assert.equal(previewKind(file('video/mp4')), 'video');
  assert.equal(previewKind(file('audio/mpeg')), 'audio');
  assert.equal(previewKind(file('application/vnd.openxmlformats-officedocument.wordprocessingml.document')), null);
  assert.equal(previewKind(file('application/zip')), null);
  assert.equal(previewKind({ metadata: { mimeType: 'image/png' } }), null);
});

test('unsupported previews use a non-loading placeholder', async () => {
  const driver = await readFile(new URL('../resources/js/adapters/MediaActionDriver.js', import.meta.url), 'utf8');
  assert.match(driver, /smartbrowser-preview-unavailable/);
  assert.match(driver, /const kind = previewKind\(resource\)/);
  assert.match(driver, /kind === 'pdf'[\s\S]*<iframe/);
});
