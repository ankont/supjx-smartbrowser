<template>
  <div class="resource-usage-editor">
    <SelectionUsageField v-for="definition in primary" :key="definition.key" v-bind="fieldProps(definition)" @change="$emit('change', definition.key, $event)" />
    <details v-if="secondary.length" class="resource-usage-secondary" :open="secondary.some(definition => errors?.[definition.key]) || undefined">
      <summary>{{ t('COM_SMARTBROWSER_USAGE_MORE') }}</summary>
      <SelectionUsageField v-for="definition in secondary" :key="definition.key" v-bind="fieldProps(definition)" @change="$emit('change', definition.key, $event)" />
    </details>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import SelectionUsageField from './SelectionUsageField.vue';
const props = defineProps({ definitions: Array, values: Object, errors: Object, resource: Object, t: Function, editors: Object, resolveReference: Function });
defineEmits(['change']);
const primary = computed(() => props.definitions.filter(definition => definition.presentation === 'primary'));
const secondary = computed(() => props.definitions.filter(definition => definition.presentation === 'secondary'));
const fieldProps = definition => ({ definition, value: props.values[definition.key], values: props.values, error: props.errors?.[definition.key], resource: props.resource, t: props.t, editors: props.editors, resolveReference: props.resolveReference });
</script>
