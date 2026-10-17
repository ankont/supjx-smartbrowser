<template>
  <div class="resource-lightweight-area">
  <div v-show="!nativePreview" ref="surface" class="resource-lightweight-visual" :class="{ 'has-override': Boolean(override), 'is-information-visual': !contentOnly, 'is-grid-information': !contentOnly && resource?.type !== 'image', 'has-unavailable-content': contentOnly && resource?.id && !image }">
      <ResourceVisual v-if="!contentOnly" :resource="resource" :fit-content="resource.type === 'image'" />
    <ResourcePreviewRenderer v-else-if="!nativePreview" :context="rendererContext" @active-change="customActive = $event" @before-update="presentation?.release()">
      <ResourceVisual ref="fallbackVisual" :resource="genericResource" presentation-managed @image-change="fallbackImage = $event" />
    </ResourcePreviewRenderer>
    <ResourceVisualOverlays v-if="enrichedOverlayContext && !nativePreview" :context="enrichedOverlayContext" />
    <ResourceImagePresentation v-if="enrichedOverlayContext && contentOnly && !nativePreview" ref="presentation" :image-element="currentImage" :context="enrichedOverlayContext" @providers-change="presentationRevision++" />
  </div>
    <div v-if="canPreview" class="resource-lightweight-actions resource-lightweight-eye-action">
      <button v-if="canPreview" type="button" class="resource-lightweight-icon-action" :title="t('COM_SMARTBROWSER_ACTION_PREVIEW')" :aria-label="t('COM_SMARTBROWSER_ACTION_PREVIEW')" @click="$emit('preview')"><span class="fas fa-eye" aria-hidden="true" /></button>
    </div>
    <div ref="previewActionsEl" class="resource-lightweight-actions resource-lightweight-preview-action">
      <button v-if="editable && hasPreviewChanges" type="button" class="resource-lightweight-icon-action" :disabled="picking" :title="t('COM_SMARTBROWSER_USAGE_CLEAR')" :aria-label="t('COM_SMARTBROWSER_USAGE_CLEAR')" @click="resetPreview"><span class="fas fa-times" aria-hidden="true" /></button>
      <template v-for="definition in editableThumbnails" :key="definition.key">
        <button type="button" :class="{ selected: Boolean(values?.[definition.key]) }" :disabled="picking" :title="t(values?.[definition.key] ? 'COM_SMARTBROWSER_USAGE_CHANGE_THUMBNAIL' : 'COM_SMARTBROWSER_USAGE_ADD_THUMBNAIL')" :aria-label="t(values?.[definition.key] ? 'COM_SMARTBROWSER_USAGE_CHANGE_THUMBNAIL' : 'COM_SMARTBROWSER_USAGE_ADD_THUMBNAIL')" @click="pick(definition)"><span class="fas fa-image" aria-hidden="true" /></button>
      </template>
      <slot name="actions" />
    </div>
  </div>
  <small v-if="error || thumbnailDefinitions.some(definition => errors?.[definition.key])" class="text-danger" role="alert">{{ t(error || errors[thumbnailDefinitions.find(definition => errors?.[definition.key]).key]) }}</small>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue';
import { lightweightImage, genericPreviewResource, previewVisuals, thumbnailCapabilities, resolveThumbnailResource } from '../core/lightweightVisual.js';
import { normalizeReference } from '../core/selectionUsage.js';
import { resourceKey } from '../core/selectionIdentity.js';
import ResourceVisual from './ResourceVisual.vue';
import ResourceVisualOverlays from './ResourceVisualOverlays.vue';
import ResourcePreviewRenderer from './ResourcePreviewRenderer.vue';
import ResourceImagePresentation from './ResourceImagePresentation.vue';
const props = defineProps({ resource: Object, definitions: Array, values: Object, errors: Object, resolveReference: Function, canPreview: Boolean, editable: Boolean, contentOnly: Boolean, nativePreview: Boolean, overlayContext: Object, t: Function });
const emit = defineEmits(['change', 'preview']);
const thumbnailDefinitions = computed(() => thumbnailCapabilities(props.definitions));
const editableThumbnails = computed(() => props.editable ? thumbnailDefinitions.value.filter(definition => definition.presentation !== 'hidden') : []);
const override = computed(() => thumbnailDefinitions.value.find(definition => props.values?.[definition.key]));
const resolvedImage = ref(''), error = ref(''), picking = ref(false), surface = ref(null);
const resolvedResource = ref(null);
const previewActionsEl = ref(null);
const fallbackImage = shallowRef(null), customImage = shallowRef(null), customActive = ref(false);
const presentation = ref(null);
const fallbackVisual = ref(null);
const imageVersion = ref(0);
let imageOwner = null;
const currentImage = computed(() => customActive.value ? customImage.value : fallbackImage.value);
const notifyPresentationChange = detail => {
  if (!customActive.value) fallbackVisual.value?.refreshPresentation();
  imageOwner?.onPresentationChange?.(detail);
  surface.value?.dispatchEvent(new CustomEvent('smartbrowser:image-presentation-change', { detail, bubbles: true }));
};
const setImageElement = (element, options = {}) => {
  if (element != null && (element.tagName !== 'IMG' || !surface.value?.contains(element))) throw new TypeError('The primary image must belong to this preview.');
  presentation.value?.release();
  const owner = { onPresentationChange: options.onPresentationChange };
  imageOwner = owner; customImage.value = element;
  imageVersion.value++;
  return () => { if (imageOwner === owner) { presentation.value?.release(); imageOwner = null; customImage.value = null; } };
};
const enrichedOverlayContext = computed(() => props.overlayContext ? { ...props.overlayContext, actionsContainer: previewActionsEl.value,
  visualElement: surface.value, imageElement: currentImage.value, getImageElement: () => currentImage.value,
  imageUrl: image.value, imageVersion: imageVersion.value, resolvedImage: resolvedResource.value || props.resource, values: props.values || {}, notifyPresentationChange } : null);
const presentationRevision = ref(0);
const hasPreviewChanges = computed(() => { presentationRevision.value; return Boolean(override.value || props.overlayContext?.hasPreviewChanges?.()); });
async function resetPreview() {
  picking.value = true;
  try {
    if (props.overlayContext?.resetPreview) await props.overlayContext.resetPreview();
    else for (const definition of editableThumbnails.value) emit('change', definition.key, null);
  } catch { error.value = 'COM_SMARTBROWSER_USAGE_INVALID'; }
  finally { picking.value = false; }
}
const image = computed(() => {
  return props.contentOnly && props.resource?.type === 'image' ? props.resource.metadata?.url || props.resource.image || lightweightImage(props.resource) : resolvedImage.value || lightweightImage(props.resource);
});
const genericResource = computed(() => ({ ...genericPreviewResource(props.resource, props.values, resolvedImage.value), imageCrop: resolvedResource.value?.imageCrop || props.resource?.imageCrop }));
const rendererContext = computed(() => ({ ...props.overlayContext, resource: props.resource,
  visualElement: surface.value, setImageElement, getImageElement: () => currentImage.value, imageUrl: image.value,
  resolvedImage: resolvedResource.value || props.resource, actionsContainer: previewActionsEl.value,
  values: props.values || {}, visuals: previewVisuals(genericResource.value, props.values, image.value),
  isReadOnly: props.overlayContext?.isReadOnly !== false, purpose: 'preview' }));
let generation = 0, disposed = false;
watch(() => [resourceKey(props.resource), override.value, override.value && props.values?.[override.value.key]], async () => {
  const current = ++generation;
  resolvedImage.value = ''; resolvedResource.value = null; error.value = '';
  const definition = override.value;
  if (!definition) return;
  try {
    const thumbnail = await resolveThumbnailResource(definition, props.values[definition.key], props.resolveReference);
    if (current !== generation) return;
    resolvedResource.value = thumbnail; resolvedImage.value = lightweightImage(thumbnail);
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

