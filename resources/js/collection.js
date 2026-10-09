import { createApp } from 'vue';
import CollectionView from './components/CollectionView.vue';
import ResourceApi from './services/ResourceApi.js';
import { createCollectionState } from './core/collectionState.js';

const mounted = new WeakMap();
export function mountCollection(container, configuration = {}) {
  const target = typeof container === 'string' ? document.querySelector(container) : container;
  if (!(target instanceof Element)) throw new TypeError('A collection requires a container element.');
  if (mounted.has(target)) throw new Error('A SmartBrowser collection is already mounted in this container.');
  const defaults = window.Joomla?.getOptions('com_smartbrowser.collection', {}) || {};
  const config = { ...defaults, ...configuration };
  if (!config.apiBaseUrl || !config.csrfToken) throw new TypeError('Collection apiBaseUrl and csrfToken are required.');
  if (config.layout && !['grid', 'details', 'compact'].includes(config.layout)) throw new TypeError('Collection layout must be grid, details or compact.');
  const t = config.translate || (key => window.Joomla?.Text?._(key, key) || key);
  const api = new ResourceApi({ ...config, mode: config.readOnly ? 'readonly' : 'manage' });
  let destroyed = false;
  const notify = detail => {
    if (destroyed) return;
    target.dispatchEvent(new CustomEvent('smartbrowser:collection-change', { detail, bubbles: true }));
    config.onChange?.(detail);
  };
  const model = createCollectionState({ config, api, notify, translate: t });
  const app = createApp(CollectionView, { model, api, config, t }).provide('smartBrowserOptions', model.options);
  app.mount(target);
  const ready = model.refresh();
  ready.catch(error => config.onError?.(error));
  const instance = {
    ready, getItems: model.getItems,
    setItems: items => model.setItems(items),
    addItems: items => model.addItems(items),
    refresh: () => model.refresh(),
    destroy() {
      if (destroyed) return;
      destroyed = true; model.destroy(); app.unmount(); mounted.delete(target);
    },
  };
  mounted.set(target, instance);
  return instance;
}
window.SmartBrowser = { ...window.SmartBrowser, mountCollection };
document.dispatchEvent(new CustomEvent('smartbrowser:collection-ready'));
