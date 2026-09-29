<template>
  <div class="smartbrowser-shell" :style="gridWidthStyle">
    <div v-if="state.busy" class="smartbrowser-busy" role="status" aria-live="polite">
      <span class="spinner-border" aria-hidden="true" />
      <span>{{ t('COM_SMARTBROWSER_WORKING') }}</span>
    </div>
    <ResourceActions
      :actions="state.actions"
      :available="(action) => driver.available(action, selection)"
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
      :can-complete="selection.length > 0"
      :t="t"
      @action="driver.execute($event, selection)"
      @batch="batchDialog?.open()"
      @toggle-flat="toggleFlat"
      @toggle-filters="toggleFilters"
      @filter="applyFilter"
      @clear-filters="clearFilters"
      @complete="completeSelection(selection)"
      @no-user="completeSelection([{ id: 'user:0', type: 'user', title: '' }])"
    />
    <ResourceBatchDialog ref="batchDialog" :selection="selection" :adapter="options.adapter" :filters="state.presentation.filters" :batch-options="state.presentation.batchOptions" :t="t" @apply="applyBatch" />
    <div class="smartbrowser-layout" :class="{ 'flat-mode': flatActive, 'tree-collapsed': treeCollapsed }">
      <ResourceTree v-if="!flatActive && !treeCollapsed" :adapters="options.adapters" :active-adapter="options.adapter" :roots="state.roots" :nodes="state.nodes" :breadcrumb="state.breadcrumb" :selected-node="state.selectedNode" :t="t" @open="load" @adapter="switchAdapter" />
      <button v-if="!flatActive" type="button" class="resource-sidebar-handle" :title="t(treeCollapsed ? 'COM_SMARTBROWSER_SHOW_TREE' : 'COM_SMARTBROWSER_HIDE_TREE')" :aria-label="t(treeCollapsed ? 'COM_SMARTBROWSER_SHOW_TREE' : 'COM_SMARTBROWSER_HIDE_TREE')" :aria-expanded="!treeCollapsed" @click="treeCollapsed = !treeCollapsed">
        <span :class="treeCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'" aria-hidden="true" />
      </button>
      <main class="resource-main">
        <ResourceToolbar
          :breadcrumb="state.breadcrumb"
          :root="state.roots[0]"
          :root-icon="adapterIcon"
          :icon-only-root="!flatActive && state.breadcrumb.length > 1"
          :search="state.search"
          :sort-by="state.sortBy"
          :sort-direction="state.sortDirection"
          :sort-fields="state.presentation.sortFields"
          :views="views"
          :active-view="state.activeView"
          :grid-size="state.viewOptions.gridSize"
          :details-thumbnails="state.viewOptions.detailsThumbnails"
          :details-date-mode="state.viewOptions.detailsDateMode"
          :columns="availableColumns"
          :hidden-columns="state.hiddenColumns"
          :shown-columns="state.shownColumns"
          :show-info="state.showInfo"
          :can-invert="bulkSelectableResources.length > 0"
          :t="t"
          @open="openNode"
          @invert-selection="invertSelection"
          @search="state.search = $event"
          @sort-by="setSortBy"
          @sort-direction-value="state.sortDirection = $event"
          @resize="resize"
          @toggle-thumbnails="state.viewOptions.detailsThumbnails = !state.viewOptions.detailsThumbnails"
          @toggle-date-field="toggleDateField"
          @toggle-column="toggleColumn"
          @view="state.activeView = $event"
          @info="state.showInfo = !state.showInfo"
        />
        <div
          class="resource-browser"
          :class="{ loading: state.loading, 'is-dragging': dragging, 'info-open': state.showInfo }"
          @dragenter.prevent="dragging = isMedia"
          @dragover.prevent
          @dragleave.self="dragging = false"
          @drop.prevent="drop"
        >
          <div v-if="state.loading" class="resource-loader"><span class="spinner-border" aria-hidden="true" /></div>
          <div v-else-if="!resources.length" class="resource-empty">
            <span :class="state.search ? 'icon-search' : isMedia ? 'icon-cloud-upload' : adapterIcon" aria-hidden="true" />
            <p>{{ state.search ? t('COM_SMARTBROWSER_NO_RESULTS') : isMedia ? t('COM_SMARTBROWSER_DROP_UPLOAD') : t('COM_SMARTBROWSER_EMPTY_STATE') }}</p>
          </div>
          <component
            :is="activeView.component"
            v-else
            :resources="resources"
            :selected-ids="state.selectedIds"
            :focused-id="state.focusedId"
            :all-selected="bulkSelectableResources.length > 0 && bulkSelectableResources.every((resource) => state.selectedIds.includes(resource.id))"
            :options="state.viewOptions"
            :actions="state.actions"
            :action-available="(action, target) => driver.available(action, target)"
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
          <div v-if="isMedia && dragging" class="resource-drop-overlay"><span class="icon-cloud-upload" />{{ t('COM_SMARTBROWSER_DROP_UPLOAD') }}</div>
          <ResourceInfoPanel v-if="state.showInfo" :resource="focusedResource" :fields="state.presentation.infoFields" :t="t" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, nextTick, onMounted, ref } from 'vue';
import ResourceActions from './ResourceActions.vue';
import ResourceBatchDialog from './ResourceBatchDialog.vue';
import ResourceInfoPanel from './ResourceInfoPanel.vue';
import ResourceToolbar from './ResourceToolbar.vue';
import ResourceTree from './ResourceTree.vue';
import { flatRootUrl, flatUiStorageKey, flatViewUrl, regularViewUrl } from '../core/flatViewNavigation.js';
import { columnCatalog } from '../core/columnCatalog.js';

const browser = inject('browser');
const options = inject('smartBrowserOptions');
const driver = inject('actionDriver');
const api = inject('resourceApi');
const registry = inject('viewRegistry');
const { state, resources, bulkSelectableResources, selection, focusedResource, load, focus, toggle, selectAll, invertSelection } = browser;
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
const flatAvailable = ['articles', 'categories', 'tags', 'articles-by-tag', 'menus', 'users', 'media'].includes(options.adapter.replace(/^flat-/, ''));
const flatActive = options.adapter.startsWith('flat-');
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
const adapterIcon = computed(() => options.adapters?.find((adapter) => adapter.id === options.adapter)?.icon || 'icon-list');
const sizes = ['sm', 'md', 'lg', 'xl'];
const t = (key) => Joomla.Text?._(key, key) || key;
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
const completeSelection = (selected) => {
  const detail = { adapter: options.adapter.replace(/^flat-/, ''), mode: options.mode, resources: [...selected] };
  document.dispatchEvent(new CustomEvent('smartbrowser:select', { detail }));
  if (window.parent !== window) window.parent.document.dispatchEvent(new CustomEvent('smartbrowser:select', { detail }));
};

const resize = (step) => {
  const current = sizes.indexOf(state.viewOptions.gridSize);
  state.viewOptions.gridSize = sizes[Math.max(0, Math.min(sizes.length - 1, current + step))];
};
const activate = (resource) => {
  if (options.mode === 'select') {
    completeSelection([resource]);
    return;
  }
  const preview = state.actions.find((action) => action.id === 'preview');
  if (preview) driver.execute(preview, [resource]);
};
const runItemAction = (action, resource) => driver.execute(action, [resource]);
const switchAdapter = (adapter) => {
  if (adapter === options.adapter) return;
  const url = new URL(window.location.href);
  url.searchParams.set('adapter', adapter);
  url.searchParams.delete('node');
  url.searchParams.delete('browseRoot');
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
    state.sortBy = '';
    state.sortDirection = '';
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
  load(state.selectedNode);
});
</script>
