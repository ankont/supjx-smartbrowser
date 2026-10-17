(function () {
  const scriptUrl = document.currentScript?.src;
  const sizeUrl = scriptUrl ? new URL('picker-size.js', scriptUrl) : null;
  if (sizeUrl) sizeUrl.search = new URL(scriptUrl).search;
  const sizeModule = sizeUrl ? import(sizeUrl.href) : Promise.resolve(null);
  let contract;
  sizeModule.then(module => { contract = module; }).catch(() => {});
  sizeModule.catch(() => {});
  const instances = new Map();
  const editors = Object.create(null);
  const previewActions = new Map();
  const visualOverlays = new Map();
  const previewRenderers = new Map();
  const imagePresentations = new Map(), imagePresentationListeners = new Set();
  const presentationDefinitions = () => [...imagePresentations.values()].sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
  const subscribeImagePresentations = listener => {
    if (typeof listener !== 'function') throw new TypeError('An image presentation subscriber must be a function.');
    imagePresentationListeners.add(listener); return () => imagePresentationListeners.delete(listener);
  };
  const notifyImagePresentations = () => {
    for (const listener of imagePresentationListeners) { try { listener(presentationDefinitions()); } catch (error) { console.error(error); } }
  };
  const unregisterImagePresentation = id => { if (imagePresentations.delete(id)) notifyImagePresentations(); };
  const previewRendererListeners = new Set();
  const rendererDefinitions = () => [...previewRenderers.values()].sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
  const notifyPreviewRenderers = () => {
    for (const listener of previewRendererListeners) {
      try { listener(rendererDefinitions()); } catch (error) { console.error(error); }
    }
  };
  const subscribePreviewRenderers = listener => {
    if (typeof listener !== 'function') throw new TypeError('A preview renderer subscriber must be a function.');
    previewRendererListeners.add(listener); return () => previewRendererListeners.delete(listener);
  };
  const unregisterPreviewRenderer = id => { if (previewRenderers.delete(id)) notifyPreviewRenderers(); };
  const visualOverlayListeners = new Set();
  const subscribeVisualOverlays = listener => {
    if (typeof listener !== 'function') throw new TypeError('A visual overlay subscriber must be a function.');
    visualOverlayListeners.add(listener);
    return () => visualOverlayListeners.delete(listener);
  };
  const overlayDefinitions = () => [...visualOverlays.values()].sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
  const notifyVisualOverlays = () => {
    for (const listener of visualOverlayListeners) {
      try { listener(overlayDefinitions()); } catch (error) { console.error(error); }
    }
  };
  const unregisterVisualOverlay = id => { if (visualOverlays.delete(id)) notifyVisualOverlays(); };
  const previewActionListeners = new Set();
  const subscribePreviewActions = listener => {
    if (typeof listener !== 'function') throw new TypeError('A preview action subscriber must be a function.');
    previewActionListeners.add(listener);
    return () => previewActionListeners.delete(listener);
  };
  const notifyPreviewActions = () => {
    for (const listener of previewActionListeners) {
      try { listener([...previewActions.values()]); } catch (error) { console.error(error); }
    }
  };
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
      selectionState: '1',
      adapterOptions: JSON.stringify(config.adapterOptions || {}),
    };
    if (config.resultFormat === 'collection') values.showAdapterSwitcher = !config.allowedAdapters?.length || config.allowedAdapters.length > 1 ? '1' : '0';
    Object.entries(values).forEach(([key, value]) => { if (value !== '') url.searchParams.set(key, value); });
    if (selected.node || config.initialNode) {
      url.searchParams.set('node', selected.node || config.initialNode);
      if (selected.resourceId) url.searchParams.set('initialResource', selected.resourceId);
    }
    return url.toString();
  };

  window.SmartBrowserPicker = {
    subscribeImagePresentations,
    getImagePresentations: presentationDefinitions,
    unregisterImagePresentation,
    registerImagePresentation(definition) {
      if (!/^[a-z][a-z0-9_-]*(?:\.[a-zA-Z][a-zA-Z0-9_-]*)+$/.test(definition?.id || '') || typeof definition.apply !== 'function'
        || definition.order != null && !Number.isFinite(definition.order)
        || !Array.isArray(definition.styles) || definition.styles.some(name => typeof name !== 'string' || !/^(?:--)?[a-z][a-z0-9-]*$/.test(name))
        || definition.hasChanges != null && typeof definition.hasChanges !== 'function'
        || definition.reset != null && typeof definition.reset !== 'function') throw new TypeError('An image presentation needs a namespaced ID, CSS styles and apply function.');
      if (imagePresentations.has(definition.id)) throw new Error('Image presentation is already registered.');
      imagePresentations.set(definition.id, definition); notifyImagePresentations();
      return () => { if (imagePresentations.get(definition.id) === definition) unregisterImagePresentation(definition.id); };
    },
    subscribePreviewRenderers,
    unregisterPreviewRenderer,
    registerPreviewRenderer(definition) {
      if (!/^[a-z][a-z0-9_-]*(?:\.[a-zA-Z][a-zA-Z0-9_-]*)+$/.test(definition?.id || '') || typeof definition.mount !== 'function'
        || definition.order != null && !Number.isFinite(definition.order)) throw new TypeError('A preview renderer needs a namespaced ID and mount function.');
      if (previewRenderers.has(definition.id)) throw new Error('Preview renderer is already registered.');
      previewRenderers.set(definition.id, definition); notifyPreviewRenderers();
      return () => { if (previewRenderers.get(definition.id) === definition) unregisterPreviewRenderer(definition.id); };
    },
    subscribeVisualOverlays,
    unregisterVisualOverlay,
    registerVisualOverlay(definition) {
      if (!/^[a-z][a-z0-9_-]*(?:\.[a-zA-Z][a-zA-Z0-9_-]*)+$/.test(definition?.id || '') || typeof definition.mount !== 'function'
        || definition.order != null && !Number.isFinite(definition.order)) throw new TypeError('A visual overlay needs a namespaced ID and mount function.');
      if (visualOverlays.has(definition.id)) throw new Error('Visual overlay is already registered.');
      visualOverlays.set(definition.id, definition);
      notifyVisualOverlays();
      return () => { if (visualOverlays.get(definition.id) === definition) unregisterVisualOverlay(definition.id); };
    },
    subscribePreviewActions,
    extensions() { return { editors: { ...editors }, previewActions: [...previewActions.values()], visualOverlays: overlayDefinitions(), previewRenderers: rendererDefinitions(), imagePresentations: presentationDefinitions() }; },
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
      notifyPreviewActions();
      return () => { if (previewActions.delete(definition.id)) notifyPreviewActions(); };
    },
    context(id, source) {
      const instance = instances.get(id);
      if (!instance || instance.frame.contentWindow !== source) return null;
      return { ...instance.context, addressContract: window.SmartBrowser?.SelectionAddress, subscribePreviewActions, subscribeVisualOverlays, visualOverlays: overlayDefinitions(), subscribePreviewRenderers, previewRenderers: rendererDefinitions(), subscribeImagePresentations, getImagePresentations: presentationDefinitions, imagePresentations: presentationDefinitions(), ...(instance.snapshot ? {
        getCollectionSnapshot: () => clone(instance.snapshot),
        commitCollection: snapshot => { instance.snapshot = { items: contract.collectionEntries(snapshot.items, instance.constraints), resources: clone(snapshot.resources || {}), virtualResources: clone(snapshot.virtualResources || {}) }; },
        initialUsage: Object.fromEntries(instance.snapshot.items.map(entry => [contract.referenceKey(entry.selection), entry.usage])),
      } : {}), editors: { ...editors }, previewActions: [...previewActions.values()], cancel: () => instance.close(), toggleSize: () => instance.size?.toggle() || false, isMaximized: () => instance.size?.isMaximized() || false };
    },
    open(config = {}) {
      const collectionMode = config.resultFormat === 'collection';
      if (collectionMode && !contract) return sizeModule.then(module => { if (!module) throw new Error('Collection contract unavailable.'); contract = module; return window.SmartBrowserPicker.open(config); });
      return new Promise((resolve, reject) => {
        for (const name of ['selectionProfile', 'initialUsage']) {
          if (config[name] != null && (typeof config[name] !== 'object' || Array.isArray(config[name]))) throw new TypeError(`${name} must be an object.`);
        }
        if (config.initialSelection != null && !Array.isArray(config.initialSelection)) throw new TypeError('initialSelection must be an ordered array.');
        if (config.allowedAdapters != null && (!Array.isArray(config.allowedAdapters) || config.allowedAdapters.length > 50 || config.allowedAdapters.some(id => typeof id !== 'string' || !/^[a-z][a-z0-9-]*$/.test(id)))) throw new TypeError('allowedAdapters must contain adapter IDs.');
        const constraints = { allowedAdapters: config.allowedAdapters || [], homogeneous: config.homogeneous === true, maxSelections: config.maxSelections ?? 500 };
        if (!Number.isInteger(constraints.maxSelections) || constraints.maxSelections < 1 || constraints.maxSelections > 500) throw new TypeError('Invalid selection limit.');
        const snapshot = collectionMode ? { items: contract.collectionEntries(config.initialCollection || [], constraints), resources: {} } : null;
        if (snapshot && !config.multiple && snapshot.items.length > 1) throw new TypeError('Single selection accepts at most one resource.');
        if (collectionMode) {
          config = { ...config, adapter: config.adapter || snapshot.items[0]?.selection.adapter || constraints.allowedAdapters[0] || 'media' };
          if (constraints.allowedAdapters.length && !constraints.allowedAdapters.includes(config.adapter.replace(/^flat-/, ''))) throw new TypeError('Disallowed browsing adapter.');
        }
        const dialog = document.createElement('dialog');
        dialog.className = 'smartbrowser-picker';
        dialog.innerHTML = '<iframe title="SmartBrowser"></iframe>';
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
          if (collectionMode) {
            const items = contract.collectionEntries(event.detail.collectionItems || [], constraints);
            if (!config.multiple && items.length > 1) return;
            if (items.length) close({ items });
            return;
          }
          if (config.allowedAdapters?.length && event.detail.adapter && !config.allowedAdapters.includes(event.detail.adapter)) return;
          const allowed = new Set(config.allowedResourceTypes || []);
          const resources = (event.detail?.resources || []).filter((resource) => !allowed.size || allowed.has(resource.type));
          if (resources.length > constraints.maxSelections) return;
          if (!resources.length) return;
          const selection = config.multiple ? resources : (resources[0] || null);
          const usage = Object.fromEntries((config.multiple ? resources : resources.slice(0, 1)).map(resource => [resource.id, event.detail?.usage?.[resource.id] || {}]));
          const result = config.resultFormat === 'usage' ? { selection, usage, ...(config.includeAdapter ? { adapter: event.detail.adapter || (config.adapter || 'media').replace(/^flat-/, '') } : {}) } : selection;
          close(result);
        };
        const url = new URL(buildUrl(config.url || Joomla.getOptions('com_smartbrowser.picker', {}).url || 'index.php?option=com_smartbrowser', config));
        url.searchParams.set('pickerInstance', instanceId);
        instances.set(instanceId, { frame, snapshot, constraints, close, context: clone({
          selectionProfile: config.selectionProfile || {}, initialUsage: config.initialUsage || {},
          title: typeof config.title === 'string' ? config.title : '', subtitle: typeof config.subtitle === 'string' ? config.subtitle : '', confirmLabel: typeof config.confirmLabel === 'string' ? config.confirmLabel : '',
          selectionEditorContext: config.selectionEditorContext || {},
          initialSelection: config.initialSelection || [],
          allowedAdapters: config.allowedAdapters || [],
          initialAdapter: config.adapter || 'media',
          initialFocus: config.initialFocus || null, initialInfoOpen: config.initialInfoOpen === true,
          initialBrowseRoot: config.browseRoot || '',
          collectionMode, homogeneous: config.homogeneous === true,
          allowOrdering: config.allowOrdering !== false && config.ordering !== false, maxSelections: constraints.maxSelections,
        }) });
        window.SmartBrowserDialogDismiss.install(dialog, () => false, () => close());
        document.addEventListener('smartbrowser:select', selected);
        frame.src = url.toString();
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
