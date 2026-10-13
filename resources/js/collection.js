import { createApp, reactive } from 'vue';
import CollectionView from './components/CollectionView.vue';
import ResourceApi from './services/ResourceApi.js';
import { createCollectionState } from './core/collectionState.js';

const mounted = new WeakMap();
export function mountCollection(container, configuration = {}) {
  const target = typeof container === 'string' ? document.querySelector(container) : container;
  if (!(target instanceof Element)) throw new TypeError('A collection requires a container element.');
  if (mounted.has(target)) throw new Error('A SmartBrowser collection is already mounted in this container.');
  const defaults = window.Joomla?.getOptions('com_smartbrowser.collection', {}) || {};
  const config = reactive({ ...defaults, ...configuration });
  if (!config.apiBaseUrl || !config.csrfToken) throw new TypeError('Collection apiBaseUrl and csrfToken are required.');
  if (config.layout && !['grid', 'details', 'compact'].includes(config.layout)) throw new TypeError('Collection layout must be grid, details or compact.');
  if (config.informationPanelPosition && !['auto', 'top', 'bottom', 'left', 'right'].includes(config.informationPanelPosition)) throw new TypeError('Invalid information panel position.');
  if (config.informationPanelHorizontalPosition && !['left', 'right'].includes(config.informationPanelHorizontalPosition)) throw new TypeError('Invalid horizontal information panel position.');
  if (config.informationPanelVerticalPosition && !['top', 'bottom'].includes(config.informationPanelVerticalPosition)) throw new TypeError('Invalid vertical information panel position.');
  if (config.selectionUseData && !['hidden', 'readonly', 'editable'].includes(config.selectionUseData)) throw new TypeError('Invalid selection use data presentation.');
  const t = config.translate || (key => window.Joomla?.Text?._(key, key) || key);
  const api = new ResourceApi({ ...config, mode: config.readOnly ? 'readonly' : 'manage' });
  let destroyed = false;
  const toolbarButtons = new Map();
  let attachedPreview;
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
    setNativeAddress: value => { config.nativeAddress = String(value || ''); },
    attachPreview(element) {
      if (destroyed || !(element instanceof HTMLElement) || attachedPreview) return;
      const host = target.querySelector('.sb-native-preview-host');
      if (!host) return;
      const marker = document.createComment('SmartBrowser preview');
      element.before(marker);
      host.append(element);
      attachedPreview = { element, marker };
      config.nativePreview = true;
    },
    addToolbarButton(button) {
      if (destroyed || !(button instanceof HTMLElement) || !button.matches('button, [role="button"]')) throw new TypeError('A toolbar button element is required.');
      if (!toolbarButtons.has(button)) {
        const marker = document.createComment('SmartBrowser toolbar button');
        button.before(marker);
        toolbarButtons.set(button, marker);
        target.querySelector('.sb-collection-extra-buttons').append(button);
      }
      return () => {
        const marker = toolbarButtons.get(button);
        if (!marker) return;
        marker.replaceWith(button);
        toolbarButtons.delete(button);
      };
    },
    destroy() {
      if (destroyed) return;
      toolbarButtons.forEach((marker, button) => marker.replaceWith(button));
      toolbarButtons.clear();
      if (attachedPreview) attachedPreview.marker.replaceWith(attachedPreview.element);
      destroyed = true; model.destroy(); app.unmount(); mounted.delete(target);
    },
  };
  mounted.set(target, instance);
  return instance;
}
window.SmartBrowser = { ...window.SmartBrowser, mountCollection };
document.dispatchEvent(new CustomEvent('smartbrowser:collection-ready'));
