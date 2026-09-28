<template>
  <div class="resource-batch-field">
    <span>{{ t('COM_SMARTBROWSER_BATCH_MODE') }}</span>
    <div class="btn-group resource-batch-mode-toggle" role="group" :aria-label="t('COM_SMARTBROWSER_BATCH_MODE')">
      <button v-for="mode in modes" :key="mode.value" type="button" class="btn" :class="modelValue === mode.value ? 'is-active' : ''" :aria-pressed="modelValue === mode.value" @click="$emit('update:modelValue', mode.value)">{{ t(mode.label) }}</button>
    </div>
  </div>
</template>

<script setup>
defineProps({ modelValue: { type: String, required: true }, t: { type: Function, required: true } });
defineEmits(['update:modelValue']);
const modes = [
  { value: 'move', label: 'COM_SMARTBROWSER_BATCH_MOVE' },
  { value: 'copy', label: 'COM_SMARTBROWSER_BATCH_COPY' },
];
</script>
