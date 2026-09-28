(function () {
  const buildUrl = (baseUrl, config) => {
    const url = new URL(baseUrl, window.location.href);
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
    return url.toString();
  };

  window.SmartBrowserPicker = {
    open(config = {}) {
      return new Promise((resolve) => {
        const dialog = document.createElement('dialog');
        dialog.className = 'smartbrowser-picker';
        dialog.innerHTML = '<iframe title="SmartBrowser"></iframe><button type="button" class="btn-close" aria-label="Close"></button>';
        const close = (result = null) => {
          document.removeEventListener('smartbrowser:select', selected);
          dialog.close();
          dialog.remove();
          if (typeof config.onSelect === 'function' && result) config.onSelect(result);
          resolve(result);
        };
        const selected = (event) => {
          const allowed = new Set(config.allowedResourceTypes || []);
          const resources = (event.detail?.resources || []).filter((resource) => !allowed.size || allowed.has(resource.type));
          if (!resources.length) return;
          const result = config.multiple ? resources : (resources[0] || null);
          close(result);
        };
        window.SmartBrowserDialogDismiss.install(dialog, () => false, () => close());
        document.addEventListener('smartbrowser:select', selected);
        dialog.querySelector('iframe').src = buildUrl(config.url || Joomla.getOptions('com_smartbrowser.picker', {}).url || 'index.php?option=com_smartbrowser', config);
        dialog.querySelector('.btn-close').addEventListener('click', () => close());
        document.body.appendChild(dialog);
        dialog.showModal();
      });
    },
  };
}());
