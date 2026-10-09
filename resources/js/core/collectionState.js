import { computed, effectScope, reactive } from 'vue';
import createBrowserState from './createBrowserState.js';
import { createViewRegistry } from './viewRegistry.js';
import { collectionEntries, referenceKey, resourceKey } from './selectionIdentity.js';

export const collectionIdentifiers = items => {
  if (!Array.isArray(items)) throw new TypeError('Collection items must be an array.');
  const ids = items.map(item => item && typeof item === 'object' ? item.id : item);
  if (ids.some(id => !['string', 'number'].includes(typeof id) || String(id) === '')) throw new TypeError('Invalid collection identifier.');
  return [...new Set(ids.map(String))];
};

export function createCollectionState({ config, api, notify, translate }) {
  const referenceItems = config.referenceItems === true || !config.adapter || (config.items || []).some(item => item?.selection || item?.adapter);
  const normalize = next => referenceItems ? collectionEntries(next, config) : collectionIdentifiers(next);
  const itemKey = item => referenceItems ? referenceKey(item.selection) : item;
  const copyItems = () => referenceItems ? JSON.parse(JSON.stringify(items)) : [...items];
  const scope = effectScope();
  const options = reactive({ ...config, roots: [], actions: [], multiple: true, selectionTarget: 'both', mode: config.readOnly ? 'readonly' : 'manage', defaultView: config.layout === 'compact' ? 'details' : config.layout || 'grid' });
  const browser = scope.run(() => createBrowserState({ options, api, persistence: { load: defaults => defaults, save() {} }, viewRegistry: createViewRegistry().register({ id: 'grid', component: {} }).register({ id: 'details', component: {} }) }));
  const { state } = browser;
  let items = normalize(config.items || []), generation = 0, destroyed = false;
  const editable = !config.readOnly;
  const canRemove = editable && config.allowRemove !== false;
  const canOrder = editable && config.allowOrdering !== false;
  const renderResources = resources => resources.map(resource => ({ ...resource,
    selectable: editable && (canRemove || canOrder), bulkSelectable: editable && (canRemove || canOrder), focusable: editable,
    actionable: editable, navigable: false, activatable: false, interactiveOverlays: editable && config.contextActions === true,
    capabilities: { ...resource.capabilities, collectionRemove: canRemove },
  }));
  const emit = reason => notify({ adapter: config.adapter, mode: 'collection', items: copyItems(), resources: [...state.items], reason });
  async function refresh() {
    if (destroyed) return;
    const request = ++generation;
    state.loading = true; state.error = '';
    try {
      const result = await api.collection(items, referenceItems ? { referenceItems: true, homogeneous: config.homogeneous === true } : undefined);
      if (destroyed || request !== generation) return;
      const currentUsage = new Map(referenceItems ? items.map(item => [itemKey(item), item.usage]) : []);
      items = referenceItems ? normalize(result.items).map(item => ({ ...item, usage: currentUsage.get(itemKey(item)) || item.usage })) : [...result.identifiers];
      state.items = renderResources(result.resources);
      state.actions = [...(result.actions || []), ...state.items.flatMap(resource => resource.collectionActions || [])].filter((action, index, all) => all.findIndex(candidate => candidate.id === action.id) === index && action.requiresSelection && !action.currentNode && !['reorder', 'removeFromGroup', 'batch', 'activate', 'select'].includes(action.id));
      state.presentation = result.presentation || {};
      options.visualSettings = result.visualSettings;
      options.imageBackground = result.imageBackground;
      state.selectedIds = state.selectedIds.filter(id => items.some(item => itemKey(item) === id));
    } catch (error) {
      if (!destroyed && request === generation) { state.error = error.message; throw error; }
    } finally { if (!destroyed && request === generation) state.loading = false; }
  }
  async function setItems(next) {
    if (destroyed) throw new Error('Collection is destroyed.');
    const normalized = normalize(next);
    const sameReferences = referenceItems && normalized.length === items.length && normalized.every((item, index) => itemKey(item) === itemKey(items[index]));
    items = normalized;
    if (sameReferences && state.items.length === items.length && !state.error) return;
    state.selectedIds = []; state.items = []; state.sortBy = 'collectionOrder'; state.sortDirection = 'asc';
    await refresh();
  }
  function remove(ids) {
    if (!canRemove || destroyed || state.loading || state.busy) return;
    ++generation;
    const selected = new Set(ids);
    const next = items.filter(item => !selected.has(itemKey(item)));
    if (next.length === items.length) return;
    items = next;
    state.items = state.items.filter(resource => !selected.has(resourceKey(resource)));
    state.selectedIds = state.selectedIds.filter(id => !selected.has(id));
    emit('remove');
  }
  async function move(direction) {
    if (!canOrder || destroyed || state.busy || state.loading || !state.selectedIds.length || !['up', 'down'].includes(direction) || (state.sortBy && state.sortBy !== 'collectionOrder')) return;
    const request = ++generation;
    state.busy = true;
    try {
      const canonicalDirection = state.sortDirection === 'desc' ? (direction === 'up' ? 'down' : 'up') : direction;
      const result = await api.collection(items, { ...(referenceItems ? { referenceItems: true, homogeneous: config.homogeneous === true } : {}), operation: 'reorder', selection: [...state.selectedIds], direction: canonicalDirection });
      if (destroyed || request !== generation) return;
      items = normalize(result.items);
      const byId = new Map(state.items.map(resource => [resourceKey(resource), resource]));
      state.items = items.map(item => byId.get(itemKey(item))).filter(Boolean);
      emit('reorder');
    } catch (error) { if (!destroyed && request === generation) state.error = error.message; }
    finally { if (!destroyed) state.busy = false; }
  }
  const resources = scope.run(() => computed(() => {
    if (state.sortBy === 'collectionOrder') return state.sortDirection === 'desc' ? [...state.items].reverse() : state.items;
    return browser.resources.value;
  }));
  return { options, browser, resources, canRemove, canOrder, refresh, setItems, remove, move,
    getItems: copyItems,
    async addItems(next) { const combined = normalize([...items, ...next]); await setItems(combined); emit('add'); },
    destroy() { destroyed = true; generation++; api.destroy?.(); scope.stop(); },
  };
}
