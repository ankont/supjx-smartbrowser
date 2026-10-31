<template>
  <slot v-if="disabled" />
  <div v-else ref="viewport" class="resource-info-scroll" @scroll="remember">
    <div ref="content" class="resource-info-scroll-content"><slot /></div>
  </div>
</template>
<script setup>
import { onMounted, onBeforeUnmount, onUpdated, ref, watch } from 'vue';
const props = defineProps({ disabled: Boolean, resourceKey: String, tab: String });
const viewport = ref(null), content = ref(null);
const positions = new Map();
let frame = 0, release = 0, restoring = false, observer;
const remember = () => {
  if (restoring || !viewport.value) return;
  const node = viewport.value, range = node.scrollHeight - node.clientHeight;
  positions.set(props.tab, range > 0 ? node.scrollTop / range : 0);
};
const restore = () => {
  if (!viewport.value) return;
  restoring = true;
  cancelAnimationFrame(frame); cancelAnimationFrame(release);
  frame = requestAnimationFrame(() => {
    const node = viewport.value;
    if (node) node.scrollTop = (positions.get(props.tab) || 0) * Math.max(0, node.scrollHeight - node.clientHeight);
    release = requestAnimationFrame(() => { restoring = false; });
  });
};
watch(() => [props.resourceKey, props.tab], restore, { flush: 'post' });
onUpdated(restore);
onMounted(() => { if (content.value) { observer = new ResizeObserver(restore); observer.observe(content.value); } });
onBeforeUnmount(() => { observer?.disconnect(); cancelAnimationFrame(frame); cancelAnimationFrame(release); });
</script>
