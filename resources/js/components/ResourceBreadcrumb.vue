<template>
  <nav class="resource-breadcrumb" aria-label="Breadcrumb">
    <button v-for="(crumb, index) in trail" :key="crumb.id" type="button" :class="{ 'root-crumb': index === 0 && iconOnlyRoot }" :title="crumb.title" :aria-label="index === 0 && iconOnlyRoot ? crumb.title : undefined" @click="$emit('open', crumb.id)">
      <span v-if="index === 0" :class="crumb.useResourceIcon ? crumb.openIcon || crumb.icon : rootIcon" aria-hidden="true" />
      <span v-if="index !== 0 || !iconOnlyRoot" class="resource-breadcrumb-title">{{ crumb.title }}</span>
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({ breadcrumb: Array, root: Object, rootIcon: String, iconOnlyRoot: Boolean });
defineEmits(['open']);
const trail = computed(() => {
  const items = props.breadcrumb || [];
  const first = items[0] || props.root;
  return first ? [first, ...items.slice(1).filter((item) => item.visible !== false)] : [];
});
</script>
