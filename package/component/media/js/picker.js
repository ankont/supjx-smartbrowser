(function () {
  const scriptUrl = document.currentScript?.src;
  const sizeModule = scriptUrl ? import(new URL('picker-size.js', scriptUrl).href) : Promise.resolve(null);
  sizeModule.catch(() => {});
  const instances = new Map();
  const editors = Object.create(null);
  const previewActions = new Map();
  let sequence = 0;
  const clone = value => JSON.parse(JSON.stringify(value));
  const buildUrl = (baseUrl, config) => {
    const url = new URL(baseUrl, window.location.href);
    const selected = window.SmartBrowserMediaValue.selectionLocation(config.initialValue);
    const values = {
      view: 'browser', adapter: config.adapter || 'media', mode: 'select',
      multiple: config.multiple ? '1' : '0', selectionTarget: config.selectionTarget || 'item',
      showContextResources: config.showContextResources ? '1' : '0',
      browseRoot: config.browseRoot || '', defaultView: config.defaultView || 'grid',
      allowedResourceTypes: (config.allowedResourceTypes || []).join(','), tmpl: 'component',
      allowNoUser: config.allowNoUser ? '1' : '0',
      Itemid: '0',
    };
    Object.entries(values).forEach(([key, value]) => { if (value !== '') url.searchParams.set(key, value); });
    if (selected.node || config.initialNode) {
      url.searchParams.set('node', selected.node || config.initialNode);
      if (selected.resourceId) url.searchParams.set('initialResource', selected.resourceId);
    }
    return url.toString();
  };

  window.SmartBrowserPicker = {
    registerUsageEditor(id, definition) {
      if (!/^[a-z][a-z0-9_-]*(?:\.[a-zA-Z][a-zA-Z0-9_-]*)+$/.test(id) || typeof definition?.mount !== 'function') throw new TypeError('A usage editor needs a namespaced ID and mount function.');
      if (editors[id]) throw new Error('Usage editor is already registered.');
      editors[id] = definition;
      return () => { delete editors[id]; };
    },
    registerPreviewAction(definition) {
      if (!/^[a-z][a-z0-9_-]*(?:\.[a-zA-Z][a-zA-Z0-9_-]*)+$/.test(definition?.id || '') || typeof definition.run !== 'function') throw new TypeError('A preview action needs a namespaced ID and run function.');
      if (previewActions.has(definition.id)) throw new Error('Preview action is already registered.');
      previewActions.set(definition.id, definition);
      return () => { previewActions.delete(definition.id); };
    },
    context(id, source) {
      const instance = instances.get(id);
      if (!instance || instance.frame.contentWindow !== source) return null;
      return { ...instance.context, editors: { ...editors }, previewActions: [...previewActions.values()], toggleSize: () => instance.size?.toggle() || false, isMaximized: () => instance.size?.isMaximized() || false };
    },
    open(config = {}) {
      return new Promise((resolve, reject) => {
        for (const name of ['selectionProfile', 'initialUsage']) {
          if (config[name] != null && (typeof config[name] !== 'object' || Array.isArray(config[name]))) throw new TypeError(`${name} must be an object.`);
        }
        if (config.initialSelection != null && !Array.isArray(config.initialSelection)) throw new TypeError('initialSelection must be an ordered array.');
        const dialog = document.createElement('dialog');
        dialog.className = 'smartbrowser-picker';
        dialog.innerHTML = '<iframe title="SmartBrowser"></iframe><button type="button" class="btn-close" aria-label="Close"></button>';
        const frame = dialog.querySelector('iframe');
        const instanceId = `sb-picker-${Date.now()}-${++sequence}`;
        let closed = false;
        let size;
        const close = (result = null) => {
          if (closed) return;
          closed = true;
          size?.destroy();
          document.removeEventListener('smartbrowser:select', selected);
          instances.delete(instanceId);
          dialog.close();
          dialog.remove();
          resolve(result);
          if (typeof config.onSelect === 'function' && result) config.onSelect(result);
        };
        const selected = (event) => {
          if (event.detail?.pickerInstance !== instanceId) return;
          const allowed = new Set(config.allowedResourceTypes || []);
          const resources = (event.detail?.resources || []).filter((resource) => !allowed.size || allowed.has(resource.type));
          if (!resources.length) return;
          const selection = config.multiple ? resources : (resources[0] || null);
          const usage = Object.fromEntries((config.multiple ? resources : resources.slice(0, 1)).map(resource => [resource.id, event.detail?.usage?.[resource.id] || {}]));
          const result = config.resultFormat === 'usage' ? { selection, usage } : selection;
          close(result);
        };
        const url = new URL(buildUrl(config.url || Joomla.getOptions('com_smartbrowser.picker', {}).url || 'index.php?option=com_smartbrowser', config));
        url.searchParams.set('pickerInstance', instanceId);
        instances.set(instanceId, { frame, context: clone({
          selectionProfile: config.selectionProfile || {}, initialUsage: config.initialUsage || {},
          initialSelection: config.initialSelection || [],
        }) });
        window.SmartBrowserDialogDismiss.install(dialog, () => false, () => close());
        document.addEventListener('smartbrowser:select', selected);
        frame.src = url.toString();
        dialog.querySelector('.btn-close').addEventListener('click', () => close());
        dialog.addEventListener('close', () => close());
        try {
          document.body.appendChild(dialog);
          dialog.showModal();
          sizeModule.then(module => {
            if (closed || !module) return;
            const translate = key => Joomla.Text?._(key, key === 'COM_SMARTBROWSER_EDITOR_RESTORE' ? 'Restore' : 'Maximize') || (key === 'COM_SMARTBROWSER_EDITOR_RESTORE' ? 'Restore' : 'Maximize');
            size = module.createEditorSize(dialog, null, translate, 'smartbrowser.pickerMaximized');
            instances.get(instanceId).size = size;
          }).catch(error => Joomla.renderMessages?.({ error: [error.message] }));
        } catch (error) {
          closed = true;
          document.removeEventListener('smartbrowser:select', selected);
          instances.delete(instanceId);
          dialog.remove();
          reject(error);
        }
      });
    },
  };
}());
