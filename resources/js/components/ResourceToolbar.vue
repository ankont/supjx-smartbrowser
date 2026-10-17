<template>
  <div class="resource-toolbar" role="toolbar">
    <div class="resource-toolbar-primary">
      <ResourceBreadcrumb :breadcrumb="breadcrumb" :root="root" :root-icon="rootIcon" :icon-only-root="iconOnlyRoot" @open="$emit('open', $event)" />
      <div class="resource-view-controls">
        <ResourceOrderingControls v-if="reorderVisible" :enabled="reorderEnabled" :t="t" @reorder="$emit('reorder', $event)" />
        <button v-if="multiple" type="button" class="resource-icon-button" :disabled="!canInvert" :title="t('COM_SMARTBROWSER_INVERT_SELECTION')" :aria-label="t('COM_SMARTBROWSER_INVERT_SELECTION')" @click="$emit('invert-selection')">
          <span class="fas fa-retweet" aria-hidden="true" />
        </button>
        <ResourceToolbarPopover :label="t('COM_SMARTBROWSER_SEARCH')" icon="fas fa-search" panel-class="resource-search-row" :width="360">
          <form class="input-group resource-search-control" role="search" @submit.prevent="$emit('search', search)">
            <input :value="search" type="search" class="form-control" :aria-label="t('COM_SMARTBROWSER_SEARCH')" :placeholder="t('COM_SMARTBROWSER_SEARCH')" @input="$emit('search', $event.target.value)">
            <button type="submit" class="btn btn-primary" :title="t('COM_SMARTBROWSER_SEARCH')" :aria-label="t('COM_SMARTBROWSER_SEARCH')"><span class="fas fa-search" aria-hidden="true" /></button>
          </form>
        </ResourceToolbarPopover>
        <ResourceSortControls v-if="hasControl('sort')" :fields="effectiveSortFields" :sort-by="sortBy" :sort-direction="sortDirection" :t="t" @sort-by="$emit('sort-by', $event)" @sort-direction-value="$emit('sort-direction-value', $event)" />
        <button v-if="hasControl('zoom')" type="button" class="resource-icon-button" :disabled="gridSize === 'sm'" title="Decrease size" @click="$emit('resize', -1)">
          <span class="fas fa-search-minus" aria-hidden="true" />
        </button>
        <button v-if="hasControl('zoom')" type="button" class="resource-icon-button" :disabled="gridSize === 'xl'" title="Increase size" @click="$emit('resize', 1)">
          <span class="fas fa-search-plus" aria-hidden="true" />
        </button>
        <button v-if="hasControl('thumbnails')" type="button" class="resource-icon-button" :class="{ active: detailsThumbnails }" title="Toggle thumbnails" @click="$emit('toggle-thumbnails')">
          <span class="fas fa-images" aria-hidden="true" />
        </button>
        <button v-if="hasControl('dateField')" type="button" class="resource-icon-button resource-date-toggle" :title="dateToggleTitle" @click="$emit('toggle-date-field')">
          <span class="fas fa-calendar" aria-hidden="true" />
          <small aria-hidden="true">{{ dateModeLabel }}</small>
        </button>
        <ResourceColumnPicker v-if="hasControl('dateField') && columns?.length" :columns="columns" :hidden-columns="hiddenColumns" :shown-columns="shownColumns" :t="t" @toggle-column="$emit('toggle-column', $event)" />
        <div class="resource-mode-controls">
          <button v-for="view in views" :key="view.id" type="button" class="resource-icon-button" :class="{ active: activeView === view.id }" :title="t(view.label)" @click="$emit('view', view.id)">
            <span :class="view.icon" aria-hidden="true" />
          </button>
        </div>
        <button type="button" class="resource-icon-button" :class="{ active: showInfo }" :title="t('COM_SMARTBROWSER_TOGGLE_INFO')" @click="$emit('info')">
          <span class="fas fa-info" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import ResourceBreadcrumb from './ResourceBreadcrumb.vue';
import ResourceOrderingControls from './ResourceOrderingControls.vue';
import ResourceColumnPicker from './ResourceColumnPicker.vue';
import ResourceSortControls from './ResourceSortControls.vue';
import ResourceToolbarPopover from './ResourceToolbarPopover.vue';

const props = defineProps({ breadcrumb: Array, root: Object, rootIcon: String, iconOnlyRoot: Boolean, search: String, sortBy: String, sortDirection: String, sortFields: Array, orderingField: String, views: Array, activeView: String, gridSize: String, detailsThumbnails: Boolean, multiple: Boolean, columns: Array, hiddenColumns: Array, shownColumns: Array, showInfo: Boolean, canInvert: Boolean, reorderVisible: Boolean, reorderEnabled: Boolean, t: Function });
defineEmits(['open', 'invert-selection', 'reorder', 'search', 'sort-by', 'sort-direction-value', 'resize', 'toggle-thumbnails', 'toggle-date-field', 'toggle-column', 'view', 'info']);
const activeDefinition = computed(() => props.views.find((view) => view.id === props.activeView) || {});
const defaultSortFields = [
  { id: 'title', label: 'COM_SMARTBROWSER_NAME' },
  { id: 'size', label: 'COM_SMARTBROWSER_SIZE' },
  { id: 'dimension', label: 'COM_SMARTBROWSER_DIMENSIONS' },
  { id: 'created', label: 'COM_SMARTBROWSER_DATE_CREATED' },
  { id: 'modified', label: 'COM_SMARTBROWSER_DATE_MODIFIED' },
];
const effectiveSortFields = computed(() => {
  const fields = props.sortFields?.length ? [...props.sortFields] : [...defaultSortFields];
  if (props.orderingField && !fields.some((field) => field.id === props.orderingField)) {
    fields.push({ id: props.orderingField, label: 'JGRID_HEADING_ORDERING' });
  }
  const columnOrder = (props.columns || []).flatMap((column) => column.dateGroup
    ? (column.fields || []).map((field) => field.sortField || field.id)
    : [column.sortField || column.id]);
  const rank = (id) => id === props.orderingField ? -1 : columnOrder.indexOf(id);
  return fields.sort((left, right) => {
    const a = rank(left.id);
    const b = rank(right.id);
    return (a < 0 && left.id !== props.orderingField ? columnOrder.length : a)
      - (b < 0 && right.id !== props.orderingField ? columnOrder.length : b);
  });
});
const dateModeLabel = computed(() => ({ created: 'C', modified: 'M', both: 'M&C' })[props.detailsDateMode] || 'M');
const dateToggleTitle = computed(() => `${props.t('COM_SMARTBROWSER_DATE')}: ${dateModeLabel.value}`);
const hasControl = (id) => activeDefinition.value.controls?.includes(id);
</script>
