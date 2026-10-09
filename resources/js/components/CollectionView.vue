<template>
  <section class="smartbrowser smartbrowser-collection" :class="{ 'is-compact': config.layout === 'compact' }" :aria-label="t('COM_SMARTBROWSER_COLLECTION_TITLE')" :aria-busy="state.loading || state.busy">
    <div class="resource-browser">
      <header v-if="config.layout !== 'compact' || model.canOrder || canAdd" class="resource-toolbar sb-collection-toolbar">
        <div class="resource-view-controls">
          <ResourceOrderingControls v-if="model.canOrder" :enabled="!state.loading && !state.busy && state.selectedIds.length > 0 && state.sortBy === 'collectionOrder'" :t="t" @reorder="model.move" />
          <button v-if="canAdd" class="resource-icon-button" type="button" :disabled="adding || state.loading || state.busy" :title="t(config.addLabel || 'COM_SMARTBROWSER_COLLECTION_ADD')" :aria-label="t(config.addLabel || 'COM_SMARTBROWSER_COLLECTION_ADD')" @click="add"><span class="fas fa-plus" aria-hidden="true" /></button>
          <button v-if="model.canRemove" class="resource-icon-button" type="button" :disabled="!state.selectedIds.length || state.loading || state.busy" :title="t('COM_SMARTBROWSER_COLLECTION_REMOVE')" :aria-label="t('COM_SMARTBROWSER_COLLECTION_REMOVE')" @click="model.remove(state.selectedIds)"><span class="fas fa-minus" aria-hidden="true" /></button>
          <template v-if="config.layout !== 'compact'">
            <select :aria-label="t('COM_SMARTBROWSER_SORT_BY')" :value="state.sortBy" @change="state.sortBy = $event.target.value"><option value="collectionOrder">{{ t('JGRID_HEADING_ORDERING') }}</option><option v-for="field in sortFields" :key="field.id" :value="field.id">{{ t(field.label) }}</option></select>
            <button class="resource-icon-button" type="button" :title="t('COM_SMARTBROWSER_SORT_DIRECTION')" :aria-label="t('COM_SMARTBROWSER_SORT_DIRECTION')" @click="state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc'"><span :class="state.sortDirection === 'asc' ? 'fas fa-sort-amount-up' : 'fas fa-sort-amount-down-alt'" aria-hidden="true" /></button>
            <button v-for="view in views" :key="view.id" class="resource-icon-button" type="button" :class="{ active: state.activeView === view.id }" :title="t(view.label)" :aria-label="t(view.label)" @click="state.activeView = view.id"><span :class="view.icon" aria-hidden="true" /></button>
          </template>
        </div>
      </header>
      <p v-if="state.error" class="alert alert-danger" role="alert">{{ state.error }}</p>
      <p v-if="state.loading" role="status">{{ t('COM_SMARTBROWSER_LOADING') }}</p>
      <p v-else-if="!model.resources.value.length" class="resource-empty-state">{{ t('COM_SMARTBROWSER_COLLECTION_EMPTY') }}</p>
      <component v-else :is="config.layout === 'compact' || state.activeView === 'details' ? ResourceDetails : ResourceGrid"
        :resources="model.resources.value" :selected-ids="state.selectedIds" :focused-id="state.focusedId" :all-selected="allSelected"
        :selection-controls="model.canRemove || model.canOrder" :options="state.viewOptions" :actions="actions" :action-available="available"
        :default-action="resourceDefault" :preview-action="resourcePreview"
        :grid-fields="state.presentation.gridFields || []" :columns="config.layout === 'compact' ? [{ id: 'title', label: 'COM_SMARTBROWSER_NAME' }] : state.presentation.columns || [{ id: 'title', label: 'COM_SMARTBROWSER_NAME' }]"
        :sort-by="state.sortBy" :sort-direction="state.sortDirection" :sort-fields="sortFields" :ordering-field="'collectionOrder'" :t="t"
        @select="model.browser.toggle" @select-all="model.browser.selectAll" @focus="model.browser.focus" @action="action" @sort="sort" />
      <footer v-if="config.showCount !== false" class="sb-collection-count">{{ t('COM_SMARTBROWSER_COLLECTION_TITLE') }}: {{ model.getItems().length }}</footer>
    </div>
  </section>
</template>
<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import ResourceGrid from './ResourceGrid.vue';
import ResourceDetails from './ResourceDetails.vue';
import ResourceOrderingControls from './ResourceOrderingControls.vue';
import MediaActionDriver from '../adapters/MediaActionDriver.js';
import { defaultResourceAction, resourcePreviewAction } from '../core/defaultResourceAction.js';
import { resourceKey } from '../core/selectionIdentity.js';
import ResourceApi from '../services/ResourceApi.js';
const props = defineProps({ model: Object, api: Object, config: Object, t: Function });
const state = props.model.browser.state;
const canAdd = computed(() => !props.config.readOnly && typeof props.config.onAdd === 'function');
const adding = ref(false);
async function add() {
  if (!canAdd.value || adding.value || state.loading || state.busy) return;
  adding.value = true;
  try { await props.config.onAdd(); }
  catch (error) { props.config.onError?.(error); }
  finally { adding.value = false; }
}
state.sortBy = 'collectionOrder'; state.sortDirection = 'asc';
state.viewOptions.gridSize = props.config.gridSize || 'sm';
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
  ...(!props.config.readOnly ? (props.config.resourceActions || []).map(action => ({ ...action, collectionCommand: true })) : []),
  ...(props.config.contextActions === true && !props.config.readOnly ? state.actions.filter(action => (props.config.contextActionIds || safeActions).includes(action.id)) : []),
]);
const hostAction = action => (props.config.resourceActions || []).some(candidate => candidate.id === action.id);
const itemAction = (action, resource) => resource.collectionActions?.find(candidate => candidate.id === action.id) || action;
const available = (action, selection) => !state.loading && !state.busy && (action.id === 'collectionRemove' ? props.model.canRemove : !selection.some(resource => resource.unavailable) && (hostAction(action) ? !props.config.readOnly : selection.every(resource => (!resource.collectionActions || resource.collectionActions.some(candidate => candidate.id === action.id)) && driverFor(resource).available(itemAction(action, resource), [resource]))));
const resourceDefault = resource => actions.value.find(action => action.id === props.config.defaultResourceActionId && available(action, [resource])) || (props.config.contextActions === true && !props.config.readOnly
  ? defaultResourceAction({ ...resource, activatable: !resource.unavailable }, 'manage', actions.value, available) : null);
const resourcePreview = resource => props.config.contextActions === true && !props.config.readOnly
  ? resourcePreviewAction(resource, 'manage', actions.value, available) : null;
const action = (action, resource) => action.id === 'collectionRemove' ? props.model.remove([resourceKey(resource)]) : available(action, [resource]) && (hostAction(action) ? props.config.onResourceAction?.(action, resource) : driverFor(resource).execute(itemAction(action, resource), [resource]));
const sortFields = computed(() => (state.presentation.sortFields || [{ id: 'title', label: 'COM_SMARTBROWSER_NAME' }]).filter(field => !['ordering', 'collectionOrder'].includes(field.id)));
const sort = field => { if (state.sortBy === field) state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc'; else { state.sortBy = field; state.sortDirection = 'asc'; } };
const views = [{ id: 'grid', label: 'COM_SMARTBROWSER_GRID', icon: 'fas fa-th' }, { id: 'details', label: 'COM_SMARTBROWSER_DETAILS', icon: 'fas fa-list' }];
const allSelected = computed(() => props.model.browser.bulkSelectableResources.value.length > 0 && props.model.browser.bulkSelectableResources.value.every(resource => state.selectedIds.includes(resourceKey(resource))));
onBeforeUnmount(() => { driver.destroy(); itemDrivers.forEach(({ driver, api }) => { driver.destroy(); api.destroy(); }); });
</script>
