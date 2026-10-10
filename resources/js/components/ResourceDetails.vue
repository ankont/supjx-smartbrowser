<template>
  <div class="table-responsive resource-details-view">
    <table class="table table-hover">
      <thead><tr>
        <th class="resource-type-column resource-details-select-column" scope="col">
          <span class="resource-details-select-controls">
            <label v-if="selectionControls" class="resource-details-select-all">
              <input type="checkbox" :checked="allSelected" :aria-label="t('COM_SMARTBROWSER_SELECT_ALL')" @change="$emit('select-all')">
            </label>
            <button v-if="orderingField" type="button" class="resource-ordering-sort" :title="t('JGRID_HEADING_ORDERING')" @click="$emit('sort', orderingField)">
              <span :class="sortIcon(orderingField)" aria-hidden="true" />
            </button>
          </span>
        </th>
        <th v-for="column in columns" :key="column.id" :class="`resource-column-${column.id}`" :style="statusColumnStyle(column)" scope="col">
          <button v-if="isSortable(column)" type="button" class="btn btn-link" :title="columnLabel(column)" :aria-label="columnLabel(column)" @click="$emit('sort', sortField(column))">
            <span v-if="headerIcon(column)" :class="headerIcon(column)" aria-hidden="true" />
            <span class="resource-header-text" :class="{ 'resource-header-primary': ['title', 'name'].includes(column.id) }">{{ columnLabel(column) }}</span>
            <span :class="sortIcon(sortField(column))" aria-hidden="true" />
          </button>
          <span v-else class="resource-column-label" :title="columnLabel(column)">
            <span v-if="headerIcon(column)" :class="headerIcon(column)" aria-hidden="true" />
            <span class="resource-header-text" :class="{ 'resource-header-primary': ['title', 'name'].includes(column.id) }">{{ column.shortLabel ? t(column.shortLabel) : columnLabel(column) }}</span>
          </span>
        </th>
        <th class="resource-row-actions" scope="col" />
      </tr></thead>
      <tbody>
        <tr
          v-for="resource in resources"
          :key="resourceKey(resource)"
          :class="{ selected: selectedIds.includes(resourceKey(resource)), focused: focusedId === resourceKey(resource), focusable: canFocusResource(resource), contextual: isContextualResource(resource) }"
          :tabindex="canFocusResource(resource) ? 0 : undefined"
          :aria-current="focusedId === resourceKey(resource) ? 'true' : undefined"
          @click.stop="openMenu = null; $emit('select', resource, $event.ctrlKey || $event.metaKey)"
      @dblclick.stop="performDefault(resource, $event)"
      @keydown.enter.prevent="performDefault(resource)"
        >
          <td class="resource-type-column">
            <ResourceVisual :resource="resource" variant="compact" :allow-image="options.detailsThumbnails" />
            <label v-if="selectionControls && canSelectResource(resource)" class="resource-row-select" :class="{ checked: selectedIds.includes(resourceKey(resource)) }" @click.stop>
              <input type="checkbox" :checked="selectedIds.includes(resourceKey(resource))" :aria-label="resource.title" @change="$emit('select', resource, true)">
            </label>
          </td>
          <th class="resource-title-cell" scope="row" :title="resource.title">
            <span class="resource-cell-ellipsis">{{ resource.title }}</span>
          </th>
          <td v-for="column in columns.slice(1)" :key="column.id" :class="`resource-column-${column.id}`" :style="statusColumnStyle(column)" :title="cellTitle(resource, column)">
            <span class="resource-cell-content" :class="{ 'resource-status-group': column.format === 'status' }">
            <template v-if="column.format === 'status' && resource.statusPresentation">
              <button v-if="overlayAction(statusOverlay(resource), resource)" type="button" class="resource-status-icon" :class="status(resource).class" :title="status(resource).label" @click.stop="$emit('focus', resource); $emit('action', overlayAction(statusOverlay(resource), resource), resource)">
                <span :class="status(resource).icon" aria-hidden="true" />
                <span class="visually-hidden">{{ status(resource).label }}</span>
              </button>
              <span v-else class="resource-status-icon" :class="status(resource).class" :title="status(resource).label">
                <span :class="status(resource).icon" aria-hidden="true" />
                <span class="visually-hidden">{{ status(resource).label }}</span>
              </span>
            </template>
            <span v-else-if="column.format === 'language'" class="resource-language">
              <img v-if="resource.metadata.languageImage" :src="resource.metadata.languageImage" alt="">
              <span v-else-if="resource.metadata.language === '*'" class="resource-language-all fas fa-asterisk" aria-hidden="true" />
              <span class="resource-language-name">{{ cell(resource, column) }}</span>
            </span>
            <span v-else class="resource-cell-ellipsis">{{ cell(resource, column) }}</span>
            <span v-if="column.overlays && resource.overlays?.length" class="resource-row-overlays">
              <template v-for="overlay in resource.overlays.filter((item) => item.id !== 'status')" :key="overlay.id">
                <button v-if="overlayAction(overlay, resource)" type="button" class="resource-overlay" :class="[`overlay-${overlay.id}`, `tone-${overlay.tone || 'neutral'}`]" :title="overlay.label" @click.stop="$emit('focus', resource); $emit('action', overlayAction(overlay, resource), resource)">
                    <img v-if="overlay.image" :src="overlay.image" alt="" aria-hidden="true" />
                    <span v-else :class="overlay.icon" aria-hidden="true" />
                </button>
                <span v-else class="resource-overlay" :class="[`overlay-${overlay.id}`, `tone-${overlay.tone || 'neutral'}`]" :title="overlay.label">
                    <img v-if="overlay.image" :src="overlay.image" alt="" aria-hidden="true" />
                    <span v-else :class="overlay.icon" aria-hidden="true" />
                </span>
              </template>
            </span>
            </span>
          </td>
          <td class="resource-row-actions">
            <button v-if="itemActions(resource).length" type="button" class="resource-row-menu-toggle" :aria-expanded="openMenu === resourceKey(resource)" :title="t('COM_SMARTBROWSER_ACTIONS')" @click.stop="$emit('focus', resource); toggleMenu(resourceKey(resource))">
              <span class="fas fa-ellipsis-h" aria-hidden="true" />
            </button>
            <div v-if="openMenu === resourceKey(resource)" class="resource-item-menu resource-row-menu" @click.stop>
              <strong>{{ resource.title }}</strong>
              <button v-for="action in itemActions(resource)" :key="action.id" type="button" :class="[`resource-action-${action.id}`, { 'resource-default-action': action.isDefault, 'resource-modified-action': action.isModified }]" :title="action.isDefault ? t('COM_SMARTBROWSER_DOUBLE_CLICK') : action.isModified ? t('COM_SMARTBROWSER_CTRL_DOUBLE_CLICK') : undefined" :disabled="!actionAvailable(action, [resource])" @click="openMenu = null; $emit('action', action, resource)">
                <span :class="action.icon" aria-hidden="true" />
                {{ t(action.label) }}
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { resourceKey } from '../core/selectionIdentity.js';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { canActOnResource, canFocusResource, canSelectResource, isContextualResource } from '../core/resourcePolicy.js';
import { itemMenuActions } from '../core/itemMenuActions.js';
import { fieldIcons } from '../core/fieldIcons.js';
import ResourceVisual from './ResourceVisual.vue';

const props = defineProps({ defaultAction: Function, modifiedAction: Function, previewAction: Function, selectionControls: { type: Boolean, default: true }, resources: Array, selectedIds: Array, focusedId: String, allSelected: Boolean, options: Object, actions: Array, actionAvailable: Function, sortBy: String, sortDirection: String, sortFields: Array, orderingField: String, columns: Array, t: Function });
const emit = defineEmits(['select', 'select-all', 'focus', 'open', 'activate', 'sort', 'action']);
const performDefault = (resource, event) => {
  if ((event?.ctrlKey || event?.metaKey) && (props.modifiedAction || props.previewAction)) {
    const preview = props.modifiedAction ? props.modifiedAction(resource) : props.previewAction(resource);
    if (preview && props.actionAvailable(preview, [resource])) { emit('action', preview, resource); return; }
  }
  if (props.defaultAction) {
    const action = props.defaultAction(resource);
    if (action && props.actionAvailable(action, [resource])) emit('action', action, resource);
  } else if (resource.navigable) emit('open', resource.id);
  else if (resource.activatable) emit('activate', resource);
  else emit('focus', resource);
};
const mediaColumns = [
  { id: 'title', label: 'COM_SMARTBROWSER_NAME' },
  { id: 'size', label: 'COM_SMARTBROWSER_SIZE' },
  { id: 'dimension', label: 'COM_SMARTBROWSER_DIMENSIONS' },
  { id: 'created', label: 'COM_SMARTBROWSER_DATE_CREATED' },
  { id: 'modified', label: 'COM_SMARTBROWSER_DATE_MODIFIED' },
];
const dateMode = () => ['created', 'modified', 'both'].includes(props.options.detailsDateMode) ? props.options.detailsDateMode : 'modified';
const expandDateGroup = (column) => {
  if (!column.dateGroup) return [column];
  const fields = column.fields || [];
  return dateMode() === 'both' ? fields : fields.filter((field) => field.id === dateMode());
};
const columns = computed(() => (props.columns?.length ? props.columns : mediaColumns).flatMap(expandDateGroup));
const statusWidth = computed(() => 44 + 24 * Math.max(0, ...(props.resources || []).map((resource) =>
  (resource.overlays || []).filter((overlay) => overlay.id !== 'status').length)));
const idWidth = computed(() => Math.max(48, 24 + 8 * Math.max(1, ...(props.resources || []).map((resource) => String(resource.metadata?.id ?? '').length))));
const statusColumnStyle = (column) => {
  const width = column.id === 'status' && column.overlays ? statusWidth.value : column.id === 'id' ? idWidth.value : null;
  return width === null ? null : { width: `${width}px`, minWidth: `${width}px` };
};
const headerIcon = (column) => column.headerIcon || (Object.hasOwn(fieldIcons, column.id) ? fieldIcons[column.id] : 'fas fa-info');
const sortField = (column) => column.sortField || column.id;
const columnLabel = (column) => props.t(column.label);
const isSortable = (column) => (props.sortFields || mediaColumns).some((field) => field.id === sortField(column));
const sortIcon = (field) => props.sortBy !== field ? 'fas fa-sort ms-1' : props.sortDirection === 'asc' ? 'fas fa-caret-up ms-1' : 'fas fa-caret-down ms-1';
const formatSize = (bytes) => !bytes ? '' : `${(bytes / 1024).toFixed(2)}KB`;
const dimensions = (resource) => resource.metadata.width && resource.metadata.height ? `${resource.metadata.width}px \u00d7 ${resource.metadata.height}px` : '';
const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  const pad = (part) => String(part).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
const valueAt = (resource, path) => String(path || '').split('.').reduce((value, part) => value?.[part], resource);
const cell = (resource, column) => {
  if (column.id === 'size') return resource.kind === 'node' ? '' : formatSize(resource.metadata.size);
  if (column.id === 'dimension') return dimensions(resource);
  const source = column.source || `metadata.${column.id}`;
  const value = valueAt(resource, source);
  if (column.format === 'size') return formatSize(value);
  if (column.format === 'dimensions') return dimensions(resource);
  if (column.format === 'date' || ['created', 'modified'].includes(column.id)) return formatDate(value);
  if (column.format === 'mediaType') return props.t({ folder: 'COM_SMARTBROWSER_FOLDER', image: 'COM_SMARTBROWSER_MEDIA_IMAGE', document: 'COM_SMARTBROWSER_MEDIA_DOCUMENT', video: 'COM_SMARTBROWSER_MEDIA_VIDEO', audio: 'COM_SMARTBROWSER_MEDIA_AUDIO' }[value] || 'COM_SMARTBROWSER_RESOURCE');
  if (column.format === 'language' && value === '*') return props.t('COM_SMARTBROWSER_ALL_LANGUAGES');
  return value ?? '';
};
const cellTitle = (resource, column) => column.id === 'location'
  ? String(resource.metadata?.locationPath || cell(resource, column) || '')
  : column.format === 'status' ? status(resource).label : String(cell(resource, column) || '');
const status = (resource) => ({
  icon: resource.statusPresentation?.icon || 'fas fa-question-circle',
  label: resource.statusPresentation?.label || cell(resource, { source: 'metadata.stateLabel' }),
  class: `status-${resource.statusPresentation?.tone || 'neutral'}`,
});
const statusOverlay = (resource) => resource.overlays?.find((overlay) => overlay.id === 'status') || {};
const openMenu = ref(null);
const toggleMenu = (id) => { openMenu.value = openMenu.value === id ? null : id; };
const itemActions = resource => itemMenuActions(props.actions, resource, props.actionAvailable, props.defaultAction?.(resource), (props.modifiedAction || props.previewAction)?.(resource));
const overlayAction = (overlay, resource) => canActOnResource(resource)
  && resource.interactiveOverlays !== false
  ? props.actions.find((action) => action.id === overlay.action && props.actionAvailable(action, [resource]))
  : undefined;
const closeMenu = () => { openMenu.value = null; };
onMounted(() => document.addEventListener('click', closeMenu));
onBeforeUnmount(() => document.removeEventListener('click', closeMenu));
</script>
