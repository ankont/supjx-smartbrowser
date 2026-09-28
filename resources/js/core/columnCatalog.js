const optionalFields = {
  articles: [
    ['categoryPath', 'COM_SMARTBROWSER_CATEGORY_HIERARCHY'],
    ['tagPaths', 'COM_SMARTBROWSER_TAG_HIERARCHY'],
    ['access', 'JFIELD_ACCESS_LABEL'],
    ['languageKey', 'COM_SMARTBROWSER_LANGUAGE_KEY'],
  ],
  categories: [
    ['categoryPath', 'COM_SMARTBROWSER_CATEGORY_HIERARCHY'],
    ['access', 'JFIELD_ACCESS_LABEL'],
    ['languageKey', 'COM_SMARTBROWSER_LANGUAGE_KEY'],
  ],
  tags: [
    ['tagPaths', 'COM_SMARTBROWSER_TAG_HIERARCHY'],
    ['access', 'JFIELD_ACCESS_LABEL'],
    ['languageKey', 'COM_SMARTBROWSER_LANGUAGE_KEY'],
  ],
  menus: [['link', 'COM_SMARTBROWSER_URL']],
  media: [
    ['parentPath', 'COM_SMARTBROWSER_PARENT'],
    ['url', 'COM_SMARTBROWSER_URL'],
    ['mimeType', 'COM_SMARTBROWSER_MIME_TYPE'],
    ['extension', 'COM_SMARTBROWSER_EXTENSION'],
    ['width', 'COM_SMARTBROWSER_DIMENSIONS', 'dimensions'],
    ['size', 'COM_SMARTBROWSER_SIZE', 'size'],
  ],
};

const columnId = (source) => ({ stateLabel: 'status', width: 'dimension', link: 'url' })[source.split('.').pop()] || source.split('.').pop();

export function columnCatalog(presentation, adapter) {
  const defaults = presentation?.columns || [];
  const result = defaults.map((column) => ({ ...column, defaultVisible: true }));
  const ids = new Set(defaults.map((column) => column.id));
  const baseAdapter = adapter.replace(/^flat-/, '') === 'articles-by-tag' ? 'articles' : adapter.replace(/^flat-/, '');
  const candidates = [...(presentation?.infoFields || []), ...(optionalFields[baseAdapter] || []).map(([id, label, format]) => ({
    id: columnId(id), label, source: `metadata.${id}`, format,
  }))];
  const hasDateGroup = ids.has('dates');
  for (const field of candidates) {
    if (!field.source || !field.label || field.source === 'metadata.locationPath') continue;
    const id = field.id || columnId(field.source);
    if (ids.has(id) || (hasDateGroup && ['created', 'modified'].includes(id))) continue;
    ids.add(id);
    result.push({ id, label: field.label, source: field.source, format: field.format, defaultVisible: false });
  }
  return result;
}
