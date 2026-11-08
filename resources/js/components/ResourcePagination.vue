<template>
  <nav class="resource-pagination" :class="{ 'is-smart': smart }" :aria-label="t('COM_SMARTBROWSER_PAGINATION')" :aria-busy="busy">
    <button v-if="multiplePages && !smart" type="button" class="btn btn-outline-secondary" :disabled="busy || page.offset === 0" :title="t('COM_SMARTBROWSER_PAGE_PREVIOUS')" :aria-label="t('COM_SMARTBROWSER_PAGE_PREVIOUS')" @click="$emit('page', Math.max(0, page.offset - page.limit))"><span class="fas fa-chevron-left" aria-hidden="true" /></button>
    <span v-if="multiplePages" role="status" aria-live="polite">{{ t('COM_SMARTBROWSER_PAGE_RANGE').replace('%1$s', String(page.total ? smart ? 1 : page.offset + 1 : 0)).replace('%2$s', String(smart ? loaded : Math.min(page.offset + page.limit, page.total))).replace('%3$s', String(page.total)) }}</span>
    <span v-if="!multiplePages" role="status" aria-live="polite">{{ t('COM_SMARTBROWSER_ITEM_COUNT').replace('%s', String(page?.total ?? total)) }}</span>
    <button v-if="multiplePages && !smart" type="button" class="btn btn-outline-secondary" :disabled="busy || !page.hasMore" :title="t('COM_SMARTBROWSER_PAGE_NEXT')" :aria-label="t('COM_SMARTBROWSER_PAGE_NEXT')" @click="$emit('page', page.offset + page.limit)"><span class="fas fa-chevron-right" aria-hidden="true" /></button>
    <button v-else-if="smart && page?.hasMore" type="button" class="btn btn-outline-secondary resource-load-more" :disabled="busy" @click="$emit('more')"><span v-if="busy" class="spinner-border spinner-border-sm" aria-hidden="true" /><span v-else class="fas fa-angle-down" aria-hidden="true" />{{ t(busy ? 'COM_SMARTBROWSER_LOADING' : 'COM_SMARTBROWSER_LOAD_MORE') }}</button>
    <button v-if="smart && page?.hasMore" type="button" class="btn btn-outline-secondary resource-load-more resource-load-all" :disabled="busy" @click="$emit('all')"><span class="fas fa-angle-double-down" aria-hidden="true" />{{ t('COM_SMARTBROWSER_LOAD_ALL') }}</button>
  </nav>
</template>
<script setup>
import { computed } from 'vue';
const props = defineProps({ page: Object, total: { type: Number, default: 0 }, busy: Boolean, t: Function, smart: Boolean, loaded: Number });
const multiplePages = computed(() => props.page && props.page.total > props.page.limit && !(props.smart && props.loaded >= props.page.total));
defineEmits(['page', 'more', 'all']);
</script>
