<template>
  <div class="resource-lightweight-area">
  <div v-show="!nativePreview" ref="surface" class="resource-lightweight-visual" :class="{ 'has-override': Boolean(override), 'is-information-visual': !contentOnly, 'has-unavailable-content': contentOnly && resource?.id && !image }">
      <ResourceVisual v-if="!contentOnly" :resource="{ ...resource, image, icon }" fit-content />
    <img v-else-if="image && failed !== image" :src="image" alt="" loading="lazy" @error="failed = image">
    <span v-if="contentOnly && (!image || failed === image)" class="resource-preview-empty">{{ t('COM_SMARTBROWSER_PREVIEW_UNAVAILABLE') }}</span>
  </div>
    <div v-if="canPreview" class="resource-lightweight-actions resource-lightweight-preview-action">
      <button v-if="canPreview" type="button" :title="t('COM_SMARTBROWSER_ACTION_PREVIEW')" :aria-label="t('COM_SMARTBROWSER_ACTION_PREVIEW')" @click="$emit('preview')"><span class="fas fa-eye" aria-hidden="true" /></button>
    </div>
    <div class="resource-lightweight-actions">
      <template v-for="definition in editableThumbnails" :key="definition.key">
        <button type="button" :class="{ selected: Boolean(values?.[definition.key]) }" :disabled="picking" :title="t(values?.[definition.key] ? 'COM_SMARTBROWSER_USAGE_CHANGE_THUMBNAIL' : 'COM_SMARTBROWSER_USAGE_ADD_THUMBNAIL')" :aria-label="t(values?.[definition.key] ? 'COM_SMARTBROWSER_USAGE_CHANGE_THUMBNAIL' : 'COM_SMARTBROWSER_USAGE_ADD_THUMBNAIL')" @click="pick(definition)"><span class="fas fa-image" aria-hidden="true" /></button>
        <button v-if="values?.[definition.key]" type="button" :disabled="picking" :title="t('COM_SMARTBROWSER_USAGE_CLEAR')" :aria-label="t('COM_SMARTBROWSER_USAGE_CLEAR')" @click="$emit('change', definition.key, null)"><span class="fas fa-times" aria-hidden="true" /></button>
      </template>
      <slot name="actions" />
    </div>
  </div>
  <small v-if="error || thumbnailDefinitions.some(definition => errors?.[definition.key])" class="text-danger" role="alert">{{ t(error || errors[thumbnailDefinitions.find(definition => errors?.[definition.key]).key]) }}</small>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { effectiveIcon, lightweightImage, thumbnailCapabilities, resolveThumbnail } from '../core/lightweightVisual.js';
import { normalizeReference } from '../core/selectionUsage.js';
import { resourceKey } from '../core/selectionIdentity.js';
import ResourceVisual from './ResourceVisual.vue';
const props = defineProps({ resource: Object, definitions: Array, values: Object, errors: Object, resolveReference: Function, canPreview: Boolean, editable: Boolean, contentOnly: Boolean, nativePreview: Boolean, t: Function });
const emit = defineEmits(['change', 'preview']);
const thumbnailDefinitions = computed(() => thumbnailCapabilities(props.definitions));
const editableThumbnails = computed(() => props.editable ? thumbnailDefinitions.value.filter(definition => definition.presentation !== 'hidden') : []);
const icon = computed(() => effectiveIcon(props.resource, props.values));
const override = computed(() => thumbnailDefinitions.value.find(definition => props.values?.[definition.key]));
const resolvedImage = ref(''), failed = ref(''), error = ref(''), picking = ref(false), surface = ref(null);
const image = computed(() => props.contentOnly && props.resource?.type === 'image' ? props.resource.metadata?.url || props.resource.image || lightweightImage(props.resource) : resolvedImage.value || lightweightImage(props.resource));
let generation = 0, disposed = false;
watch(() => [resourceKey(props.resource), override.value, override.value && props.values?.[override.value.key]], async () => {
  const current = ++generation;
  resolvedImage.value = ''; failed.value = ''; error.value = '';
  const definition = override.value;
  if (!definition) return;
  try {
    const thumbnail = await resolveThumbnail(definition, props.values[definition.key], props.resolveReference);
    if (current !== generation) return;
    resolvedImage.value = thumbnail;
  } catch { if (current === generation) error.value = 'COM_SMARTBROWSER_USAGE_INVALID'; }
}, { immediate: true, deep: true });
async function pick(definition) {
  const id = resourceKey(props.resource);
  picking.value = true;
  try {
    const selected = await window.SmartBrowserPicker.open({ ...definition.picker, title: props.t('COM_SMARTBROWSER_SELECT_THUMBNAIL'), subtitle: props.resource.title, confirmLabel: props.t('COM_SMARTBROWSER_USE_THUMBNAIL'), multiple: false, initialSelection: props.values?.[definition.key] ? [props.values[definition.key].id] : [] });
    if (selected && !disposed && resourceKey(props.resource) === id) emit('change', definition.key, normalizeReference({ adapter: definition.picker.adapter, id: selected.id }));
  } catch { if (!disposed && resourceKey(props.resource) === id) error.value = 'COM_SMARTBROWSER_USAGE_INVALID'; }
  finally { picking.value = false; }
}
defineExpose({ element: surface });
onBeforeUnmount(() => { disposed = true; ++generation; });
</script>

