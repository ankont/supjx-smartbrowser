<template>
  <div class="resource-usage-field">
    <label v-if="definition.editor !== 'boolean'" :for="fieldId">{{ t(definition.label) }}<span v-if="definition.required" aria-hidden="true"> *</span></label>
    <input v-if="definition.editor === 'text'" :id="fieldId" class="form-control" type="text" :value="value ?? ''" :required="definition.required" :aria-invalid="Boolean(error)" @input="change($event.target.value)">
    <textarea v-else-if="definition.editor === 'textarea'" :id="fieldId" class="form-control" rows="3" :value="value ?? ''" :required="definition.required" :aria-invalid="Boolean(error)" @input="change($event.target.value)" />
    <label v-else-if="definition.editor === 'boolean'" class="resource-usage-check">
      <input :id="fieldId" class="form-check-input" type="checkbox" :checked="value === true" @change="change($event.target.checked)">{{ t(definition.label) }}
    </label>
    <select v-else-if="definition.editor === 'select'" :id="fieldId" class="form-select" :value="value" :aria-invalid="Boolean(error)" @change="change(definition.options.find(option => String(option.value) === $event.target.value)?.value)">
      <option v-if="!definition.required && !definition.options?.some(option => option.value === '')" value="">{{ t('COM_SMARTBROWSER_USAGE_CHOOSE') }}</option>
      <option v-for="option in definition.options" :key="String(option.value)" :value="option.value">{{ t(option.label) }}</option>
    </select>
    <input v-else-if="definition.editor === 'number'" :id="fieldId" class="form-control" type="number" :value="value ?? ''" :aria-invalid="Boolean(error)" @input="change($event.target.value === '' ? null : Number($event.target.value))">
    <template v-else-if="definition.editor === 'resource'">
      <select :id="fieldId" class="form-select" :value="referenceMode" @change="setReferenceMode($event.target.value)">
        <option value="auto">{{ t('COM_SMARTBROWSER_USAGE_AUTO') }}</option>
        <option value="custom">{{ t('COM_SMARTBROWSER_USAGE_CUSTOM') }}</option>
      </select>
      <div v-if="referenceMode === 'custom'" class="resource-usage-reference">
        <span v-if="value">{{ referenceTitle || value.id }}</span>
        <button type="button" class="btn btn-outline-primary" :disabled="picking" @click="pick"><span class="fas fa-plus" aria-hidden="true" /> {{ t(definition.pickerLabel || 'COM_SMARTBROWSER_USAGE_PICK_RESOURCE') }}</button>
        <button v-if="value" type="button" class="btn btn-outline-secondary" :title="t('COM_SMARTBROWSER_USAGE_CLEAR')" :aria-label="t('COM_SMARTBROWSER_USAGE_CLEAR')" @click="clear"><span class="fas fa-times" aria-hidden="true" /></button>
      </div>
    </template>
    <div v-else-if="customEditor" ref="customContainer" />
    <small v-else class="text-danger">{{ t('COM_SMARTBROWSER_USAGE_EDITOR_UNAVAILABLE') }}</small>
    <small v-if="definition.description">{{ t(definition.description) }}</small>
    <small v-if="error || localError" class="text-danger" role="alert">{{ t(error || localError) }}</small>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { normalizeReference } from '../core/selectionUsage.js';
const props = defineProps({ definition: Object, resource: Object, value: null, values: Object, error: String, t: Function, editors: Object, resolveReference: Function });
const emit = defineEmits(['change']);
const fieldId = `sb-usage-${Math.random().toString(36).slice(2)}`;
const referenceMode = ref(props.value ? 'custom' : 'auto');
const referenceTitle = ref('');
const picking = ref(false);
const localError = ref('');
const customContainer = ref(null);
const customEditor = computed(() => props.editors?.[props.definition.editor]);
let editorInstance, abort, generation = 0, disposed = false;
const change = value => { localError.value = ''; emit('change', value); };
const clear = () => { referenceMode.value = 'auto'; change(null); };
const setReferenceMode = mode => { referenceMode.value = mode; if (mode === 'auto') change(null); };
watch(() => props.value, async value => {
  const current = ++generation;
  localError.value = '';
  referenceTitle.value = '';
  if (props.definition.type !== 'resource' || !value) return;
  referenceMode.value = 'custom';
  try {
    const resource = await props.resolveReference(value, props.definition.picker);
    if (current === generation) {
      referenceTitle.value = resource?.title || '';
      if (!resource || resource.unavailable) localError.value = 'COM_SMARTBROWSER_USAGE_INVALID';
    }
  } catch { if (current === generation) localError.value = 'COM_SMARTBROWSER_USAGE_INVALID'; }
}, { immediate: true });
async function pick() {
  picking.value = true;
  try {
    const selected = await window.SmartBrowserPicker.open({ ...props.definition.picker, multiple: false, initialSelection: props.value ? [props.value.id] : [] });
    if (selected && !disposed) change(normalizeReference({ adapter: props.definition.picker.adapter, id: selected.id }));
  } catch { localError.value = 'COM_SMARTBROWSER_USAGE_INVALID'; }
  finally { picking.value = false; }
}
watch([customEditor, () => props.resource?.id], async () => {
  abort?.abort(); editorInstance?.destroy?.(); editorInstance = null;
  await nextTick();
  if (disposed || !customEditor.value || !customContainer.value) return;
  abort = new AbortController();
  try {
    editorInstance = customEditor.value.mount(customContainer.value, { definition: props.definition, resource: props.resource,
      id: fieldId, value: props.value, values: props.values, setValue: change, signal: abort.signal, translate: props.t }) || null;
  } catch { localError.value = 'COM_SMARTBROWSER_USAGE_EDITOR_UNAVAILABLE'; }
}, { immediate: true });
watch(() => [props.value, props.values], () => editorInstance?.update?.({ value: props.value, values: props.values }), { deep: true });
onBeforeUnmount(() => { disposed = true; ++generation; abort?.abort(); editorInstance?.destroy?.(); });
</script>
