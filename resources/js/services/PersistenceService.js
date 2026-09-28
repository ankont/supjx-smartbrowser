export default class PersistenceService {
  constructor(storage = window.sessionStorage, key = 'supjx.smartbrowser.media') {
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
