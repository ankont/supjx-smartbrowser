import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../package/component/media/js/media-value.js', import.meta.url), 'utf8');
const context = vm.createContext({ URL, URLSearchParams });
vm.runInContext(source, context);
const media = context.SmartBrowserMediaValue;

const resource = (filesystem, path, relativePath, width, height) => ({
  id: `${filesystem}:${path}`,
  type: 'image',
  metadata: { filesystem, filesystemPath: path, relativePath, url: `https://example.test/${relativePath}`, width, height, mimeType: 'image/jpeg' },
});

test('Joomla Media serialization uses resource filesystem and known dimensions', () => {
  const image = resource('local-assets', '/site/default/GenericIonidios.jpg', 'assets/site/default/GenericIonidios.jpg', 720, 360);
  const value = media.format(image);
  assert.equal(value, 'assets/site/default/GenericIonidios.jpg#joomlaImage://local-assets/site/default/GenericIonidios.jpg?width=720&height=360');
  assert.equal(media.format(image, 'path'), 'assets/site/default/GenericIonidios.jpg');
  assert.equal(media.format(image, 'url'), 'https://example.test/assets/site/default/GenericIonidios.jpg');
  assert.equal(media.format(image, 'resource'), image);
});

test('another filesystem round-trips without local root assumptions', () => {
  const image = resource('cloud-library', '/photos/header.jpg', 'library/photos/header.jpg', 1024, 512);
  const parsed = media.parse(media.format(image));
  assert.equal(parsed.filesystem, 'cloud-library');
  assert.equal(parsed.filesystemPath, '/photos/header.jpg');
  assert.equal(parsed.resourceId, image.id);
  assert.equal(parsed.width, 1024);
  assert.equal(parsed.height, 512);
  assert.equal(media.selectionLocation(media.format(image)).node, 'cloud-library:/photos');
});

test('missing dimensions do not require another image read', () => {
  const image = resource('remote-gallery', '/cover.svg', 'gallery/cover.svg', 0, null);
  assert.equal(media.format(image), 'gallery/cover.svg#joomlaImage://remote-gallery/cover.svg');
  assert.equal(media.parse(media.format(image)).width, null);
  assert.equal(media.parse(media.format(image)).height, null);
  image.metadata.width = 640;
  assert.equal(media.format(image), 'gallery/cover.svg#joomlaImage://remote-gallery/cover.svg?width=640');
});

test('plain paths, URLs, and non-image files retain plain output', () => {
  assert.equal(media.parse('assets/site/default/file.jpg').path, 'assets/site/default/file.jpg');
  assert.equal(media.parse('assets/site/default/file.jpg').resourceId, null);
  assert.equal(media.parse('https://example.test/file.jpg').path, 'https://example.test/file.jpg');
  const document = { ...resource('local-files', '/report.docx', 'files/report.docx'), type: 'document' };
  assert.equal(media.format(document), 'files/report.docx');
});

test('native saved value resolves the exact resource and parent folder', () => {
  const value = 'assets/site/default/GenericIonidios.jpg#joomlaImage://local-assets/site/default/GenericIonidios.jpg?width=720&height=360';
  assert.equal(media.parse(value).path, 'assets/site/default/GenericIonidios.jpg');
  assert.equal(media.selectionLocation(value).resourceId, 'local-assets:/site/default/GenericIonidios.jpg');
  assert.equal(media.selectionLocation(value).node, 'local-assets:/site/default');
});

test('both field integrations use one formatter and media resources stay descriptive', async () => {
  const [adapter, field, editor, picker, app] = await Promise.all([
    readFile(new URL('../package/component/admin/src/Adapter/MediaAdapter.php', import.meta.url), 'utf8'),
    readFile(new URL('../package/component/media/js/media-field.js', import.meta.url), 'utf8'),
    readFile(new URL('../package/component/media/js/editor-fields.js', import.meta.url), 'utf8'),
    readFile(new URL('../package/component/media/js/picker.js', import.meta.url), 'utf8'),
    readFile(new URL('../resources/js/components/SmartBrowserApp.vue', import.meta.url), 'utf8'),
  ]);
  for (const key of ['filesystem', 'filesystemPath', 'relativePath', 'url', 'width', 'height', 'mimeType']) {
    assert.match(adapter, new RegExp(`'${key}'\\s*=>`));
  }
  assert.match(field, /SmartBrowserMediaValue\.format\(resource, 'joomla'\)/);
  assert.match(editor, /SmartBrowserMediaValue\.format\(resource, 'joomla'\)/);
  assert.match(picker, /SmartBrowserMediaValue\.selectionLocation\(config\.initialValue\)/);
  assert.match(app, /resources: \[\.\.\.selected\]/);
});
