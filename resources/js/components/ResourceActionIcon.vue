<template>
  <span :class="icon === 'arrow-down-up-across-line' ? 'fas fa-arrow-down-up-across-line' : icon" aria-hidden="true" />
</template>
<script setup>
defineProps({ icon: String });
</script>
