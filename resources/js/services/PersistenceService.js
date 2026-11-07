import { preferenceStorage } from '../core/userPreferences.js';
import { personalPreferences, pickerScope, nodePreferenceKey } from '../core/personalPreferences.js';
export const isManagementBrowser = options => options.mode === 'manage' && !options.pickerInstance && !options.pickerContext;
export const browserStateKey = (options, storage = preferenceStorage()) => isManagementBrowser(options)
  ? `supjx.smartbrowser.${options.adapter.replace(/^flat-/, '')}`
  : `supjx.smartbrowser.picker.${pickerScope(options, personalPreferences(storage))}.${options.adapter.replace(/^flat-/, '')}`;

export default class PersistenceService {
  constructor(storage = preferenceStorage(), key = 'supjx.smartbrowser.media', options = null) {
    this.storage = storage;
    this.key = key;
    this.nodeKey = options ? nodePreferenceKey(options, storage) : null;
  }

  load(defaults) {
    try {
      const saved = { ...defaults, ...JSON.parse(this.storage.getItem(this.key) || '{}') };
      if (this.nodeKey) saved.selectedNode = JSON.parse(this.storage.getItem(this.nodeKey) || '{}').selectedNode || saved.selectedNode;
      return saved;
    } catch (error) {
      return { ...defaults };
    }
  }

  save(state) {
    const persisted = {
      ...(!this.nodeKey ? { selectedNode: state.selectedNode } : {}),
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
    if (this.nodeKey) {
      let node = {}; try { node = JSON.parse(this.storage.getItem(this.nodeKey) || '{}'); } catch {}
      this.storage.setItem(this.nodeKey, JSON.stringify({ ...node, selectedNode: state.selectedNode }));
    }
  }
}
