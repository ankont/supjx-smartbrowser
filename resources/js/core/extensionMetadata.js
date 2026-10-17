export const extensionKey = key => /^ext\.[a-zA-Z][a-zA-Z0-9_-]*(?:\.[a-zA-Z][a-zA-Z0-9_-]*)*$/.test(key);
export const extensionValues = values => Object.fromEntries(Object.entries(values || {}).filter(([key]) => extensionKey(key)));
export function metadataKey(namespace) {
  const key = namespace?.startsWith('ext.') ? namespace : `ext.${namespace}`;
  if (!extensionKey(key)) throw new TypeError('Invalid extension metadata namespace.');
  return key;
}
export function metadataValue(data) {
  const seen = new Set();
  const visit = (value, depth) => {
    if (depth > 24) throw new TypeError('Extension metadata is too deep.');
    if (value === null || typeof value === 'string' || typeof value === 'boolean') return;
    if (typeof value === 'number' && Number.isFinite(value)) return;
    if (typeof value !== 'object' || seen.has(value) || !Array.isArray(value) && Object.getPrototypeOf(value) !== Object.prototype) throw new TypeError('Extension metadata must be JSON data.');
    seen.add(value);
    for (const child of Object.values(value)) visit(child, depth + 1);
    seen.delete(value);
  };
  visit(data, 0);
  const encoded = JSON.stringify(data);
  if (new TextEncoder().encode(encoded).length > 65536) throw new TypeError('Extension metadata exceeds 64 KB.');
  return JSON.parse(encoded);
}
