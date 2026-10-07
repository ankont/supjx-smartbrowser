import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { previewKind } from '../resources/js/adapters/MediaActionDriver.js';
import MediaActionDriver from '../resources/js/adapters/MediaActionDriver.js';

test('file edit and preview dispatch to distinct dialogs; component previews use a popup', async () => {
  let result = { metadata: { mimeType: 'image/png' } };
  const driver = new MediaActionDriver({ execute: async () => result }, {}, async () => {}, key => key);
  driver.available = () => true;
  const calls = [];
  driver.editMedia = resource => calls.push(['edit', resource]);
  driver.preview = resource => calls.push(['preview', resource]);
  driver.previewUrl = (url, title) => calls.push(['url', url, title]);
  await driver.executeUnchecked({ id: 'edit' }, [{ id: 'file' }]);
  await driver.executeUnchecked({ id: 'preview' }, [{ id: 'file' }]);
  result = { command: 'previewUrl', url: '/index.php?tmpl=component', title: 'Article' };
  await driver.executeUnchecked({ id: 'preview' }, [{ id: 'article:1' }]);
  assert.deepEqual(calls.map(call => call[0]), ['edit', 'preview', 'url']);
});

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
