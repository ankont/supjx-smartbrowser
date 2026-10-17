<template></template>
<script setup>
import { onBeforeUnmount, ref, shallowRef, watch } from 'vue';
import { createImagePresentation } from '../core/imagePresentation.js';
const props = defineProps({ imageElement: Object, context: Object });
const emit = defineEmits(['providers-change']);
const registry = props.context?.overlayRegistry || window.SmartBrowserPicker;
const definitions = shallowRef(registry?.extensions?.().imagePresentations || registry?.imagePresentations || []);
const unsubscribe = registry?.subscribeImagePresentations?.(next => { definitions.value = next; emit('providers-change'); });
const controller = createImagePresentation();
const loadRevision = ref(0);
const loaded = () => { loadRevision.value++; };
watch(() => props.imageElement, (image, previous) => {
  previous?.removeEventListener('load', loaded);
  image?.addEventListener('load', loaded);
}, { flush: 'sync', immediate: true });
defineExpose({ release: () => controller.destroy() });
watch(() => props.context, () => controller.destroy(), { deep: true, flush: 'pre' });
watch(() => [props.imageElement, props.context, definitions.value, loadRevision.value], () => {
  controller.sync(props.imageElement, definitions.value, props.context);
}, { deep: true, flush: 'post', immediate: true });
onBeforeUnmount(() => { props.imageElement?.removeEventListener('load', loaded); unsubscribe?.(); controller.destroy(); });
</script>
