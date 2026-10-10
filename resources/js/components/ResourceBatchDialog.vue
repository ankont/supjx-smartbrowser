<template>
  <dialog ref="dialog" class="resource-batch-dialog" :aria-label="t('COM_SMARTBROWSER_BATCH_ACTIONS')">
    <div class="resource-batch-body">
      <div class="resource-batch-heading" role="heading" aria-level="3">{{ t('COM_SMARTBROWSER_BATCH_SELECT_ACTIONS') }}</div>
      <details v-if="orderingAvailable && items.every(item => item.capabilities?.reorder)" class="resource-batch-step" :open="sort.enabled">
        <summary @click.prevent="sort.enabled = !sort.enabled">{{ t('COM_SMARTBROWSER_BATCH_SORT') }}</summary>
        <div class="resource-batch-fields">
          <select v-model="sort.field" class="form-select" :aria-label="t('COM_SMARTBROWSER_BATCH_SORT')"><option v-for="field in sortFields" :key="field.id" :value="field.id">{{ t(field.label) }}</option></select>
          <select v-model="sort.direction" class="form-select" :aria-label="t('COM_SMARTBROWSER_SORT_DIRECTION')"><option value="asc">{{ t('COM_SMARTBROWSER_ASCENDING') }}</option><option value="desc">{{ t('COM_SMARTBROWSER_DESCENDING') }}</option></select>
        </div>
      </details>
      <template v-if="isMedia">
        <details class="resource-batch-step" :open="media.placement !== 'none'">
          <summary @click.prevent="media.placement = media.placement === 'none' ? 'move' : 'none'">{{ t('COM_SMARTBROWSER_BATCH_PLACEMENT') }}</summary>
          <div class="resource-batch-fields">
            <ResourceBatchModeToggle v-model="media.placement" :t="t" />
            <label>{{ t('COM_SMARTBROWSER_BATCH_DESTINATION_FOLDER') }}
              <span v-if="folderLoading" class="spinner-border spinner-border-sm" role="status" :aria-label="t('COM_SMARTBROWSER_LOADING_FOLDERS')" />
              <span v-else-if="folderError" class="text-danger">{{ folderError }}</span>
              <ResourceFancySelect v-else v-model="media.destination" :options="folderOptions" placeholder="COM_SMARTBROWSER_SELECT_FOLDER" :t="t" />
            </label>
          </div>
        </details>
        <details class="resource-batch-step" :open="media.rename">
          <summary @click.prevent="media.rename = !media.rename">{{ t('COM_SMARTBROWSER_BATCH_RENAME') }}</summary>
          <div class="resource-batch-fields">
            <label>{{ t('COM_SMARTBROWSER_BATCH_FIND') }}<input v-model="media.find" type="text" class="form-control"></label>
            <label>{{ t('COM_SMARTBROWSER_BATCH_REPLACE') }}<input v-model="media.replace" type="text" class="form-control" :disabled="!media.find"></label>
            <label>{{ t('COM_SMARTBROWSER_BATCH_PREFIX') }}<input v-model="media.prefix" type="text" class="form-control"></label>
            <label>{{ t('COM_SMARTBROWSER_BATCH_SUFFIX') }}<input v-model="media.suffix" type="text" class="form-control"></label>
            <label class="resource-batch-check"><input v-model="media.number" type="checkbox" class="form-check-input"> {{ t('COM_SMARTBROWSER_BATCH_NUMBER') }}</label>
            <label v-if="media.number">{{ t('COM_SMARTBROWSER_BATCH_START_AT') }}<input v-model.number="media.startAt" type="number" min="1" class="form-control"></label>
          </div>
        </details>
        <details class="resource-batch-step" :open="media.zip">
          <summary @click.prevent="media.zip = !media.zip">{{ t('COM_SMARTBROWSER_BATCH_ZIP') }}</summary>
          <div class="resource-batch-fields"><label>{{ t('COM_SMARTBROWSER_BATCH_ZIP_NAME') }}<span class="input-group"><input v-model="media.zipName" type="text" class="form-control" @blur="media.zipName = bareZipName"><span class="input-group-text">.zip</span></span></label></div>
        </details>
        <details v-if="canExtract" class="resource-batch-step" :open="media.extract">
          <summary @click.prevent="media.extract = !media.extract">{{ t('COM_SMARTBROWSER_BATCH_EXTRACT') }}</summary>
          <div class="resource-batch-fields"><label class="resource-batch-check"><input v-model="media.deleteArchive" type="checkbox" class="form-check-input" :disabled="!items.every(item => item.capabilities?.delete)"> {{ t('COM_SMARTBROWSER_BATCH_EXTRACT_DELETE') }}</label></div>
        </details>
      </template>
      <template v-else-if="isArticles">
        <details v-for="field in articleFields" :key="field.id" class="resource-batch-step" :open="article[field.enabled]">
          <summary @click.prevent="article[field.enabled] = !article[field.enabled]">{{ t(field.label) }}</summary>
          <div class="resource-batch-fields"><select v-model="article[field.id]" class="form-select" :aria-label="t(field.label)"><option value="">{{ t(field.placeholder) }}</option><option v-for="option in filterOptions(field.id)" :key="option.value" :value="option.value">{{ t(option.label) }}</option></select></div>
        </details>
        <details class="resource-batch-step" :open="article.tagsOpen">
          <summary @click.prevent="article.tagsOpen = !article.tagsOpen">{{ t('COM_SMARTBROWSER_BATCH_TAGS') }}</summary>
          <div v-if="article.tagsOpen" class="resource-batch-fields">
            <div class="resource-batch-field"><span>{{ t('COM_SMARTBROWSER_BATCH_ADD_TAG') }}</span><ResourceFancySelect :model-value="article.tagAdd" :options="filterOptions('tag')" multiple placeholder="COM_SMARTBROWSER_BATCH_KEEP_TAGS" :t="t" @update:model-value="updateTagAdd" /></div>
            <div class="resource-batch-field"><span>{{ t('COM_SMARTBROWSER_BATCH_REMOVE_TAG') }}</span><ResourceFancySelect :model-value="article.tagRemove" :options="filterOptions('tag')" multiple placeholder="COM_SMARTBROWSER_BATCH_KEEP_TAGS" :t="t" @update:model-value="updateTagRemove" /></div>
          </div>
        </details>
        <details class="resource-batch-step" :open="article.placement !== 'none'">
          <summary @click.prevent="article.placement = article.placement === 'none' ? 'move' : 'none'">{{ t('COM_SMARTBROWSER_BATCH_CATEGORY_PLACEMENT') }}</summary>
          <div v-if="article.placement !== 'none'" class="resource-batch-fields">
            <ResourceBatchModeToggle v-model="article.placement" :t="t" />
            <label>{{ t('COM_SMARTBROWSER_CATEGORY') }}<ResourceFancySelect v-model="article.category" :options="filterOptions('category')" placeholder="COM_SMARTBROWSER_SELECT_CATEGORY" :t="t" /></label>
          </div>
        </details>
      </template>
      <template v-else-if="isCategories || isTags || isMenus">
        <details v-for="field in sharedFields" :key="field.id" class="resource-batch-step" :open="shared[field.enabled]">
          <summary @click.prevent="shared[field.enabled] = !shared[field.enabled]">{{ t(field.label) }}</summary>
          <div v-if="shared[field.enabled]" class="resource-batch-fields"><select v-model="shared[field.id]" class="form-select" :aria-label="t(field.label)"><option value="">{{ t(field.placeholder) }}</option><option v-for="option in filterOptions(field.id)" :key="option.value" :value="option.value">{{ t(option.label) }}</option></select></div>
        </details>
        <details v-if="isCategories" class="resource-batch-step" :open="shared.tagsOpen">
          <summary @click.prevent="shared.tagsOpen = !shared.tagsOpen">{{ t('COM_SMARTBROWSER_BATCH_TAGS') }}</summary>
          <div v-if="shared.tagsOpen" class="resource-batch-fields">
            <div class="resource-batch-field"><span>{{ t('COM_SMARTBROWSER_BATCH_ADD_TAG') }}</span><ResourceFancySelect :model-value="shared.tagAdd" :options="filterOptions('tag')" multiple placeholder="COM_SMARTBROWSER_BATCH_KEEP_TAGS" :t="t" @update:model-value="updateSharedTagAdd" /></div>
            <div class="resource-batch-field"><span>{{ t('COM_SMARTBROWSER_BATCH_REMOVE_TAG') }}</span><ResourceFancySelect :model-value="shared.tagRemove" :options="filterOptions('tag')" multiple placeholder="COM_SMARTBROWSER_BATCH_KEEP_TAGS" :t="t" @update:model-value="updateSharedTagRemove" /></div>
          </div>
        </details>
        <details v-if="isCategories" class="resource-batch-step" :open="shared.placement !== 'none'">
          <summary @click.prevent="shared.placement = shared.placement === 'none' ? 'move' : 'none'">{{ t('COM_SMARTBROWSER_BATCH_CATEGORY_PLACEMENT') }}</summary>
          <div v-if="shared.placement !== 'none'" class="resource-batch-fields">
            <ResourceBatchModeToggle v-model="shared.placement" :t="t" />
            <label>{{ t('COM_SMARTBROWSER_BATCH_PARENT_CATEGORY') }}<ResourceFancySelect v-model="shared.category" :options="filterOptions('category')" placeholder="COM_SMARTBROWSER_SELECT_CATEGORY" :t="t" /></label>
          </div>
        </details>
        <details v-if="isCategories" class="resource-batch-step" :open="shared.flipOrdering">
          <summary @click.prevent="shared.flipOrdering = !shared.flipOrdering">{{ t('COM_SMARTBROWSER_BATCH_FLIP_ORDERING') }}</summary>
        </details>
        <details v-if="isMenus" class="resource-batch-step" :open="shared.placement !== 'none'">
          <summary @click.prevent="shared.placement = shared.placement === 'none' ? 'move' : 'none'">{{ t('COM_SMARTBROWSER_BATCH_MENU_PLACEMENT') }}</summary>
          <div v-if="shared.placement !== 'none'" class="resource-batch-fields">
            <ResourceBatchModeToggle v-model="shared.placement" :t="t" />
            <label>{{ t('COM_SMARTBROWSER_BATCH_MENU_DESTINATION') }}<ResourceFancySelect v-model="shared.menuDestination" :options="menuDestinationOptions" placeholder="COM_SMARTBROWSER_SELECT_MENU" :t="t" /></label>
          </div>
        </details>
      </template>
      <template v-else-if="isUsers">
        <details class="resource-batch-step" :open="user.groupOpen">
          <summary @click.prevent="user.groupOpen = !user.groupOpen">{{ t('COM_SMARTBROWSER_BATCH_USER_GROUPS') }}</summary>
          <div v-if="user.groupOpen" class="resource-batch-fields">
            <label>{{ t('COM_SMARTBROWSER_BATCH_MODE') }}<select v-model="user.groupAction" class="form-select resource-batch-mode-select"><option value="add">{{ t('COM_SMARTBROWSER_BATCH_GROUP_ADD') }}</option><option value="remove">{{ t('COM_SMARTBROWSER_BATCH_GROUP_REMOVE') }}</option><option value="set">{{ t('COM_SMARTBROWSER_BATCH_GROUP_SET') }}</option></select></label>
            <label>{{ t('COM_SMARTBROWSER_USER_GROUP') }}<ResourceFancySelect v-model="user.group" :options="filterOptions('group')" placeholder="COM_SMARTBROWSER_SELECT_USER_GROUP" :t="t" /></label>
          </div>
        </details>
        <details class="resource-batch-step" :open="user.resetOpen">
          <summary @click.prevent="user.resetOpen = !user.resetOpen">{{ t('COM_SMARTBROWSER_BATCH_PASSWORD_RESET') }}</summary>
          <div v-if="user.resetOpen" class="resource-batch-fields"><label>{{ t('COM_SMARTBROWSER_BATCH_PASSWORD_RESET') }}<select v-model="user.reset" class="form-select"><option value="yes">{{ t('JYES') }}</option><option value="no">{{ t('JNO') }}</option></select></label></div>
        </details>
      </template>
    </div>
    <div class="resource-batch-bottom">
      <div class="resource-batch-preview">
        <div class="resource-batch-preview-heading" role="heading" aria-level="3">{{ t('COM_SMARTBROWSER_BATCH_PREVIEW') }}</div>
        <div v-if="activeSteps.length" class="resource-batch-summary">
          <template v-for="(step, index) in activeSteps" :key="step.id">
            <div class="resource-batch-sequence-item">
              <span v-if="index" class="fas fa-arrow-right resource-batch-sequence-arrow" aria-hidden="true" />
              <div class="resource-batch-summary-step">
                <div class="resource-batch-summary-step-heading" role="heading" aria-level="4">{{ step.title }}</div>
                <div v-if="step.parameters.length || step.preview" class="resource-batch-summary-params">
                  <span v-for="parameter in step.parameters" :key="parameter">{{ parameter }}</span>
                  <button v-if="step.preview" type="button" class="resource-batch-preview-link" @click="openPreview">{{ t('COM_SMARTBROWSER_BATCH_VIEW_NAMES') }}</button>
                </div>
              </div>
            </div>
          </template>
        </div>
        <p v-else class="resource-batch-no-changes">{{ t('COM_SMARTBROWSER_BATCH_NO_CHANGES') }}</p>
      </div>
      <div class="resource-batch-footer">
        <button type="button" class="resource-batch-items-link" @click="openSelection">{{ items.length }} {{ t(items.length === 1 ? 'COM_SMARTBROWSER_SELECTED_ITEM_COUNT_ONE' : 'COM_SMARTBROWSER_SELECTED_ITEM_COUNT_MANY') }}</button>
        <div class="resource-batch-footer-actions">
          <button type="button" class="btn btn-primary" :disabled="busy || !canApply" @click="apply">{{ t('COM_SMARTBROWSER_BATCH_APPLY') }}</button>
          <button type="button" class="btn btn-danger" @click="close">{{ t('COM_SMARTBROWSER_CANCEL') }}</button>
        </div>
      </div>
    </div>
  </dialog>
  <dialog ref="previewDialog" class="resource-batch-preview-dialog" :aria-label="t('COM_SMARTBROWSER_BATCH_VIEW_NAMES')">
    <div class="resource-batch-preview-dialog-head"><strong>{{ t('COM_SMARTBROWSER_BATCH_VIEW_NAMES') }} ({{ previewRows.length }})</strong><button type="button" class="btn-close" :aria-label="t('COM_SMARTBROWSER_CANCEL')" @click="closePreview" /></div>
    <div class="resource-batch-preview-list"><div v-for="row in previewRows" :key="row.id" class="resource-batch-preview-row"><span :title="row.before">{{ row.before }}</span><span class="fas fa-arrow-right" aria-hidden="true" /><strong :title="row.after">{{ row.after }}</strong></div></div>
  </dialog>
  <dialog ref="selectionDialog" class="resource-batch-preview-dialog" :aria-label="t('COM_SMARTBROWSER_SELECTED_ITEMS')">
    <div class="resource-batch-preview-dialog-head"><strong>{{ t('COM_SMARTBROWSER_SELECTED_ITEMS') }}</strong><button type="button" class="btn-close" :aria-label="t('COM_SMARTBROWSER_CANCEL')" @click="closeSelection" /></div>
    <ul class="resource-batch-selected-list"><li v-for="item in items" :key="item.id"><span :class="item.icon || 'fas fa-file'" aria-hidden="true" /><span>{{ item.title }}</span></li></ul>
  </dialog>
</template>

<script setup>
import { computed, inject, onMounted, reactive, ref } from 'vue';
import ResourceFancySelect from './ResourceFancySelect.vue';
import ResourceBatchModeToggle from './ResourceBatchModeToggle.vue';

const props = defineProps({ selection: { type: Array, required: true }, adapter: { type: String, required: true }, filters: { type: Array, default: () => [] }, batchOptions: { type: Object, default: () => ({}) }, sortFields: { type: Array, default: () => [] }, orderingAvailable: Boolean, t: { type: Function, required: true } });
const emit = defineEmits(['apply']);
const api = inject('resourceApi');
const busy = ref(false);
const folderOptions = ref([]);
const folderLoading = ref(false);
const folderError = ref('');
let folderRequest = 0;
const dialog = ref(null);
const previewDialog = ref(null);
const selectionDialog = ref(null);
const adapter = computed(() => props.adapter.replace(/^flat-/, ''));
const isMedia = computed(() => adapter.value === 'media');
const isArticles = computed(() => ['articles', 'articles-by-tag'].includes(adapter.value));
const isCategories = computed(() => adapter.value === 'categories');
const isTags = computed(() => adapter.value === 'tags');
const isMenus = computed(() => adapter.value === 'menus');
const isUsers = computed(() => adapter.value === 'users');
const selectionPrefix = computed(() => ({ articles: 'article:', 'articles-by-tag': 'article:', categories: 'category:', tags: 'tag:', menus: 'menu-item:', users: 'user:' })[adapter.value]);
const items = computed(() => selectionPrefix.value ? props.selection.filter((item) => item.id.startsWith(selectionPrefix.value)) : props.selection);
const mediaDefaults = { rename: false, find: '', replace: '', prefix: '', suffix: '', number: false, startAt: 1, placement: 'none', destination: '', zip: false, zipName: 'selection', extract: false, deleteArchive: false };
const articleDefaults = { changeLanguage: false, language: '', changeAccess: false, access: '', tagsOpen: false, tagAdd: [], tagRemove: [], placement: 'none', category: '' };
const sharedDefaults = { changeLanguage: false, language: '', changeAccess: false, access: '', tagsOpen: false, tagAdd: [], tagRemove: [], placement: 'none', category: '', flipOrdering: false, menuDestination: '' };
const userDefaults = { groupOpen: false, groupAction: 'add', group: '', resetOpen: false, reset: 'yes' };
const media = reactive({ ...mediaDefaults });
const article = reactive({ ...articleDefaults });
const shared = reactive({ ...sharedDefaults });
const user = reactive({ ...userDefaults });
const sort = reactive({ enabled: false, field: 'title', direction: 'asc' });
const canExtract = computed(() => items.value.length === 1 && items.value[0].capabilities?.extract === true);
const articleFields = [
  { id: 'language', enabled: 'changeLanguage', label: 'COM_SMARTBROWSER_BATCH_SET_LANGUAGE', placeholder: 'COM_SMARTBROWSER_SELECT_LANGUAGE' },
  { id: 'access', enabled: 'changeAccess', label: 'COM_SMARTBROWSER_BATCH_SET_ACCESS', placeholder: 'COM_SMARTBROWSER_SELECT_ACCESS' },
];
const sharedFields = articleFields;
const dirty = computed(() => sort.enabled || JSON.stringify(media) !== JSON.stringify(mediaDefaults) || JSON.stringify(article) !== JSON.stringify(articleDefaults)
  || JSON.stringify(shared) !== JSON.stringify(sharedDefaults) || JSON.stringify(user) !== JSON.stringify(userDefaults));
const filterOptions = (id) => (props.batchOptions[id] || props.filters.find((filter) => filter.id === id)?.options || []).filter((option) => String(option.value) !== '');
const menuDestinationOptions = computed(() => (props.batchOptions.menu || []).flatMap((menu) => [
  { value: `${menu.value}.0`, label: menu.label },
  ...(props.batchOptions.menuParent || []).filter((parent) => parent.menu === menu.value).map((parent) => ({
    value: `${menu.value}.${parent.value}`, label: `- ${parent.label}`,
  })),
]));
const bareZipName = computed(() => media.zipName.trim().replace(/\.zip$/i, ''));
const updateTagAdd = (values) => { article.tagAdd = values; article.tagRemove = article.tagRemove.filter((value) => !values.includes(value)); };
const updateTagRemove = (values) => { article.tagRemove = values; article.tagAdd = article.tagAdd.filter((value) => !values.includes(value)); };
const updateSharedTagAdd = (values) => { shared.tagAdd = values; shared.tagRemove = shared.tagRemove.filter((value) => !values.includes(value)); };
const updateSharedTagRemove = (values) => { shared.tagRemove = values; shared.tagAdd = shared.tagAdd.filter((value) => !values.includes(value)); };
const optionTitle = (id, value) => props.t(filterOptions(id).find((option) => String(option.value) === String(value))?.label || value);
const activeSteps = computed(() => {
  const steps = [];
  if (sort.enabled && props.orderingAvailable) steps.push({ id: 'sort', title: props.t('COM_SMARTBROWSER_BATCH_SORT'), parameters: [props.t(props.sortFields.find(field => field.id === sort.field)?.label || sort.field), props.t(sort.direction === 'asc' ? 'COM_SMARTBROWSER_ASCENDING' : 'COM_SMARTBROWSER_DESCENDING')] });
  if (isMedia.value) {
    if (media.placement !== 'none') steps.push({ id: 'placement', title: props.t(media.placement === 'copy' ? 'COM_SMARTBROWSER_BATCH_COPY' : 'COM_SMARTBROWSER_BATCH_MOVE'), parameters: [folderOptions.value.find((option) => option.value === media.destination)?.path || '...'] });
    if (media.rename) steps.push({ id: 'rename', title: props.t('COM_SMARTBROWSER_BATCH_RENAME'), parameters: [
      ...(media.find ? [`${props.t('COM_SMARTBROWSER_BATCH_FIND')}: ${media.find} → ${media.replace}`] : []),
      ...(media.prefix ? [`${props.t('COM_SMARTBROWSER_BATCH_PREFIX')}: ${media.prefix}`] : []),
      ...(media.suffix ? [`${props.t('COM_SMARTBROWSER_BATCH_SUFFIX')}: ${media.suffix}`] : []),
      ...(media.number ? [`${props.t('COM_SMARTBROWSER_BATCH_NUMBER')}: ${media.startAt}`] : []),
    ], preview: true });
    if (media.zip) steps.push({ id: 'zip', title: props.t('COM_SMARTBROWSER_BATCH_ZIP'), parameters: [`${bareZipName.value}.zip`] });
    if (media.extract && canExtract.value) steps.push({ id: 'extract', title: props.t('COM_SMARTBROWSER_BATCH_EXTRACT'), parameters: media.deleteArchive ? [props.t('COM_SMARTBROWSER_BATCH_EXTRACT_DELETE')] : [] });
  } else if (isArticles.value) {
    for (const field of articleFields) if (article[field.enabled] && article[field.id]) steps.push({ id: field.id, title: props.t(field.label), parameters: [optionTitle(field.id, article[field.id])] });
    if (article.tagsOpen && article.tagAdd.length) steps.push({ id: 'tag-add', title: props.t('COM_SMARTBROWSER_BATCH_ADD_TAG'), parameters: article.tagAdd.map((tag) => optionTitle('tag', tag)) });
    if (article.tagsOpen && article.tagRemove.length) steps.push({ id: 'tag-remove', title: props.t('COM_SMARTBROWSER_BATCH_REMOVE_TAG'), parameters: article.tagRemove.map((tag) => optionTitle('tag', tag)) });
    if (article.placement !== 'none') steps.unshift({ id: 'placement', title: props.t(article.placement === 'copy' ? 'COM_SMARTBROWSER_BATCH_COPY' : 'COM_SMARTBROWSER_BATCH_MOVE'), parameters: [article.category ? optionTitle('category', article.category) : '...'] });
  } else if (isCategories.value || isTags.value || isMenus.value) {
    for (const field of sharedFields) if (shared[field.enabled] && shared[field.id]) steps.push({ id: field.id, title: props.t(field.label), parameters: [optionTitle(field.id, shared[field.id])] });
    if (isCategories.value) {
      if (shared.tagsOpen && shared.tagAdd.length) steps.push({ id: 'tag-add', title: props.t('COM_SMARTBROWSER_BATCH_ADD_TAG'), parameters: shared.tagAdd.map((tag) => optionTitle('tag', tag)) });
      if (shared.tagsOpen && shared.tagRemove.length) steps.push({ id: 'tag-remove', title: props.t('COM_SMARTBROWSER_BATCH_REMOVE_TAG'), parameters: shared.tagRemove.map((tag) => optionTitle('tag', tag)) });
      if (shared.placement !== 'none') steps.unshift({ id: 'placement', title: props.t(shared.placement === 'copy' ? 'COM_SMARTBROWSER_BATCH_COPY' : 'COM_SMARTBROWSER_BATCH_MOVE'), parameters: [shared.category ? optionTitle('category', shared.category) : '...'] });
      if (shared.flipOrdering) steps.push({ id: 'flip', title: props.t('COM_SMARTBROWSER_BATCH_FLIP_ORDERING'), parameters: [] });
    }
    if (isMenus.value && shared.placement !== 'none') steps.unshift({ id: 'placement', title: props.t(shared.placement === 'copy' ? 'COM_SMARTBROWSER_BATCH_COPY' : 'COM_SMARTBROWSER_BATCH_MOVE'), parameters: [menuDestinationOptions.value.find((option) => option.value === shared.menuDestination)?.label || '...'] });
  } else if (isUsers.value) {
    if (user.groupOpen && user.group) steps.push({ id: 'group', title: props.t(({ add: 'COM_SMARTBROWSER_BATCH_GROUP_ADD', remove: 'COM_SMARTBROWSER_BATCH_GROUP_REMOVE', set: 'COM_SMARTBROWSER_BATCH_GROUP_SET' })[user.groupAction]), parameters: [optionTitle('group', user.group)] });
    if (user.resetOpen) steps.push({ id: 'reset', title: props.t('COM_SMARTBROWSER_BATCH_PASSWORD_RESET'), parameters: [props.t(user.reset === 'yes' ? 'JYES' : 'JNO')] });
  }
  return steps;
});
const canApply = computed(() => {
  if (!items.value.length || !activeSteps.value.length) return false;
  if (media.extract && (!canExtract.value || media.rename || media.zip || media.placement !== 'none')) return false;
  if (isMedia.value && media.placement !== 'none' && !folderOptions.value.some((option) => option.value === media.destination)) return false;
  if (isArticles.value && article.placement !== 'none' && !article.category) return false;
  if (isCategories.value && shared.placement !== 'none' && !shared.category) return false;
  if (isMenus.value && shared.placement !== 'none' && !menuDestinationOptions.value.some((option) => option.value === shared.menuDestination)) return false;
  if (isMedia.value && media.zip && !bareZipName.value) return false;
  return true;
});
const payload = () => {
  if (isMedia.value) return { ...media, zipName: bareZipName.value };
  if (isArticles.value) return { language: article.changeLanguage ? article.language : '', access: article.changeAccess ? article.access : '', tagAdd: article.tagsOpen ? article.tagAdd : [], tagRemove: article.tagsOpen ? article.tagRemove : [], placement: article.placement, category: article.category };
  if (isUsers.value) return { group: user.groupOpen ? user.group : '', groupAction: user.groupAction === 'remove' ? 'del' : user.groupAction, reset: user.resetOpen ? user.reset : '' };
  const divider = shared.menuDestination.lastIndexOf('.');
  return { language: shared.changeLanguage ? shared.language : '', access: shared.changeAccess ? shared.access : '', tagAdd: isCategories.value && shared.tagsOpen ? shared.tagAdd : [], tagRemove: isCategories.value && shared.tagsOpen ? shared.tagRemove : [], placement: shared.placement, category: shared.category, flipOrdering: isCategories.value && shared.flipOrdering, menu: isMenus.value && divider >= 0 ? shared.menuDestination.slice(0, divider) : '', menuParent: isMenus.value && divider >= 0 ? shared.menuDestination.slice(divider + 1) : '0' };
};
const apply = async () => {
  if (busy.value || !canApply.value) return;
  busy.value = true;
  try {
    await new Promise((resolve, reject) => emit('apply', { selection: items.value.map((item) => item.id), payload: { ...payload(), ...(sort.enabled && props.orderingAvailable ? { sort: { field: sort.field, direction: sort.direction } } : {}) }, resolve, reject }));
    close();
  } catch (error) {
    window.Joomla?.renderMessages?.({ error: [error.message || String(error)] });
  } finally {
    busy.value = false;
  }
};
const renamed = (item, index) => {
  if (!media.rename) return item.title;
  const dot = item.kind === 'item' ? item.title.lastIndexOf('.') : -1;
  const stem = dot > 0 ? item.title.slice(0, dot) : item.title;
  const extension = dot > 0 ? item.title.slice(dot) : '';
  const replaced = media.find ? stem.split(media.find).join(media.replace) : stem;
  const sequence = media.number ? `-${String(Math.max(1, Number(media.startAt) || 1) + index).padStart(2, '0')}` : '';
  return `${media.prefix}${replaced}${media.suffix}${sequence}${extension}`;
};
const previewRows = computed(() => items.value.map((item, index) => {
  const path = item.id.includes(':') ? item.id.slice(item.id.indexOf(':') + 1) : item.title;
  const parent = media.placement !== 'none' && media.destination
    ? `${media.destination.slice(media.destination.indexOf(':') + 1).replace(/\/$/, '')}/`
    : path.slice(0, path.lastIndexOf('/') + 1);
  return { id: item.id, before: path, after: parent + renamed(item, index) };
}));
const loadFolders = async () => {
  const request = ++folderRequest;
  folderLoading.value = true;
  folderError.value = '';
  try {
    const options = await api.execute('batchFolders', items.value.map((item) => item.id));
    if (request === folderRequest) folderOptions.value = options;
  } catch (error) {
    if (request === folderRequest) folderError.value = error.message || String(error);
  } finally {
    if (request === folderRequest) folderLoading.value = false;
  }
};
const open = () => {
  Object.assign(media, mediaDefaults);
  Object.assign(article, articleDefaults);
  Object.assign(shared, sharedDefaults);
  Object.assign(user, userDefaults);
  Object.assign(sort, { enabled: false, field: props.sortFields[0]?.id || 'title', direction: 'asc' });
  folderOptions.value = [];
  dialog.value?.showModal();
  if (isMedia.value) loadFolders();
};
const openPreview = () => previewDialog.value?.showModal();
const closePreview = () => { if (previewDialog.value?.open) previewDialog.value.close(); };
const openSelection = () => selectionDialog.value?.showModal();
const closeSelection = () => { if (selectionDialog.value?.open) selectionDialog.value.close(); };
const close = () => { folderRequest++; closePreview(); closeSelection(); dialog.value?.close(); };
defineExpose({ open, close });
onMounted(() => {
  window.SmartBrowserDialogDismiss.install(dialog.value, () => dirty.value);
  window.SmartBrowserDialogDismiss.install(previewDialog.value);
  window.SmartBrowserDialogDismiss.install(selectionDialog.value);
  dialog.value.addEventListener('close', () => { closePreview(); closeSelection(); });
});
</script>
