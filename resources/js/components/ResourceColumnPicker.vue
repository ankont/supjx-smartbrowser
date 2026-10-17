<template>
  <ResourceToolbarPopover class="resource-column-picker" :label="t('COM_SMARTBROWSER_COLUMNS')" icon="fas fa-columns" panel-class="resource-column-menu" :width="220">
    <div class="resource-column-menu-title">{{ t('COM_SMARTBROWSER_COLUMNS') }}</div>
    <label v-for="column in columns" :key="column.id" class="resource-column-choice">
      <input type="checkbox" :checked="column.defaultVisible !== false ? !hiddenColumns?.includes(column.id) : shownColumns?.includes(column.id)" :disabled="column.id === 'title' || column.id === 'name'" @change="$emit('toggle-column', column.id)">
      <span>{{ t(column.label || (column.dateGroup ? 'COM_SMARTBROWSER_DATE' : column.fields?.[0]?.label)) }}</span>
    </label>
  </ResourceToolbarPopover>
</template>
<script setup>
import ResourceToolbarPopover from './ResourceToolbarPopover.vue';
defineProps({ columns: Array, hiddenColumns: Array, shownColumns: Array, t: Function });
defineEmits(['toggle-column']);
</script>
