/** Definitions are supplied by the host, never installed globally on resources. */
export function consumerCapabilities(resource, consumer, definitions = []) {
  if (!consumer || !/^[a-z][a-z0-9_-]*$/.test(consumer)) return [];
  return definitions.filter(definition => definition.key?.startsWith(`ext.${consumer}.`)
    && Array.isArray(definition.resourceTypes) && definition.resourceTypes.includes(resource?.type));
}
