<template>
  <span class="resource-ordering-moves">
    <button type="button" :disabled="!enabled" :title="t('COM_SMARTBROWSER_MOVE_UP')" :aria-label="t('COM_SMARTBROWSER_MOVE_UP')" @click="$emit('reorder', 'up')"><span class="fas fa-arrow-up" aria-hidden="true" /></button>
    <button type="button" :disabled="!enabled" :title="t('COM_SMARTBROWSER_MOVE_DOWN')" :aria-label="t('COM_SMARTBROWSER_MOVE_DOWN')" @click="$emit('reorder', 'down')"><span class="fas fa-arrow-down" aria-hidden="true" /></button>
  </span>
</template>
<script setup>
defineProps({ enabled: Boolean, t: Function });
defineEmits(['reorder']);
</script>
