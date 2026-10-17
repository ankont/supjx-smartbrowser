import test from 'node:test';
import assert from 'node:assert/strict';
import { createSelectionAddressContract, mediaReference, mediaLocator } from '../resources/js/core/selectionAddress.js';
import createSelectionAddressService, { selectionAddressOperations } from '../resources/js/services/SelectionAddressService.js';
import { createCollectionState } from '../resources/js/core/collectionState.js';
import { referenceKey } from '../resources/js/core/selectionIdentity.js';

const imageUri = 'images/cover.jpg#joomlaImage://local-images/cover.jpg?width=800&height=600&crop=0%2C0%2C800%2C600&ratio=4%3A3&zoom=1.2&pluginFlag=one&pluginFlag=two&custom%5Bquality%5D=high';
const descriptor = (key, name, type = 'string', extra = {}) => ({ key, type, default: null, editor: 'text', address: { name, ...extra } });
const article = (capabilities = []) => ({ id: 'article:43', adapter: 'articles', type: 'article', kind: 'item', metadata: { publicUrl: 'https://example.org/library/article.html' }, selectionCapabilities: capabilities });
const profileFor = definitions => Object.fromEntries(definitions.map(d => [d.key, {}]));

test('all seven semantic formats share one parser/serializer without version fields', () => {
  const api = createSelectionAddressContract();
  const addresses = [imageUri, 'https://example.org/a#joomlaItem://article/43', 'https://example.org/page#joomlaLink://?target=_blank',
    'files/manual.pdf#joomlaFile://local-files/manual.pdf', '#joomlaFolder://local-images/gallery',
    'videos/intro.mp4#joomlaMedia://local-videos/intro.mp4?mediaType=video', 'https://example.org/gallery#joomlaGallery://collection/42?layout=grid'];
  assert.equal(api.formats().length, 7);
  for (const address of addresses) assert.equal(api.serialize(api.parse(address)), address);
  assert.throws(() => api.reference(api.parse(addresses[6])), /gallery.*provider/);
  assert.equal(api.serialize(api.parse('https://www.youtube.com/watch?v=x#joomlaMedia://youtube/x?mediaType=video')), 'https://www.youtube.com/watch?v=x#joomlaMedia://youtube/x?mediaType=video');
});

test('rightmost registered marker preserves original fragments, and unknown formats are not links', () => {
  const api = createSelectionAddressContract();
  const value = 'https://example.org/page?q=a#section#joomlaLink://?target=_blank';
  assert.equal(api.parse(value).url, 'https://example.org/page?q=a#section');
  assert.equal(api.parse('https://example.org/page#section').plain, true);
  assert.throws(() => api.parse('https://example.org/#notRegistered://thing'), /Unsupported/);
  assert.throws(() => api.reference({ ...api.parse(value), locator: 'not-empty' }, { linkReference() {} }), /empty locator/);
  assert.deepEqual(api.reference(api.parse('#joomlaItem://article/43'), { allowedAdapters: ['articles'] }), { adapter: 'articles', id: 'article:43' });
  assert.deepEqual(api.reference(api.parse('https://new-route.test/changed#joomlaItem://article/43'), { allowedAdapters: ['articles'] }), { adapter: 'articles', id: 'article:43' });
});

test('unsafe schemes, malformed encoding and traversal are rejected without rendering metadata', () => {
  const api = createSelectionAddressContract();
  for (const input of ['javascript:alert(1)', 'data:text/html,x', 'vbscript:x', '//evil.test/x', 'https://user:pass@example.org', 'x%0Aname', 'x#joomlaImage://local-images/%2e%2e/secret', 'x#joomlaImage://local-images/%252e%252e/secret']) {
    assert.throws(() => { const parsed = api.parse(input); if (!parsed.plain) api.reference(parsed); });
  }
  assert.throws(() => api.parse('#joomlaItem://article/43?name=%ZZ'));
  assert.equal(mediaLocator({ id: 'local-images:/εικόνα με κενά.png' }), 'local-images/%CE%B5%CE%B9%CE%BA%CF%8C%CE%BD%CE%B1%20%CE%BC%CE%B5%20%CE%BA%CE%B5%CE%BD%CE%AC.png');
  assert.deepEqual(mediaReference('local-images/%CE%B5.png'), { adapter: 'media', id: 'local-images:/ε.png' });
  assert.deepEqual(mediaReference(mediaLocator({ id: 'local-images:/100% #1?.png' })), { adapter: 'media', id: 'local-images:/100% #1?.png' });
});

test('scalars use descriptor types, flat aliases, standard URI escaping and no JSON', async () => {
  const api = createSelectionAddressContract();
  const definitions = [descriptor('article.displayedName', 'titleOverride'), descriptor('example.count', 'count', 'number'), descriptor('example.flag', 'flag', 'boolean'), descriptor('example.empty', 'empty')];
  const resource = article(definitions), profile = profileFor(definitions);
  const usage = { 'article.displayedName': 'Τίτλος & "quoted"', 'example.count': 0, 'example.flag': false, 'example.empty': '' };
  const properties = await api.encodeProperties(resource, profile, usage);
  const text = api.serialize({ ...api.describe(resource), properties });
  assert.ok(text.includes('titleOverride=%CE'));
  assert.ok(!text.includes('{'));
  assert.deepEqual((await api.decodeProperties(api.parse(text), resource, profile)).usage, usage);
  await assert.rejects(() => api.decodeProperties(api.parse('#joomlaItem://article/43?flag=maybe'), resource, profile));
});

test('generic Joomla image compounds are lossless, including repeated unknown native parameters', async () => {
  const api = createSelectionAddressContract();
  const definitions = [descriptor('visual.thumbnailOverride', 'thumbnailOverride', 'string', { codec: 'joomlaImage', alias: 't' })];
  const resource = article(definitions), profile = profileFor(definitions);
  const properties = await api.encodeProperties(resource, profile, { 'visual.thumbnailOverride': imageUri });
  const text = api.serialize({ ...api.describe(resource), properties });
  assert.ok(text.includes('thumbnailOverride=t&t.src=images%2Fcover.jpg&t.media=local-images%2Fcover.jpg'));
  assert.ok(text.includes('t.param.pluginFlag=one&t.param.pluginFlag=two'));
  const decoded = await api.decodeProperties(api.parse(text), resource, profile);
  assert.equal(decoded.usage['visual.thumbnailOverride'], imageUri);
  assert.equal(decoded.compounds['visual.thumbnailOverride'], imageUri);
  const noDimensions = await api.encodeProperties(resource, profile, { 'visual.thumbnailOverride': '/explicit/custom.png#joomlaImage://local-images/cover.jpg' });
  assert.ok(!noDimensions.some(([key]) => key.endsWith('.width') || key.endsWith('.height')));
  assert.equal(noDimensions.find(([key]) => key === 't.src')[1], '/explicit/custom.png');
});

test('short aliases are deterministic and cannot collide with ordinary properties or each other', async () => {
  const api = createSelectionAddressContract();
  const definitions = [descriptor('example.thumbnail', 'thumbnailOverride', 'string', { codec: 'joomlaImage', alias: 't' }), descriptor('example.poster', 'poster', 'string', { codec: 'joomlaImage', alias: 't' }), descriptor('example.reserved', 't.src')];
  const resource = article(definitions), profile = profileFor(definitions);
  const properties = await api.encodeProperties(resource, profile, { 'example.thumbnail': imageUri, 'example.poster': imageUri });
  assert.equal(properties.find(([key]) => key === 'thumbnailOverride')[1], 't1');
  assert.equal(properties.find(([key]) => key === 'poster')[1], 't2');
  const custom = api.parse('#joomlaItem://article/43?thumbnailOverride=q&q.src=images%2Fa.jpg&q.media=local-images%2Fa.jpg');
  assert.equal((await api.decodeProperties(custom, resource, profile)).usage['example.thumbnail'], 'images/a.jpg#joomlaImage://local-images/a.jpg');
  for (const suffix of ['thumbnailOverride=q&q.src=x', 'thumbnailOverride=q&poster=q&q.src=x&q.media=local-images/x', 'thumbnailOverride=t&t.src=x&t.media=local-images/x', 'thumbnailOverride=q&thumbnailOverride=p']) {
    await assert.rejects(() => api.decodeProperties(api.parse(`#joomlaItem://article/43?${suffix}`), resource, profile));
  }
});

test('property provider conflicts are explicit, unknown data is retained or rejected, never silently dropped', async () => {
  const api = createSelectionAddressContract();
  const definitions = [descriptor('example.first', 'same'), descriptor('example.second', 'same')];
  assert.throws(() => api.descriptors(article(definitions), profileFor(definitions)), /conflict/);
  const collision = descriptor('example.width', 'width', 'number');
  assert.throws(() => api.descriptors({ type: 'image', selectionCapabilities: [collision] }, profileFor([collision])), /conflict/);
  const resource = article([]);
  const parsed = api.parse('#joomlaItem://article/43?unknown=one&unknown=two');
  assert.deepEqual((await api.decodeProperties(parsed, resource, {})).remaining, [['unknown', 'one'], ['unknown', 'two']]);
  await assert.rejects(() => api.encodeProperties(resource, {}, { 'ext.plugin.data': { structured: true } }), /codec/);
  const remove = api.registerCodec('coordinates', { encode: value => Object.entries(value), decode: parts => ({ value: Object.fromEntries(parts) }) });
  api.registerProperty({ ...descriptor('ext.plugin.data', 'crop', 'object', { codec: 'coordinates', alias: 'c' }) });
  const properties = await api.encodeProperties(resource, {}, { 'ext.plugin.data': { x: '1', y: '2' } });
  assert.deepEqual((await api.decodeProperties({ ...parsed, properties }, resource, {})).usage['ext.plugin.data'], { x: '1', y: '2' });
  remove();
});

const capabilities = [descriptor('article.displayedName', 'titleOverride')];
function fixture({ denied = [], native = false, invalidProperties = false } = {}) {
  const calls = [], changes = [];
  const config = { adapter: native ? 'media' : 'articles', allowedAdapters: native ? ['media'] : ['articles'], referenceItems: true, selectedResources: true,
    multiple: true, selectionTarget: 'item', selectionProfile: native ? {} : { 'article.displayedName': {} }, nativeImage: native, nativeUsageKeys: [],
    items: [{ selection: { adapter: native ? 'media' : 'articles', id: native ? 'local-images:/cover.jpg' : 'article:1' }, usage: { 'ext.test.flag': 'retain' } }] };
  const api = { async collection(items, options = {}) {
    calls.push(options);
    const resources = items.map(entry => ({ ...article(capabilities), ...(native ? { type: 'image', metadata: { relativePath: 'images/cover.jpg' } } : {}), id: entry.selection.id,
      selection: entry.selection, selectionKey: referenceKey(entry.selection), unavailable: denied.includes(entry.selection.id) }));
    return options.operation === 'validate' && invalidProperties ? { errors: [{ index: 0, message: 'Property invalid' }] } : { items, resources };
  } };
  const service = createSelectionAddressService({ api, config });
  const model = createCollectionState({ config, api, notify: change => changes.push(change) });
  const operations = selectionAddressOperations({ model, api, config, service });
  return { config, api, model, service, operations, calls, changes };
}

test('multiline import commits full ordered entries atomically after resolution and server validation', async () => {
  const f = fixture(); await f.model.refresh();
  const result = await f.operations.importAddresses('#joomlaItem://article/43?titleOverride=One\r\n\r\nhttps://old.test/a#joomlaItem://article/44?role=featured', { append: false });
  assert.deepEqual(result.map(entry => entry.selection.id), ['article:43', 'article:44']);
  assert.equal(result[0].usage['article.displayedName'], 'One');
  assert.deepEqual(result[1].usage['ext.selectionAddress'].properties, [['role', 'featured']]);
  assert.equal(f.changes.length, 1);
  assert.ok(f.calls.some(call => call.operation === 'validate'));
  const exported = await f.operations.exportAddresses();
  assert.ok(exported.startsWith('https://example.org/library/article.html#joomlaItem://article/43?titleOverride=One'));
  assert.ok(!exported.includes('old.test'));
  f.model.destroy(); f.service.destroy();
});

test('invalid multiline input, denied resources, unknown providers, limits and validation leave selection untouched', async () => {
  for (const [setup, input, pattern] of [
    [{}, '#joomlaItem://article/43\nhttps://example.org/#badFormat://x', /Line 2/],
    [{ denied: ['article:44'] }, '#joomlaItem://article/43\n#joomlaItem://article/44', /Line 2/],
    [{ invalidProperties: true }, '#joomlaItem://article/43', /Line 1.*Property invalid/],
    [{}, '#joomlaGallery://collection/42', /Line 1.*gallery/],
    [{}, '#joomlaItem://user/42', /Line 1.*disallowed/],
  ]) {
    const f = fixture(setup); await f.model.refresh(); const before = f.model.getItems();
    await assert.rejects(() => f.operations.importAddresses(input, { append: false }), pattern);
    assert.deepEqual(f.model.getItems(), before); assert.equal(f.changes.length, 0);
    f.model.destroy(); f.service.destroy();
  }
  const f = fixture(); f.config.maxSelections = 1;
  await f.model.refresh();
  await assert.rejects(() => f.operations.importAddresses('#joomlaItem://article/43\n#joomlaItem://article/44', { append: false }));
  f.model.destroy(); f.service.destroy();
});

test('native image import retains explicit public path, dimensions and all SmartCrop/unknown metadata', async () => {
  const f = fixture({ native: true }); await f.model.refresh();
  const items = await f.operations.importAddresses(imageUri, { append: false });
  assert.equal(items[0].usage['ext.address'], imageUri);
  assert.equal(await f.operations.exportAddresses(), imageUri);
  await assert.rejects(() => f.operations.importAddresses('images/cover.jpg#joomlaFile://local-images/cover.jpg', { append: false }), /only accepts Joomla image/);
  assert.equal(f.model.getItems()[0].usage['ext.address'], imageUri);
  f.model.destroy(); f.service.destroy();
});

test('file vs playable semantics survive import independently of the underlying resource identity', async () => {
  const api = createSelectionAddressContract();
  const audio = { id: 'local-audio:/song.mp3', adapter: 'media', type: 'audio', metadata: { url: '/song.mp3' } };
  assert.equal(api.describe(audio).format, 'joomlaMedia');
  assert.equal(api.describe(audio, { format: 'joomlaFile' }).format, 'joomlaFile');
  assert.deepEqual(api.reference(api.parse('/song.mp3#joomlaMedia://local-audio/song.mp3?mediaType=audio')), api.reference(api.parse('/song.mp3#joomlaFile://local-audio/song.mp3')));
});

test('format handlers and structured properties extend through registries rather than parser branches', async () => {
  const api = createSelectionAddressContract();
  const original = api.getFormat('joomlaGallery');
  const remove = api.registerFormat('joomlaGallery', { ...original, reference: () => ({ adapter: 'categories', id: 'category:42' }),
    describe: resource => ({ format: 'joomlaGallery', locator: `collection/${resource.metadata.id}`, url: resource.metadata.publicUrl }) }, { replace: true });
  assert.deepEqual(api.reference(api.parse('#joomlaGallery://collection/42')), { adapter: 'categories', id: 'category:42' });
  remove();
  assert.throws(() => api.reference(api.parse('#joomlaGallery://collection/42')), /provider/);
  api.registerFormat('pluginAsset', { reference: address => ({ adapter: 'media', id: `local-files:/${address.locator}` }) });
  assert.deepEqual(api.reference(api.parse('/file#pluginAsset://custom.pdf')), { adapter: 'media', id: 'local-files:/custom.pdf' });
  let notifications = 0;
  const unsubscribe = api.subscribe(() => notifications++);
  const removeProperty = api.registerProperty(descriptor('ext.example.value', 'value'));
  removeProperty(); unsubscribe();
  assert.equal(notifications, 2);
});

test('plain links retain query strings/fragments and target uses existing consumer values', async () => {
  const api = createSelectionAddressContract();
  const address = api.parse('https://example.org/page?q=a#section');
  let received;
  api.reference(address, { linkReference: url => { received = url; return { adapter: 'direct-links', id: 'uri:existing-contract' }; } });
  assert.equal(received, 'https://example.org/page?q=a#section');
  const definitions = [descriptor('link.target', 'target', 'string', { values: { '': '', '0': '_self', '1': '_blank' } })];
  const resource = { ...article(definitions), type: 'uri', adapter: 'direct-links', metadata: { url: received } };
  const properties = await api.encodeProperties(resource, profileFor(definitions), { 'link.target': '1' });
  assert.deepEqual(properties, [['target', '_blank']]);
  assert.equal((await api.decodeProperties({ ...address, properties }, resource, profileFor(definitions))).usage['link.target'], '1');
  assert.equal(api.describe(resource).format, 'joomlaLink');
  api.assertResource(api.parse('/video#joomlaMedia://local-videos/movie.mp4?mediaType=video'), { type: 'video', kind: 'item' });
  assert.throws(() => api.assertResource(api.parse('/video#joomlaMedia://local-videos/movie.mp4?mediaType=video'), { type: 'uri', kind: 'item' }));
});

test('an import cannot overwrite an intervening selection edit', async () => {
  const f = fixture(); await f.model.refresh();
  const before = f.model.getItems();
  const original = f.service.import.bind(f.service);
  f.service.import = async (...args) => { const result = await original(...args); f.model.setUsage(f.model.resources.value[0], { 'ext.changed': true }); return result; };
  await assert.rejects(() => f.operations.importAddresses('#joomlaItem://article/43', { append: false }), /Selection changed/);
  assert.equal(f.model.getItems()[0].selection.id, before[0].selection.id);
  assert.equal(f.model.getItems()[0].usage['ext.changed'], true);
  f.model.destroy(); f.service.destroy();
});

test('explicit scalar defaults remain portable across consumers with different profile defaults', async () => {
  const api = createSelectionAddressContract();
  const definitions = [{ ...descriptor('example.flag', 'flag', 'boolean'), default: false }, { ...descriptor('example.text', 'text'), default: '' }];
  const resource = article(definitions);
  const properties = await api.encodeProperties(resource, profileFor(definitions), { 'example.flag': false, 'example.text': '' });
  assert.deepEqual(properties, [['flag', 'false'], ['text', '']]);
  const decoded = await api.decodeProperties({ properties }, resource, { 'example.flag': { default: true }, 'example.text': { default: 'Receiver default' } });
  assert.equal(decoded.usage['example.flag'], false);
  assert.equal(decoded.usage['example.text'], '');
});

test('Joomla view adapters can roundtrip without turning public URLs into resource identity', () => {
  const api = createSelectionAddressContract();
  const resource = { ...article(), adapter: 'featured-articles' };
  const text = api.serialize(api.describe(resource));
  assert.ok(text.endsWith('article/43?adapter=featured-articles'));
  assert.deepEqual(api.reference(api.parse(text), { allowedAdapters: ['articles', 'featured-articles'] }), { adapter: 'featured-articles', id: 'article:43' });
  assert.throws(() => api.reference(api.parse(text), { allowedAdapters: ['articles'] }), /disallowed/);
  assert.throws(() => api.reference(api.parse('#joomlaItem://article/43?adapter=users'), {}), /disallowed/);
});

test('non-image field address metadata survives without replacing the routed resource URL', async () => {
  const f = fixture(); await f.model.refresh();
  const entry = { selection: { adapter: 'articles', id: 'article:43' }, usage: { 'ext.address': 'https://legacy.example/article' } };
  const text = await f.service.serialize(entry, article(capabilities));
  assert.ok(text.startsWith('https://example.org/library/article.html#joomlaItem://article/43?'));
  assert.ok(text.includes('ext.address=https%3A%2F%2Flegacy.example%2Farticle'));
  const result = await f.operations.importAddresses(text, { append: false });
  assert.equal(result[0].usage['ext.address'], entry.usage['ext.address']);
  f.model.destroy(); f.service.destroy();
});

test('duplicate imports retain the first entry and server errors use original source lines', async () => {
  const f = fixture(); await f.model.refresh();
  const original = f.api.collection;
  f.api.collection = async (entries, options = {}) => {
    if (options.operation === 'validate') {
      assert.deepEqual(entries.map(entry => entry.selection.id), ['article:43', 'article:44']);
      return { errors: [{ index: 1, message: 'Property invalid' }] };
    }
    return original(entries, options);
  };
  await assert.rejects(() => f.operations.importAddresses('#joomlaItem://article/43\n#joomlaItem://article/43\n\n#joomlaItem://article/44', { append: false }), /Line 4: Property invalid/);
  assert.equal(f.changes.length, 0);
  f.model.destroy(); f.service.destroy();
});
