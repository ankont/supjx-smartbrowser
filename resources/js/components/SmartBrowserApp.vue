<template>
  <div class="smartbrowser-shell" :style="gridWidthStyle">
    <div v-if="state.busy" class="smartbrowser-busy" role="status" aria-live="polite">
      <span class="spinner-border" aria-hidden="true" />
      <span>{{ t('COM_SMARTBROWSER_WORKING') }}</span>
    </div>
    <ResourceActions
      :actions="state.actions"
      :available="action => actionAvailable(action, selection)"
      :selection="selection"
      :batch-available="options.mode === 'manage'"
      :flat-available="flatAvailable"
      :flat-active="flatActive"
      :filters-open="filtersOpen"
      :filters="state.presentation.filters"
      :filter-values="state.filters"
      :manager-url="options.managerUrl"
      :manager-new-tab="options.application === 'site'"
      :dashboard-url="options.dashboardUrl"
      :integrated="options.integrated"
      :selection-mode="options.mode === 'select'"
      :allow-no-user="options.allowNoUser"
      :can-complete="selection.length > 0 && !usageValidating"
      :t="t"
      @action="executeAction($event, selection)"
      @batch="batchDialog?.open()"
      @toggle-flat="toggleFlat"
      @toggle-filters="toggleFilters"
      @filter="applyFilter"
      @clear-filters="clearFilters"
      @complete="completeSelection(selection)"
      @no-user="completeSelection([{ id: 'user:0', type: 'user', title: '' }])"
    >
      <template #display-controls>
        <button v-if="pickerContext?.toggleSize" type="button" class="resource-icon-button resource-display-toggle" :class="{ active: pickerMaximized }" :aria-pressed="pickerMaximized" :title="t(pickerMaximized ? 'COM_SMARTBROWSER_EDITOR_RESTORE' : 'COM_SMARTBROWSER_EDITOR_MAXIMIZE')" :aria-label="t(pickerMaximized ? 'COM_SMARTBROWSER_EDITOR_RESTORE' : 'COM_SMARTBROWSER_EDITOR_MAXIMIZE')" @click="pickerMaximized = pickerContext.toggleSize()">
          <span :class="pickerMaximized ? 'fas fa-compress' : 'fas fa-expand'" aria-hidden="true" />
        </button>
        <button v-if="displayEnabled" type="button" class="resource-icon-button resource-display-toggle" :class="{ active: displayMode !== 'normal' }" :aria-pressed="displayMode !== 'normal'" :title="t(displayLabel)" :aria-label="t(displayLabel)" @click="cycleDisplay">
          <span :class="displayMode === 'normal' ? 'fas fa-arrows-alt-h' : displayMode === 'wide' ? 'fas fa-expand' : 'fas fa-compress'" aria-hidden="true" />
        </button>
      </template>
    </ResourceActions>
    <details v-if="collectionMode" class="resource-picker-collection">
      <summary><span class="fas fa-chevron-right resource-picker-collection-chevron" aria-hidden="true" />{{ t('COM_SMARTBROWSER_COLLECTION_TITLE') }}: <span>{{ state.selectedIds.length }}</span></summary>
      <CollectionView v-if="pickerCollection" :model="pickerCollection" :api="api" :config="pickerCollectionConfig" :t="t" />
    </details>
    <ResourceBatchDialog ref="batchDialog" :selection="selection" :adapter="options.adapter" :filters="state.presentation.filters" :batch-options="state.presentation.batchOptions" :t="t" @apply="applyBatch" />
    <div class="smartbrowser-layout" :class="{ 'flat-mode': flatActive && !collectionMode, 'tree-collapsed': treeCollapsed }">
      <ResourceTree v-if="(!flatActive || collectionMode) && !treeCollapsed" :adapters="pickerContext?.allowedAdapters?.length ? (options.adapters || []).filter(adapter => pickerContext.allowedAdapters.includes(adapter.id.replace(/^flat-/, ''))) : options.adapters" :active-adapter="options.adapter" :roots="state.roots" :nodes="flatActive ? [] : state.nodes" :breadcrumb="state.breadcrumb" :selected-node="state.selectedNode" :t="t" @open="load" @adapter="switchAdapter" />
      <button v-if="!flatActive || collectionMode" type="button" class="resource-sidebar-handle" :title="t(treeCollapsed ? 'COM_SMARTBROWSER_SHOW_TREE' : 'COM_SMARTBROWSER_HIDE_TREE')" :aria-label="t(treeCollapsed ? 'COM_SMARTBROWSER_SHOW_TREE' : 'COM_SMARTBROWSER_HIDE_TREE')" :aria-expanded="!treeCollapsed" @click="treeCollapsed = !treeCollapsed">
        <span :class="treeCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'" aria-hidden="true" />
      </button>
      <main class="resource-main">
        <ResourceToolbar
          :breadcrumb="state.breadcrumb"
          :root="state.roots[0]"
          :root-icon="openNodeIcon"
          :icon-only-root="!flatActive && state.breadcrumb.length > 1"
          :search="state.search"
          :sort-by="state.sortBy"
          :sort-direction="state.sortDirection"
          :sort-fields="state.presentation.sortFields"
          :ordering-field="state.presentation.orderingField"
          :views="views"
          :active-view="state.activeView"
          :grid-size="state.viewOptions.gridSize"
          :details-thumbnails="state.viewOptions.detailsThumbnails"
          :details-date-mode="state.viewOptions.detailsDateMode"
          :columns="availableColumns"
          :hidden-columns="state.hiddenColumns"
          :shown-columns="state.shownColumns"
          :show-info="showInfo"
          :multiple="options.multiple"
          :can-invert="options.multiple && bulkSelectableResources.length > 0"
          :reorder-visible="reorderVisible"
          :reorder-enabled="reorderEnabled"
          :t="t"
          @open="openNode"
          @invert-selection="invertSelection"
          @reorder="moveSelection"
          @search="state.search = $event"
          @sort-by="setSortBy"
          @sort-direction-value="state.sortDirection = $event"
          @resize="resize"
          @toggle-thumbnails="state.viewOptions.detailsThumbnails = !state.viewOptions.detailsThumbnails"
          @toggle-date-field="toggleDateField"
          @toggle-column="toggleColumn"
          @view="state.activeView = $event"
          @info="toggleInfo"
        />
        <div
          class="resource-browser"
          :class="{ loading: state.loading, 'is-dragging': dragging, 'info-open': showInfo, 'usage-open': forceUsageInfo }"
          @dragenter.prevent="dragging = isMedia"
          @dragover.prevent
          @dragleave.self="dragging = false"
          @drop.prevent="drop"
        >
          <div v-if="state.loading" class="resource-loader"><span class="spinner-border" aria-hidden="true" /></div>
          <div v-else-if="!resources.length" class="resource-empty">
            <span :class="state.search ? 'fas fa-search' : isMedia ? 'fas fa-cloud-upload-alt' : adapterIcon" aria-hidden="true" />
            <p>{{ state.search ? t('COM_SMARTBROWSER_NO_RESULTS') : isMedia ? t('COM_SMARTBROWSER_DROP_UPLOAD') : t('COM_SMARTBROWSER_EMPTY_STATE') }}</p>
          </div>
          <component
            :is="activeView.component"
            v-else
            :resources="resources"
            :selected-ids="state.selectedIds"
            :focused-id="state.focusedId"
            :all-selected="bulkSelectableResources.length > 0 && bulkSelectableResources.every((resource) => state.selectedIds.includes(resourceKey(resource)))"
            :options="state.viewOptions"
            :actions="state.actions"
            :action-available="itemActionAvailable"
            :default-action="resourceDefault"
            :preview-action="resourcePreview"
            :modified-action="resourceModified"
            :sort-by="state.sortBy"
            :sort-direction="state.sortDirection"
            :sort-fields="state.presentation.sortFields"
            :ordering-field="state.presentation.orderingField"
            :columns="visibleColumns"
            :grid-fields="state.presentation.gridFields"
            :t="t"
            @select="toggle"
            @focus="focus"
            @select-all="selectAll"
            @open="load"
            @activate="activate"
            @action="runItemAction"
            @sort="sortFromTable"
          />
          <div v-if="isMedia && dragging" class="resource-drop-overlay"><span class="fas fa-cloud-upload-alt" />{{ t('COM_SMARTBROWSER_DROP_UPLOAD') }}</div>
          <ResourceInfoPanel v-if="showInfo" :resource="focusedResource" :fields="focusedResource?.collectionPresentation?.infoFields || state.presentation.infoFields" :t="t"
            :usage-definitions="usageDefinitions" :usage-values="usageValues" :usage-errors="usageErrors[resourceKey(focusedResource)] || {}"
            :usage-editors="pickerContext?.editors" :resolve-reference="resolveUsageReference" :usage-revision="usageRevision"
            :preview-actions="previewActions" :preview-context="previewContext" :can-preview="Boolean(resourcePreview(focusedResource)) && driverFor(focusedResource).canPreview(focusedResource) && !state.busy" @preview="runItemAction(resourcePreview(focusedResource), focusedResource)" @usage-change="setUsage" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { createDisplayMode } from '../core/displayMode.js';
import ResourceActions from './ResourceActions.vue';
import ResourceBatchDialog from './ResourceBatchDialog.vue';
import ResourceInfoPanel from './ResourceInfoPanel.vue';
import ResourceToolbar from './ResourceToolbar.vue';
import ResourceTree from './ResourceTree.vue';
import { flatRootUrl, flatUiStorageKey, flatViewUrl, regularViewUrl } from '../core/flatViewNavigation.js';
import { columnCatalog } from '../core/columnCatalog.js';
import { defaultResourceAction, resourcePreviewAction, modifiedResourceAction } from '../core/defaultResourceAction.js';
import { createSelectionUsage } from '../core/selectionUsage.js';
import { referenceKey, resourceKey, resourceReference } from '../core/selectionIdentity.js';
import CollectionView from './CollectionView.vue';
import { createCollectionState } from '../core/collectionState.js';
import ResourceApi from '../services/ResourceApi.js';
import MediaActionDriver from '../adapters/MediaActionDriver.js';
import { asPrimaryResource, canSelectResource } from '../core/resourcePolicy.js';

const browser = inject('browser');
const options = inject('smartBrowserOptions');
const displayEnabled = options.application === 'site' && window.self === window.top;
const displayMode = ref('normal');
let displayController;
const displayLabel = computed(() => ({ normal: 'COM_SMARTBROWSER_DISPLAY_WIDE', wide: 'COM_SMARTBROWSER_DISPLAY_FOCUS', focus: 'COM_SMARTBROWSER_DISPLAY_NORMAL' })[displayMode.value]);
const cycleDisplay = () => { displayMode.value = displayController.cycle(); };
onMounted(() => {
  if (displayEnabled) displayController = createDisplayMode(document.getElementById('smartbrowser-app'), mode => { displayMode.value = mode; });
});
onBeforeUnmount(() => displayController?.destroy());
const driver = inject('actionDriver');
const api = inject('resourceApi');
const registry = inject('viewRegistry');
const { state, resources, bulkSelectableResources, selection, focusedResource, load, focus, toggle, selectAll, invertSelection } = browser;
const pickerContext = options.mode === 'select' ? options.pickerContext : null;
const collectionMode = Boolean(pickerContext?.collectionMode);
const t = (key) => Joomla.Text?._(key, key) || key;
const itemDrivers = new Map();
const driverFor = resource => {
  const adapter = resource?.selection?.adapter || resource?.adapter;
  if (!adapter || adapter === options.adapter.replace(/^flat-/, '')) return driver;
  if (!itemDrivers.has(adapter)) {
    const scopedApi = new ResourceApi({ ...options, adapter, browseRoot: null, flatScope: null });
    itemDrivers.set(adapter, { api: scopedApi, driver: new MediaActionDriver(scopedApi, state, async () => {
      await pickerCollection?.refresh();
      for (const resource of pickerCollection?.browser.state.items || []) state.selectedResources[resourceKey(resource)] = asPrimaryResource(resource);
      await load();
    }, t, options.editorMode, options.application) });
  }
  return itemDrivers.get(adapter).driver;
};
const actionsFor = resource => resource?.collectionActions || state.actions;
const scopedAction = (action, resource) => actionsFor(resource).find(candidate => candidate.id === action.id) || action;
const actionAvailable = (action, targets) => {
  if (!collectionMode || action.currentNode || !targets.length) return driver.available(action, targets);
  if (action.single && targets.length !== 1) return false;
  const available = resource => (!resource.collectionActions || resource.collectionActions.some(candidate => candidate.id === action.id)) && driverFor(resource).available(scopedAction(action, resource), [resource]);
  return action.exclusiveGroup ? targets.some(available) : targets.every(available);
};
const executeAction = async (action, targets) => {
  if (!actionAvailable(action, targets)) return;
  if (!collectionMode || action.currentNode || !targets.length) return driver.execute(action, targets);
  const groups = new Map();
  for (const resource of targets) {
    const scopedDriver = driverFor(resource);
    if (!groups.has(scopedDriver)) groups.set(scopedDriver, []);
    groups.get(scopedDriver).push(resource);
  }
  for (const [scopedDriver, resources] of groups) await scopedDriver.execute(scopedAction(action, resources[0]), resources);
};
onBeforeUnmount(() => itemDrivers.forEach(({ api, driver }) => { driver.destroy(); api.destroy(); }));
let pickerCollection, updatingProjection = false;
const pickerCollectionConfig = { referenceItems: true, homogeneous: pickerContext?.homogeneous === true, readOnly: false, showCount: false,
  items: pickerContext?.getCollectionSnapshot?.().items || [], layout: 'compact', allowRemove: true, allowOrdering: options.multiple && pickerContext?.allowOrdering !== false,
  contextActions: false, resourceActions: [{ id: 'selectionFocus', label: 'COM_SMARTBROWSER_USAGE_OPTIONS', icon: 'fas fa-pen', requiresSelection: true }],
  defaultResourceActionId: 'selectionFocus', apiBaseUrl: options.apiBaseUrl, csrfToken: options.csrfToken, application: options.application,
  onResourceAction: (_action, resource) => { state.selectedResources[resourceKey(resource)] = resource; state.focusedId = resourceKey(resource); },
};
const referenceApis = new Map();
async function resolveUsageReference(reference, constraint = {}) {
  const key = JSON.stringify([reference.adapter, constraint.browseRoot || '']);
  if (!referenceApis.has(key)) referenceApis.set(key, new ResourceApi({ ...options, adapter: reference.adapter, mode: 'select', browseRoot: constraint.browseRoot || null, flatScope: null }));
  const result = await referenceApis.get(key).collection([reference.id]);
  return result.resources[0];
}
const usage = createSelectionUsage({ profile: pickerContext?.selectionProfile || {}, initialUsage: pickerContext?.initialUsage || {}, editors: pickerContext?.editors || {}, resolveReference: resolveUsageReference });
const collectionItems = () => state.selectedIds.flatMap(key => {
  const resource = selection.value.find(resource => resourceKey(resource) === key);
  if (resource) return [{ selection: resourceReference(resource, options.adapter.replace(/^flat-/, '')), usage: usage.get(resource) }];
  const retained = pickerContext?.getCollectionSnapshot?.().items.find(entry => referenceKey(entry.selection) === key);
  return retained ? [retained] : [];
});
const commitCollection = () => { if (collectionMode) pickerContext.commitCollection({ items: collectionItems(), resources: Object.fromEntries(selection.value.map(resource => [resourceKey(resource), resource])) }); };
watch(() => [state.selectedIds, state.selectedResources], commitCollection, { deep: true, flush: 'sync' });
onBeforeUnmount(commitCollection);
const usageVersion = ref(0);
if (collectionMode) {
  pickerCollection = createCollectionState({ config: pickerCollectionConfig, api, translate: t, notify: detail => {
    updatingProjection = true;
    state.selectedResources = Object.fromEntries(detail.resources.map(resource => [resourceKey(resource), asPrimaryResource(resource)]));
    state.selectedIds = detail.items.map(entry => referenceKey(entry.selection));
    updatingProjection = false;
  } });
  pickerCollection.refresh().catch(error => Joomla.renderMessages({ error: [error.message] }));
  watch(() => [state.selectedIds, usageVersion.value], () => {
    if (!updatingProjection) pickerCollection.setItems(collectionItems()).catch(error => Joomla.renderMessages({ error: [error.message] }));
  }, { deep: true, flush: 'sync' });
  onBeforeUnmount(() => pickerCollection.destroy());
}
const pickerMaximized = ref(pickerContext?.isMaximized?.() || false);
const usageRevision = ref(0);
const usageErrors = ref({});
const usageValidating = ref(false);
const usageDefinitions = computed(() => usage.definitions(focusedResource.value).filter(definition => definition.presentation !== 'hidden'));
const usageValues = computed(() => { usageVersion.value; return usage.get(focusedResource.value); });
const forceUsageInfo = computed(() => Boolean(pickerContext && usageDefinitions.value.length));
const hasUsageProfile = Boolean(pickerContext && Object.keys(pickerContext.selectionProfile || {}).length);
const pickerInfoOpen = ref(state.showInfo);
const showInfo = computed(() => forceUsageInfo.value || (hasUsageProfile ? pickerInfoOpen.value : state.showInfo));
const toggleInfo = () => {
  if (forceUsageInfo.value) return;
  if (hasUsageProfile) pickerInfoOpen.value = !pickerInfoOpen.value;
  else state.showInfo = !state.showInfo;
};
const setResourceUsage = (resource, key, value) => {
  if (!resource || unmounted) return;
  usage.set(resource, key, value);
  usageErrors.value = { ...usageErrors.value, [resourceKey(resource)]: {} };
  usageVersion.value++;
  commitCollection();
};
const setUsage = (key, value) => setResourceUsage(focusedResource.value, key, value);
const previewContext = computed(() => {
  const resource = focusedResource.value;
  return { resource, profile: pickerContext?.selectionProfile || {}, values: usageValues.value,
    getValues: () => usage.get(resource), setValue: (key, value) => setResourceUsage(resource, key, value),
    refresh: () => load(), selectResource: config => window.SmartBrowserPicker.open(config) };
});
const previewActions = computed(() => (pickerContext?.previewActions || []).filter(action => {
  try { return focusedResource.value && (!action.applies || action.applies(previewContext.value)); } catch { return false; }
}));
let unmounted = false;
onBeforeUnmount(() => { unmounted = true; referenceApis.forEach(api => api.destroy()); });
const views = registry.all();
const activeView = computed(() => registry.get(state.activeView));
const availableColumns = computed(() => columnCatalog(state.presentation, options.adapter));
const visibleColumns = computed(() => availableColumns.value.filter((column) =>
  column.id === 'title' || column.id === 'name' || (column.defaultVisible
    ? !state.hiddenColumns.includes(column.id)
    : state.shownColumns.includes(column.id))));
const toggleColumn = (id) => {
  const column = availableColumns.value.find((entry) => entry.id === id);
  if (!column || ['title', 'name'].includes(id)) return;
  const key = column.defaultVisible ? 'hiddenColumns' : 'shownColumns';
  state[key] = state[key].includes(id) ? state[key].filter((entry) => entry !== id) : [...state[key], id];
};
const dragging = ref(false);
const treeCollapsed = ref(false);
const batchDialog = ref(null);
const isMedia = computed(() => options.adapter === 'media');
const reorderVisible = computed(() => options.mode === 'manage' && ['details', 'grid'].includes(state.activeView)
  && state.presentation.orderingField && state.sortBy === state.presentation.orderingField
  && ['asc', 'desc'].includes(state.sortDirection)
  && (options.adapter === 'featured-articles' || String(state.filters.featured ?? '') !== '1'));
const reorderEnabled = computed(() => reorderVisible.value && !state.busy && selection.value.length > 0
  && selection.value.every((resource) => resource.capabilities?.reorder === true));
const moveSelection = async (direction) => {
  if (!reorderEnabled.value || !['up', 'down'].includes(direction)) return;
  const ids = selection.value.map((resource) => resource.id);
  const focusedId = state.focusedId;
  state.busy = true;
  try {
    const canonicalDirection = state.sortDirection === 'desc' ? (direction === 'up' ? 'down' : 'up') : direction;
    const result = await api.execute('reorder', ids, { direction: canonicalDirection });
    if (result.updated?.length) {
      await load();
      state.selectedIds = ids.filter((id) => resources.value.some((resource) => resource.id === id));
      state.focusedId = state.selectedIds.includes(focusedId) ? focusedId : state.selectedIds[0] || null;
    }
  } catch (error) {
    Joomla.renderMessages({ error: [error.message] });
  } finally {
    state.busy = false;
  }
};
const flatAvailable = options.adapter !== 'featured-articles' && ['articles', 'categories', 'tags', 'articles-by-tag', 'menus', 'users', 'media'].includes(options.adapter.replace(/^flat-/, ''));
const flatActive = options.adapter.startsWith('flat-') || options.adapter === 'featured-articles';
const gridWidthStyle = Object.fromEntries(
  Object.entries(options.gridWidths || {}).map(([size, width]) => [`--sb-grid-${size}`, `${width}px`]),
);
const uiKey = flatUiStorageKey(options.adapter, options.browseRoot, window.location.href);
let storedUi = (() => { try { return JSON.parse(window.sessionStorage.getItem(uiKey) || '{}'); } catch { return {}; } })();
const filtersOpen = ref(storedUi.filtersOpen === true);
const saveUi = (values) => {
  storedUi = { ...storedUi, filtersOpen: filtersOpen.value, ...values };
  window.sessionStorage.setItem(uiKey, JSON.stringify(storedUi));
};
const toggleFilters = () => { filtersOpen.value = !filtersOpen.value; saveUi({ filtersOpen: filtersOpen.value }); };
const toggleFlat = () => {
  saveUi({ flat: !flatActive });
  window.location.assign(flatActive
    ? regularViewUrl(window.location.href, options.browseRoot)
    : flatViewUrl(window.location.href, options.adapter, state.selectedNode, options.browseRoot));
};
const adapterIcon = computed(() => options.adapters?.find((adapter) => adapter.id === options.adapter)?.icon || 'fas fa-list');
const openNodeIcon = computed(() => options.adapters?.find(adapter => adapter.id === options.adapter)?.nodeOpenIcon || ({ media: 'fas fa-folder-open', articles: 'fas fa-box-open', 'flat-articles': 'fas fa-box-open', categories: 'fas fa-box-open', tags: 'fas fa-tags', 'articles-by-tag': 'fas fa-tags', users: 'fas fa-users-viewfinder', menus: 'fas fa-diagram-successor', 'featured-articles': 'fas fa-star' })[options.adapter] || 'fas fa-folder-open');
const sizes = ['sm', 'md', 'lg', 'xl'];
const applyBatch = async ({ selection: ids, payload, resolve, reject }) => {
  try {
    const result = await api.execute('batch', ids, payload);
    if (result.download) {
      const binary = atob(result.download.content);
      const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([bytes], { type: 'application/zip' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = result.download.name;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    }
    await load();
    resolve(result);
  } catch (error) { reject(error); }
};
const completeSelection = async (selected) => {
  if (usageValidating.value || !selected.length) return;
  usageValidating.value = true;
  const version = usageVersion.value;
  let result;
  try { result = await usage.validate(selected); }
  finally { usageValidating.value = false; }
  if (unmounted || version !== usageVersion.value) return;
  usageErrors.value = result.errors;
  if (!result.valid) {
    if (Object.keys(result.profileErrors).length) {
      Joomla.renderMessages({ error: [t('COM_SMARTBROWSER_USAGE_PROFILE_INVALID')] });
    }
    const editableError = Object.keys(result.errors).find(id => Object.keys(result.errors[id]).some(key => !result.profileErrors[id]?.[key]));
    if (editableError) { state.focusedId = editableError; usageRevision.value++; }
    return;
  }
  const detail = { adapter: options.adapter.replace(/^flat-/, ''), mode: options.mode, resources: [...selected] };
  if (collectionMode) detail.collectionItems = selected.map(resource => ({ selection: resourceReference(resource, options.adapter.replace(/^flat-/, '')), usage: result.usage[resourceKey(resource)] || {} }));
  if (pickerContext) { detail.pickerInstance = options.pickerInstance; detail.usage = result.usage; }
  document.dispatchEvent(new CustomEvent('smartbrowser:select', { detail }));
  if (window.parent !== window) window.parent.document.dispatchEvent(new CustomEvent('smartbrowser:select', { detail }));
};

const resize = (step) => {
  const current = sizes.indexOf(state.viewOptions.gridSize);
  state.viewOptions.gridSize = sizes[Math.max(0, Math.min(sizes.length - 1, current + step))];
};
const resourceDefault = resource => defaultResourceAction(resource, options.mode, actionsFor(resource), actionAvailable, options.selectionTarget || 'both');
const resourcePreview = resource => resourcePreviewAction(resource, options.mode, actionsFor(resource), actionAvailable);
const resourceModified = resource => modifiedResourceAction(resource, options.mode, actionsFor(resource), actionAvailable, options.selectionTarget || 'both');
const itemActionAvailable = (action, target) => !state.busy && (action.local ? target.every(resource => resourceDefault(resource)?.id === action.id || resourceModified(resource)?.id === action.id) : actionAvailable(action, target));
const activate = resource => { const action = resourceDefault(resource); if (action) runItemAction(action, resource); };
const runItemAction = (action, resource) => {
  if (!action || !resource) return;
  if (!itemActionAvailable(action, [resource])) return;
  if (action.id === 'browseOpen') return load(resource.id);
  if (action.id === 'pickerSelect') {
    if (!collectionMode) return completeSelection([resource]);
    if (!state.selectedIds.includes(resourceKey(resource))) toggle(resource, true);
    return completeSelection(selection.value);
  }
  return executeAction(action, [resource]);
};
const switchAdapter = (adapter) => {
  if (pickerContext?.allowedAdapters?.length && !pickerContext.allowedAdapters.includes(adapter.replace(/^flat-/, ''))) return;
  if (adapter === options.adapter) return;
  commitCollection();
  const url = new URL(window.location.href);
  url.searchParams.set('adapter', adapter);
  url.searchParams.delete('node');
  url.searchParams.delete('browseRoot');
  if (pickerContext?.initialBrowseRoot && adapter.replace(/^flat-/, '') === pickerContext.initialAdapter.replace(/^flat-/, '')) url.searchParams.set('browseRoot', pickerContext.initialBrowseRoot);
  url.searchParams.delete('initialResource');
  url.searchParams.delete('flatScope');
  window.location.href = url.toString();
};
const applyFilter = async ({ id, value }) => {
  state.filters[id] = value;
  if (id === 'menu' && value && !options.browseRoot && options.adapter === 'menus') {
    await load(`menu:${value}`);
    return;
  }
  if (id === 'menu' && value && !options.browseRoot && options.adapter === 'flat-menus') {
    const url = new URL(window.location.href);
    url.searchParams.set('flatScope', `menu:${value}`);
    url.searchParams.set('flatFromNode', `menu:${value}`);
    window.location.assign(url.toString());
    return;
  }
  await load(state.selectedNode);
};
const clearFilters = async () => {
  (state.presentation.filters || []).forEach((filter) => { state.filters[filter.id] = filter.default ?? ''; });
  await load(state.selectedNode);
};
const openNode = async (nodeId) => {
  if (flatActive && nodeId === state.selectedNode && nodeId === state.roots[0]?.id) {
    state.search = '';
    state.sortBy = options.defaultSortBy || '';
    state.sortDirection = options.defaultSortDirection || '';
    const rootUrl = flatRootUrl(window.location.href, options.flatRootNode);
    if (rootUrl !== window.location.href) {
      (state.presentation.filters || []).forEach((filter) => { state.filters[filter.id] = filter.default ?? ''; });
      await nextTick();
      window.location.assign(rootUrl);
      return;
    }
    await clearFilters();
    return;
  }
  await load(nodeId);
};
const sortFromTable = (field) => {
  if (state.sortBy !== field) {
    state.sortBy = field;
    state.sortDirection = 'asc';
  } else if (state.sortDirection === 'asc') {
    state.sortDirection = 'desc';
  } else {
    state.sortBy = '';
    state.sortDirection = '';
  }
};
const setSortBy = (field) => {
  state.sortBy = field;
  state.sortDirection = field ? (state.sortDirection || 'asc') : '';
};
const toggleDateField = () => {
  const modes = ['modified', 'created', 'both'];
  const current = modes.indexOf(state.viewOptions.detailsDateMode);
  state.viewOptions.detailsDateMode = modes[(current + 1) % modes.length];
};
const drop = async (event) => {
  dragging.value = false;
  if (!isMedia.value) return;
  await driver.uploadFiles(event.dataTransfer?.files);
};

onMounted(() => {
  if (flatActive) saveUi({ flat: true });
  if (!flatActive && flatAvailable && storedUi.flat === true) {
    window.location.replace(flatViewUrl(window.location.href, options.adapter, state.selectedNode, options.browseRoot));
    return;
  }
  load(state.selectedNode).then(async () => {
    if (collectionMode) {
      const snapshot = pickerContext.getCollectionSnapshot();
      try {
        const result = await api.collection(snapshot.items, { referenceItems: true, homogeneous: pickerContext.homogeneous });
        if (unmounted) return;
        state.selectedResources = Object.fromEntries(result.resources.map(resource => [resourceKey(resource), asPrimaryResource(resource)]));
        state.selectedIds = result.items.map(entry => referenceKey(entry.selection));
        state.focusedId = state.selectedIds.find(key => resources.value.some(resource => resourceKey(resource) === key)) || state.selectedIds[0] || null;
      } catch (error) { if (!unmounted) Joomla.renderMessages({ error: [error.message] }); }
    }
    if (!collectionMode && pickerContext?.initialSelection?.length && (!pickerContext.initialAdapter || pickerContext.initialAdapter.replace(/^flat-/, '') === options.adapter.replace(/^flat-/, ''))) {
      const ids = pickerContext.initialSelection.map(item => item && typeof item === 'object' ? item.id : item);
      try {
        const result = await api.collection(options.multiple ? ids : ids.slice(0, 1));
        if (unmounted) return;
        const allowed = new Set(options.allowedResourceTypes || []);
        const initial = result.resources.filter(resource => !resource.unavailable && canSelectResource(resource, options.selectionTarget)
          && (!allowed.size || allowed.has(resource.type)));
        state.selectedIds = initial.map(resource => resource.id);
        state.selectedResources = Object.fromEntries(initial.map(resource => [resource.id, resource]));
        state.focusedId = state.selectedIds[0] || null;
      } catch (error) { if (!unmounted) Joomla.renderMessages({ error: [error.message] }); }
    }
    if (options.adapter === 'media' && options.initialResource && resources.value.some((resource) => resource.id === options.initialResource)) {
      state.focusedId = resourceKey(resources.value.find(resource => resource.id === options.initialResource));
    }
  });
});
</script>
