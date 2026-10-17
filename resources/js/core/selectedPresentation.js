import { lightweightImage } from './lightweightVisual.js';

const pathSources = new Set(['parentId', 'metadata.locationPath', 'metadata.path', 'metadata.categoryPath', 'metadata.parentPath', 'metadata.tagPaths', 'metadata.url', 'metadata.link']);
export const supplementalInfoFields = [
  ['metadata.access', 'JFIELD_ACCESS_LABEL'], ['metadata.categoryPath', 'COM_SMARTBROWSER_CATEGORY_HIERARCHY'],
  ['metadata.parent', 'COM_SMARTBROWSER_PARENT'], ['metadata.parentPath', 'COM_SMARTBROWSER_PARENT'],
  ['metadata.tagPaths', 'COM_SMARTBROWSER_TAG_HIERARCHY'], ['metadata.url', 'COM_SMARTBROWSER_URL'],
  ['metadata.link', 'COM_SMARTBROWSER_URL'], ['metadata.mimeType', 'COM_SMARTBROWSER_MIME_TYPE'],
  ['metadata.extension', 'COM_SMARTBROWSER_EXTENSION'], ['metadata.size', 'COM_SMARTBROWSER_SIZE', 'size'],
  ['metadata.width', 'COM_SMARTBROWSER_DIMENSIONS', 'dimensions'],
].map(([source, label, format]) => ({ source, label, format }));
export const valueAt = (resource, source) => String(source || '').split('.').reduce((value, key) => value?.[key], resource);
export function selectionPaths(resource, presentation = {}) {
  const fields = resource?.infoFields?.length ? resource.infoFields : resource?.collectionPresentation?.infoFields || presentation.infoFields || [];
  const candidates = [...fields, ...supplementalInfoFields.filter(field => !fields.some(existing => existing.source === field.source))];
  const paths = candidates.filter(field => pathSources.has(field.source) && (!field.kinds || field.kinds.includes(resource?.kind)))
    .map(field => ({ ...field, value: valueAt(resource, field.source) })).filter(field => field.value !== null && field.value !== undefined && field.value !== '');
  if (paths.length) return paths;
  const source = ['metadata.locationPath', 'metadata.path', 'metadata.url', 'metadata.link', 'parentId', 'id'].find(source => valueAt(resource, source));
  return source ? [{ source, label: 'COM_SMARTBROWSER_SELECTION_PATH', value: valueAt(resource, source) }] : [];
}
export function selectedPresentation(resource, presentation = {}) {
  return { ...resource, image: resource?.effectiveThumbnail || lightweightImage(resource),
    selectionType: resource?.metadata?.typeLabel || resource?.type || '',
    selectionPath: selectionUri(resource) };
}
export function selectionUri(resource) {
  if (resource?.adapter === 'media' || ['image', 'document', 'audio', 'video'].includes(resource?.type)) {
    const formatted = globalThis.SmartBrowserMediaValue?.format(resource, 'joomla');
    if (formatted) return formatted;
  }
  return resource?.metadata?.relativePath || resource?.metadata?.url || resource?.metadata?.link || resource?.id || '';
}
export const selectionColumns = [
  { id: 'title', label: 'COM_SMARTBROWSER_NAME', headerIcon: 'fas fa-file-alt' },
  { id: 'selectionPath', source: 'selectionPath', label: 'COM_SMARTBROWSER_URI', headerIcon: 'fas fa-link' },
  { id: 'status', label: 'JSTATUS', format: 'status', overlays: true },
];
export const selectionGridFields = selectionColumns.slice(1, 3);
export const selectionColumnCatalog = [
  ...selectionColumns.map(column => ({ ...column, defaultVisible: true })),
  { id: 'selectionId', source: 'id', label: 'JGRID_HEADING_ID', headerIcon: 'fas fa-hashtag', defaultVisible: false },
  { id: 'type', source: 'selectionType', label: 'COM_SMARTBROWSER_TYPE', headerIcon: 'fas fa-shapes', defaultVisible: false },
  { id: 'created', source: 'metadata.created', label: 'JGLOBAL_FIELD_CREATED_LABEL', headerIcon: 'fas fa-calendar-plus', format: 'date', defaultVisible: false },
  { id: 'modified', source: 'metadata.modified', label: 'JGLOBAL_FIELD_MODIFIED_LABEL', headerIcon: 'fas fa-calendar-alt', format: 'date', defaultVisible: false },
];
export const selectionSortFields = selectionColumnCatalog.filter(column => column.id !== 'status').map(column => ({ id: column.id, label: column.label }));
export function sortSelectionResources(resources, field, direction = 'asc') {
  const column = selectionColumnCatalog.find(column => column.id === field);
  if (!column) return [...resources];
  const value = resource => valueAt(resource, column.source || column.id);
  return [...resources].sort((a, b) => {
    const left = value(a), right = value(b);
    const missingLeft = left == null || left === '', missingRight = right == null || right === '';
    if (missingLeft || missingRight) return Number(missingLeft) - Number(missingRight);
    const comparison = typeof left === 'number' && typeof right === 'number' ? left - right
      : String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: 'base' });
    return direction === 'desc' ? -comparison : comparison;
  });
}
export function selectionTypeLabel(resource, translate) {
  const key = { image: 'COM_SMARTBROWSER_MEDIA_IMAGE', document: 'COM_SMARTBROWSER_MEDIA_DOCUMENT', video: 'COM_SMARTBROWSER_MEDIA_VIDEO', audio: 'COM_SMARTBROWSER_MEDIA_AUDIO', folder: 'COM_SMARTBROWSER_FOLDER' }[resource?.type];
  const type = resource?.metadata?.typeLabel || resource?.type || '';
  return key ? translate(key) : type ? type.charAt(0).toUpperCase() + type.slice(1) : translate('COM_SMARTBROWSER_RESOURCE');
}
export function canAddSelection(config, count) {
  return !config.readOnly && typeof config.onAdd === 'function' && count < (config.multiple === false ? 1 : config.maxSelections || 500);
}
export function selectionPanelPosition(position = 'auto', width = 0) {
  if (position === 'auto') return width >= 800 ? 'right' : 'bottom';
  return ['left', 'right'].includes(position) && width < 640 ? 'bottom' : position;
}
