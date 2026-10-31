import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import createService from '../resources/js/services/SelectionAddressService.js';
import { createSelectionAddressContract } from '../resources/js/core/selectionAddress.js';

test('JavaScript addresses restore in PHP and supply bare URLs plus resolved template selections', async () => {
  const contract = createSelectionAddressContract();
  contract.registerProperty({ key: 'ext.example.data', type: 'object', address: { name: 'example', codec: 'example', alias: 'e' } });
  contract.registerCodec('example', { encode: value => [['value', value.value]], decode: parts => ({ value: { value: parts[0][1] } }) });
  const capabilities = [
    { key: 'article.displayedName', type: 'string', address: { name: 'titleOverride' } },
    { key: 'visual.thumbnailOverride', type: 'resource', visualRole: 'thumbnail', address: { name: 'thumbnailOverride', codec: 'joomlaImage', alias: 't' }, picker: { adapter: 'media', allowedResourceTypes: ['image'] } },
  ];
  const resource = { id: 'article:43', type: 'article', adapter: 'articles', metadata: { publicUrl: 'https://example.org/article.html#section' }, selectionCapabilities: capabilities };
  const service = createService({ contract, config: { allowedAdapters: ['articles', 'media'], selectionProfile: { 'article.displayedName': {}, 'visual.thumbnailOverride': {} } }, api: {} });
  const address = await service.serialize({ selection: { adapter: 'articles', id: resource.id }, usage: {
    'article.displayedName': 'Temporary title', 'visual.thumbnailOverride': { adapter: 'media', id: 'local-images:/cover.jpg' },
    'ext.example.data': { value: 'opaque' },
    'ext.selectionAddress': { compounds: { 'visual.thumbnailOverride': 'images/cover.jpg#joomlaImage://local-images/cover.jpg?flag=one&flag=two' } },
  } }, resource);
  assert.match(execFileSync('php', ['tests/article-link-addresses.php', address], { encoding: 'utf8' }), /safe URL presentation OK/);
});
