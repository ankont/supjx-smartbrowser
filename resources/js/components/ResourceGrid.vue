<template>
  <div class="resource-browser-grid" :class="`size-${options.gridSize}`">
    <div v-if="selectionControls" class="resource-view-icons" :class="{ active: allSelected }">
      <label class="resource-grid-select-all">
        <input type="checkbox" :checked="allSelected" :aria-label="t('COM_SMARTBROWSER_SELECT_ALL')" @change="$emit('select-all')">
      </label>
    </div>
    <div
      v-for="resource in resources"
      :key="resource.id"
      class="resource-browser-item"
      :class="{ selected: selectedIds.includes(resource.id), focused: focusedId === resource.id, active: openMenu === resource.id, contextual: isContextualResource(resource) }"
      :role="canFocusResource(resource) ? 'button' : undefined"
      :tabindex="canFocusResource(resource) ? 0 : undefined"
      :aria-pressed="canSelectResource(resource) ? selectedIds.includes(resource.id) : undefined"
      @click.stop="openMenu = null; $emit('select', resource, $event.ctrlKey || $event.metaKey)"
      @dblclick.stop="performDefault(resource, $event)"
      @keydown.enter.prevent="performDefault(resource)"
      @mouseleave="openMenu = null"
    >
      <label v-if="canSelectResource(resource)" class="resource-item-select" :class="{ checked: selectedIds.includes(resource.id) }" @click.stop>
        <input type="checkbox" :checked="selectedIds.includes(resource.id)" :aria-label="resource.title" @change="$emit('select', resource, true)">
      </label>
      <button v-if="itemActions(resource).length" type="button" class="resource-item-menu-toggle" :aria-expanded="openMenu === resource.id" :title="t('COM_SMARTBROWSER_ACTIONS')" @click.stop="$emit('focus', resource); toggleMenu(resource.id, $event)">
        <span class="fas fa-ellipsis-h" aria-hidden="true" />
      </button>
      <div v-if="openMenu === resource.id" class="resource-item-menu" :class="{ 'align-start': menuAlignStart }" :style="menuMaxWidth ? { maxWidth: `${menuMaxWidth}px` } : null" @click.stop>
        <strong>{{ resource.title }}</strong>
        <button v-for="action in itemActions(resource)" :key="action.id" type="button" :class="[`resource-action-${action.id}`, { 'resource-default-action': action.isDefault }]" :disabled="!actionAvailable(action, [resource])" @click="openMenu = null; $emit('action', action, resource)">
          <span :class="action.icon" aria-hidden="true" />
          {{ t(action.label) }}
        </button>
      </div>
      <span class="resource-item-visual">
        <ResourceVisual :resource="resource" />
        <span v-if="resource.overlays?.length" class="resource-item-overlays">
          <template v-for="overlay in resource.overlays" :key="overlay.id">
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
      <span class="resource-item-title" :title="`${t('COM_SMARTBROWSER_NAME')}: ${resource.title}`">{{ resource.title }}</span>
      <span v-for="line in secondaryLines(resource)" :key="line.label" class="resource-item-metadata" :class="{ 'resource-item-identifier': line.identifier }" :title="`${t(line.label)}: ${line.value}`">
        <span :class="line.icon" aria-hidden="true" />
        <span class="resource-item-metadata-text">{{ line.value }}</span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { canActOnResource, canFocusResource, canSelectResource, isContextualResource } from '../core/resourcePolicy.js';
import { itemMenuActions } from '../core/itemMenuActions.js';
import ResourceVisual from './ResourceVisual.vue';

const props = defineProps({ defaultAction: Function, previewAction: Function, selectionControls: { type: Boolean, default: true }, resources: Array, selectedIds: Array, focusedId: String, allSelected: Boolean, options: Object, actions: Array, actionAvailable: Function, gridFields: Array, t: Function });
const emit = defineEmits(['select', 'select-all', 'focus', 'open', 'activate', 'action']);
const performDefault = (resource, event) => {
  if ((event?.ctrlKey || event?.metaKey) && props.previewAction) {
    const preview = props.previewAction(resource);
    if (preview && props.actionAvailable(preview, [resource])) { emit('action', preview, resource); return; }
  }
  if (props.defaultAction) {
    const action = props.defaultAction(resource);
    if (action && props.actionAvailable(action, [resource])) emit('action', action, resource);
  } else if (resource.navigable) emit('open', resource.id);
  else if (resource.activatable) emit('activate', resource);
  else emit('focus', resource);
};
const openMenu = ref(null);
const menuAlignStart = ref(false);
const menuMaxWidth = ref(0);
const toggleMenu = async (id, event) => {
  if (openMenu.value === id) { openMenu.value = null; return; }
  const item = event.currentTarget.closest('.resource-browser-item');
  const view = item?.closest('.resource-browser');
  menuAlignStart.value = false;
  menuMaxWidth.value = view ? Math.max(0, Math.min(360, view.clientWidth - 8, window.innerWidth - 20)) : 0;
  openMenu.value = id;
  await nextTick();
  if (openMenu.value !== id || !view) return;
  const menu = item.querySelector('.resource-item-menu');
  menuAlignStart.value = menu?.getBoundingClientRect().left < view.getBoundingClientRect().left + 4;
};
const itemActions = resource => itemMenuActions(props.actions, resource, props.actionAvailable, props.defaultAction?.(resource));
const overlayAction = (overlay, resource) => canActOnResource(resource)
  && resource.interactiveOverlays !== false
  ? props.actions.find((action) => action.id === overlay.action && props.actionAvailable(action, [resource]))
  : undefined;
const closeMenu = () => { openMenu.value = null; };
const valueAt = (resource, path) => String(path || '').split('.').reduce((value, part) => value?.[part], resource);
const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  const pad = (part) => String(part).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
const secondaryLines = (resource) => {
  const metadata = resource.metadata || {};
  const line = (label, value, icon, identifier = false) => value ? { label, value, icon, identifier } : null;
  if (resource.type === 'user') return [
    line('COM_SMARTBROWSER_USERNAME', metadata.username, 'fas fa-user', true),
    line('JGLOBAL_EMAIL', metadata.email, 'fas fa-envelope'),
  ].filter(Boolean);
  if (metadata.alias || metadata.languageKey || metadata.menuItemType) return [
    line('COM_SMARTBROWSER_ALIAS_LABEL', metadata.alias, 'fas fa-link', true),
    line('COM_SMARTBROWSER_MENU_ITEM_TYPE', metadata.menuItemType, 'fas fa-file-alt'),
    line('COM_SMARTBROWSER_LANGUAGE_KEY', metadata.languageKey, 'fas fa-language'),
    resource.type === 'article' && props.gridFields?.some((field) => field.source === 'metadata.cardSummaryWithCategory')
      ? line('JCATEGORY', metadata.category, 'fas fa-folder') : null,
  ].filter(Boolean);
  if (resource.kind === 'item' && metadata.mimeType) return [
    line('COM_SMARTBROWSER_MIME_TYPE', metadata.mimeType, 'fas fa-file-alt'),
    resource.type === 'image' && metadata.width > 0 && metadata.height > 0
      ? line('COM_SMARTBROWSER_DIMENSIONS', `${metadata.width} × ${metadata.height}`, 'fas fa-expand') : null,
  ].filter(Boolean);
  return (props.gridFields || []).map((field) => line(
    field.label || 'COM_SMARTBROWSER_DETAILS',
    field.format === 'date' ? formatDate(valueAt(resource, field.source)) : valueAt(resource, field.source),
    'fas fa-info',
  )).filter(Boolean);
};
onMounted(() => document.addEventListener('click', closeMenu));
onBeforeUnmount(() => document.removeEventListener('click', closeMenu));
</script>
