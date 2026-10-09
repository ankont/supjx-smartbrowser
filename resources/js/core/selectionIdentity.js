export function normalizeReference(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)
    || typeof value.adapter !== 'string' || !/^[a-z][a-z0-9-]*$/.test(value.adapter)
    || typeof value.id !== 'string' || !value.id || value.id.length > 2048) return null;
  return { adapter: value.adapter, id: value.id };
}
export const referenceKey = reference => JSON.stringify([reference.adapter, reference.id]);
export const resourceKey = resource => resource?.selectionKey || resource?.id;
export const resourceReference = (resource, adapter) => normalizeReference(resource?.selection || { adapter: resource?.adapter || adapter, id: resource?.id });

export function collectionEntries(items, { adapter, allowedAdapters = [], homogeneous = false } = {}) {
  if (!Array.isArray(items) || items.length > 500) throw new TypeError('A collection supports at most 500 entries.');
  const seen = new Set();
  const entries = items.map(item => {
    const selection = normalizeReference(item?.selection || (item && typeof item === 'object' ? { adapter: item.adapter || adapter, id: String(item.id) } : { adapter, id: String(item) }));
    if (!selection || !selection.id.includes(':') || allowedAdapters.length && !allowedAdapters.includes(selection.adapter)) throw new TypeError('Invalid or disallowed collection reference.');
    const usage = item?.usage ?? {};
    if (!usage || typeof usage !== 'object' || Array.isArray(usage) || Object.keys(usage).length > 100
      || Object.keys(usage).some(key => !/^[a-z][a-z0-9_-]*(?:\.[a-zA-Z][a-zA-Z0-9_-]*)+$/.test(key)) || JSON.stringify(usage).length > 65536) throw new TypeError('Invalid collection usage.');
    return { selection, usage: JSON.parse(JSON.stringify(usage)) };
  }).filter(entry => {
    const key = referenceKey(entry.selection);
    if (seen.has(key)) return false;
    seen.add(key); return true;
  });
  if (homogeneous && new Set(entries.map(entry => entry.selection.adapter)).size > 1) throw new TypeError('This collection requires one adapter.');
  return entries;
}
