const regularAdapters = new Set(['articles', 'categories', 'tags', 'articles-by-tag', 'menus', 'users', 'media']);

export const flatUiStorageKey = (adapter, browseRoot, href) => {
  const root = adapter.startsWith('flat-')
    ? new URL(href).searchParams.get('flatFromBrowseRoot') || ''
    : browseRoot || '';
  return `supjx.smartbrowser.ui.${adapter.replace(/^flat-/, '')}.${root}`;
};

export const flatViewUrl = (href, adapter, node, browseRoot) => {
  const url = new URL(href);
  if (!regularAdapters.has(adapter)) return url.toString();

  url.searchParams.set('flatFromAdapter', adapter);
  url.searchParams.set('flatFromNode', node);
  if (browseRoot) url.searchParams.set('flatFromBrowseRoot', browseRoot);
  else url.searchParams.delete('flatFromBrowseRoot');
  const flatAdapter = `flat-${adapter}`;
  url.searchParams.set('adapter', flatAdapter);
  url.searchParams.set('node', `${flatAdapter}:root`);

  if (adapter === 'articles' || adapter === 'categories') {
    const scope = node.startsWith('category:') ? node : browseRoot;
    if (scope?.startsWith('category:')) url.searchParams.set('browseRoot', scope);
    else url.searchParams.delete('browseRoot');
    url.searchParams.delete('flatScope');
  } else {
    if (browseRoot) url.searchParams.set('browseRoot', browseRoot);
    else url.searchParams.delete('browseRoot');
    url.searchParams.set('flatScope', node);
  }
  return url.toString();
};

export const regularViewUrl = (href, browseRoot) => {
  const url = new URL(href);
  const previous = url.searchParams.get('flatFromAdapter');
  const adapter = regularAdapters.has(previous) ? previous : 'articles';
  const originalRoot = url.searchParams.get('flatFromBrowseRoot') || (!previous ? browseRoot : null);
  const node = url.searchParams.get('flatFromNode') || originalRoot || 'content:root';

  url.searchParams.set('adapter', adapter);
  url.searchParams.set('node', node);
  if (originalRoot) url.searchParams.set('browseRoot', originalRoot);
  else url.searchParams.delete('browseRoot');
  for (const key of ['flatFromAdapter', 'flatFromNode', 'flatFromBrowseRoot', 'flatScope']) url.searchParams.delete(key);
  return url.toString();
};

export const flatRootUrl = (href, rootNode) => {
  const url = new URL(href);
  if (!url.searchParams.get('adapter')?.startsWith('flat-') || !rootNode) return url.toString();
  const adapter = url.searchParams.get('adapter');
  url.searchParams.set('node', `${adapter}:root`);
  url.searchParams.set('flatFromNode', rootNode);
  if (adapter === 'flat-articles' || adapter === 'flat-categories') {
    const originalRoot = url.searchParams.get('flatFromBrowseRoot') || (!url.searchParams.has('flatFromAdapter') ? url.searchParams.get('browseRoot') : null);
    if (originalRoot) url.searchParams.set('browseRoot', originalRoot);
    else url.searchParams.delete('browseRoot');
    url.searchParams.delete('flatScope');
  } else {
    url.searchParams.set('flatScope', rootNode);
  }
  return url.toString();
};
