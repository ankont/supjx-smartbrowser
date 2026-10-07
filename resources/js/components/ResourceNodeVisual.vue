<template>
  <ResourceVisual :resource="resource" variant="compact" :allow-image="false" :open="open" align-base-start />
</template>

<script setup>
import ResourceVisual from './ResourceVisual.vue';
defineProps({ resource: Object, open: Boolean });
</script>
