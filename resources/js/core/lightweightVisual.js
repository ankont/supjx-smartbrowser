export const thumbnailCapabilities = definitions => (definitions || []).filter(definition => definition.type === 'resource' && definition.visualRole === 'thumbnail');

export function lightweightImage(resource) {
  if (!resource || resource.unavailable) return '';
  return resource.thumbnail || resource.metadata?.thumbnail || resource.metadata?.poster || resource.image
    || (resource.type === 'image' ? resource.metadata?.url : '') || '';
}
