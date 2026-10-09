import { collectionEntries, referenceKey } from './selectionIdentity.js';

export function selectionFieldValue(value, adapters, multiple = true, homogeneous = false) {
  if (value === '' || value == null) return { version: 1, items: [] };
  if (typeof value === 'string' && value.length > 262144) throw new TypeError('Field value too large.');
  const parsed = typeof value === 'string' ? JSON.parse(value) : value;
  if (parsed?.version !== 1) throw new TypeError('Invalid SmartBrowser field version.');
  const rawItems = parsed.items || parsed.selection?.map(selection => ({ selection, usage: parsed.usage?.[selection.id] || {} }));
  const items = collectionEntries(rawItems, { allowedAdapters: Array.isArray(adapters) ? adapters : adapters ? [adapters] : [], homogeneous });
  if (items.length !== rawItems.length || !multiple && items.length > 1) throw new TypeError('Invalid SmartBrowser field selection.');
  return { version: 1, items };
}

export function fieldPickerResult(current, result, adapters, multiple, editedReference = null, homogeneous = false) {
  const entries = result.items || (Array.isArray(result.selection) ? result.selection : [result.selection]).map(resource => ({
    selection: { adapter: result.adapter || current.items[0]?.selection.adapter || (Array.isArray(adapters) ? adapters[0] : adapters), id: resource.id }, usage: result.usage?.[resource.id] || {},
  }));
  const items = editedReference ? current.items.flatMap(entry => referenceKey(entry.selection) === referenceKey(editedReference) ? entries : [entry]) : entries;
  return selectionFieldValue({ version: 1, items: collectionEntries(items) }, adapters, multiple, homogeneous);
}
