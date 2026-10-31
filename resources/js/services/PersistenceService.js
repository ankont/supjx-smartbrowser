import { preferenceStorage } from '../core/userPreferences.js';
export const isManagementBrowser = options => options.mode === 'manage' && !options.pickerInstance && !options.pickerContext;
export const browserStateKey = options => isManagementBrowser(options)
  ? `supjx.smartbrowser.${options.adapter.replace(/^flat-/, '')}`
  : `supjx.smartbrowser.picker.${encodeURIComponent(options.pickerContext?.viewPreferenceKey || options.viewPreferenceKey || 'default')}.${options.adapter.replace(/^flat-/, '')}`;

export default class PersistenceService {
  constructor(storage = preferenceStorage(), key = 'supjx.smartbrowser.media') {
    this.storage = storage;
    this.key = key;
  }

  load(defaults) {
    try {
      return { ...defaults, ...JSON.parse(this.storage.getItem(this.key) || '{}') };
    } catch (error) {
      return { ...defaults };
    }
  }

  save(state) {
    const persisted = {
      selectedNode: state.selectedNode,
      activeView: state.activeView,
      viewOptions: state.viewOptions,
      hiddenColumns: state.hiddenColumns,
      shownColumns: state.shownColumns,
      sortBy: state.sortBy,
      sortDirection: state.sortDirection,
      showInfo: state.showInfo,
      filters: state.filters,
    };

    this.storage.setItem(this.key, JSON.stringify(persisted));
  }
}
