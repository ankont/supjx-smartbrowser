<template><div ref="sentinel" class="resource-scroll-sentinel" aria-hidden="true" /></template>
<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
const props = defineProps({ enabled: Boolean, requestKey: String });
const emit = defineEmits(['load']);
const sentinel = ref(null);
let observer, root, frame = 0, requested = '', disposed = false;
const connect = () => {
  let nextRoot = null;
  for (let parent = sentinel.value?.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
    if (/auto|scroll/.test(getComputedStyle(parent).overflowY) && parent.scrollHeight > parent.clientHeight + 1) { nextRoot = parent; break; }
  }
  if (observer && nextRoot === root) return;
  root = nextRoot; observer?.disconnect();
  observer = new IntersectionObserver(check, { root, rootMargin: '180px' });
  observer.observe(sentinel.value);
};
const check = () => {
  if (disposed || !props.enabled || !sentinel.value || requested === props.requestKey) return;
  connect();
  const rect = sentinel.value.getBoundingClientRect();
  const viewport = root?.getBoundingClientRect() || { top: 0, bottom: innerHeight };
  if (rect.top <= viewport.bottom + 180 && rect.bottom >= viewport.top) { requested = props.requestKey; emit('load'); }
};
const schedule = () => {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(check);
};
onMounted(() => {
  connect();
  // Nested scrollers and mobile viewport changes can change the effective root
  // without crossing an IntersectionObserver threshold.
  document.addEventListener('scroll', schedule, { capture: true, passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.visualViewport?.addEventListener('resize', schedule, { passive: true });
  schedule();
});
watch(() => [props.enabled, props.requestKey], async () => {
  await nextTick(); if (disposed) return;
  cancelAnimationFrame(frame); frame = requestAnimationFrame(check);
});
onBeforeUnmount(() => {
  disposed = true; observer?.disconnect(); cancelAnimationFrame(frame);
  document.removeEventListener('scroll', schedule, true);
  window.removeEventListener('resize', schedule);
  window.visualViewport?.removeEventListener('resize', schedule);
});
</script>
