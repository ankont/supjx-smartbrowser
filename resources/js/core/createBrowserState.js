import { computed, reactive, watch } from 'vue';
import { asContextualResource, asPrimaryResource, canBulkSelectResource, canFocusResource, canSelectResource } from './resourcePolicy.js';

const compare = (field, direction) => (left, right) => {
  const a = field === 'title' ? left.title.toLocaleLowerCase() : field === 'dimension' ? (left.metadata?.width || 0) * (left.metadata?.height || 0) : left.metadata?.[field];
  const b = field === 'title' ? right.title.toLocaleLowerCase() : field === 'dimension' ? (right.metadata?.width || 0) * (right.metadata?.height || 0) : right.metadata?.[field];
  const result = typeof a === 'string' ? (a || '').localeCompare(b || '') : (a || 0) - (b || 0);
  return direction === 'asc' ? result : -result;
};

export default function createBrowserState({ options, api, persistence, viewRegistry }) {
  const allowedTypes = new Set(options.allowedResourceTypes || []);
  const applySelectionConstraints = (resource) => options.mode === 'readonly' || (allowedTypes.size && !allowedTypes.has(resource.type))
    ? { ...resource, selectable: false, bulkSelectable: false }
    : resource;
  const defaults = {
    selectedNode: options.currentNode || options.initialNode || options.roots[0]?.id || '',
    activeView: options.defaultView || 'grid',
    viewOptions: { gridSize: 'md', detailsThumbnails: false, detailsDateMode: 'modified' },
    hiddenColumns: [],
    shownColumns: [],
    sortBy: '',
    sortDirection: '',
    showInfo: false,
    filters: {},
  };
  const restored = persistence.load(defaults);
  restored.filters = { ...(restored.filters || {}), ...(options.initialFilters || {}) };
  if (!Array.isArray(restored.hiddenColumns)) restored.hiddenColumns = [];
  if (!Array.isArray(restored.shownColumns)) restored.shownColumns = [];
  if (options.currentNode) restored.selectedNode = options.currentNode;
  if (options.defaultView) restored.activeView = options.defaultView;
  if (!viewRegistry.has(restored.activeView)) restored.activeView = 'grid';

  const state = reactive({
    ...restored,
    roots: options.roots,
    nodes: [],
    items: [],
    contextItems: [],
    breadcrumb: [],
    actions: options.actions,
    presentation: options.presentation || {},
    currentResource: null,
    focusedId: null,
    selectedIds: [],
    search: '',
    loading: false,
    busy: false,
    error: '',
  });

  const resources = computed(() => {
    const query = state.search.trim().toLocaleLowerCase();
    const matches = (item) => !query || [item.title, item.subtitle, item.metadata?.alias]
      .some((value) => String(value || '').toLocaleLowerCase().includes(query));
    const nodes = state.nodes.map(asPrimaryResource).map(applySelectionConstraints).filter(matches);
    const items = state.items.map(asPrimaryResource).map(applySelectionConstraints).filter(matches);
    const contextItems = state.contextItems.map(asContextualResource);
    if (!state.sortBy) return [...nodes, ...items, ...contextItems];
    return [
      ...nodes.sort(compare(state.sortBy, state.sortDirection)),
      ...items.sort(compare(state.sortBy, state.sortDirection)),
      ...contextItems,
    ];
  });
  const selectableResources = computed(() => {
    const target = options.selectionTarget || 'both';
    return resources.value.filter((resource) => canSelectResource(resource, target));
  });
  const bulkSelectableResources = computed(() => {
    const target = options.selectionTarget || 'both';
    return resources.value.filter((resource) => canBulkSelectResource(resource, target));
  });
  const selection = computed(() => resources.value.filter((resource) => state.selectedIds.includes(resource.id)));
  const focusedResource = computed(() => resources.value.find((resource) => resource.id === state.focusedId) || null);

  async function load(nodeId = state.selectedNode) {
    state.loading = true;
    state.error = '';
    state.selectedIds = [];
    state.focusedId = null;
    try {
      const data = await api.getResources(nodeId, {
        search: state.search,
        sortBy: state.sortBy,
        sortDirection: state.sortDirection,
        filters: state.filters,
      });
      state.selectedNode = nodeId;
      state.nodes = data.nodes;
      state.items = data.items;
      state.contextItems = data.contextItems || [];
      state.breadcrumb = data.breadcrumb;
      state.actions = options.mode === 'readonly' ? [] : data.actions;
      state.presentation = data.presentation || state.presentation;
      if (state.sortBy && !(state.presentation.sortFields || []).some((field) => field.id === state.sortBy)) {
        state.sortBy = '';
        state.sortDirection = '';
      }
      (state.presentation.filters || []).forEach((filter) => {
        if (state.filters[filter.id] === undefined) state.filters[filter.id] = filter.default;
      });
      state.currentResource = data.currentResource || null;
      const url = new URL(window.location.href);
      url.searchParams.set('node', nodeId);
      window.history.replaceState({}, '', url);
    } catch (error) {
      if (nodeId !== options.initialNode && [403, 404].includes(error.status)) {
        state.selectedNode = options.initialNode;
        await load(options.initialNode);
        return;
      }
      state.error = error.message;
      Joomla.renderMessages({ error: [error.message] });
    } finally {
      state.loading = false;
    }
  }

  function toggle(resource, additive = true) {
    focus(resource);
    const target = options.selectionTarget || 'both';
    if (!canSelectResource(resource, target)) return;
    const exists = state.selectedIds.includes(resource.id);
    if (!options.multiple || !additive) state.selectedIds = exists ? [] : [resource.id];
    else state.selectedIds = exists ? state.selectedIds.filter((id) => id !== resource.id) : [...state.selectedIds, resource.id];
  }

  function focus(resource) {
    if (canFocusResource(resource)) state.focusedId = resource.id;
  }

  function selectAll() {
    const bulkIds = bulkSelectableResources.value.map((resource) => resource.id);
    const allSelected = bulkIds.length > 0 && bulkIds.every((id) => state.selectedIds.includes(id));
    state.selectedIds = allSelected
      ? state.selectedIds.filter((id) => !bulkIds.includes(id))
      : [...new Set([...state.selectedIds, ...bulkIds])];
  }

  function invertSelection() {
    const visibleIds = bulkSelectableResources.value.map((resource) => resource.id);
    const selected = new Set(state.selectedIds);
    visibleIds.forEach((id) => selected.has(id) ? selected.delete(id) : selected.add(id));
    state.selectedIds = [...selected];
  }

  watch(() => [state.selectedNode, state.activeView, state.viewOptions, state.hiddenColumns, state.shownColumns, state.sortBy, state.sortDirection, state.showInfo, state.filters], () => persistence.save(state), { deep: true });

  return { state, resources, selectableResources, bulkSelectableResources, selection, focusedResource, load, focus, toggle, selectAll, invertSelection };
}
