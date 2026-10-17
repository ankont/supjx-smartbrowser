import { fieldPickerResult, selectionFieldValue } from './selectionFieldValue.js';
import { referenceKey, resourceKey } from './selectionIdentity.js';

export function createCollectionPicker({ config, model, api, open, isDisposed = () => false }) {
  let pending = false;
  async function pick(resource = null, append = false) {
    if (pending || isDisposed() || config.readOnly || model.browser.state.loading || model.browser.state.busy) return;
    const current = { version: 1, items: model.getItems() };
    const limit = config.multiple === false ? 1 : config.maxSelections || 500;
    if (append && current.items.length >= limit) return;
    const revision = model.revision.value;
    const adapters = config.allowedAdapters || (config.adapter ? [config.adapter] : []);
    const reference = resource?.selection || (resource ? { adapter: resource.adapter || config.adapter, id: resource.id } : null);
    const adapter = reference?.adapter || current.items[0]?.selection.adapter || config.adapter || adapters[0];
    const previous = reference ? current.items.find(entry => referenceKey(entry.selection) === referenceKey(reference)) : config.multiple === false ? current.items[0] : null;
    const profile = { ...config.selectionProfile };
    if (!append && config.preserveUsageOnReplace && previous) {
      for (const [key, policy] of Object.entries(profile)) {
        if (policy !== false && Object.hasOwn(previous.usage, key)) profile[key] = { ...(typeof policy === 'object' ? policy : {}), default: previous.usage[key] };
      }
    }
    pending = true;
    try {
      const extras = typeof config.pickerOptions === 'function' ? config.pickerOptions() : config.pickerOptions || {};
      const result = await open({ ...config, ...extras, url: config.pickerUrl, adapter, selectionProfile: profile,
        browseRoot: adapter === config.adapter ? config.browseRoot : '',
        allowedAdapters: append && config.homogeneous && current.items.length ? [current.items[0].selection.adapter] : adapters,
        homogeneous: config.multiple !== false && config.homogeneous, multiple: config.multiple !== false, resultFormat: 'collection',
        maxSelections: append ? limit - current.items.length : limit,
        initialFocus: reference, initialInfoOpen: Boolean(reference), initialNode: resource?.parentId || '', initialCollection: append ? [] : current.items });
      if (!result || isDisposed()) return;
      if (revision !== model.revision.value) throw new Error('Selection changed while the Picker was open.');
      selectionFieldValue({ version: 1, items: result.items }, adapters, config.multiple !== false, config.homogeneous);
      const next = fieldPickerResult(current, result, adapters, config.multiple !== false, config.multiple === false ? reference : null,
        config.homogeneous, config.preserveUsageOnReplace === true, append ? 'append' : 'replace');
      if (next.items.length > limit) throw new Error('Selection limit exceeded.');
      const resolved = await api.collection(next.items, { referenceItems: true, homogeneous: config.homogeneous === true });
      if (isDisposed()) return;
      if (revision !== model.revision.value) throw new Error('Selection changed while the Picker was open.');
      const selected = new Set(result.items.map(entry => referenceKey(entry.selection)));
      for (const item of resolved.resources) {
        if (!selected.has(resourceKey(item))) continue;
        if (item.unavailable || item.selectable === false || config.allowedResourceTypes?.length && !config.allowedResourceTypes.includes(item.type)
          || config.selectionTarget === 'item' && item.kind !== 'item' || config.selectionTarget === 'node' && item.kind !== 'node') throw new Error('Unavailable or disallowed selection.');
      }
      await model.setItems(next.items, { resolvedResources: resolved.resources, reason: append ? 'add' : 'replace' });
      return model.getItems();
    } finally { pending = false; }
  }
  return { add: () => pick(null, true), editSelection: resource => pick(resource) };
}
