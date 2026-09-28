<template>
  <div class="resource-toolbar" role="toolbar">
    <div class="resource-toolbar-primary">
      <ResourceBreadcrumb :breadcrumb="breadcrumb" :root="root" :root-icon="rootIcon" :icon-only-root="iconOnlyRoot" @open="$emit('open', $event)" />
      <div class="resource-view-controls">
        <button type="button" class="resource-icon-button" :disabled="!canInvert" :title="t('COM_SMARTBROWSER_INVERT_SELECTION')" :aria-label="t('COM_SMARTBROWSER_INVERT_SELECTION')" @click="$emit('invert-selection')">
          <span class="fas fa-retweet" aria-hidden="true" />
        </button>
        <button type="button" class="resource-icon-button" :class="{ active: showSearch }" :title="t('COM_SMARTBROWSER_SEARCH')" @click="showSearch = !showSearch">
          <span class="icon-search" aria-hidden="true" />
        </button>
        <button v-if="hasControl('sort')" type="button" class="resource-icon-button" :class="{ active: showSort }" :title="t('COM_SMARTBROWSER_SORT_BY')" @click="showSort = !showSort">
          <span class="fas fa-sort-amount-down-alt" aria-hidden="true" />
        </button>
        <button v-if="hasControl('zoom')" type="button" class="resource-icon-button" :disabled="gridSize === 'sm'" title="Decrease size" @click="$emit('resize', -1)">
          <span class="icon-search-minus" aria-hidden="true" />
        </button>
        <button v-if="hasControl('zoom')" type="button" class="resource-icon-button" :disabled="gridSize === 'xl'" title="Increase size" @click="$emit('resize', 1)">
          <span class="icon-search-plus" aria-hidden="true" />
        </button>
        <button v-if="hasControl('thumbnails')" type="button" class="resource-icon-button" :class="{ active: detailsThumbnails }" title="Toggle thumbnails" @click="$emit('toggle-thumbnails')">
          <span class="icon-images" aria-hidden="true" />
        </button>
        <button v-if="hasControl('dateField')" type="button" class="resource-icon-button resource-date-toggle" :title="dateToggleTitle" @click="$emit('toggle-date-field')">
          <span class="icon-calendar" aria-hidden="true" />
          <small aria-hidden="true">{{ dateModeLabel }}</small>
        </button>
        <div v-if="hasControl('dateField') && columns?.length" ref="columnPicker" class="resource-column-picker">
          <button type="button" class="resource-icon-button" :title="t('COM_SMARTBROWSER_COLUMNS')" :aria-label="t('COM_SMARTBROWSER_COLUMNS')" :aria-expanded="showColumns" @click="showColumns = !showColumns">
            <span class="fas fa-columns" aria-hidden="true" />
          </button>
          <div v-if="showColumns" class="resource-column-menu">
            <div class="resource-column-menu-title">{{ t('COM_SMARTBROWSER_COLUMNS') }}</div>
            <label v-for="column in columns" :key="column.id" class="resource-column-choice">
              <input type="checkbox" :checked="column.defaultVisible ? !hiddenColumns?.includes(column.id) : shownColumns?.includes(column.id)" :disabled="column.id === 'title' || column.id === 'name'" @change="$emit('toggle-column', column.id)">
              <span>{{ t(column.label || (column.dateGroup ? 'COM_SMARTBROWSER_DATE' : column.fields?.[0]?.label)) }}</span>
            </label>
          </div>
        </div>
        <div class="resource-mode-controls">
          <button v-for="view in views" :key="view.id" type="button" class="resource-icon-button" :class="{ active: activeView === view.id }" :title="t(view.label)" @click="$emit('view', view.id)">
            <span :class="view.icon" aria-hidden="true" />
          </button>
        </div>
        <button type="button" class="resource-icon-button" :class="{ active: showInfo }" :title="t('COM_SMARTBROWSER_TOGGLE_INFO')" @click="$emit('info')">
          <span class="icon-info" aria-hidden="true" />
        </button>
      </div>
    </div>
    <div v-if="showSearch" class="resource-toolbar-expanded resource-search-row">
      <label for="smartbrowser-search" class="visually-hidden">{{ t('COM_SMARTBROWSER_SEARCH') }}</label>
      <div class="input-group resource-search-control">
        <input id="smartbrowser-search" :value="search" type="search" class="form-control" :placeholder="t('COM_SMARTBROWSER_SEARCH')" @input="$emit('search', $event.target.value)" @keydown.enter.prevent="$emit('search', $event.target.value)">
        <button type="button" class="btn btn-primary" :title="t('COM_SMARTBROWSER_SEARCH')" @click="$emit('search', search)">
          <span class="icon-search" aria-hidden="true" />
          <span class="visually-hidden">{{ t('COM_SMARTBROWSER_SEARCH') }}</span>
        </button>
      </div>
    </div>
    <div v-if="showSort && hasControl('sort')" class="resource-toolbar-expanded resource-sort-row">
      <div class="resource-sort-controls">
        <label>
          <span class="visually-hidden">{{ t('COM_SMARTBROWSER_SORT_BY') }}</span>
          <select :value="sortBy" class="form-select" @change="$emit('sort-by', $event.target.value)">
            <option value="">{{ t('COM_SMARTBROWSER_DEFAULT_SORTING') }}</option>
            <option v-for="field in effectiveSortFields" :key="field.id" :value="field.id">{{ t(field.label) }}</option>
          </select>
        </label>
        <label>
          <span class="visually-hidden">{{ t('COM_SMARTBROWSER_SORT_DIRECTION') }}</span>
          <select :value="sortDirection || 'asc'" class="form-select" :disabled="!sortBy" @change="$emit('sort-direction-value', $event.target.value)">
            <option value="asc">{{ t('COM_SMARTBROWSER_ASCENDING') }}</option>
            <option value="desc">{{ t('COM_SMARTBROWSER_DESCENDING') }}</option>
          </select>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import ResourceBreadcrumb from './ResourceBreadcrumb.vue';

const props = defineProps({ breadcrumb: Array, root: Object, rootIcon: String, iconOnlyRoot: Boolean, search: String, sortBy: String, sortDirection: String, sortFields: Array, views: Array, activeView: String, gridSize: String, detailsThumbnails: Boolean, detailsDateMode: String, columns: Array, hiddenColumns: Array, shownColumns: Array, showInfo: Boolean, canInvert: Boolean, t: Function });
defineEmits(['open', 'invert-selection', 'search', 'sort-by', 'sort-direction-value', 'resize', 'toggle-thumbnails', 'toggle-date-field', 'toggle-column', 'view', 'info']);
const activeDefinition = computed(() => props.views.find((view) => view.id === props.activeView) || {});
const effectiveSortFields = computed(() => props.sortFields?.length ? props.sortFields : [
  { id: 'title', label: 'COM_SMARTBROWSER_NAME' },
  { id: 'size', label: 'COM_SMARTBROWSER_SIZE' },
  { id: 'dimension', label: 'COM_SMARTBROWSER_DIMENSIONS' },
  { id: 'created', label: 'COM_SMARTBROWSER_DATE_CREATED' },
  { id: 'modified', label: 'COM_SMARTBROWSER_DATE_MODIFIED' },
]);
const showSort = ref(false);
const showSearch = ref(false);
const showColumns = ref(false);
const columnPicker = ref(null);
const closeColumnsOutside = (event) => {
  if (!columnPicker.value?.contains(event.target)) showColumns.value = false;
};
onMounted(() => document.addEventListener('pointerdown', closeColumnsOutside));
onBeforeUnmount(() => document.removeEventListener('pointerdown', closeColumnsOutside));
const dateModeLabel = computed(() => ({ created: 'C', modified: 'M', both: 'M&C' })[props.detailsDateMode] || 'M');
const dateToggleTitle = computed(() => `${props.t('COM_SMARTBROWSER_DATE')}: ${dateModeLabel.value}`);
const hasControl = (id) => activeDefinition.value.controls?.includes(id);
</script>
