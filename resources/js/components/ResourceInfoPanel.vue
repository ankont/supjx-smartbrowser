<template>
  <aside class="resource-info-panel" :class="{ 'has-usage': usageDefinitions?.length, 'showing-usage': usageDefinitions?.length && tab === 'usage' }">
    <template v-if="resource">
      <div v-if="usageDefinitions?.length" class="resource-info-tabs" role="tablist">
        <button type="button" role="tab" :aria-selected="tab === 'usage'" @click="selectTab('usage')">{{ t('COM_SMARTBROWSER_USAGE_OPTIONS') }}</button>
        <button type="button" role="tab" :aria-selected="tab === 'info'" @click="selectTab('info')">{{ t('COM_SMARTBROWSER_USAGE_INFO') }}</button>
      </div>
      <LightweightResourceVisual ref="previewElement" :resource="resource" :definitions="usageDefinitions" :values="usageValues" :errors="usageErrors" :resolve-reference="resolveReference" :can-preview="canPreview" :editable="tab === 'usage'" :t="t" @preview="$emit('preview')" @change="(key, value) => $emit('usage-change', key, value)">
        <template #actions>
          <button v-for="action in previewActions" :key="action.id" type="button" :disabled="actionBusy" :title="t(action.label)" :aria-label="t(action.label)" @click="runPreviewAction(action)"><span :class="action.icon || 'fas fa-bolt'" aria-hidden="true" /></button>
        </template>
      </LightweightResourceVisual>
      <h3>{{ resource.title }}</h3>
      <SelectionUsageEditor v-if="usageDefinitions?.length && tab === 'usage'" :key="resourceKey(resource)" :definitions="formDefinitions" :values="usageValues" :errors="usageErrors" :resource="resource" :t="t" :editors="usageEditors" :resolve-reference="resolveReference" @change="(key, value) => $emit('usage-change', key, value)" />
      <template v-else>
      <dl v-if="fields?.length">
        <div v-for="field in visibleFields" :key="`${field.source}-${field.label}`" v-show="fieldValue(field) !== '' && fieldValue(field) !== null && fieldValue(field) !== undefined">
          <dt><span :class="fieldIcon(field)" aria-hidden="true" />{{ t(field.label) }}</dt>
          <dd v-if="field.format === 'language'" class="resource-language">
            <img v-if="resource.metadata?.languageImage" :src="resource.metadata.languageImage" alt="" aria-hidden="true">
            <span v-else-if="rawFieldValue(field) === '*'" class="resource-language-all fas fa-asterisk" aria-hidden="true" />
            <span>{{ fieldValue(field) }}</span>
          </dd>
          <dd v-else :class="{ 'resource-info-identifier': field.source === 'metadata.alias' || field.source === 'metadata.username', 'resource-info-lines': field.source === 'metadata.tagPaths' }">{{ fieldValue(field) }}</dd>
          <small v-if="field.format === 'date' && timezoneLabel(rawFieldValue(field))" class="resource-info-timezone">{{ timezoneLabel(rawFieldValue(field)) }}</small>
        </div>
      </dl>
      <dl v-else>
        <div v-if="resource.parentId">
          <dt><span class="fas fa-folder" aria-hidden="true" />{{ t('COM_SMARTBROWSER_FOLDER') }}</dt>
          <dd>{{ resource.parentId }}</dd>
        </div>
        <div>
          <dt><span class="fas fa-file-alt" aria-hidden="true" />{{ t('COM_SMARTBROWSER_TYPE') }}</dt>
          <dd>{{ typeLabel }}</dd>
        </div>
        <div v-if="resource.metadata.created">
          <dt><span class="fas fa-calendar" aria-hidden="true" />{{ t('COM_SMARTBROWSER_DATE_CREATED') }}</dt>
          <dd>{{ formatDate(resource.metadata.created) }}</dd>
          <small v-if="timezoneLabel(resource.metadata.created)" class="resource-info-timezone">{{ timezoneLabel(resource.metadata.created) }}</small>
        </div>
        <div v-if="resource.metadata.modified">
          <dt><span class="fas fa-calendar" aria-hidden="true" />{{ t('COM_SMARTBROWSER_DATE_MODIFIED') }}</dt>
          <dd>{{ formatDate(resource.metadata.modified) }}</dd>
          <small v-if="timezoneLabel(resource.metadata.modified)" class="resource-info-timezone">{{ timezoneLabel(resource.metadata.modified) }}</small>
        </div>
        <div v-if="resource.metadata.width && resource.metadata.height">
          <dt><span class="fas fa-expand" aria-hidden="true" />{{ t('COM_SMARTBROWSER_DIMENSIONS') }}</dt>
          <dd>{{ resource.metadata.width }}px × {{ resource.metadata.height }}px</dd>
        </div>
        <div v-if="resource.metadata.size">
          <dt><span class="fas fa-database" aria-hidden="true" />{{ t('COM_SMARTBROWSER_SIZE') }}</dt>
          <dd>{{ formatSize(resource.metadata.size) }}</dd>
        </div>
        <div v-if="resource.metadata.mimeType">
          <dt><span class="fas fa-file-alt" aria-hidden="true" />{{ t('COM_SMARTBROWSER_MIME_TYPE') }}</dt>
          <dd>{{ resource.metadata.mimeType }}</dd>
        </div>
        <div v-if="resource.metadata.extension">
          <dt><span class="fas fa-file-alt" aria-hidden="true" />{{ t('COM_SMARTBROWSER_EXTENSION') }}</dt>
          <dd>{{ resource.metadata.extension }}</dd>
        </div>
        <div>
          <dt><span class="fas fa-key" aria-hidden="true" />{{ t('JGLOBAL_FIELD_ID_LABEL') }}</dt>
          <dd>{{ resource.metadata.id ?? resource.id }}</dd>
        </div>
      </dl>
      </template>
    </template>
  </aside>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { resourceKey } from '../core/selectionIdentity.js';
import { iconForField } from '../core/fieldIcons.js';
import LightweightResourceVisual from './LightweightResourceVisual.vue';
import { thumbnailCapabilities } from '../core/lightweightVisual.js';
import SelectionUsageEditor from './SelectionUsageEditor.vue';

const props = defineProps({ resource: Object, fields: Array, t: Function, usageDefinitions: Array, usageValues: Object, usageErrors: Object, usageEditors: Object, resolveReference: Function, previewActions: Array, previewContext: Object, usageRevision: Number, canPreview: Boolean });
defineEmits(['usage-change', 'preview']);
const formDefinitions = computed(() => (props.usageDefinitions || []).filter(definition => !thumbnailCapabilities([definition]).length));
const tab = ref('info');
const preferredTab = ref('usage');
const selectTab = value => { preferredTab.value = value; tab.value = value; };
const actionBusy = ref(false);
const previewElement = ref(null);
let previewAbort;
watch(() => resourceKey(props.resource), () => previewAbort?.abort());
onBeforeUnmount(() => previewAbort?.abort());
watch(() => Boolean(props.usageDefinitions?.length), available => { tab.value = available ? preferredTab.value : 'info'; }, { immediate: true });
watch(() => props.usageRevision, () => { if (props.usageDefinitions?.length) tab.value = 'usage'; });
async function runPreviewAction(action) {
  actionBusy.value = true;
  previewAbort = new AbortController();
  const signal = previewAbort.signal;
  try { await action.run({ ...props.previewContext, previewElement: previewElement.value?.element, signal }); }
  catch (error) { if (!signal.aborted) Joomla.renderMessages({ error: [error.message || props.t('COM_SMARTBROWSER_USAGE_INVALID')] }); }
  finally { actionBusy.value = false; }
}
const supplementalFields = [
  ['metadata.access', 'JFIELD_ACCESS_LABEL'],
  ['metadata.categoryPath', 'COM_SMARTBROWSER_CATEGORY_HIERARCHY'],
  ['metadata.parent', 'COM_SMARTBROWSER_PARENT'],
  ['metadata.parentPath', 'COM_SMARTBROWSER_PARENT'],
  ['metadata.tagPaths', 'COM_SMARTBROWSER_TAG_HIERARCHY'],
  ['metadata.url', 'COM_SMARTBROWSER_URL'],
  ['metadata.link', 'COM_SMARTBROWSER_URL'],
  ['metadata.mimeType', 'COM_SMARTBROWSER_MIME_TYPE'],
  ['metadata.extension', 'COM_SMARTBROWSER_EXTENSION'],
  ['metadata.size', 'COM_SMARTBROWSER_SIZE', 'size'],
  ['metadata.width', 'COM_SMARTBROWSER_DIMENSIONS', 'dimensions'],
].map(([source, label, format]) => ({ source, label, format }));
const visibleFields = computed(() => {
  const fields = (props.resource?.infoFields?.length ? props.resource.infoFields : props.fields || []).filter((field) =>
    (!field.kinds || field.kinds.includes(props.resource?.kind))
    && !['metadata.locationPath', 'metadata.category', 'metadata.tags'].includes(field.source));
  const present = new Set(fields.map((field) => field.source));
  return [...fields, ...supplementalFields.filter((field) => {
    const value = props.resource?.metadata?.[field.source.split('.')[1]];
    return !present.has(field.source) && value !== null && value !== undefined && value !== '';
  })];
});
const fieldIcon = iconForField;
const typeLabel = computed(() => {
  if (props.resource?.kind === 'node') return props.t('COM_SMARTBROWSER_FOLDER');
  if (!props.resource?.type) return props.t('COM_SMARTBROWSER_RESOURCE');
  return props.resource.type.charAt(0).toUpperCase() + props.resource.type.slice(1);
});
const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  const pad = (part) => String(part).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
const formatSize = (bytes) => `${(bytes / 1024).toFixed(2)} KB`;
const rawFieldValue = (field) => String(field.source || '').split('.').reduce((value, part) => value?.[part], props.resource);
const fieldValue = (field) => {
  if ((field.format === 'language' || field.source === 'metadata.language') && rawFieldValue(field) === '*') return props.t('COM_SMARTBROWSER_ALL_LANGUAGES');
  if (field.format === 'date') return formatDate(rawFieldValue(field));
  if (field.format === 'size') return rawFieldValue(field) !== null && rawFieldValue(field) !== undefined ? formatSize(rawFieldValue(field)) : '';
  if (field.format === 'dimensions') return props.resource?.metadata.width && props.resource?.metadata.height
    ? `${props.resource.metadata.width}px \u00d7 ${props.resource.metadata.height}px`
    : '';
  return rawFieldValue(field);
};
const timezoneLabel = (value) => {
  const match = String(value || '').trim().match(/(Z|[+-]\d{2}:?\d{2})$/i);
  if (!match) return '';

  const sourceOffset = match[1].toUpperCase() === 'Z'
    ? 0
    : (match[1].startsWith('-') ? -1 : 1) * ((Number(match[1].slice(1, 3)) * 60) + Number(match[1].slice(-2)));
  const date = new Date(value);
  const userOffset = -date.getTimezoneOffset();
  if (sourceOffset === userOffset) return '';

  const sign = sourceOffset >= 0 ? '+' : '-';
  const absolute = Math.abs(sourceOffset);
  const offset = sourceOffset === 0 ? 'UTC' : `UTC${sign}${String(Math.floor(absolute / 60)).padStart(2, '0')}:${String(absolute % 60).padStart(2, '0')}`;
  return `${props.t('COM_SMARTBROWSER_SOURCE_TIMEZONE')}: ${offset}`;
};
</script>
