<template>
  <Teleport :to="nativeToolbar || 'body'" :disabled="!nativeToolbar">
  <div ref="headerElement" class="resource-actions-area sb-browser-header" :class="{ 'is-native-header': !!nativeToolbar }">
  <header class="sb-browser-heading">
    <Teleport :to="nativeIntro || 'body'" :disabled="!nativeIntro">
      <div class="sb-browser-heading-leading">
        <button v-if="selectionMode" type="button" class="btn btn-primary resource-picker-select" :disabled="!canComplete" :title="confirmLabel || t('COM_SMARTBROWSER_SELECT')" :aria-label="confirmLabel || t('COM_SMARTBROWSER_SELECT')" @click="$emit('complete')">
          <span class="fas fa-check" aria-hidden="true" /> <span>{{ confirmLabel || t('COM_SMARTBROWSER_SELECT') }}</span>
        </button>
        <a v-if="dashboardUrl" class="btn resource-dashboard-link" :href="dashboardUrl" :title="t(integrated ? 'COM_SMARTBROWSER_DASHBOARD' : 'COM_SMARTBROWSER_BACK_TO_DASHBOARD')" :aria-label="t(integrated ? 'COM_SMARTBROWSER_DASHBOARD' : 'COM_SMARTBROWSER_BACK_TO_DASHBOARD')">
          <span class="fas fa-arrow-left" aria-hidden="true" /> <span>{{ t(integrated ? 'COM_SMARTBROWSER_DASHBOARD' : 'COM_SMARTBROWSER_BACK_TO_DASHBOARD') }}</span>
        </a>
      <div class="sb-browser-heading-copy">
        <component :is="selectionMode ? 'h2' : 'h1'" v-if="!nativeToolbar" class="sb-browser-title"><span :class="headingIcon" aria-hidden="true" /> {{ headingTitle }}</component>
        <p v-if="headingSubtitle" class="sb-browser-description">{{ headingSubtitle }}</p>
      </div>
      </div>
    </Teleport>
    <Teleport :to="nativeManager || 'body'" :disabled="!nativeManager">
      <div class="sb-heading-controls">
        <button v-if="canCancel" type="button" class="btn btn-danger resource-picker-cancel" :title="t('JCANCEL')" :aria-label="t('JCANCEL')" @click="$emit('cancel')"><span class="fas fa-times" aria-hidden="true" /> <span>{{ t('JCANCEL') }}</span></button>
        <slot name="preferences" />
        <a v-if="managerUrl" class="btn resource-manager-link" :href="managerUrl" :target="managerNewTab ? '_blank' : undefined" :rel="managerNewTab ? 'noopener noreferrer' : undefined" :title="t('COM_SMARTBROWSER_OPEN_JOOMLA_MANAGER')" :aria-label="t('COM_SMARTBROWSER_OPEN_JOOMLA_MANAGER')"><span class="fab fa-joomla" aria-hidden="true" /></a>
        <slot name="display-controls" />
      </div>
    </Teleport>
  </header>
  <div ref="actionRow" class="resource-actions" :class="{ 'has-native-toolbar': !!nativeToolbar }">
    <button v-if="allowNoUser" type="button" class="btn btn-outline-secondary" :title="t('JOPTION_NO_USER')" :aria-label="t('JOPTION_NO_USER')" @click="$emit('no-user')">
      <span class="fas fa-user" aria-hidden="true" /> <span class="resource-action-label">{{ t('JOPTION_NO_USER') }}</span>
    </button>
    <button
      v-for="action in directActions"
      :key="action.id"
      type="button"
      class="btn btn-outline-secondary"
      :class="[`resource-action-${action.id}`, { 'resource-action-create': action.creationRole ? action.creationRole === 'item' : action.primary && ['upload', 'createNode', 'createChild', 'newArticle', 'newUser'].includes(action.id), 'resource-contextual-add': action.creationRole === 'contextual', 'is-destructive': ['delete', 'trash', 'remove'].includes(action.id) }]"
      :title="t(action.label)"
      :aria-label="t(action.label)"
      :disabled="!available(action)"
      @click="$emit('action', action)"
    >
      <span :class="action.icon" aria-hidden="true" />
      <span v-if="action.creationRole !== 'contextual'" class="resource-action-label">{{ t(action.label) }}</span>
    </button>
    <div v-if="menuActions.length" ref="actionMenu" class="resource-action-menu-wrap">
      <button type="button" class="btn btn-outline-secondary resource-action-menu-toggle" :aria-expanded="showActions" :title="t('COM_SMARTBROWSER_ACTIONS')" :aria-label="t('COM_SMARTBROWSER_ACTIONS')" @click="showActions = !showActions">
        <span class="fas fa-ellipsis-h" aria-hidden="true" /> <span class="resource-action-label">{{ t('COM_SMARTBROWSER_ACTIONS') }}</span> <span class="fas fa-angle-down" aria-hidden="true" />
      </button>
      <div v-if="showActions" class="resource-action-menu" role="menu">
        <div v-for="action in menuActions" :key="action.id" class="resource-action-menu-item" role="none">
          <button type="button" role="menuitem" :class="[`resource-action-${action.id}`, { 'is-destructive': ['delete', 'trash', 'remove'].includes(action.id) }]" :disabled="!available(action)" @click="showActions = false; $emit('action', action)">
            <span :class="action.icon" aria-hidden="true" /> {{ t(action.label) }}
          </button>
        </div>
      </div>
    </div>
    <button v-if="batchAvailable" type="button" class="btn btn-outline-secondary resource-batch-toggle" :disabled="!selection?.length" :title="t('COM_SMARTBROWSER_BATCH_ACTIONS')" :aria-label="t('COM_SMARTBROWSER_BATCH_ACTIONS')" @click="$emit('batch')">
      <span class="fas fa-magic" aria-hidden="true" /> <span class="resource-action-label">{{ t('COM_SMARTBROWSER_BATCH') }}</span>
    </button>
    <div v-if="filters?.length" class="resource-filter-buttons">
      <button type="button" class="btn resource-filter-toggle" :class="{ active: filtersOpen }" :aria-expanded="filtersOpen" :title="t('COM_SMARTBROWSER_FILTER_OPTIONS')" :aria-label="t('COM_SMARTBROWSER_FILTER_OPTIONS')" @click="$emit('toggle-filters')">
        <span class="fas fa-filter" aria-hidden="true" /> <span class="resource-action-label">{{ t('COM_SMARTBROWSER_FILTER_OPTIONS') }}</span>
        <span v-if="activeFilterCount" class="badge bg-primary">{{ activeFilterCount }}</span>
        <span class="fas fa-angle-down resource-filter-caret" :class="{ open: filtersOpen }" aria-hidden="true" />
      </button>
      <button type="button" class="btn resource-filter-clear" :disabled="!activeFilterCount" :title="t('JCLEAR')" @click="$emit('clear-filters')">{{ t('JCLEAR') }}</button>
    </div>
    <button v-if="flatAvailable" type="button" class="btn resource-flat-toggle" :class="{ active: flatActive }" :title="t('COM_SMARTBROWSER_FLAT_VIEW')" :aria-label="t('COM_SMARTBROWSER_FLAT_VIEW')" :aria-pressed="flatActive" :aria-busy="flatBusy" :disabled="flatBusy" @click="$emit('toggle-flat')">
      <span v-if="flatBusy" class="spinner-border spinner-border-sm" role="status" :aria-label="t('COM_SMARTBROWSER_WORKING')" />
      <span v-else class="fas fa-layer-group" aria-hidden="true" />
      <span class="resource-action-label">{{ t('COM_SMARTBROWSER_FLAT_VIEW') }}</span>
    </button>
  </div>
    <div v-if="filters?.length && filtersOpen" class="resource-action-filters">
      <label v-for="filter in filters" :key="filter.id">
        <span>{{ t(filter.label) }}</span>
        <select
          v-if="filter.type === 'select'"
          class="form-select"
          :value="filterValues[filter.id] ?? filter.default"
          @change="$emit('filter', { id: filter.id, value: $event.target.value })"
        >
          <option v-for="option in filter.options" :key="option.value" :value="option.value">{{ optionLabel(filter, option) }}</option>
        </select>
      </label>
    </div>
  </div>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, onUpdated, ref } from 'vue';

const props = defineProps({ headingTitle: String, headingSubtitle: String, headingIcon: String, nativeToolbarTarget: String, actions: Array, available: Function, selection: Array, batchAvailable: Boolean, canCancel: Boolean, flatAvailable: Boolean, flatActive: Boolean, flatBusy: Boolean, filtersOpen: Boolean, filters: Array, filterValues: Object, managerUrl: String, managerNewTab: Boolean, dashboardUrl: String, integrated: Boolean, selectionMode: Boolean, allowNoUser: Boolean, canComplete: Boolean, confirmLabel: String, t: Function });
const nativeToolbar = props.nativeToolbarTarget ? document.querySelector(props.nativeToolbarTarget) : null;
const nativeIntro = nativeToolbar?.parentElement.querySelector('#sb-native-intro');
const nativeManager = nativeToolbar?.parentElement.querySelector('#sb-native-manager');
const headerElement = ref(null);
defineExpose({ element: headerElement });
defineEmits(['action', 'batch', 'cancel', 'toggle-flat', 'toggle-filters', 'filter', 'clear-filters', 'complete', 'no-user']);
const showActions = ref(false);
const actionMenu = ref(null);
const actionRow = ref(null);
let fitObserver;
let fitFrame = 0;
let observedWidth = 0;
const fitActions = () => {
  const row = actionRow.value;
  if (!row) return;
  row.classList.remove('is-compact-1', 'is-compact-2', 'is-compact-3', 'is-compact-4');
  const fits = () => {
    const style = getComputedStyle(row);
    const gap = parseFloat(style.columnGap) || 0;
    const padding = (parseFloat(style.paddingInlineStart) || 0) + (parseFloat(style.paddingInlineEnd) || 0);
    const children = [...row.children].filter((child) => getComputedStyle(child).display !== 'none');
    return children.reduce((width, child) => width + child.getBoundingClientRect().width, padding + gap * Math.max(0, children.length - 1)) <= row.clientWidth + 1;
  };
  for (let level = 1; level <= 4 && !fits(); level += 1) row.classList.add(`is-compact-${level}`);
};
const scheduleFit = () => {
  cancelAnimationFrame(fitFrame);
  fitFrame = requestAnimationFrame(() => { fitActions(); fitOptions(); });
};
const fitOptions = () => {
  const toolbar = nativeToolbar?.parentElement;
  const link = toolbar?.querySelector('.sb-options-icon');
  const label = link?.querySelector('.sb-options-label');
  if (!label) return;
  link.classList.remove('is-expanded');
  if (toolbar.clientWidth < 640) return;
  const style = getComputedStyle(toolbar);
  const children = [...toolbar.children].filter(child => child !== nativeToolbar && child !== nativeIntro && getComputedStyle(child).display !== 'none');
  const used = children.reduce((width, child) => {
    const childStyle = getComputedStyle(child);
    return width + child.getBoundingClientRect().width + (child === link ? 0 : (parseFloat(childStyle.marginInlineStart) || 0) + (parseFloat(childStyle.marginInlineEnd) || 0));
  }, 240 + (parseFloat(style.columnGap) || 0) * children.length + (parseFloat(style.paddingInlineStart) || 0) + (parseFloat(style.paddingInlineEnd) || 0));
  const canvas = document.createElement('canvas').getContext('2d');
  canvas.font = getComputedStyle(label).font;
  if (used + canvas.measureText(label.textContent).width + 8 + 24 <= toolbar.clientWidth) link.classList.add('is-expanded');
};
const activeFilterCount = computed(() => (props.filters || []).filter((filter) => String(props.filterValues[filter.id] ?? filter.default ?? '') !== String(filter.default ?? '')).length);
const optionLabel = (filter, option) => props.t(option.label);
const visibleActions = computed(() => {
  const renderedGroups = new Set();
  const result = [];
  const trashed = props.filterValues?.state === 'trashed' || props.selection?.length && props.selection.every(resource => resource.status === -2);
  const eligible = props.actions.filter((action) => (action.id !== 'checkin' || props.available(action))
    && !(action.id === 'trash' && trashed)
    && (!action.trashedOnly || props.filterValues?.state === 'trashed' || props.selection?.some(resource => resource.status === -2)));
  eligible.forEach((action) => {
    if (!action.exclusiveGroup) {
      result.push(action);
      return;
    }
    if (renderedGroups.has(action.exclusiveGroup)) return;
    renderedGroups.add(action.exclusiveGroup);
    const actions = eligible.filter((candidate) => candidate.exclusiveGroup === action.exclusiveGroup);
    const applicable = actions.filter((action) => props.available(action));
    const overlayAction = props.selection?.length === 1
      ? props.selection[0].overlays?.find((overlay) => actions.some((candidate) => candidate.id === overlay.action))?.action
      : null;
    result.push(...(applicable.length ? applicable : [actions.find((candidate) => candidate.id === overlayAction) || actions[0]]));
  });
  return result;
});
const creationOrder = { item: 0, node: 1, contextual: 2 };
const directActions = computed(() => visibleActions.value
  .filter((action) => action.primary || action.creationRole || ['upload', 'createNode', 'createChild', 'newArticle'].includes(action.id))
  .sort((left, right) => (creationOrder[left.creationRole] ?? 3) - (creationOrder[right.creationRole] ?? 3)));
const menuActions = computed(() => visibleActions.value.filter((action) => !directActions.value.includes(action)));
const closeActionMenu = (event) => { if (!actionMenu.value?.contains(event.target)) showActions.value = false; };
const closeActionMenuOnEscape = (event) => { if (event.key === 'Escape') showActions.value = false; };
onMounted(() => {
  document.addEventListener('click', closeActionMenu);
  document.addEventListener('keydown', closeActionMenuOnEscape);
  fitObserver = new ResizeObserver(([entry]) => {
    if (entry.contentRect.width === observedWidth) return;
    observedWidth = entry.contentRect.width;
    scheduleFit();
  });
  fitObserver.observe(actionRow.value);
  if (nativeToolbar) {
    fitObserver.observe(nativeToolbar);
    fitObserver.observe(nativeToolbar.parentElement);
  }
  document.fonts?.ready.then(scheduleFit);
  scheduleFit();
});
onUpdated(scheduleFit);
onBeforeUnmount(() => {
  document.removeEventListener('click', closeActionMenu);
  document.removeEventListener('keydown', closeActionMenuOnEscape);
  fitObserver?.disconnect();
  cancelAnimationFrame(fitFrame);
});
</script>
