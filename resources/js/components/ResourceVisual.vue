<template>
  <span ref="surface" class="resource-visual-content" :class="`visual-${variant}`" :data-sb-visual="visualId" aria-hidden="true">
    <span v-for="layer in visual.layers" :key="layer.asset" class="resource-visual-layer" :class="[`asset-${layer.asset}`, `style-${layer.style}`, { 'resource-node-visual-symbol': layer.style === 'badge', 'has-image-crop': layer.src && crop }]">
      <img v-if="layer.src" class="resource-visual-image" :class="{ 'image-background': visual.background === 'checkerboard' }" :src="layer.src" alt="" loading="lazy" @load="imageLoaded" @error="failedImage = resource.image">
      <span v-else class="resource-visual-icon" :class="layer.icon" :data-visual-icon="layer.icon" />
    </span>
  </span>
</template>

<script setup>
import { computed, inject, onBeforeUnmount, onMounted, onUpdated, ref, watch } from 'vue';
import { resolveResourceVisual } from '../core/resourceVisual.js';
import { allocateVisualId, visualStyleRegistry } from '../core/visualStyleVariables.js';
const visualId = allocateVisualId();
const props = defineProps({ resource: Object, settings: Object, background: String, availableAssets: Object, variant: { type: String, default: 'grid' }, allowImage: { type: Boolean, default: true }, open: Boolean, alignBaseStart: Boolean });
const options = inject('smartBrowserOptions', {});
const failedImage = ref(null), dimensions = ref({ url: '', ratio: 1 }), surface = ref(null), side = ref(props.variant === 'compact' ? 18 : 180);
const iconRatios = ref({}), observedIcons = new Set();
let observer;
const observeIcons = () => {
  for (const icon of observedIcons) if (!surface.value.contains(icon)) { observer.unobserve(icon); observedIcons.delete(icon); }
  for (const icon of surface.value.querySelectorAll('[data-visual-icon]')) if (!observedIcons.has(icon)) { observer.observe(icon); observedIcons.add(icon); }
};
onMounted(() => {
  syncVariables();
  observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === surface.value) side.value = Math.min(entry.contentRect.width, entry.contentRect.height);
      else if (entry.contentRect.width && entry.contentRect.height) {
        const icon = entry.target.dataset.visualIcon, ratio = Math.round(entry.contentRect.width / entry.contentRect.height * 100) / 100;
        if (Math.abs((iconRatios.value[icon] || 0) - ratio) > .001) iconRatios.value = { ...iconRatios.value, [icon]: ratio };
      }
    }
  });
  observer.observe(surface.value);
  observeIcons();
});
onUpdated(() => { if (observer) observeIcons(); });
onBeforeUnmount(() => { observer?.disconnect(); visualStyleRegistry().remove(visualId); });
const imageLoaded = (event) => { dimensions.value = { url: props.resource.image, ratio: event.target.naturalWidth / event.target.naturalHeight }; };
const crop = computed(() => props.resource.imageCrop?.source === props.resource.image ? props.resource.imageCrop : null);
const visual = computed(() => resolveResourceVisual(props.resource, {
  settings: props.settings ?? props.resource.collectionVisualSettings ?? options.visualSettings ?? {}, allowImage: props.allowImage, open: props.open,
  background: props.background ?? props.resource.collectionImageBackground ?? options.imageBackground ?? 'auto', availableAssets: props.availableAssets,
  compact: props.variant === 'compact',
  alignBaseStart: props.alignBaseStart,
  iconRatios: iconRatios.value,
  imageFailed: Boolean(props.resource.image && failedImage.value === props.resource.image),
  imageRatio: crop.value?.ratio || (dimensions.value.url === props.resource.image ? dimensions.value.ratio : 1),
}));
const syncVariables = () => visualStyleRegistry().update(visualId, visual.value.layers.map(layer => ({ ...layer, crop: layer.src ? crop.value : null })), side.value);
watch([visual, side], () => { if (surface.value) syncVariables(); }, { flush: 'post' });
</script>
