<template>
  <div ref="shellElement" class="smartbrowser-shell sb-redesigned-browser" :class="{ 'is-site': options.application === 'site', 'is-picker': options.mode === 'select' || !!pickerContext, 'is-contained': options.mode === 'select' || !!pickerContext || displayMode === 'focus' }" :style="{ ...gridWidthStyle, '--sb-browser-available-height': availableHeight, '--sb-picker-footer-height': pickerFooterHeight, '--sb-picker-message-height': pickerMessageHeight }">
    <div v-if="state.busy" class="smartbrowser-busy" role="status" aria-live="polite">
      <span class="spinner-border" aria-hidden="true" />
      <span>{{ t('COM_SMARTBROWSER_WORKING') }}</span>
    </div>
    <ResourceActions
      ref="browserHeader"
      :native-toolbar-target="options.nativeToolbarTarget"
      :heading-title="pickerContext || options.mode === 'select' ? pickerTitle : browserTitle"
      :heading-subtitle="pickerContext || options.mode === 'select' ? pickerContext?.subtitle : options.browserDescription"
      :heading-icon="adapterIcon"
      :actions="state.actions"
      :available="action => actionAvailable(action, selection)"
      :selection="selection"
      :batch-available="options.mode === 'manage'"
      :can-cancel="typeof pickerContext?.cancel === 'function'"
      :flat-available="flatAvailable"
      :flat-active="flatActive"
      :flat-busy="flatNavigating"
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
      :confirm-label="pickerContext?.confirmLabel"
      :t="t"
      @action="executeAction($event, selection)"
      @batch="batchDialog?.open()"
      @cancel="pickerContext?.cancel()"
      @toggle-flat="toggleFlat"
      @toggle-filters="toggleFilters"
      @filter="applyFilter"
      @clear-filters="clearFilters"
      @complete="completeSelection(selection)"
      @no-user="completeSelection([{ id: 'user:0', type: 'user', title: '' }])"
    >
      <template #preferences><PersonalPreferencesDialog :t="t" :adapter="options.adapter" current-view @saved="personalSaved" @reset-view="resetPersonalView" /></template>
      <template #display-controls>
        <button v-if="pickerContext?.toggleSize" type="button" class="resource-icon-button resource-display-toggle" :class="{ active: pickerMaximized }" :aria-pressed="pickerMaximized" :title="t(pickerMaximized ? 'COM_SMARTBROWSER_EDITOR_RESTORE' : 'COM_SMARTBROWSER_EDITOR_MAXIMIZE')" :aria-label="t(pickerMaximized ? 'COM_SMARTBROWSER_EDITOR_RESTORE' : 'COM_SMARTBROWSER_EDITOR_MAXIMIZE')" @click="pickerMaximized = pickerContext.toggleSize()">
          <span :class="pickerMaximized ? 'fas fa-compress' : 'fas fa-expand'" aria-hidden="true" />
        </button>
        <button v-if="displayEnabled" type="button" class="resource-icon-button resource-display-toggle" :class="{ active: displayMode !== 'normal' }" :aria-pressed="displayMode !== 'normal'" :title="t(displayLabel)" :aria-label="t(displayLabel)" @click="cycleDisplay">
          <span :class="displayMode === 'normal' ? 'fas fa-arrows-alt-h' : displayMode === 'wide' ? 'fas fa-expand' : 'fas fa-compress'" aria-hidden="true" />
        </button>
      </template>
    </ResourceActions>
    <ResourceBatchDialog ref="batchDialog" :selection="selection" :adapter="options.adapter" :filters="state.presentation.filters" :batch-options="state.presentation.batchOptions" :sort-fields="state.presentation.sortFields" :ordering-available="reorderVisible" :t="t" @apply="applyBatch" />
    <div class="smartbrowser-layout" :class="{ 'tree-collapsed': treeCollapsed }">
      <ResourceTree v-if="!treeCollapsed && (!treeApi || flatTree)" :adapters="treeAdapters" :active-adapter="options.adapter" :roots="flatTree?.roots || state.roots" :nodes="flatTree?.nodes || state.navigationNodes || state.nodes" :breadcrumb="flatTree?.breadcrumb || state.breadcrumb" :selected-node="flatTree?.nodeId || state.selectedNode" :t="t" @open="openTreeNode" @adapter="switchAdapter"></ResourceTree>
      <div class="sb-tree-handle-rail">
      <button type="button" class="resource-sidebar-handle" :title="t(treeCollapsed ? 'COM_SMARTBROWSER_SHOW_TREE' : 'COM_SMARTBROWSER_HIDE_TREE')" :aria-label="t(treeCollapsed ? 'COM_SMARTBROWSER_SHOW_TREE' : 'COM_SMARTBROWSER_HIDE_TREE')" :aria-expanded="!treeCollapsed" :aria-busy="flatTreeLoading" @click="treeCollapsed = !treeCollapsed">
        <span v-if="flatTreeLoading" class="spinner-border spinner-border-sm" aria-hidden="true" />
        <span v-else :class="treeCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'" aria-hidden="true" />
      </button>
      </div>
      <main class="resource-main">
        <ResourceToolbar
          :history-entries="historyEntries" :history-previous="historyPrevious" @history-back="historyBack" @history-open="historyOpen" @history-clear="clearHistory"
          :breadcrumb="toolbarBreadcrumb"
          :root="state.roots[0]"
          :root-icon="openNodeIcon"
          :icon-only-root="toolbarBreadcrumb.length > 1"
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
          :t="listingText"
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
          @view="changeView"
          @info="toggleInfo"
        />
        <div
          class="resource-browser"
          :aria-busy="renderLoading"
          :class="{ loading: renderLoading, 'is-dragging': dragging, 'info-open': showInfo, 'usage-open': forceUsageInfo }"
          @dragenter.prevent="dragging = isMedia"
          @dragover.prevent
          @dragleave.self="dragging = false"
          @drop.prevent="drop"
        >
          <div v-if="renderLoading" class="resource-loader" role="status" aria-live="polite"><span class="spinner-border" aria-hidden="true" /><span>{{ t('COM_SMARTBROWSER_LOADING') }}</span></div>
          <div v-else-if="!resources.length" class="resource-empty">
            <span :class="state.search ? 'fas fa-search' : isMedia ? 'fas fa-cloud-upload-alt' : adapterIcon" aria-hidden="true" />
            <p>{{ state.search ? t('COM_SMARTBROWSER_NO_RESULTS') : isMedia ? t('COM_SMARTBROWSER_DROP_UPLOAD') : t('COM_SMARTBROWSER_EMPTY_STATE') }}</p>
          </div>
          <component
            :is="activeView.component"
            v-else
            :resources="addressResources"
            :selected-ids="state.selectedIds"
            :focused-id="state.focusedId"
            :all-selected="bulkSelectableResources.length > 0 && bulkSelectableResources.every((resource) => state.selectedIds.includes(resourceKey(resource)))"
            :options="state.viewOptions"
            :selection-controls="!pickerContext || options.multiple !== false"
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
            :t="listingText"
            @select="toggle"
            @focus="focus"
            @select-all="selectAll"
            @open="load"
            @activate="activate"
            @action="runItemAction"
            @sort="sortFromTable"
          ><template #end><ResourceLoadSentinel v-if="state.loadingMode === 'smart'" :enabled="!!state.pagination?.hasMore && !state.loading && !state.loadingMore && !state.loadingAll && !state.error" :request-key="`${state.navigationRevision}:${state.pagination?.nextOffset}`" @load="browser.loadMore()" /></template></component>
          <div v-if="isMedia && dragging" class="resource-drop-overlay"><span class="fas fa-cloud-upload-alt" />{{ t('COM_SMARTBROWSER_DROP_UPLOAD') }}</div>
          <div v-if="showInfo" class="sb-browser-info-rail">
          <ResourceInfoPanel :resource="focusedResource" :fields="focusedResource?.collectionPresentation?.infoFields || state.presentation.infoFields" :t="t"
            :usage-definitions="usageDefinitions" :usage-values="usageValues" :usage-errors="usageErrors[resourceKey(focusedResource)] || {}"
            :usage-editors="pickerContext?.editors" :resolve-reference="resolveUsageReference" :usage-revision="usageRevision"
            :preview-actions="previewActions" :preview-context="previewContext" :can-preview="Boolean(resourcePreview(focusedResource)) && driverFor(focusedResource).canPreview(focusedResource) && !state.busy" @preview="runItemAction(resourcePreview(focusedResource), focusedResource)" @usage-change="setUsage" />
          </div>
        </div>
        <ResourcePagination :page="state.pagination" :total="resources.length" :smart="state.loadingMode === 'smart'" :loaded="state.loadedCount" :busy="state.loading || state.loadingMore || state.loadingAll" :t="t" @page="changePage" @more="browser.loadMore()" @all="browser.loadAll()" />
      </main>
    </div>
    <div v-if="pickerMode" ref="messagesElement" class="sb-browser-messages" />
    <details v-if="pickerMode" ref="pickerFooter" class="resource-picker-collection">
      <summary><span class="fas fa-chevron-up resource-picker-collection-chevron" aria-hidden="true" />{{ t('COM_SMARTBROWSER_COLLECTION_TITLE') }}: <span>{{ state.selectedIds.length }}</span></summary>
      <div class="resource-picker-collection-body"><CollectionView v-if="pickerCollection" :model="pickerCollection" :api="api" :config="pickerCollectionConfig" :t="t" /></div>
    </details>
  </div>
</template>

<script setup>
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { browserAvailableHeight, revealResources } from '../core/pickerViewport.js';
import { createDisplayMode } from '../core/displayMode.js';
import { observeBrowserLayout } from '../core/browserLayout.js';
import ResourceActions from './ResourceActions.vue';
import PersonalPreferencesDialog from './PersonalPreferencesDialog.vue';
import { createNodeHistory } from '../core/nodeHistory.js';
import { pickerScope, nodePreferenceKey } from '../core/personalPreferences.js';
import ResourceBatchDialog from './ResourceBatchDialog.vue';
import ResourceInfoPanel from './ResourceInfoPanel.vue';
import ResourceToolbar from './ResourceToolbar.vue';
import ResourceTree from './ResourceTree.vue';
import ResourcePagination from './ResourcePagination.vue';
import ResourceLoadSentinel from './ResourceLoadSentinel.vue';
import { flatRootUrl, flatUiStorageKey, flatViewUrl, regularViewUrl } from '../core/flatViewNavigation.js';
import { isManagementBrowser, browserStateKey } from '../services/PersistenceService.js';
import { preferenceStorage } from '../core/userPreferences.js';
import { columnCatalog } from '../core/columnCatalog.js';
import { defaultResourceAction, resourcePreviewAction, modifiedResourceAction } from '../core/defaultResourceAction.js';
import { createSelectionUsage } from '../core/selectionUsage.js';
import { referenceKey, resourceKey, resourceReference } from '../core/selectionIdentity.js';
import { selectionUri } from '../core/selectedPresentation.js';
import { previewExtensionContext } from '../core/previewExtensionContext.js';
import CollectionView from './CollectionView.vue';
import { createCollectionState } from '../core/collectionState.js';
import ResourceApi from '../services/ResourceApi.js';
import createSelectionAddressService from '../services/SelectionAddressService.js';
import MediaActionDriver from '../adapters/MediaActionDriver.js';
import { asPrimaryResource, canSelectResource } from '../core/resourcePolicy.js';

const browser = inject('browser');
const options = inject('smartBrowserOptions');
const persistence = inject('persistence');
const displayEnabled = options.application === 'site' && window.self === window.top;
const displayMode = ref('normal');
const shellElement = ref(null), availableHeight = ref('620px');
const viewportWidth = ref(window.innerWidth);
async function changePage(offset) {
  await load(state.selectedNode, { offset });
  if (state.error) return;
  const viewport = shellElement.value?.querySelector('.resource-browser');
  if (viewport && getComputedStyle(viewport).overflowY !== 'visible') viewport.scrollTop = 0;
}
const browserHeader = ref(null);
const messagesElement = ref(null);
const pickerFooter = ref(null), pickerFooterHeight = ref('0px');
const pickerMessageHeight = ref('0px');
let messageContainer, messagePlaceholder;
let heightObserver;
let stopLayout;
const updateAvailableHeight = () => {
  viewportWidth.value = window.innerWidth;
  const shell = shellElement.value;
  if (!shell) return;
  availableHeight.value = `${browserAvailableHeight(shell)}px`;
  pickerFooterHeight.value = `${pickerFooter.value?.getBoundingClientRect().height || 0}px`;
  pickerMessageHeight.value = `${messagesElement.value?.getBoundingClientRect().height || 0}px`;
};
let displayController;
const displayLabel = computed(() => ({ normal: 'COM_SMARTBROWSER_DISPLAY_WIDE', wide: 'COM_SMARTBROWSER_DISPLAY_FOCUS', focus: 'COM_SMARTBROWSER_DISPLAY_NORMAL' })[displayMode.value]);
const cycleDisplay = () => { displayMode.value = displayController.cycle(); };
onMounted(() => {
  messageContainer = document.getElementById('system-message-container');
  if (messagesElement.value && messageContainer && !messageContainer.contains(shellElement.value)) {
    messagePlaceholder = document.createComment('SmartBrowser message position');
    messageContainer.before(messagePlaceholder);
    messagesElement.value.append(messageContainer);
  }
  if (displayEnabled) displayController = createDisplayMode(document.getElementById('smartbrowser-app'), mode => { displayMode.value = mode; });
  updateAvailableHeight();
  heightObserver = new ResizeObserver(updateAvailableHeight);
  heightObserver.observe(shellElement.value.parentElement);
  if (pickerFooter.value) heightObserver.observe(pickerFooter.value);
  if (messagesElement.value) heightObserver.observe(messagesElement.value);
  const dialog = shellElement.value.closest('dialog');
  if (dialog) heightObserver.observe(dialog);
  stopLayout = observeBrowserLayout(shellElement.value, () => browserHeader.value?.element, options.nativeToolbarTarget);
  window.addEventListener('resize', updateAvailableHeight);
});
watch(displayMode, () => nextTick(updateAvailableHeight));
onBeforeUnmount(() => {
  if (messagePlaceholder?.parentNode) messagePlaceholder.replaceWith(messageContainer);
  heightObserver?.disconnect();
  stopLayout?.();
  window.removeEventListener('resize', updateAvailableHeight);
  displayController?.destroy();
});
const driver = inject('actionDriver');
const api = inject('resourceApi');
const registry = inject('viewRegistry');
const { state, resources, bulkSelectableResources, selection, focusedResource, load, focus, toggle, selectAll, invertSelection } = browser;
watch(() => [state.revealIds, state.busy, state.loading, state.activeView], async () => {
  if (!state.revealIds?.length || state.busy || state.loading) return;
  const keys = state.revealIds;
  await nextTick();
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  if (!unmounted && shellElement.value && keys === state.revealIds) {
    revealResources(shellElement.value, keys);
    state.revealIds = [];
  }
});
const pickerContext = options.mode === 'select' ? options.pickerContext || options.selectionHost : options.selectionHost || null;
const collectionMode = Boolean(pickerContext?.collectionMode);
const pickerMode = options.mode === 'select' || !!pickerContext;
const t = (key) => Joomla.Text?._(key, key) || key;
const listingText = key => t(state.pagination && ['COM_SMARTBROWSER_SELECT_ALL', 'COM_SMARTBROWSER_INVERT_SELECTION'].includes(key) ? key + (state.loadingMode === 'smart' ? '_LOADED' : '_PAGE') : key);
const browserTitle = computed(() => t(options.adapters?.find(adapter => adapter.id === options.adapter)?.title || options.adapters?.find(adapter => adapter.id === options.adapter.replace(/^flat-/, ''))?.title || 'COM_SMARTBROWSER_RESOURCE'));
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
  itemDrivers.get(adapter).driver.selectionHost = selectionHost;
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
const toPickerResource = resource => collectionMode ? resource : { ...resource, selectionKey: undefined };
const pickerCollectionConfig = { referenceItems: true, homogeneous: pickerContext?.homogeneous === true, readOnly: false, showCount: false,
  selectionProfile: pickerContext?.selectionProfile || {},
  addressContract: pickerContext?.addressContract, adapter: options.adapter.replace(/^flat-/, ''),
  allowedAdapters: pickerContext?.allowedAdapters || (pickerContext?.collectionMode ? [] : [options.adapter.replace(/^flat-/, '')]),
  allowedResourceTypes: options.allowedResourceTypes, selectionTarget: options.selectionTarget, maxSelections: pickerContext?.maxSelections || 500,
  selectedResources: true, informationPanel: false, multiple: options.multiple,
  items: pickerContext?.getCollectionSnapshot?.().items || [], layout: 'compact', allowRemove: true, allowOrdering: options.multiple && pickerContext?.allowOrdering !== false,
  contextActions: false, resourceActions: [{ id: 'selectionFocus', label: 'COM_SMARTBROWSER_USAGE_OPTIONS', icon: 'fas fa-pen', requiresSelection: true }],
  defaultResourceActionId: 'selectionFocus', apiBaseUrl: options.apiBaseUrl, csrfToken: options.csrfToken, application: options.application,
  onResourceAction: (_action, resource) => { resource = toPickerResource(resource); state.selectedResources[resourceKey(resource)] = resource; state.focusedId = resourceKey(resource); },
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
const commitCollection = () => { if (collectionMode) pickerContext.commitCollection?.({ items: collectionItems(), resources: Object.fromEntries(selection.value.map(resource => [resourceKey(resource), resource])), virtualResources: state.virtualResources }); };
const selectionHost = options.selectionState && (pickerContext || options.selectionHost) ? {
  editorContext: pickerContext?.selectionEditorContext || {},
  canAdd: (adapter, type) => browser.canAddSelection(adapter, type),
  canCreate: type => browser.canCreateSelectionResource(type),
  remove: resources => {
    browser.deleteVirtualResources(resources);
    resources.forEach(resource => usage.forget(resource));
    usageVersion.value++;
    commitCollection();
    options.selectionHost?.onChange?.({ items: collectionItems() });
  },
  replace: (resource, previous) => {
    const oldValues = previous ? { ...usage.get(previous) } : {};
    const next = browser.replaceSelectionResource(resource, previous);
    for (const definition of usage.definitions(next)) {
      if (Object.prototype.hasOwnProperty.call(oldValues, definition.key)) usage.set(next, definition.key, oldValues[definition.key]);
    }
    usageVersion.value++;
    commitCollection();
    options.selectionHost?.onChange?.({ items: collectionItems() });
    if (previous && resourceKey(previous) !== resourceKey(next)) usage.forget(previous);
    return next;
  },
} : null;
driver.selectionHost = selectionHost;
watch(() => [state.selectedIds, state.selectedResources], commitCollection, { deep: true, flush: 'sync' });
onBeforeUnmount(commitCollection);
const usageVersion = ref(0);
if (pickerMode) {
  pickerCollection = createCollectionState({ config: pickerCollectionConfig, api, translate: t, notify: detail => {
    updatingProjection = true;
    for (const entry of detail.items) {
      const resource = detail.resources.find(resource => resourceKey(resource) === referenceKey(entry.selection));
      if (resource) for (const [key, value] of Object.entries(entry.usage)) usage.set(toPickerResource(resource), key, value);
    }
    state.selectedResources = Object.fromEntries(detail.resources.map(toPickerResource).map(resource => [resourceKey(resource), asPrimaryResource(resource)]));
    state.selectedIds = detail.items.map(entry => collectionMode ? referenceKey(entry.selection) : entry.selection.id);
    usageVersion.value++;
    updatingProjection = false;
    commitCollection();
  } });
  pickerCollection.refresh().catch(error => Joomla.renderMessages({ error: [error.message] }));
  watch(() => [state.selectedIds, usageVersion.value], () => {
    if (!updatingProjection) pickerCollection.setItems(collectionItems()).catch(error => Joomla.renderMessages({ error: [error.message] }));
  }, { deep: true, flush: 'sync' });
  onBeforeUnmount(() => pickerCollection.destroy());
}
const pickerMaximized = ref(pickerContext?.isMaximized?.() || false);
const pickerTitle = computed(() => {
  if (pickerContext?.title) return pickerContext.title;
  const adapter = options.adapters?.find(adapter => adapter.id === options.adapter) || options.adapters?.find(adapter => adapter.id === options.adapter.replace(/^flat-/, ''));
  return `${t('COM_SMARTBROWSER_PICKER_SELECT_TITLE')} \u2014 ${t(adapter?.title || 'COM_SMARTBROWSER_RESOURCE')}`;
});
const usageRevision = ref(0);
const usageErrors = ref({});
const usageValidating = ref(false);
const usageDefinitions = computed(() => usage.definitions(focusedResource.value).filter(definition => definition.presentation !== 'hidden'));
const usageValues = computed(() => { usageVersion.value; return usage.get(focusedResource.value); });
const forceUsageInfo = computed(() => Boolean(pickerContext && Object.keys(pickerContext.selectionProfile || {}).length));
const hasUsageProfile = Boolean(pickerContext && Object.keys(pickerContext.selectionProfile || {}).length);
const pickerInfoOpen = ref(pickerContext?.initialInfoOpen === true || (typeof options.pickerRememberedInfo === 'boolean' ? options.pickerRememberedInfo : Object.values(pickerContext?.selectionProfile || {}).some(policy => policy !== false && policy?.presentation !== 'hidden') || state.showInfo));
const showInfo = computed(() => hasUsageProfile || pickerContext?.initialInfoOpen === true ? pickerInfoOpen.value : state.showInfo);
const toggleInfo = () => {
  if (hasUsageProfile || pickerContext?.initialInfoOpen === true) { pickerInfoOpen.value = !pickerInfoOpen.value; state.showInfo = pickerInfoOpen.value; }
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
  return previewExtensionContext({ resource, overlayRegistry: pickerContext || window.SmartBrowserPicker, isReadOnly: !pickerContext || options.mode === 'readonly', fieldElement: null,
    isCurrent: () => !unmounted && resourceKey(focusedResource.value) === resourceKey(resource),
    getAddress: () => usage.get(resource)['ext.address'] ?? selectionUri(resource),
    getDefaultAddress: () => selectionUri(resource),
    resetAddress: () => setResourceUsage(resource, 'ext.address', null),
    setAddress: address => setResourceUsage(resource, 'ext.address', address), profile: pickerContext?.selectionProfile || {}, values: usageValues.value,
    getValues: () => usage.get(resource), setValue: (key, value) => setResourceUsage(resource, key, value),
    refresh: () => load(), selectResource: config => window.SmartBrowserPicker.open(config) });
});
const registeredPreviewActions = ref(pickerContext?.previewActions || []);
const unsubscribePreviewActions = pickerContext?.subscribePreviewActions?.(actions => { registeredPreviewActions.value = actions; });
onBeforeUnmount(() => unsubscribePreviewActions?.());
const previewActions = computed(() => registeredPreviewActions.value.filter(action => {
  try { return focusedResource.value && (!previewContext.value.isReadOnly || action.allowReadOnly === true) && (!action.applies || action.applies(previewContext.value)); } catch { return false; }
}));
let unmounted = false;
onBeforeUnmount(() => { unmounted = true; referenceApis.forEach(api => api.destroy()); });
const views = registry.all();
const activeView = computed(() => registry.get(state.activeView));
const viewChanging = ref(false);
const renderLoading = computed(() => state.loading || viewChanging.value);
const changeView = async (view) => {
  if (state.activeView === view || state.loading || state.busy || viewChanging.value) return;
  viewChanging.value = true;
  try {
    await nextTick();
    // Paint progress before mounting a potentially large grid/details view.
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    state.activeView = view;
    await nextTick();
  } finally { viewChanging.value = false; }
};
const addressValues = ref({});
const addressService = createSelectionAddressService({ api, config: { ...options,
  selectionProfile: pickerContext?.selectionProfile || {}, addressContract: pickerContext?.addressContract } });
let addressGeneration = 0;
watch(() => [resources.value, usageVersion.value], async () => {
  if (!pickerContext) return;
  const generation = ++addressGeneration, values = {};
  for (const resource of resources.value) {
    try {
      values[resourceKey(resource)] = await addressService.serialize({ selection: resourceReference(resource, options.adapter.replace(/^flat-/, '')), usage: usage.get(resource) }, resource);
    } catch { values[resourceKey(resource)] = ''; }
  }
  if (generation === addressGeneration) addressValues.value = values;
}, { immediate: true });
onBeforeUnmount(() => { addressGeneration++; addressService.destroy(); });
const addressResources = computed(() => pickerContext ? resources.value.map(resource => ({ ...resource, selectionAddress: addressValues.value[resourceKey(resource)] || '' })) : resources.value);
const availableColumns = computed(() => {
  const columns = columnCatalog(state.presentation, options.adapter);
  if (pickerContext && !columns.some(column => column.id === 'selectionAddress')) columns.push({ id: 'selectionAddress', source: 'selectionAddress', label: 'COM_SMARTBROWSER_URI', headerIcon: 'fas fa-link', defaultVisible: false });
  return columns;
});
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
const treeCollapsed = ref(options.adapter.startsWith('flat-'));
const flatTree = ref(null);
const flatTreeLoading = ref(false);
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
      state.selectedIds = state.pagination ? ids : ids.filter((id) => resources.value.some((resource) => resource.id === id));
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
const treeApi = options.adapter.startsWith('flat-') ? new ResourceApi({ ...options, adapter: options.adapter.slice(5), browseRoot: options.flatTreeRoot || null, flatScope: null, navigationOnly: true }) : null;
const treeAdapters = computed(() => (options.adapters || []).filter(adapter =>
  (!treeApi || adapter.id !== options.adapter.slice(5)) && (!pickerContext?.allowedAdapters?.length || pickerContext.allowedAdapters.includes(adapter.id.replace(/^flat-/, '')))));
watch(treeCollapsed, async collapsed => {
  if (collapsed || !treeApi || flatTree.value || flatTreeLoading.value) return;
  flatTreeLoading.value = true;
  try {
    const roots = (await treeApi.getResources('')).roots || [];
    const nodeId = options.flatTreeNode || roots[0]?.id;
    flatTree.value = { ...(nodeId ? await treeApi.getResources(nodeId) : {}), roots };
  }
  catch (error) { if (!unmounted) Joomla.renderMessages({ error: [error.message] }); }
  finally { flatTreeLoading.value = false; }
});
onBeforeUnmount(() => treeApi?.destroy());
const openTreeNode = async nodeId => {
  if (!treeApi) return load(nodeId);
  commitCollection();
  await navigateFlat(flatViewUrl(window.location.href, options.adapter.slice(5), nodeId, options.flatTreeRoot || null));
};
const toolbarBreadcrumb = computed(() => {
  if (!flatActive || !options.flatBreadcrumb?.length) return state.breadcrumb;
  // Preserve the adapter's existing root title/icon, including constrained roots.
  if (options.flatBreadcrumb.length === 1) return state.breadcrumb;
  return options.flatBreadcrumb;
});
const historyEntries = ref([]), historyPrevious = ref(null);
let nodeHistory;
const refreshHistory = () => { historyEntries.value = nodeHistory.entries(); historyPrevious.value = nodeHistory.previous(); };
const setupHistory = () => { nodeHistory = createNodeHistory(preferenceStorage(), nodePreferenceKey(options), options.browseRoot || ''); refreshHistory(); };
setupHistory();
watch(() => state.navigationRevision, () => {
  nodeHistory.visit(options.flatTreeNode || state.selectedNode, toolbarBreadcrumb.value);
  refreshHistory();
});
const historyOpen = async id => {
  await openTreeNode(id);
  if (!treeApi && (state.error || state.selectedNode !== id)) { nodeHistory.remove(id); refreshHistory(); }
};
const clearHistory = () => {
  nodeHistory.clear();
  nodeHistory.visit(options.flatTreeNode || state.selectedNode, toolbarBreadcrumb.value);
  refreshHistory();
};
const historyBack = () => { const entry = nodeHistory.back(); refreshHistory(); if (entry) historyOpen(entry.id); };
function resetPersonalView() {
  const storage = preferenceStorage();
  if (persistence) { persistence.storage = storage; persistence.key = browserStateKey(options, storage); persistence.nodeKey = nodePreferenceKey(options, storage); }
  storage.removeItem(browserStateKey(options, storage)); storage.removeItem(uiKey); storage.removeItem(nodePreferenceKey(options, storage));
  state.activeView = options.defaultView || 'grid'; state.showInfo = false; state.search = ''; state.hiddenColumns = []; state.shownColumns = [];
  state.sortBy = options.defaultSortBy || ''; state.sortDirection = options.defaultSortDirection || ''; state.viewOptions = { gridSize: 'md', detailsThumbnails: false, detailsDateMode: 'modified' };
  state.filters = { ...(options.initialFilters || {}) };
  for (const filter of state.presentation.filters || []) if (state.filters[filter.id] === undefined) state.filters[filter.id] = filter.default;
  filtersOpen.value = false; treeCollapsed.value = !!treeApi; storedUi = {}; setupHistory();
}
function personalSaved(settings) {
  // New picker scopes take effect on its next opening; never reload an unsaved host form.
  const defaults = Joomla.getOptions?.('com_smartbrowser.preferences', {}) || {};
  options.editorMode = settings.editorMode === 'inherit' ? defaults.editorDefault || 'modal' : settings.editorMode;
  driver.editorMode = options.editorMode;
  setupHistory();
  void browser.applyLoadingPreferences(settings);
}
const flatNavigating = ref(false);
const gridWidthStyle = Object.fromEntries(
  Object.entries(options.gridWidths || {}).map(([size, width]) => [`--sb-grid-${size}`, `${width}px`]),
);
const uiKey = isManagementBrowser(options) ? flatUiStorageKey(options.adapter, options.browseRoot, window.location.href, true)
  : `supjx.smartbrowser.ui.picker.${pickerScope(options)}.${options.adapter.replace(/^flat-/, '')}`;
let storedUi = (() => { try { return JSON.parse(preferenceStorage().getItem(uiKey) || '{}'); } catch { return {}; } })();
const filtersOpen = ref(storedUi.filtersOpen === true);
const saveUi = (values) => {
  storedUi = { ...storedUi, filtersOpen: filtersOpen.value, ...values };
  preferenceStorage().setItem(uiKey, JSON.stringify(storedUi));
};
const toggleFilters = () => { filtersOpen.value = !filtersOpen.value; saveUi({ filtersOpen: filtersOpen.value }); };
const navigateFlat = async (url) => {
  if (flatNavigating.value) return;
  flatNavigating.value = true;
  state.loading = true;
  await nextTick();
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  window.location.assign(url);
};
const toggleFlat = () => {
  saveUi({ flat: !flatActive });
  navigateFlat(flatActive
    ? regularViewUrl(window.location.href, options.browseRoot)
    : flatViewUrl(window.location.href, options.adapter, state.selectedNode, options.browseRoot));
};
const adapterIcon = computed(() => options.adapters?.find((adapter) => adapter.id === options.adapter)?.icon || options.adapters?.find((adapter) => adapter.id === options.adapter.replace(/^flat-/, ''))?.icon || 'fas fa-list');
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
    if (state.pagination && options.mode === 'manage' && !collectionMode && !options.selectionState) {
      state.selectedIds = []; state.selectedResources = {};
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
    if (editableError) { state.focusedId = editableError; usageRevision.value++; if (!showInfo.value) Joomla.renderMessages({ error: [t('COM_SMARTBROWSER_USAGE_INVALID')] }); }
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
  if (flatActive && options.flatBreadcrumb?.some(crumb => crumb.id === nodeId)) {
    if (nodeId === options.flatBreadcrumb.at(-1)?.id) return;
    const current = new URL(window.location.href);
    const originalRoot = current.searchParams.get('flatFromBrowseRoot') || (!current.searchParams.has('flatFromAdapter') ? options.browseRoot : null);
    await navigateFlat(flatViewUrl(window.location.href, options.adapter.replace(/^flat-/, ''), nodeId, originalRoot));
    return;
  }
  if (options.adapter.startsWith('flat-') && nodeId === state.selectedNode && nodeId === state.roots[0]?.id) {
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
        if (pickerContext.initialFocus) {
          const key = referenceKey(pickerContext.initialFocus);
          if (state.selectedIds.includes(key)) state.focusedId = key;
        }
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
