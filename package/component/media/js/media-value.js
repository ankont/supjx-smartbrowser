(function (root) {
  const parse = (value) => {
    const original = String(value || '');
    const marker = '#joomlaImage://';
    const index = original.indexOf(marker);
    const path = index < 0 ? original : original.slice(0, index);
    const result = { path, filesystem: null, filesystemPath: null, resourceId: null, width: null, height: null };
    if (index < 0) return result;

    try {
      const uri = new URL(original.slice(index + 1));
      if (uri.protocol !== 'joomlaimage:' || !uri.hostname) return result;
      const filesystemPath = decodeURIComponent(uri.pathname);
      if (!filesystemPath.startsWith('/') || filesystemPath.split('/').includes('..')) return result;
      result.filesystem = uri.hostname;
      result.filesystemPath = filesystemPath;
      result.resourceId = `${uri.hostname}:${filesystemPath}`;
      for (const key of ['width', 'height']) {
        const number = Number(uri.searchParams.get(key));
        if (Number.isSafeInteger(number) && number > 0) result[key] = number;
      }
    } catch { /* A malformed fragment still leaves the plain path usable. */ }
    return result;
  };

  const format = (resource, representation = 'joomla') => {
    if (representation === 'resource') return resource;
    const metadata = resource?.metadata || {};
    const path = metadata.relativePath || metadata.url || '';
    if (representation === 'path') return path;
    if (representation === 'url') return metadata.url || path;
    if (representation !== 'joomla') throw new TypeError('Unknown media representation');
    if (resource?.type !== 'image' || !path || !metadata.filesystem || !metadata.filesystemPath) return path;

    const dimensions = new URLSearchParams();
    for (const key of ['width', 'height']) {
      const number = Number(metadata[key]);
      if (Number.isSafeInteger(number) && number > 0) dimensions.set(key, String(number));
    }
    const suffix = dimensions.size ? `?${dimensions}` : '';
    return `${path}#joomlaImage://${metadata.filesystem}${metadata.filesystemPath}${suffix}`;
  };

  const selectionLocation = (value) => {
    const parsed = parse(value);
    if (!parsed.resourceId) return { resourceId: null, node: null };
    const slash = parsed.filesystemPath.lastIndexOf('/');
    return {
      resourceId: parsed.resourceId,
      node: `${parsed.filesystem}:${slash > 0 ? parsed.filesystemPath.slice(0, slash) : '/'}`,
    };
  };

  root.SmartBrowserMediaValue = { parse, format, selectionLocation };
}(globalThis));
