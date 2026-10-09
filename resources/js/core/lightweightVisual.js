export const thumbnailCapabilities = definitions => (definitions || []).filter(definition => definition.type === 'resource' && definition.visualRole === 'thumbnail');

export function effectiveIcon(resource, values = {}) {
  if (!resource || resource.unavailable) return '';
  const icon = values['visual.iconOverride'];
  return typeof icon === 'string' && icon.length <= 160 && /^[a-zA-Z0-9_-]+(?: [a-zA-Z0-9_-]+)*$/.test(icon)
    ? icon : resource.icon || 'fas fa-file';
}

export function lightweightImage(resource) {
  if (!resource || resource.unavailable) return '';
  return resource.thumbnail || resource.metadata?.thumbnail || resource.metadata?.poster || resource.image
    || (resource.type === 'image' ? resource.metadata?.url : '') || '';
}
