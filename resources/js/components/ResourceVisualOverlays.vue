<template><div ref="layer" class="resource-visual-overlay-layer" /></template>
<script setup>
import { onBeforeUnmount, ref, watch } from 'vue';
import { createVisualOverlays } from '../core/visualOverlays.js';
import { resourceKey } from '../core/selectionIdentity.js';
const props = defineProps({ context: Object });
const layer = ref(null);
const registry = props.context?.overlayRegistry || window.SmartBrowserPicker;
const definitions = ref(registry?.extensions?.().visualOverlays || registry?.visualOverlays || []);
const unsubscribe = registry?.subscribeVisualOverlays?.(next => { definitions.value = next; });
const overlays = createVisualOverlays({ createLayer(surface, definition) {
  const element = surface.ownerDocument.createElement('div');
  element.className = 'resource-visual-overlay';
  element.dataset.overlayId = definition.id;
  surface.append(element);
  return element;
} });
watch(() => [layer.value, definitions.value, props.context], () => {
  overlays.sync(layer.value, definitions.value, props.context, resourceKey(props.context?.resource));
}, { deep: true, flush: 'post', immediate: true });
onBeforeUnmount(() => { unsubscribe?.(); overlays.destroy(); });
</script>
