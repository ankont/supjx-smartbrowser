const prefix = 'supjx.smartbrowser.';

export function resetSessionNavigationIfNeeded(storage, application, token) {
  if (!token) return false;
  const marker = `${prefix}session.${application}`;
  const previous = storage.getItem(marker);
  storage.setItem(marker, token);
  if (!previous || previous === token) return false;

  for (let index = 0; index < storage.length; index++) {
    const key = storage.key(index);
    if (!key?.startsWith(prefix) || key.startsWith(`${prefix}ui.`) || key.startsWith(`${prefix}session.`)) continue;
    try {
      const state = JSON.parse(storage.getItem(key));
      if (!state || typeof state !== 'object' || Array.isArray(state)) continue;
      if (!('selectedNode' in state) && !('filters' in state)) continue;
      delete state.selectedNode;
      delete state.filters;
      storage.setItem(key, JSON.stringify(state));
    } catch {
      // Other SmartBrowser storage entries are not browser-state objects.
    }
  }
  return true;
}

export function urlWithoutSessionNavigation(href) {
  const url = new URL(href);
  url.searchParams.delete('node');
  if (url.searchParams.has('flatFromAdapter')) {
    const originalRoot = url.searchParams.get('flatFromBrowseRoot');
    if (originalRoot) url.searchParams.set('browseRoot', originalRoot);
    else url.searchParams.delete('browseRoot');
    url.searchParams.delete('flatScope');
    url.searchParams.delete('flatFromNode');
    url.searchParams.delete('flatFromBrowseRoot');
    url.searchParams.delete('flatFromAdapter');
  }
  return url.toString();
}
