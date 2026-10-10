import { computed, reactive, watch } from 'vue';
import { asContextualResource, asPrimaryResource, canBulkSelectResource, canFocusResource, canSelectResource } from './resourcePolicy.js';

import { compareResources as compare } from './resourceSort.js';
import { referenceKey, resourceKey } from './selectionIdentity.js';

export default function createBrowserState({ options, api, persistence, viewRegistry }) {
  const selectionContext = options.pickerContext || options.selectionHost;
  const collectionMode = Boolean(selectionContext?.collectionMode);
  const snapshot = collectionMode ? selectionContext.getCollectionSnapshot() : null;
  const preserveSelection = Boolean(collectionMode || options.selectionState || options.pickerContext && (Object.keys(options.pickerContext.selectionProfile || {}).length || options.pickerContext.initialSelection?.length));
  const adapter = options.adapter?.replace(/^flat-/, '');
  const identify = resource => collectionMode ? { ...resource, adapter, selection: { adapter, id: resource.id }, selectionKey: referenceKey({ adapter, id: resource.id }) } : resource;
  const foreignAdapter = resource => collectionMode && options.multiple && selectionContext.homogeneous && state.selectedIds.length
    && (state.selectedResources[state.selectedIds[0]]?.selection?.adapter || snapshot.items.find(entry => referenceKey(entry.selection) === state.selectedIds[0])?.selection.adapter) !== resource.selection?.adapter;
  const allowedTypes = new Set(options.allowedResourceTypes || []);
  const applySelectionConstraints = (resource) => options.mode === 'readonly' || foreignAdapter(resource) || (allowedTypes.size && !allowedTypes.has(resource.type))
    ? { ...resource, selectable: false, bulkSelectable: false }
    : resource;
  const defaults = {
    selectedNode: options.currentNode || options.initialNode || options.roots[0]?.id || '',
    activeView: options.defaultView || 'grid',
    viewOptions: { gridSize: 'md', detailsThumbnails: false, detailsDateMode: 'modified' },
    hiddenColumns: [],
    shownColumns: [],
    sortBy: options.defaultSortBy || '',
    sortDirection: options.defaultSortDirection || '',
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
    selectedIds: snapshot ? snapshot.items.map(entry => referenceKey(entry.selection)) : [],
    selectedResources: snapshot?.resources || {},
    virtualResources: snapshot?.virtualResources || {},
    search: '',
    loading: false,
    busy: false,
    error: '',
  });

  const resources = computed(() => {
    const query = state.search.trim().toLocaleLowerCase();
    const matches = (item) => !query || [item.title, item.subtitle, item.metadata?.alias]
      .some((value) => String(value || '').toLocaleLowerCase().includes(query));
    const nodes = state.nodes.map(identify).map(asPrimaryResource).map(applySelectionConstraints).filter(matches);
    const sourceItems = state.presentation.selectionScoped && options.selectionState
      ? Object.values(state.virtualResources).filter(resource => resource && (resource.selection?.adapter || resource.adapter || adapter) === adapter && resource.parentId === state.selectedNode)
      : state.items;
    const items = sourceItems.map(identify).map(asPrimaryResource).map(applySelectionConstraints).filter(matches);
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
  const selection = computed(() => preserveSelection
    ? state.selectedIds.map(id => resources.value.find(resource => resourceKey(resource) === id) || state.selectedResources[id]).filter(Boolean)
    : resources.value.filter((resource) => state.selectedIds.includes(resourceKey(resource))));
  const focusedResource = computed(() => resources.value.find((resource) => resourceKey(resource) === state.focusedId)
    || (preserveSelection ? state.selectedResources[state.focusedId] : null) || null);

  async function load(nodeId = state.selectedNode) {
    state.loading = true;
    state.error = '';
    if (!preserveSelection) state.selectedIds = [];
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
      if (data.presentation?.selectionScoped) {
        for (const item of data.items) {
          const resource = identify(item);
          state.virtualResources[resourceKey(resource)] = asPrimaryResource(resource);
        }
      }
      if (preserveSelection) {
        for (const item of [...data.nodes, ...data.items]) {
          const resource = identify(item);
          if (state.selectedIds.includes(resourceKey(resource))) state.selectedResources[resourceKey(resource)] = applySelectionConstraints(asPrimaryResource(resource));
        }
      }
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
    if (!canSelectResource(resource, target) || foreignAdapter(resource)) return;
    const key = resourceKey(resource);
    if (preserveSelection) state.selectedResources[key] = resource;
    const exists = state.selectedIds.includes(key);
    if (!options.multiple || !additive) state.selectedIds = exists ? [] : [key];
    else state.selectedIds = exists ? state.selectedIds.filter((id) => id !== key) : [...state.selectedIds, key];
  }

  function focus(resource) {
    if (canFocusResource(resource)) state.focusedId = resourceKey(resource);
  }

  function selectAll() {
    if (preserveSelection) bulkSelectableResources.value.forEach(resource => { state.selectedResources[resourceKey(resource)] = resource; });
    const bulkIds = bulkSelectableResources.value.map(resourceKey);
    if (collectionMode && !options.multiple) {
      const first = bulkIds[0];
      state.selectedIds = first && !state.selectedIds.includes(first) ? [first] : [];
      return;
    }
    const allSelected = bulkIds.length > 0 && bulkIds.every((id) => state.selectedIds.includes(id));
    state.selectedIds = allSelected
      ? state.selectedIds.filter((id) => !bulkIds.includes(id))
      : [...new Set([...state.selectedIds, ...bulkIds])];
  }

  function invertSelection() {
    if (preserveSelection) bulkSelectableResources.value.forEach(resource => { state.selectedResources[resourceKey(resource)] = resource; });
    const visibleIds = bulkSelectableResources.value.map(resourceKey);
    const selected = new Set(state.selectedIds);
    visibleIds.forEach((id) => selected.has(id) ? selected.delete(id) : selected.add(id));
    state.selectedIds = [...selected];
  }

  watch(() => [state.selectedNode, state.activeView, state.viewOptions, state.hiddenColumns, state.shownColumns, state.sortBy, state.sortDirection, state.showInfo, state.filters], () => persistence.save(state), { deep: true });

  function canAddSelection(targetAdapter, type) {
    if (!options.selectionState || options.mode === 'readonly'
      || options.selectionTarget === 'node' || allowedTypes.size && !allowedTypes.has(type)) return false;
    const first = state.selectedResources[state.selectedIds[0]]?.selection?.adapter || snapshot?.items.find(entry => referenceKey(entry.selection) === state.selectedIds[0])?.selection.adapter;
    return !(options.multiple && selectionContext?.homogeneous && first && first !== targetAdapter);
  }

  function canCreateSelectionResource(type) {
    return Boolean(options.selectionState && options.mode !== 'readonly' && options.selectionTarget !== 'node'
      && (!allowedTypes.size || allowedTypes.has(type)));
  }

  function replaceSelectionResource(resource, previous = null) {
    const targetAdapter = resource.adapter || adapter;
    const reference = { adapter: targetAdapter, id: resource.id };
    const key = collectionMode ? referenceKey(reference) : resource.id;
    const oldKey = previous ? resourceKey(previous) : null;
    if (previous && !state.selectedIds.includes(oldKey) && !state.virtualResources[oldKey]) throw new Error('COM_SMARTBROWSER_LINK_SELECTION_FULL');
    if ((state.selectedIds.includes(key) || state.virtualResources[key]) && key !== oldKey) throw new Error('COM_SMARTBROWSER_LINK_DUPLICATE');
    if (resource.uniquenessId) {
      for (const candidateKey of new Set([...state.selectedIds, ...Object.keys(state.virtualResources)])) {
        if (candidateKey === oldKey) continue;
        const candidate = state.virtualResources[candidateKey] || state.selectedResources[candidateKey];
        const candidateReference = candidate?.selection || (candidate ? { adapter: candidate.adapter || adapter, id: candidate.id }
          : snapshot?.items.find(entry => referenceKey(entry.selection) === candidateKey)?.selection);
        if (candidateReference?.adapter === targetAdapter && (candidateReference.id === resource.uniquenessId || candidateReference.id.startsWith(resource.uniquenessId + '.'))) throw new Error('COM_SMARTBROWSER_LINK_DUPLICATE');
      }
    }
    if (!previous && !canCreateSelectionResource(resource.type)) throw new Error('COM_SMARTBROWSER_LINK_SELECTION_FULL');
    const normalized = asPrimaryResource({ ...resource, adapter: targetAdapter, ...(collectionMode ? { selection: reference, selectionKey: key } : {}) });
    state.selectedResources[key] = normalized;
    state.virtualResources[key] = normalized;
    state.selectedIds = previous ? state.selectedIds.map(id => id === oldKey ? key : id)
      : !canAddSelection(targetAdapter, resource.type) ? state.selectedIds : options.multiple ? [...state.selectedIds, key] : [key];
    if (oldKey && oldKey !== key) { delete state.selectedResources[oldKey]; delete state.virtualResources[oldKey]; }
    state.focusedId = key;
    return normalized;
  }

  function deleteVirtualResources(resources) {
    for (const resource of resources) {
      const key = resourceKey(resource);
      if (!state.virtualResources[key]) continue;
      state.selectedIds = state.selectedIds.filter(id => id !== key);
      delete state.selectedResources[key];
      delete state.virtualResources[key];
      if (state.focusedId === key) state.focusedId = null;
    }
  }

  if (api.options && options.selectionState) api.options.selectionItems = () => [...new Set([...state.selectedIds, ...Object.keys(state.virtualResources)])].map(key => {
    const resource = state.virtualResources[key] || state.selectedResources[key];
    return resource ? { selection: resource.selection || { adapter: resource.adapter || adapter, id: resource.id }, usage: {} }
      : snapshot?.items.find(entry => referenceKey(entry.selection) === key);
  }).filter(Boolean);

  return { state, resources, selectableResources, bulkSelectableResources, selection, focusedResource, load, focus, toggle, selectAll, invertSelection, canAddSelection, canCreateSelectionResource, replaceSelectionResource, deleteVirtualResources };
}
