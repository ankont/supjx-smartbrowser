(function () {
  const resolveBrowseRoot = (wrapper, input) => {
    const configuredUrl = wrapper.getAttribute('url');
    if (configuredUrl) {
      const path = new URL(configuredUrl, window.location.href).searchParams.get('path');
      if (path) return path;
    }

    const rootFolder = wrapper.getAttribute('root-folder');
    const directory = wrapper.dataset.directory || input.dataset.directory || '';
    if (!rootFolder) return directory || undefined;

    const root = `local-${rootFolder}:/`;
    return directory ? `${root}${directory.replace(/^\/+/, '')}` : root;
  };

  document.addEventListener('click', async (event) => {
    const button = event.target.closest('joomla-field-media .button-select, .field-media-wrapper .button-select, .field-media-wrapper [data-button-select]');
    if (!button || !window.SmartBrowserPicker) return;

    const wrapper = button.closest('joomla-field-media, .field-media-wrapper');
    const input = wrapper?.querySelector('.field-media-input, input[type="text"], input[type="hidden"]');
    if (!wrapper || !input) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const accepted = (input.getAttribute('accept') || wrapper.getAttribute('types') || wrapper.dataset.types || '').toLowerCase();
    const resource = await window.SmartBrowserPicker.open({
      adapter: 'media',
      multiple: false,
      selectionTarget: 'item',
      browseRoot: resolveBrowseRoot(wrapper, input),
      allowedResourceTypes: /image/.test(accepted) ? ['image'] : [],
    });
    const value = resource?.metadata?.url || resource?.id;
    if (!value) return;

    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, true);
}());
