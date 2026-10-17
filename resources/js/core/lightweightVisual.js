export const thumbnailCapabilities = definitions => (definitions || []).filter(definition => definition.type === 'resource' && definition.visualRole === 'thumbnail');
export function selectionPresentation(resource, values = {}) {
  const displayedName = values['article.displayedName'];
  const icon = effectiveIcon(resource, values);
  return { ...resource, resolvedTitle: resource?.resolvedTitle ?? resource?.title,
    title: resource?.type === 'article' && typeof displayedName === 'string' && displayedName.trim() ? displayedName.trim() : resource?.resolvedTitle ?? resource?.title,
    icon, ...(resource?.badgeIcon && icon === values['visual.iconOverride'] ? { badgeIcon: icon } : {}),
    visualPresentation: ['thumbnail', 'icon', 'both'].includes(values['visual.presentation']) ? values['visual.presentation'] : null };
}

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

export function lightweightPreviewIcon(resource, values = {}) {
  if (!['category', 'tag', 'menu-item', 'menu'].includes(resource?.type)) return '';
  return effectiveIcon({ ...resource, icon: resource.badgeIcon || resource.icon }, values);
}

export function genericPreviewResource(resource, values = {}, image = '') {
  return { ...selectionPresentation(resource, values), image: image || resource?.image || lightweightImage(resource) };
}

export function previewVisuals(resource, values = {}, image = '') {
  const presented = selectionPresentation(resource, values);
  const mode = presented.visualPresentation;
  const thumbnail = mode === 'icon' ? '' : image || lightweightImage(resource);
  const icon = mode === 'thumbnail' && thumbnail ? '' : lightweightPreviewIcon(resource, values) || effectiveIcon(resource, values);
  return { image: thumbnail, icon, typeIcon: resource?.typeIcon || resource?.icon || 'fas fa-file',
    badgeIcon: mode === 'icon' ? '' : icon, presentation: mode, imageCrop: resource?.imageCrop || null };
}

export async function resolveThumbnailResource(definition, value, resolveReference) {
  const resource = await resolveReference(value, definition.picker);
  if (!resource || resource.unavailable || resource.selectable === false || !lightweightImage(resource)
    || definition.picker?.allowedResourceTypes?.length && !definition.picker.allowedResourceTypes.includes(resource.type)) throw new Error('COM_SMARTBROWSER_USAGE_INVALID');
  return resource;
}
export async function resolveThumbnail(definition, value, resolveReference) {
  return lightweightImage(await resolveThumbnailResource(definition, value, resolveReference));
}
