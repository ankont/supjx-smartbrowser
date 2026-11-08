<template>
  <button type="button" class="btn btn-outline-secondary sb-personal-preferences-button" :title="t('COM_SMARTBROWSER_PERSONAL_TITLE')" :aria-label="t('COM_SMARTBROWSER_PERSONAL_TITLE')" @click="open"><span class="fas fa-sliders-h" aria-hidden="true" /></button>
  <Teleport to="body">
  <dialog ref="dialog" class="sb-personal-preferences" :aria-labelledby="titleId" @close="busy = false">
    <form @submit.prevent="save">
      <div class="sb-personal-heading">
        <h2 :id="titleId">{{ t('COM_SMARTBROWSER_PERSONAL_TITLE') }}</h2>
        <button type="button" class="btn btn-outline-secondary" :aria-expanded="showHelp" :aria-controls="titleId + '-help'" :title="t('JINLINEHELP')" :aria-label="t('JINLINEHELP')" @click="showHelp = !showHelp"><span class="fas fa-question-circle" aria-hidden="true" /> <span class="sb-personal-help-label">{{ t('JINLINEHELP') }}</span></button>
      </div>
      <p>{{ t('COM_SMARTBROWSER_PERSONAL_DESCRIPTION') }}</p>
      <div :id="titleId + '-help'">
      <section v-for="group in fieldGroups" :key="group.id" class="sb-personal-group" :class="{ 'sb-personal-context-group': group.id === 'context', 'has-single-field': group.fields.length === 1 }">
      <h3 v-if="group.id === 'context'" class="sb-personal-group-title">{{ t('COM_SMARTBROWSER_PERSONAL_CONTEXT') }}</h3>
      <label v-for="field in group.fields" :key="field.key" class="sb-personal-field"><span>{{ field.adapter ? contextLabel(field.adapter) : t(field.label) }}</span>
        <input v-if="field.key === 'pageSize'" v-model.number="settings.pageSize" @input="clearInheritedSize" type="number" min="0" :max="Number.MAX_SAFE_INTEGER" step="1" class="form-control" :placeholder="pageSizeHint" :disabled="busy" :aria-describedby="showHelp ? titleId + '-pageSize' : undefined">
        <select v-else :value="field.adapter ? settings.contextItemsByAdapter[field.adapter] : settings[field.key]" @change="field.adapter ? settings.contextItemsByAdapter[field.adapter] = $event.target.value : settings[field.key] = $event.target.value" class="form-select" :disabled="busy" :aria-describedby="showHelp ? (field.adapter ? titleId + '-context-help' : titleId + '-' + field.key) : undefined"><option v-for="value in field.values" :key="value" :value="value">{{ optionLabel(field, value) }}</option></select>
        <small v-if="showHelp && !field.adapter" :id="titleId + '-' + field.key" class="form-text" :class="{ 'sb-personal-integration-help': field.key === 'integration' }">{{ t(field.label + '_DESC') }}</small>
      </label>
      <small v-if="showHelp && group.id === 'context'" :id="titleId + '-context-help'" class="form-text sb-personal-group-help">{{ t('COM_SMARTBROWSER_PERSONAL_CONTEXT_DESC') }}</small>
      </section>
      </div>
      <p v-if="error" role="alert" class="alert alert-danger">{{ error }}</p>
      <p v-if="notice" role="status">{{ notice }}</p>
      <div class="sb-personal-buttons">
        <button v-if="currentView" type="button" class="btn btn-outline-secondary" :disabled="busy" @click="$emit('reset-view'); notice = t('COM_SMARTBROWSER_PERSONAL_RESET_DONE')">{{ t('COM_SMARTBROWSER_PERSONAL_RESET_VIEW') }}</button>
        <button type="button" class="btn btn-outline-danger" :disabled="busy" @click="reset">{{ t('COM_SMARTBROWSER_PERSONAL_RESET_ALL') }}</button>
      </div>
      <div class="sb-personal-buttons"><button type="submit" class="btn btn-primary" :disabled="busy">{{ t('COM_SMARTBROWSER_PERSONAL_SAVE_CLOSE') }}</button><button type="button" class="btn btn-danger" :disabled="busy" @click="dialog.close()">{{ t('JCANCEL') }}</button></div>
    </form>
  </dialog>
  </Teleport>
</template>
<script setup>
import { computed, ref, useId } from 'vue';
import { preferenceStorage } from '../core/userPreferences.js';
import { contextAdapters, personalPreferences, savePersonalPreferences } from '../core/personalPreferences.js';
const props = defineProps({ t: Function, currentView: Boolean, adapter: String });
const emit = defineEmits(['saved', 'reset-view']);
const titleId = useId();
const dialog = ref(null), settings = ref(personalPreferences()), busy = ref(false), error = ref(''), notice = ref(''), showHelp = ref(false);
function contextLabel(adapter) {
  const key = 'COM_SMARTBROWSER_PERSONAL_CONTEXT_' + adapter.toUpperCase();
  const label = props.t(key);
  return label === key ? props.t('COM_SMARTBROWSER_ADAPTER_' + adapter.toUpperCase()) : label;
}
function optionLabel(field, value) {
  const label = props.t('COM_SMARTBROWSER_PERSONAL_VALUE_' + value.toUpperCase());
  if (value !== 'inherit') return label;
  const defaults = window.Joomla?.getOptions?.('com_smartbrowser.preferences', {})?.globalDefaults || {};
  const global = field.adapter ? defaults.contextItemsByAdapter?.[field.adapter] || defaults.contextItems : defaults[field.key];
  return global ? `${label} (${props.t('COM_SMARTBROWSER_PERSONAL_VALUE_' + global.toUpperCase())})` : label;
}
const fields = computed(() => [
  { key: 'loadingMode', label: 'COM_SMARTBROWSER_PERSONAL_LOADING', values: ['inherit', 'all', 'smart', 'pages'] },
  { key: 'pageSize', label: 'COM_SMARTBROWSER_PERSONAL_PAGE_SIZE' },
  { key: 'editorMode', label: 'COM_SMARTBROWSER_PERSONAL_EDITOR', values: ['inherit', 'modal', 'page'] },
  ...contextAdapters.filter(adapter => !props.adapter || adapter === props.adapter.replace(/^flat-/, '')).map(adapter => ({ key: 'contextItemsByAdapter.' + adapter, adapter, label: 'COM_SMARTBROWSER_PERSONAL_CONTEXT', values: ['inherit', 'show', 'hide'] })),
  { key: 'integration', label: 'COM_SMARTBROWSER_PERSONAL_INTEGRATION', values: ['inherit', 'smartbrowser', 'native'] },
  { key: 'pickerStateScope', label: 'COM_SMARTBROWSER_PERSONAL_STATE_SCOPE', values: ['caller', 'adapter'] },
  { key: 'pickerNodeScope', label: 'COM_SMARTBROWSER_PERSONAL_NODE_SCOPE', values: ['caller', 'adapter'] },
]);
const fieldGroups = computed(() => [
  { id: 'general', fields: fields.value.filter(field => ['editorMode', 'integration'].includes(field.key)) },
  { id: 'remember', fields: fields.value.filter(field => ['pickerStateScope', 'pickerNodeScope'].includes(field.key)) },
  { id: 'loading', fields: fields.value.filter(field => ['loadingMode', 'pageSize'].includes(field.key)) },
  { id: 'context', fields: fields.value.filter(field => field.adapter) },
].filter(group => group.fields.length));
const pageSizeHint = computed(() => `${props.t('COM_SMARTBROWSER_PERSONAL_VALUE_INHERIT')} (${window.Joomla?.getOptions?.('com_smartbrowser.preferences', {})?.globalDefaults?.pageSize || 50})`);
function open() { settings.value = personalPreferences(); error.value = ''; notice.value = ''; dialog.value.showModal(); }
function clearInheritedSize(event) {
  if (event.target.value !== '' && Number(event.target.value) <= 0) {
    settings.value.pageSize = null;
    event.target.value = '';
  }
}
async function save() {
  busy.value = true; error.value = '';
  try { const value = await savePersonalPreferences(settings.value); emit('saved', value); dialog.value.close(); }
  catch (exception) { error.value = window.Joomla?.Text?._(exception.message, exception.message) || exception.message; }
  finally { busy.value = false; }
}
async function reset() {
  busy.value = true; error.value = '';
  try {
    const storage = preferenceStorage();
    if (storage.reset) await storage.reset();
    else { const keys = Array.from({ length: storage.length }, (_, index) => storage.key(index)).filter(key => key?.startsWith('supjx.smartbrowser.') || key?.startsWith('smartbrowser.')); keys.forEach(key => storage.removeItem(key)); }
    settings.value = personalPreferences(); emit('reset-view'); emit('saved', settings.value); dialog.value.close();
  } catch (exception) { error.value = exception.message; }
  finally { busy.value = false; }
}
</script>
