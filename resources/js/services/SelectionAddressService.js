import { selectionAddress } from '../core/selectionAddress.js';
import { collectionEntries, referenceKey } from '../core/selectionIdentity.js';
import { createSelectionUsage } from '../core/selectionUsage.js';
import ResourceApi from './ResourceApi.js';

export function selectionAddressOperations({ model, api, config, service, isDisposed = () => false }) {
  return {
    async exportAddresses(options) {
      await model.refresh();
      return service.serializeLines(model.getItems(), model.resources.value, { ...(config.nativeImage ? { nativeAddress: config.nativeAddress } : {}), ...options });
    },
    async importAddresses(text, options) {
      if (!model.referenceItems) throw new TypeError('This consumer stores identifiers only, not selection usage.');
      const revision = model.revision.value;
      const result = await service.import(text, model.getItems(), options);
      const resolved = await api.collection(result.items, { referenceItems: true, homogeneous: config.homogeneous === true });
      if (isDisposed() || model.revision.value !== revision) throw new Error('Selection changed while importing addresses.');
      if (resolved.resources.some(resource => resource.unavailable || resource.selectable === false)) throw new Error('An imported resource is unavailable.');
      await model.setItems(result.items, { resolvedResources: resolved.resources, reason: 'import' });
      return model.getItems();
    },
  };
}

export default function createSelectionAddressService({ api, config, contract = config.addressContract || selectionAddress }) {
  const ownsApi = !api;
  api ||= new ResourceApi({ ...config, mode: 'select' });
  const providers = new Map();
  const profile = config.selectionProfile || {};
  const constraints = { ...config, allowedAdapters: config.allowedAdapters || (config.adapter ? [config.adapter] : []), maxSelections: config.multiple === false ? 1 : config.maxSelections || 500 };
  const provider = (reference, picker = {}) => {
    const root = picker.browseRoot ?? (reference.adapter === config.adapter ? config.browseRoot : '');
    const key = JSON.stringify([reference.adapter, root]);
    if (!providers.has(key)) providers.set(key, new ResourceApi({ ...config, adapter: reference.adapter, mode: 'select', browseRoot: root }));
    return providers.get(key);
  };
  const resolveReference = async (reference, picker = {}) => {
    const result = picker.adapter || picker.browseRoot ? await provider(reference, picker).collection([reference.id])
      : await api.collection([{ selection: reference, usage: {} }], { referenceItems: true });
    const resource = result.resources?.[0];
    if (!resource || resource.unavailable || resource.selectable === false || picker.adapter && picker.adapter !== reference.adapter
      || picker.allowedResourceTypes?.length && !picker.allowedResourceTypes.includes(resource.type)) throw new TypeError('Unavailable or disallowed resource.');
    return resource;
  };
  const nativeImage = address => contract.serialize(address);
  return {
    contract,
    async serialize(entry, resource, options = {}) {
      if (!resource && entry?.selection) resource = await resolveReference(entry.selection);
      if (!entry?.selection) entry = { selection: { adapter: config.adapter || resource.adapter, id: resource.id }, usage: {} };
      const usage = entry.usage || {};
      const retained = usage['ext.selectionAddress'] || {};
      const preferred = options.format || retained.format;
      const native = options.nativeAddress || (resource.type === 'image' ? usage['ext.address'] : null);
      const description = contract.describe({ ...resource, adapter: entry.selection.adapter }, { format: preferred, nativeAddress: native });
      // Format metadata and usage share the same flat namespace: collisions are errors.
      const properties = await contract.encodeProperties(resource, profile, usage, { resolveReference, format: description.format, addressConsumed: Boolean(native && description.format === 'joomlaImage') });
      for (const [name] of properties) if (description.properties.some(([key]) => key === name)) throw new TypeError(`Address property conflict: ${name}`);
      return contract.serialize({ ...description, properties: [...description.properties, ...properties] });
    },
    async serializeLines(entries, resources, options = {}) {
      const byKey = new Map(resources.map(resource => [resource.selectionKey || referenceKey(resource.selection || { adapter: resource.adapter || config.adapter, id: resource.id }), resource]));
      const lines = [];
      for (const entry of entries) {
        const item = entry.selection ? entry : { selection: { adapter: config.adapter, id: String(entry) }, usage: {} };
        const resource = byKey.get(referenceKey(item.selection));
        if (!resource) throw new TypeError('Unavailable selection address.');
        lines.push(await this.serialize(item, resource, options));
      }
      return lines.join('\n');
    },
    async import(text, current = [], { append = config.multiple !== false } = {}) {
      if (config.readOnly) throw new TypeError('This selection is read-only.');
      const addresses = contract.parseLines(text), entries = [], resolved = [], errors = [];
      for (const address of addresses) {
        try {
          if (config.nativeImage && address.format !== 'joomlaImage') throw new TypeError('This native field only accepts Joomla image addresses.');
          const reference = await contract.reference(address, { ...constraints, linkReference: async url => {
            if (constraints.allowedAdapters.length && !constraints.allowedAdapters.includes('direct-links')) throw new TypeError('Links are not allowed in this selection.');
            const type = url.startsWith('mailto:') ? 'mail' : url.startsWith('tel:') ? 'tel' : url.startsWith('#') ? 'fragment' : 'web';
            const name = address.properties.find(([key]) => key === 'name')?.[1] || '';
            const result = await provider({ adapter: 'direct-links' }).execute('resolveVirtual', [], { nodeId: `direct-links:${type}`, value: url, addressMode: /^https?:/i.test(url) ? 'absolute' : 'relative', name });
            return { adapter: 'direct-links', id: result.resource.id };
          } });
          collectionEntries([{ selection: reference }], constraints);
          const resource = await resolveReference(reference);
          if (constraints.allowedResourceTypes?.length && !constraints.allowedResourceTypes.includes(resource.type)
            || constraints.selectionTarget && constraints.selectionTarget !== 'both' && constraints.selectionTarget !== resource.kind) throw new TypeError('This resource type cannot be selected here.');
          contract.assertResource(address, resource);
          const decoded = await contract.decodeProperties(address, resource, profile, { resolveReference });
          const usage = decoded.usage;
          let properties = decoded.remaining;
          if (address.format !== 'joomlaImage') {
            const overrides = properties.filter(([key]) => key === 'ext.address');
            if (overrides.length > 1) throw new TypeError('Duplicate address override.');
            if (overrides.length) { usage['ext.address'] = overrides[0][1]; properties = properties.filter(([key]) => key !== 'ext.address'); }
          }
          if (config.nativeImage && properties.some(([name]) => (resource.selectionCapabilities || []).some(definition => (definition.address?.name || definition.key) === name))) throw new TypeError('This image field cannot store these selection properties.');
          if (address.format === 'joomlaImage') {
            // Keep explicit public paths and every native/extension query pair, not a derived URL.
            usage['ext.address'] = nativeImage({ ...address, properties });
            properties = [];
          } else if (address.format === 'joomlaMedia') properties = properties.filter(([key]) => key !== 'mediaType');
          else if (address.format === 'joomlaLink') properties = properties.filter(([key]) => key !== 'name');
          else if (address.format === 'joomlaItem') properties = properties.filter(([key]) => key !== 'adapter');
          const metadata = { format: address.format, ...(properties.length ? { properties } : {}), ...(Object.keys(decoded.compounds).length ? { compounds: decoded.compounds } : {}) };
          if (!config.nativeImage) usage['ext.selectionAddress'] = metadata;
          if (config.nativeImage && (Object.keys(decoded.compounds).length || Object.keys(usage).some(key => !['ext.address', ...(config.nativeUsageKeys || [])].includes(key)))) throw new TypeError('This image field cannot store these selection properties.');
          const state = createSelectionUsage({ profile, initialUsage: { [referenceKey(reference)]: usage }, resolveReference, editors: globalThis.SmartBrowserPicker?.extensions?.().editors || {} });
          const identified = { ...resource, selectionKey: referenceKey(reference) };
          const validation = await state.validate([identified]);
          if (!validation.valid) throw new TypeError(`Invalid selection properties: ${Object.keys(validation.errors[referenceKey(reference)] || {}).join(', ')}`);
          entries.push({ selection: reference, usage: { ...usage, ...validation.usage[referenceKey(reference)] } });
          resolved.push(identified);
        } catch (error) { errors.push(`Line ${address.line}: ${error.message}`); }
      }
      if (errors.length) throw new TypeError(errors.join('\n'));
      const normalized = collectionEntries(append ? [...current, ...entries] : entries, constraints);
      // Server validation uses the same capability/profile validator as form saves.
      const imported = collectionEntries(entries, constraints);
      const sourceLines = imported.map(entry => addresses[entries.findIndex(source => referenceKey(source.selection) === referenceKey(entry.selection))]?.line);
      const result = await api.collection(imported, { referenceItems: true, operation: 'validate', selectionProfile: profile });
      if (result.errors?.length) throw new TypeError(result.errors.map(error => `Line ${sourceLines[error.index] || '?'}: ${error.message}`).join('\n'));
      if (!result.resources || result.resources.some(resource => resource.unavailable || resource.selectable === false)) throw new TypeError('Resource is no longer available.');
      return { items: normalized, resources: [...resolved, ...result.resources] };
    },
    destroy() { providers.forEach(provider => provider.destroy()); providers.clear(); if (ownsApi) api.destroy(); },
  };
}
