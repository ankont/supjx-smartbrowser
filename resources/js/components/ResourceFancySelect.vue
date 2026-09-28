<template>
  <joomla-field-fancy-select ref="field" :key="choicesKey" :class="{ 'resource-batch-single-select': !multiple }" :placeholder="t(placeholder)">
    <select class="form-select" :multiple="multiple" @change="onChange">
      <option v-if="!multiple" value="" :selected="!modelValue">{{ t(placeholder) }}</option>
      <option v-for="option in choices" :key="option.value" :value="String(option.value)" :selected="isSelected(option.value)">{{ t(option.label) }}</option>
    </select>
  </joomla-field-fancy-select>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: [Array, String], required: true },
  options: { type: Array, default: () => [] },
  multiple: Boolean,
  placeholder: { type: String, required: true },
  t: { type: Function, required: true },
});
const emit = defineEmits(['update:modelValue']);
const field = ref(null);
const choices = computed(() => props.options.filter((option) => String(option.value) !== ''));
const choicesKey = computed(() => choices.value.map((option) => String(option.value)).join('|'));
const isSelected = (value) => props.multiple
  ? props.modelValue.includes(String(value))
  : String(props.modelValue) === String(value);
const onChange = (event) => emit('update:modelValue', props.multiple
  ? Array.from(event.target.selectedOptions, (option) => option.value)
  : event.target.value);

let dropdown;
let dropdownObserver;
let parentDialog;
const closeDropdown = () => field.value?.choicesInstance?.hideDropdown();
const positionDropdown = () => {
  if (!dropdown?.matches(':popover-open')) return;
  const anchor = field.value?.choicesInstance?.containerOuter?.element;
  if (!anchor) return;
  const rect = anchor.getBoundingClientRect();
  if (rect.bottom < 0 || rect.top > window.innerHeight) {
    field.value.choicesInstance.hideDropdown();
    return;
  }
  const below = window.innerHeight - rect.bottom - 8;
  const above = rect.top - 8;
  const openAbove = below < 240 && above > below;
  const available = Math.max(0, openAbove ? above : below);
  dropdown.style.left = `${rect.left}px`;
  dropdown.style.top = `${openAbove ? rect.top : rect.bottom}px`;
  dropdown.style.width = `${rect.width}px`;
  dropdown.style.maxHeight = `${available}px`;
  dropdown.style.transform = openAbove ? 'translateY(-100%)' : '';
  dropdown.style.setProperty('--resource-batch-dropdown-list-height', `${Math.max(0, available - 2)}px`);
};
const syncDropdown = () => {
  if (!dropdown) return;
  if (dropdown.classList.contains('is-active') && field.value?.closest('dialog')?.open) {
    if (!dropdown.matches(':popover-open')) dropdown.showPopover();
    positionDropdown();
  } else if (dropdown.matches(':popover-open')) {
    dropdown.hidePopover();
  }
};
onMounted(async () => {
  await nextTick();
  dropdown = field.value?.choicesInstance?.dropdown?.element;
  if (!dropdown) return;
  parentDialog = field.value.closest('dialog');
  dropdown.setAttribute('popover', 'manual');
  dropdown.classList.add('resource-batch-choices-dropdown');
  dropdownObserver = new MutationObserver(syncDropdown);
  dropdownObserver.observe(dropdown, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('scroll', positionDropdown, true);
  window.addEventListener('resize', positionDropdown);
  parentDialog?.addEventListener('close', closeDropdown);
});
onBeforeUnmount(() => {
  dropdownObserver?.disconnect();
  if (dropdown?.matches(':popover-open')) dropdown.hidePopover();
  window.removeEventListener('scroll', positionDropdown, true);
  window.removeEventListener('resize', positionDropdown);
  parentDialog?.removeEventListener('close', closeDropdown);
});

watch(() => props.modelValue, async (value) => {
  await nextTick();
  const choicesInstance = field.value?.choicesInstance;
  if (!choicesInstance) return;
  const wanted = props.multiple ? value : (value ? [value] : []);
  const currentValue = choicesInstance.getValue(true);
  const current = Array.isArray(currentValue) ? currentValue : (currentValue ? [currentValue] : []);
  current.filter((item) => !wanted.includes(String(item))).forEach((item) => choicesInstance.removeActiveItemsByValue(String(item)));
  wanted.filter((item) => !current.includes(String(item))).forEach((item) => choicesInstance.setChoiceByValue(String(item)));
});
</script>
