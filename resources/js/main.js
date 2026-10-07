import { createApp } from 'vue';
import SmartBrowserApp from './components/SmartBrowserApp.vue';
import ResourceGrid from './components/ResourceGrid.vue';
import ResourceDetails from './components/ResourceDetails.vue';
import MediaActionDriver from './adapters/MediaActionDriver.js';
import createBrowserState from './core/createBrowserState.js';
import { createViewRegistry } from './core/viewRegistry.js';
import PersistenceService from './services/PersistenceService.js';
import { resetPreferencesIfNeeded } from './core/resetPreferences.js';
import { resetSessionNavigationIfNeeded, urlWithoutSessionNavigation } from './core/resetSessionNavigation.js';
import ResourceApi from './services/ResourceApi.js';

const options = Joomla.getOptions('com_smartbrowser', {});
let pickerContext = null;
try { pickerContext = window.parent !== window && options.pickerInstance
  ? window.parent.SmartBrowserPicker?.context(options.pickerInstance, window) : null; } catch {}
options.pickerContext = pickerContext;
resetPreferencesIfNeeded(window.sessionStorage, options.preferencesResetToken);
const sessionChanged = resetSessionNavigationIfNeeded(window.sessionStorage, options.application, options.csrfToken);
const resetUrl = sessionChanged ? urlWithoutSessionNavigation(window.location.href) : window.location.href;
if (resetUrl !== window.location.href) window.location.replace(resetUrl);
else {
const api = new ResourceApi(options);
const persistenceKey = options.browseRoot
  ? `supjx.smartbrowser.${options.adapter}.${options.browseRoot}`
  : `supjx.smartbrowser.${options.adapter}`;
const persistence = new PersistenceService(window.sessionStorage, persistenceKey);
const viewRegistry = createViewRegistry()
  .register({ id: 'grid', label: 'COM_SMARTBROWSER_GRID', icon: 'fas fa-th', component: ResourceGrid, supportsSize: true, controls: ['sort', 'zoom'], options: { gridSize: 'md' } })
  .register({ id: 'details', label: 'COM_SMARTBROWSER_DETAILS', icon: 'fas fa-list', component: ResourceDetails, supportsSize: false, controls: ['thumbnails', 'dateField'], options: { detailsThumbnails: false, detailsDateMode: 'modified' } });
const browser = createBrowserState({ options, api, persistence, viewRegistry });
const actionDriver = new MediaActionDriver(api, browser.state, () => browser.load(), (key) => Joomla.Text?._(key, key) || key, options.editorMode, options.application);

window.SmartBrowser = {
  ...window.SmartBrowser,
  open(config = {}) {
    const showContextResources = config.showContextResources ?? options.showContextResources ?? false;
    const browseRoot = config.browseRoot ? `&browseRoot=${encodeURIComponent(config.browseRoot)}` : '';
    const defaultView = config.defaultView ? `&defaultView=${encodeURIComponent(config.defaultView)}` : '';
    const allowedTypes = config.allowedResourceTypes?.length ? `&allowedResourceTypes=${encodeURIComponent(config.allowedResourceTypes.join(','))}` : '';
    const adapterSwitcher = config.showAdapterSwitcher ? '&showAdapterSwitcher=1' : '';
    window.location.href = `${options.returnUrl}&adapter=${encodeURIComponent(config.adapter || options.adapter)}&mode=${encodeURIComponent(config.mode || 'select')}&multiple=${config.multiple ? 1 : 0}&selectionTarget=${encodeURIComponent(config.selectionTarget || 'item')}&showContextResources=${showContextResources ? 1 : 0}${browseRoot}${defaultView}${allowedTypes}${adapterSwitcher}`;
  },
  registerView: (definition) => viewRegistry.register(definition),
};

createApp(SmartBrowserApp)
  .provide('browser', browser)
  .provide('resourceApi', api)
  .provide('smartBrowserOptions', options)
  .provide('viewRegistry', viewRegistry)
  .provide('actionDriver', actionDriver)
  .mount('#smartbrowser-app');
}
