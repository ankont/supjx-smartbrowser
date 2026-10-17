<template>
  <slot v-if="!active" />
  <div ref="surface" class="resource-preview-renderer-layer" v-show="active" />
</template>
<script setup>
import { onBeforeUnmount, ref, watch } from 'vue';
import { createPreviewRenderer } from '../core/previewRenderers.js';
import { resourceKey } from '../core/selectionIdentity.js';
const props = defineProps({ context: Object });
const emit = defineEmits(['active-change', 'before-update']);
const surface = ref(null), active = ref(false);
watch(active, value => emit('active-change', value), { flush: 'sync' });
const registry = props.context?.overlayRegistry || window.SmartBrowserPicker;
const definitions = ref(registry?.extensions?.().previewRenderers || registry?.previewRenderers || []);
const unsubscribe = registry?.subscribePreviewRenderers?.(next => { definitions.value = next; });
const renderer = createPreviewRenderer({ createLayer(parent, definition) {
  const element = parent.ownerDocument.createElement('div');
  element.className = 'resource-preview-renderer'; element.dataset.rendererId = definition.id;
  parent.append(element); return element;
} });
watch(() => [surface.value, definitions.value, props.context], () => {
  emit('before-update');
  active.value = renderer.sync(surface.value, definitions.value, props.context, resourceKey(props.context?.resource));
}, { deep: true, flush: 'post', immediate: true });
onBeforeUnmount(() => { unsubscribe?.(); renderer.destroy(); });
</script>
