<template>
  <section ref="control" class="smartbrowser smartbrowser-collection" :class="{ 'is-compact': config.layout === 'compact', 'is-selected-resources': config.selectedResources, 'is-single-selection': collapsible && ['top', 'bottom'].includes(panelPosition) }" :aria-label="t('COM_SMARTBROWSER_COLLECTION_TITLE')" :aria-busy="state.loading || state.busy">
    <div class="resource-browser">
      <p v-if="state.error" class="alert alert-danger" role="alert">{{ state.error }}</p>
      <div class="sb-selected-layout" :style="listOpen ? panelTracks : undefined" :class="[`panel-${panelPosition}`, { 'panel-open': panelOpen && config.informationPanel !== false, 'is-collapsed': collapsible && !listOpen }]">
      <div class="sb-selected-items" :class="`view-${state.activeView}`">
      <div v-if="collapsible" class="sb-collection-count"><button type="button" class="sb-collection-count-toggle" :aria-expanded="listOpen" @click="listOpen = !listOpen"><span :class="listOpen ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" />{{ t('COM_SMARTBROWSER_COLLECTION_TITLE') }}: {{ model.getItems().length }}</button></div>
      <div v-show="!collapsible || listOpen" class="sb-selected-list">
      <header class="resource-toolbar sb-collection-toolbar">
        <button v-show="toolbarOverflow" class="resource-icon-button sb-toolbar-scroll" type="button" :disabled="!toolbarCanBack" :aria-label="t('COM_SMARTBROWSER_SCROLL_BACK')" @click="scrollToolbar(-1)"><span class="fas fa-chevron-left" /></button>
        <div ref="toolbar" class="resource-view-controls" @scroll="updateToolbar">
          <ResourceOrderingControls v-if="model.canOrder" :enabled="!state.loading && !state.busy && state.selectedIds.length > 0 && state.sortBy === 'collectionOrder'" :t="t" @reorder="model.move" />
          <button v-if="canAdd" class="resource-icon-button" type="button" :disabled="!addEnabled" :title="t(config.addLabel || 'COM_SMARTBROWSER_COLLECTION_ADD')" :aria-label="t(config.addLabel || 'COM_SMARTBROWSER_COLLECTION_ADD')" @click="add"><span class="fas fa-plus" aria-hidden="true" /></button>
          <button v-if="model.canRemove" class="resource-icon-button" type="button" :disabled="!removalIds.length || state.loading || state.busy" :title="t('COM_SMARTBROWSER_COLLECTION_REMOVE')" :aria-label="t('COM_SMARTBROWSER_COLLECTION_REMOVE')" @click="model.remove(removalIds)"><span class="fas fa-minus" aria-hidden="true" /></button>
          <button v-if="replaceAction" class="resource-icon-button" type="button" :disabled="!focusedResource || !available(replaceAction, [focusedResource])" :title="t(replaceAction.label)" :aria-label="t(replaceAction.label)" @click="action(replaceAction, focusedResource)"><ResourceActionIcon :icon="replaceAction.icon" /></button>
          <span class="sb-collection-extra-buttons" />
          <template v-if="config.layout !== 'compact' && !config.selectedResources">
            <select :aria-label="t('COM_SMARTBROWSER_SORT_BY')" :value="state.sortBy" @change="state.sortBy = $event.target.value"><option value="collectionOrder">{{ t('JGRID_HEADING_ORDERING') }}</option><option v-for="field in sortFields" :key="field.id" :value="field.id">{{ t(field.label) }}</option></select>
            <button class="resource-icon-button" type="button" :title="t('COM_SMARTBROWSER_SORT_DIRECTION')" :aria-label="t('COM_SMARTBROWSER_SORT_DIRECTION')" @click="state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc'"><span :class="state.sortDirection === 'asc' ? 'fas fa-sort-amount-up' : 'fas fa-sort-amount-down-alt'" aria-hidden="true" /></button>
          </template>
          <button v-for="view in views" :key="view.id" class="resource-icon-button" type="button" :class="{ active: state.activeView === view.id }" :title="t(view.label)" :aria-label="t(view.label)" :aria-pressed="state.activeView === view.id" @click="state.activeView = view.id"><span :class="view.icon" aria-hidden="true" /></button>
          <button v-if="config.informationPanel !== false && config.selectedResources" class="resource-icon-button" type="button" :class="{ active: infoState === 'side', 'info-vertical': infoState === 'vertical' }" :data-info-state="infoState" :aria-pressed="panelOpen" :title="t('COM_SMARTBROWSER_USAGE_INFO')" :aria-label="t('COM_SMARTBROWSER_USAGE_INFO')" @click="cycleInfo"><span class="fas fa-info-circle" aria-hidden="true" /></button>
        </div>
        <button v-show="toolbarOverflow" class="resource-icon-button sb-toolbar-scroll" type="button" :disabled="!toolbarCanForward" :aria-label="t('COM_SMARTBROWSER_SCROLL_FORWARD')" @click="scrollToolbar(1)"><span class="fas fa-chevron-right" /></button>
      </header>
      <div class="sb-selected-content">
      <div v-if="!model.resources.value.length" class="resource-empty-state sb-selection-empty" role="status">
        <span>{{ t(state.loading ? 'COM_SMARTBROWSER_LOADING' : 'COM_SMARTBROWSER_COLLECTION_EMPTY') }}</span>
        <button v-if="canAdd && (!panelOpen || !verticalPanel)" type="button" class="btn btn-outline-secondary" :disabled="!addEnabled" @click="add"><span class="fas fa-plus" /> {{ t('COM_SMARTBROWSER_SELECT_RESOURCE') }}</button>
      </div>
      <component v-else :is="state.activeView === 'details' ? ResourceDetails : ResourceGrid"
        :resources="resources" :selected-ids="selectionIds" :focused-id="state.focusedId" :all-selected="allSelected"
        :selection-controls="config.multiple !== false" :options="state.viewOptions" :actions="actions" :action-available="available"
        :default-action="resourceDefault" :preview-action="resourcePreview"
        :grid-fields="state.presentation.gridFields || []" :columns="config.selectedResources ? selectionColumns : state.presentation.columns || [{ id: 'title', label: 'COM_SMARTBROWSER_NAME' }]"
        :sort-by="state.sortBy" :sort-direction="state.sortDirection" :sort-fields="config.selectedResources ? [] : sortFields" :ordering-field="config.selectedResources ? undefined : 'collectionOrder'" :t="t"
        @select="select" @select-all="model.browser.selectAll" @focus="model.browser.focus" @action="action" @sort="sort" />
      </div>
      </div>
      </div>
      <div v-if="config.selectedResources && config.informationPanel !== false" v-show="panelOpen" class="sb-selected-panel">
      <div v-if="config.multiple !== false && ['top', 'bottom'].includes(panelPosition) && resources.length > 1" class="sb-selection-gallery-nav"><button type="button" class="resource-icon-button" :disabled="activeIndex <= 0" :aria-label="t('COM_SMARTBROWSER_PREVIOUS_RESOURCE')" @click="browseSelection(-1)"><span class="fas fa-chevron-left" /></button><button type="button" class="resource-icon-button" :disabled="activeIndex >= resources.length - 1" :aria-label="t('COM_SMARTBROWSER_NEXT_RESOURCE')" @click="browseSelection(1)"><span class="fas fa-chevron-right" /></button></div>
      <div v-if="listOpen && ['left', 'right'].includes(panelPosition)" class="sb-panel-resize" role="separator" tabindex="0" aria-orientation="vertical" :aria-label="t('COM_SMARTBROWSER_RESIZE_INFO')" :aria-valuenow="Math.round(panelWidth || controlWidth * .32)" @pointerdown="startResize" @pointermove="resizePanel" @pointerup="endResize" @pointercancel="endResize" @keydown.left.prevent="adjustPanel(-16)" @keydown.right.prevent="adjustPanel(16)" @dblclick="panelWidth = 0" />
      <ResourceInfoPanel v-if="config.selectedResources && config.informationPanel !== false" v-show="panelOpen" selection-only :resource="focusedResource" :fields="state.presentation.infoFields" :t="t"
        :address="config.nativeAddress" :usage-mode="usageMode" :usage-definitions="usageDefinitions" :usage-values="usageValues" :usage-errors="usageErrors" :usage-editors="extensions.editors" :resolve-reference="resolveReference"
        :preview-actions="previewActions" :selection-actions="quickActions" :allow-add="canAdd && verticalPanel" :allow-quick-add="canAdd && verticalPanel && !listOpen" :selection-position="config.multiple !== false && resources.length > 1 ? `${activeIndex + 1}/${resources.length}` : ''" :add-disabled="!addEnabled" :can-preview="Boolean(externalPreview)" :preview-context="previewContext" :native-preview="config.nativePreview" @selection-add="add" @selection-action="command => action(command, focusedResource)" @preview="action(externalPreview, focusedResource)" @usage-change="setUsage" />
      </div>
      </div>
      <footer v-if="config.showCount !== false && !collapsible" class="sb-collection-count">{{ t('COM_SMARTBROWSER_COLLECTION_TITLE') }}: {{ model.getItems().length }}</footer>
    </div>
  </section>
</template>
<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import ResourceGrid from './ResourceGrid.vue';
import ResourceDetails from './ResourceDetails.vue';
import ResourceOrderingControls from './ResourceOrderingControls.vue';
import ResourceActionIcon from './ResourceActionIcon.vue';
import ResourceInfoPanel from './ResourceInfoPanel.vue';
import { canAddSelection, selectedPresentation, selectionPanelPosition, selectionColumns } from '../core/selectedPresentation.js';
import { createSelectionUsage } from '../core/selectionUsage.js';
import { effectiveIcon, thumbnailCapabilities, resolveThumbnail } from '../core/lightweightVisual.js';
import { referenceKey } from '../core/selectionIdentity.js';
import MediaActionDriver from '../adapters/MediaActionDriver.js';
import { defaultResourceAction, resourcePreviewAction } from '../core/defaultResourceAction.js';
import { resourceKey } from '../core/selectionIdentity.js';
import ResourceApi from '../services/ResourceApi.js';
const props = defineProps({ model: Object, api: Object, config: Object, t: Function });
const state = props.model.browser.state;
const collapsible = computed(() => props.config.selectedResources && props.config.informationPanel !== false);
const preferenceKey = `${props.config.viewPreferenceKey || 'supjx.smartbrowser.collection.view'}.${props.config.multiple === false ? 'single' : 'multiple'}-layout`;
let preference = {};
try { preference = JSON.parse(localStorage.getItem(preferenceKey) || '{}') || {}; } catch {}
const listOpen = ref(collapsible.value ? preference.listOpen === true : true);
const infoState = ref(['side', 'vertical', 'hidden'].includes(preference.infoState) ? preference.infoState : props.config.informationPanelOpen === false ? 'hidden' : preference.sideInfo === true ? 'side' : 'vertical');
function cycleInfo() { infoState.value = { vertical: 'side', side: 'hidden', hidden: 'vertical' }[infoState.value]; }
watch(listOpen, open => { if (collapsible.value && !open) infoState.value = 'vertical'; }, { immediate: true });
watch([listOpen, infoState], () => { if (collapsible.value) try { localStorage.setItem(preferenceKey, JSON.stringify({ listOpen: listOpen.value, infoState: infoState.value })); } catch {} });
const canAdd = computed(() => !props.config.readOnly && typeof props.config.onAdd === 'function');
const adding = ref(false);
const addEnabled = computed(() => { props.model.revision?.value; return canAddSelection(props.config, props.model.getItems().length) && !adding.value && !state.loading && !state.busy; });
async function add() {
  if (!addEnabled.value) return;
  adding.value = true;
  try { await props.config.onAdd(); }
  catch (error) { props.config.onError?.(error); }
  finally { adding.value = false; }
}
state.sortBy = 'collectionOrder'; state.sortDirection = 'asc';
state.viewOptions.gridSize = props.config.gridSize || 'md';
state.viewOptions.detailsThumbnails = props.config.thumbnails !== false;
const driver = new MediaActionDriver(props.api, state, () => props.model.refresh(), props.t, props.config.editorMode || 'modal', props.config.application);
const itemDrivers = new Map();
const driverFor = resource => {
  if (!resource.adapter) return driver;
  if (!itemDrivers.has(resource.adapter)) {
    const api = new ResourceApi({ ...props.config, adapter: resource.adapter, mode: props.config.readOnly ? 'readonly' : 'manage' });
    itemDrivers.set(resource.adapter, { api, driver: new MediaActionDriver(api, state, () => props.model.refresh(), props.t, props.config.editorMode || 'modal', props.config.application) });
  }
  return itemDrivers.get(resource.adapter).driver;
};
const safeActions = ['edit', 'preview', 'download', 'publish', 'unpublish', 'archive', 'unarchive', 'trash', 'restore', 'checkin', 'feature', 'unfeature', 'share'];
const actions = computed(() => [
  ...(props.model.canRemove ? [{ id: 'collectionRemove', label: 'COM_SMARTBROWSER_COLLECTION_REMOVE', icon: 'fas fa-minus', requiresSelection: true, collectionCommand: true }] : []),
  ...(!props.config.readOnly && typeof props.config.onReplace === 'function' ? [{ id: 'collectionReplace', label: 'COM_SMARTBROWSER_COLLECTION_REPLACE', icon: 'arrow-down-up-across-line', requiresSelection: true, collectionCommand: true }] : []),
  ...(!props.config.readOnly ? (props.config.resourceActions || []).map(action => ({ ...action, collectionCommand: true })) : []),
  ...(props.config.contextActions === true && !props.config.readOnly ? state.actions.filter(action => (props.config.contextActionIds || safeActions).includes(action.id)) : []),
]);
const replaceAction = computed(() => actions.value.find(action => action.id === 'collectionReplace'));
const quickActions = computed(() => {
  if (!collapsible.value || listOpen.value) return [];
  return [
    ...(props.config.multiple !== false && props.model.canOrder ? [
      { id: 'collectionMoveUp', label: 'COM_SMARTBROWSER_MOVE_UP', icon: 'fas fa-arrow-up', disabled: activeIndex.value <= 0 || state.busy || state.loading },
      { id: 'collectionMoveDown', label: 'COM_SMARTBROWSER_MOVE_DOWN', icon: 'fas fa-arrow-down', disabled: activeIndex.value < 0 || activeIndex.value >= resources.value.length - 1 || state.busy || state.loading },
    ] : []),
    ...(canAdd.value ? [{ id: 'collectionAdd', label: 'COM_SMARTBROWSER_COLLECTION_ADD', icon: 'fas fa-plus', disabled: !addEnabled.value }] : []),
    ...actions.value.filter(command => ['collectionRemove', 'collectionReplace'].includes(command.id)).map(command => ({ ...command, disabled: !focusedResource.value || !available(command, [focusedResource.value]) })),
  ];
});
const externalPreview = computed(() => focusedResource.value?.collectionActions?.find(command => command.id === 'preview' && driverFor(focusedResource.value).available(command, [focusedResource.value])) || resourcePreview(focusedResource.value));
const hostAction = action => action.id === 'collectionReplace' || (props.config.resourceActions || []).some(candidate => candidate.id === action.id);
const itemAction = (action, resource) => resource.collectionActions?.find(candidate => candidate.id === action.id) || action;
const available = (action, selection) => !state.loading && !state.busy && (action.id === 'collectionRemove' ? props.model.canRemove : !selection.some(resource => resource.unavailable) && (hostAction(action) ? !props.config.readOnly : selection.every(resource => (!resource.collectionActions || resource.collectionActions.some(candidate => candidate.id === action.id)) && driverFor(resource).available(itemAction(action, resource), [resource]))));
const resourceDefault = resource => actions.value.find(action => action.id === props.config.defaultResourceActionId && available(action, [resource])) || (props.config.contextActions === true && !props.config.readOnly
  ? defaultResourceAction({ ...resource, activatable: !resource.unavailable }, 'manage', actions.value, available) : null);
const resourcePreview = resource => props.config.contextActions === true && !props.config.readOnly
  ? resourcePreviewAction(resource, 'manage', actions.value, available) : null;
async function action(command, resource) {
  if (command?.id === 'collectionAdd') return add();
  if (['collectionMoveUp', 'collectionMoveDown'].includes(command?.id)) {
    if (!resource || command.disabled) return;
    return props.model.move(command.id === 'collectionMoveUp' ? 'up' : 'down', [resourceKey(resource)]);
  }
  if (!resource || !available(command, [resource])) return;
  if (command.id === 'collectionRemove') return props.model.remove(selectionIds.value.includes(resourceKey(resource)) ? selectionIds.value : [resourceKey(resource)]);
  try { await (command.id === 'collectionReplace' ? props.config.onReplace(resource) : hostAction(command) ? props.config.onResourceAction?.(command, resource) : driverFor(resource).execute(itemAction(command, resource), [resource])); }
  catch (error) { props.config.onError?.(error); }
}
const sortFields = computed(() => (state.presentation.sortFields || [{ id: 'title', label: 'COM_SMARTBROWSER_NAME' }]).filter(field => !['ordering', 'collectionOrder'].includes(field.id)));
const sort = field => { if (state.sortBy === field) state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc'; else { state.sortBy = field; state.sortDirection = 'asc'; } };
const views = [{ id: 'grid', label: 'COM_SMARTBROWSER_GRID', icon: 'fas fa-th' }, { id: 'details', label: 'COM_SMARTBROWSER_DETAILS', icon: 'fas fa-list' }];
const allSelected = computed(() => props.model.browser.bulkSelectableResources.value.length > 0 && props.model.browser.bulkSelectableResources.value.every(resource => state.selectedIds.includes(resourceKey(resource))));
const control = ref(null), controlWidth = ref(0);
const toolbar = ref(null), toolbarOverflow = ref(false), toolbarCanBack = ref(false), toolbarCanForward = ref(false);
function updateToolbar() {
  const element = toolbar.value;
  if (!element) return;
  toolbarOverflow.value = element.scrollWidth > element.clientWidth + 2;
  toolbarCanBack.value = element.scrollLeft > 1;
  toolbarCanForward.value = element.scrollLeft + element.clientWidth < element.scrollWidth - 1;
}
function scrollToolbar(direction) { toolbar.value.scrollBy({ left: direction * 260, behavior: 'smooth' }); }
const panelOpen = computed(() => collapsible.value && !listOpen.value || infoState.value !== 'hidden');
const verticalPosition = computed(() => props.config.informationPanelVerticalPosition || (['top', 'bottom'].includes(props.config.informationPanelPosition) ? props.config.informationPanelPosition : 'top'));
const horizontalPosition = computed(() => props.config.informationPanelHorizontalPosition || (['left', 'right'].includes(props.config.informationPanelPosition) ? props.config.informationPanelPosition : 'right'));
const panelPosition = computed(() => collapsible.value ? !listOpen.value ? 'top' : infoState.value === 'side' && controlWidth.value >= 640 ? horizontalPosition.value : verticalPosition.value : selectionPanelPosition(props.config.informationPanelPosition, controlWidth.value));
const verticalPanel = computed(() => ['top', 'bottom'].includes(panelPosition.value));
const panelWidth = ref(0);
const panelTracks = computed(() => panelWidth.value && panelOpen.value && ['left', 'right'].includes(panelPosition.value) ? { gridTemplateColumns: panelPosition.value === 'left' ? `${boundedWidth(panelWidth.value)}px minmax(0, 1fr)` : `minmax(0, 1fr) ${boundedWidth(panelWidth.value)}px` } : undefined);
const boundedWidth = width => Math.max(200, Math.min(width, controlWidth.value - 200));
let drag;
function startResize(event) {
  if (event.button !== 0) return;
  event.preventDefault();
  drag = { x: event.clientX, width: event.currentTarget.parentElement.getBoundingClientRect().width };
  event.currentTarget.setPointerCapture(event.pointerId);
}
function resizePanel(event) { if (drag) panelWidth.value = boundedWidth(drag.width + (event.clientX - drag.x) * (panelPosition.value === 'left' ? 1 : -1)); }
function endResize() { drag = null; }
function adjustPanel(delta) { panelWidth.value = boundedWidth((panelWidth.value || controlWidth.value * .32) + delta * (panelPosition.value === 'left' ? 1 : -1)); }
const usageMode = computed(() => props.config.readOnly ? 'readonly' : props.config.selectionUseData || 'readonly');
const extensions = window.SmartBrowserPicker?.extensions?.() || { editors: {}, previewActions: [] };
const registeredPreviewActions = ref(extensions.previewActions);
const unsubscribePreviewActions = window.SmartBrowserPicker?.subscribePreviewActions?.(actions => { registeredPreviewActions.value = actions; });
onBeforeUnmount(() => unsubscribePreviewActions?.());
const referenceApis = new Map();
async function resolveReference(reference, constraint = {}) {
  const key = JSON.stringify([reference.adapter, constraint.browseRoot || '']);
  if (!referenceApis.has(key)) referenceApis.set(key, new ResourceApi({ ...props.config, adapter: reference.adapter, mode: 'select', browseRoot: constraint.browseRoot || null, flatScope: null }));
  return (await referenceApis.get(key).collection([reference.id])).resources[0];
}
const storedUsage = resource => {
  props.model.revision?.value;
  return props.model.getItems().find(item => item.selection && referenceKey(item.selection) === resourceKey(resource))?.usage || {};
};
const usage = computed(() => {
  props.model.revision?.value;
  return createSelectionUsage({ profile: props.config.selectionProfile || {}, initialUsage: Object.fromEntries(props.model.resources.value.map(resource => [resourceKey(resource), storedUsage(resource)])), editors: extensions.editors, resolveReference });
});
const thumbnailImages = ref({});
const resources = computed(() => props.model.resources.value.map(resource => props.config.selectedResources ? selectedPresentation({ ...resource, icon: effectiveIcon(resource, storedUsage(resource)), effectiveThumbnail: thumbnailImages.value[resourceKey(resource)] }, state.presentation) : resource));
const focusedResource = computed(() => resources.value.find(resource => resourceKey(resource) === state.focusedId) || resources.value[0] || null);
const activeIndex = computed(() => resources.value.findIndex(resource => resourceKey(resource) === resourceKey(focusedResource.value)));
function browseSelection(delta) { const resource = resources.value[activeIndex.value + delta]; if (resource) props.model.browser.focus(resource); }
const selectionIds = computed(() => state.selectedIds);
const removalIds = computed(() => props.config.multiple === false ? resources.value.map(resourceKey) : selectionIds.value);
watch(() => props.config.multiple === false ? resourceKey(resources.value[0]) : null, key => { if (key) state.selectedIds = [key]; }, { immediate: true });
const usageDefinitions = computed(() => usageMode.value === 'hidden' ? [] : usage.value.definitions(focusedResource.value).filter(definition => definition.presentation !== 'hidden'));
const usageValues = computed(() => ({ ...storedUsage(focusedResource.value), ...usage.value.get(focusedResource.value) }));
const usageErrors = ref({});
function select(resource, additive) { props.model.browser.toggle(resource, additive); }
async function setUsage(key, value) {
  const resource = focusedResource.value;
  if (!resource || usageMode.value !== 'editable') return;
  const current = usage.value;
  current.set(resource, key, value);
  const values = { ...storedUsage(resource), ...current.get(resource) };
  props.model.setUsage(resource, values);
  const result = await current.validate([resource]);
  if (resourceKey(focusedResource.value) === resourceKey(resource)) usageErrors.value = result.errors[resourceKey(resource)] || {};
}
const previewContext = computed(() => {
  const resource = focusedResource.value;
  return { resource, profile: props.config.selectionProfile || {}, values: usageValues.value, getValues: () => ({ ...storedUsage(resource), ...usage.value.get(resource) }),
    setAddress: (value) => { props.config.nativeAddress = String(value || ''); },
    setValue: (key, value) => { if (resourceKey(focusedResource.value) === resourceKey(resource)) return setUsage(key, value); }, refresh: () => props.model.refresh(), selectResource: config => window.SmartBrowserPicker.open(config) };
});
const previewActions = computed(() => usageMode.value === 'editable' ? registeredPreviewActions.value.filter(action => { try { return focusedResource.value && (!action.applies || action.applies(previewContext.value)); } catch { return false; } }) : []);
let resizeObserver, thumbnailGeneration = 0;
watch(() => [props.model.resources.value, props.model.revision?.value], async () => {
  const generation = ++thumbnailGeneration, images = {};
  for (const resource of props.model.resources.value) {
    const values = storedUsage(resource);
    const definition = thumbnailCapabilities(usage.value.definitions(resource)).find(definition => values[definition.key]);
    if (!definition) continue;
    try { images[resourceKey(resource)] = await resolveThumbnail(definition, values[definition.key], resolveReference); } catch {}
  }
  if (generation === thumbnailGeneration) thumbnailImages.value = images;
}, { immediate: true });
onMounted(() => { resizeObserver = new ResizeObserver(() => { controlWidth.value = control.value.getBoundingClientRect().width; updateToolbar(); }); resizeObserver.observe(control.value); resizeObserver.observe(toolbar.value); });
onBeforeUnmount(() => { resizeObserver?.disconnect(); thumbnailGeneration++; referenceApis.forEach(api => api.destroy()); });
onBeforeUnmount(() => { driver.destroy(); itemDrivers.forEach(({ driver, api }) => { driver.destroy(); api.destroy(); }); });
</script>
