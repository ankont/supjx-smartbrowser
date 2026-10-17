<template>
  <div ref="host" class="resource-toolbar-popup" :class="{ 'is-inline': inlineMode, 'is-aligned-start': alignment === 'start' }" @keydown="escape">
    <div :id="panelId" ref="panel" v-show="open || !inlineMode" :popover="inlineMode ? undefined : 'auto'" class="resource-toolbar-popup-panel" :class="panelClass" :style="{ '--sb-toolbar-popup-width': `${width}px` }" @toggle="syncOpen">
      <slot />
    </div>
    <button ref="button" type="button" class="resource-icon-button" :class="{ active: open }" :title="label" :aria-label="label" :aria-expanded="open" :aria-controls="panelId" :popovertarget="inlineMode ? undefined : panelId" @click="inlineMode && toggle()">
      <span :class="icon" aria-hidden="true" />
    </button>
  </div>
</template>

<script>
let nextPopupId = 0;
</script>
<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({ label: String, icon: String, panelClass: String, width: { type: Number, default: 320 }, inline: Boolean, alignment: { type: String, default: 'end' } });
const panelId = `sb-toolbar-popup-${++nextPopupId}`;
const host = ref(null), panel = ref(null), button = ref(null), open = ref(false), inlineMode = ref(false);
let observer, parentDialog;
const closeOnDialog = () => close();
function position() {
  if (!open.value || inlineMode.value) return;
  const anchor = button.value.getBoundingClientRect();
  if (!anchor.width || anchor.bottom < 0 || anchor.top > window.innerHeight) { close(); return; }
  const bounds = panel.value.getBoundingClientRect();
  const below = window.innerHeight - anchor.bottom - 8;
  const alignLeft = (props.alignment === 'start') !== (getComputedStyle(host.value).direction === 'rtl');
  panel.value.style.left = `${Math.max(8, Math.min(alignLeft ? anchor.left : anchor.right - bounds.width, window.innerWidth - bounds.width - 8))}px`;
  panel.value.style.top = `${Math.max(8, below < bounds.height && anchor.top > below ? anchor.top - bounds.height : anchor.bottom)}px`;
  panel.value.style.maxHeight = `${Math.max(80, Math.max(below, anchor.top - 8))}px`;
}
function close(restoreFocus = false) {
  if (panel.value?.matches(':popover-open')) panel.value.hidePopover();
  open.value = false;
  if (restoreFocus) button.value?.focus();
}
async function toggle() {
  if (open.value) { close(); return; }
  open.value = true;
  await nextTick();
  panel.value.querySelector('input:not(:disabled), select:not(:disabled), button:not(:disabled)')?.focus({ preventScroll: true });
}
async function syncOpen(event) {
  if (inlineMode.value) return;
  open.value = event.newState === 'open';
  if (open.value) {
    await nextTick(); position();
    panel.value.querySelector('input:not(:disabled), select:not(:disabled), button:not(:disabled)')?.focus({ preventScroll: true });
  }
}
function escape(event) {
  if (event.key !== 'Escape' || !open.value) return;
  event.stopPropagation(); event.preventDefault(); close(true);
}
function outside(event) { if (inlineMode.value && !host.value?.contains(event.target)) close(); }
onMounted(() => {
  parentDialog = host.value.closest('dialog');
  parentDialog?.addEventListener('close', closeOnDialog);
  document.addEventListener('pointerdown', outside);
  window.addEventListener('scroll', position, true);
  window.addEventListener('resize', position);
  observer = new ResizeObserver(([entry]) => {
    if (!entry.contentRect.width) close();
    const next = props.inline && entry.contentRect.width >= 800;
    if (next !== inlineMode.value) { close(); inlineMode.value = next; }
  });
  observer.observe(host.value.closest('.resource-toolbar'));
});
onBeforeUnmount(() => {
  close(); observer?.disconnect();
  parentDialog?.removeEventListener('close', closeOnDialog);
  document.removeEventListener('pointerdown', outside);
  window.removeEventListener('scroll', position, true);
  window.removeEventListener('resize', position);
});
</script>
