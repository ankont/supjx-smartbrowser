<template>
  <section class="smartbrowser smartbrowser-collection" :aria-label="t('COM_SMARTBROWSER_COLLECTION_TITLE')" :aria-busy="state.loading || state.busy">
    <div class="resource-browser">
      <header class="resource-toolbar sb-collection-toolbar">
        <strong>{{ t('COM_SMARTBROWSER_COLLECTION_TITLE') }} <span>{{ model.getItems().length }}</span></strong>
        <div class="resource-view-controls">
          <ResourceOrderingControls v-if="model.canOrder" :enabled="!state.loading && !state.busy && state.selectedIds.length > 0 && state.sortBy === 'collectionOrder'" :t="t" @reorder="model.move" />
          <button v-if="model.canRemove" class="resource-icon-button" type="button" :disabled="!state.selectedIds.length || state.loading || state.busy" :title="t('COM_SMARTBROWSER_COLLECTION_REMOVE')" :aria-label="t('COM_SMARTBROWSER_COLLECTION_REMOVE')" @click="model.remove(state.selectedIds)"><span class="fas fa-minus" aria-hidden="true" /></button>
          <select :aria-label="t('COM_SMARTBROWSER_SORT_BY')" :value="state.sortBy" @change="state.sortBy = $event.target.value"><option value="collectionOrder">{{ t('JGRID_HEADING_ORDERING') }}</option><option v-for="field in sortFields" :key="field.id" :value="field.id">{{ t(field.label) }}</option></select>
          <button class="resource-icon-button" type="button" :title="t('COM_SMARTBROWSER_SORT_DIRECTION')" :aria-label="t('COM_SMARTBROWSER_SORT_DIRECTION')" @click="state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc'"><span :class="state.sortDirection === 'asc' ? 'fas fa-sort-amount-up' : 'fas fa-sort-amount-down-alt'" aria-hidden="true" /></button>
          <button v-for="view in views" :key="view.id" class="resource-icon-button" type="button" :class="{ active: state.activeView === view.id }" :title="t(view.label)" :aria-label="t(view.label)" @click="state.activeView = view.id"><span :class="view.icon" aria-hidden="true" /></button>
        </div>
      </header>
      <p v-if="state.error" class="alert alert-danger" role="alert">{{ state.error }}</p>
      <p v-if="state.loading" role="status">{{ t('COM_SMARTBROWSER_LOADING') }}</p>
      <p v-else-if="!model.resources.value.length" class="resource-empty-state">{{ t('COM_SMARTBROWSER_COLLECTION_EMPTY') }}</p>
      <component v-else :is="state.activeView === 'details' ? ResourceDetails : ResourceGrid"
        :resources="model.resources.value" :selected-ids="state.selectedIds" :focused-id="state.focusedId" :all-selected="allSelected"
        :selection-controls="model.canRemove || model.canOrder" :options="state.viewOptions" :actions="actions" :action-available="available"
        :default-action="resourceDefault" :preview-action="resourcePreview"
        :grid-fields="state.presentation.gridFields || []" :columns="state.presentation.columns || [{ id: 'title', label: 'COM_SMARTBROWSER_NAME' }]"
        :sort-by="state.sortBy" :sort-direction="state.sortDirection" :sort-fields="sortFields" :ordering-field="'collectionOrder'" :t="t"
        @select="model.browser.toggle" @select-all="model.browser.selectAll" @focus="model.browser.focus" @action="action" @sort="sort" />
    </div>
  </section>
</template>
<script setup>
import { computed, onBeforeUnmount } from 'vue';
import ResourceGrid from './ResourceGrid.vue';
import ResourceDetails from './ResourceDetails.vue';
import ResourceOrderingControls from './ResourceOrderingControls.vue';
import MediaActionDriver from '../adapters/MediaActionDriver.js';
import { defaultResourceAction, resourcePreviewAction } from '../core/defaultResourceAction.js';
const props = defineProps({ model: Object, api: Object, config: Object, t: Function });
const state = props.model.browser.state;
state.sortBy = 'collectionOrder'; state.sortDirection = 'asc';
state.viewOptions.gridSize = props.config.gridSize || 'sm';
state.viewOptions.detailsThumbnails = props.config.thumbnails !== false;
const driver = new MediaActionDriver(props.api, state, () => props.model.refresh(), props.t, props.config.editorMode || 'modal', props.config.application);
const safeActions = ['edit', 'preview', 'download', 'publish', 'unpublish', 'archive', 'unarchive', 'trash', 'restore', 'checkin', 'feature', 'unfeature', 'share'];
const actions = computed(() => [
  ...(props.model.canRemove ? [{ id: 'collectionRemove', label: 'COM_SMARTBROWSER_COLLECTION_REMOVE', icon: 'fas fa-minus', requiresSelection: true }] : []),
  ...(props.config.contextActions === true && !props.config.readOnly ? state.actions.filter(action => (props.config.contextActionIds || safeActions).includes(action.id)) : []),
]);
const available = (action, selection) => !state.loading && !state.busy && (action.id === 'collectionRemove' ? props.model.canRemove : !selection.some(resource => resource.unavailable) && driver.available(action, selection));
const resourceDefault = resource => props.config.contextActions === true && !props.config.readOnly
  ? defaultResourceAction({ ...resource, activatable: !resource.unavailable }, 'manage', actions.value, available) : null;
const resourcePreview = resource => props.config.contextActions === true && !props.config.readOnly
  ? resourcePreviewAction(resource, 'manage', actions.value, available) : null;
const action = (action, resource) => action.id === 'collectionRemove' ? props.model.remove([resource.id]) : available(action, [resource]) && driver.execute(action, [resource]);
const sortFields = computed(() => (state.presentation.sortFields || [{ id: 'title', label: 'COM_SMARTBROWSER_NAME' }]).filter(field => !['ordering', 'collectionOrder'].includes(field.id)));
const sort = field => { if (state.sortBy === field) state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc'; else { state.sortBy = field; state.sortDirection = 'asc'; } };
const views = [{ id: 'grid', label: 'COM_SMARTBROWSER_GRID', icon: 'fas fa-th' }, { id: 'details', label: 'COM_SMARTBROWSER_DETAILS', icon: 'fas fa-list' }];
const allSelected = computed(() => props.model.browser.bulkSelectableResources.value.length > 0 && props.model.browser.bulkSelectableResources.value.every(resource => state.selectedIds.includes(resource.id)));
onBeforeUnmount(() => driver.destroy());
</script>
