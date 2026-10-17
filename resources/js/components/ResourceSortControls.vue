<template>
  <ResourceToolbarPopover inline :alignment="alignment" :label="t('COM_SMARTBROWSER_SORT_BY')" icon="fas fa-signal" panel-class="resource-sort-menu" :width="260">
    <div class="resource-sort-controls">
      <select :value="sortBy" class="form-select" :aria-label="t('COM_SMARTBROWSER_SORT_BY')" @change="$emit('sort-by', $event.target.value)">
        <option v-if="defaultValue !== null" :value="defaultValue">{{ t(defaultLabel) }}</option>
        <option v-for="field in fields" :key="field.id" :value="field.id">{{ t(field.label) }}</option>
      </select>
      <button type="button" class="resource-icon-button" :disabled="!sortBy" :title="t('COM_SMARTBROWSER_SORT_DIRECTION')" :aria-label="t('COM_SMARTBROWSER_SORT_DIRECTION')" @click="$emit('sort-direction-value', sortDirection === 'desc' ? 'asc' : 'desc')">
        <span :class="sortDirection === 'desc' ? 'fas fa-sort-amount-down-alt' : 'fas fa-sort-amount-up'" aria-hidden="true" />
      </button>
    </div>
  </ResourceToolbarPopover>
</template>
<script setup>
import ResourceToolbarPopover from './ResourceToolbarPopover.vue';
defineProps({ fields: Array, sortBy: String, sortDirection: String, alignment: { type: String, default: 'end' }, defaultValue: { type: String, default: '' }, defaultLabel: { type: String, default: 'COM_SMARTBROWSER_DEFAULT_SORTING' }, t: Function });
defineEmits(['sort-by', 'sort-direction-value']);
</script>
