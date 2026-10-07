<template>
  <div class="sb-appearance-controls">
    <div v-for="({ rule, index }, rowIndex) in visibleRules" :key="index" class="sb-appearance-row sb-appearance-rule" :class="{ 'is-active': active.has(index) }">
      <span class="sb-appearance-layer-buttons">
        <button type="button" :disabled="rowIndex === visibleRules.length - 1" :title="labels.down" :aria-label="labels.down" @click="move(index, 1)"><span class="fas fa-chevron-down" /></button>
        <button type="button" :disabled="rowIndex === 0" :title="labels.up" :aria-label="labels.up" @click="move(index, -1)"><span class="fas fa-chevron-up" /></button>
      </span>
      <select :aria-label="labels.asset" :value="rule.asset" @change="change(index, 'asset', $event.target.value)"><option v-for="asset in assets" :key="asset" :value="asset">{{ labels[asset] }}</option></select>
      <input class="sb-rule-z" type="number" min="1" step="1" :title="labels.z_index" :aria-label="labels.z_index" :value="rule.priority" @change="change(index, 'priority', Math.max(1, Number($event.target.value) || 1))">
      <select :aria-label="labels.position" :value="rule.style" @change="change(index, 'style', $event.target.value)"><option v-for="style in ['center', 'corner', 'badge']" :key="style" :value="style">{{ labels[style] }}</option></select>
      <select v-if="rule.style !== 'center'" :aria-label="labels.position" :value="rule.position" @change="change(index, 'position', $event.target.value)"><option v-for="position in visualPositions" :key="position" :value="position">{{ labels[position.replaceAll('-', '_')] }}</option></select>
      <select :aria-label="labels.size" :value="rule.size" @change="change(index, 'size', $event.target.value)"><option v-for="size in visualSizes" :key="size" :value="size">{{ labels[size] }}</option></select>
      <select v-if="rule.style === 'badge'" :aria-label="labels.anchor" :value="anchorRegions.includes(rule.anchor) ? rule.anchor : 'item'" @change="change(index, 'anchor', $event.target.value)"><option value="item">{{ labels.item }}</option><option v-for="region in anchorRegions" :key="region" :value="region">{{ region === 'center' ? labels.center : `${labels.corner}: ${labels[region.slice(7).replaceAll('-', '_')]}` }}</option></select>
      <button class="sb-rule-command" type="button" :title="labels.remove" :aria-label="labels.remove" @click="remove(index)"><span class="fas fa-trash-alt" /></button>
    </div>
    <div class="sb-rule-commands">
      <button class="sb-rule-command" type="button" :title="labels.add" :aria-label="labels.add" @click="add"><span class="fas fa-plus" /></button>
      <button v-if="adapter && custom" class="sb-rule-command" type="button" :title="labels.inherited" :aria-label="labels.inherited" @click="inherit"><span class="fas fa-undo" /></button>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue';
import { toVisualRules, normalizeVisualRules, selectVisualRules, visualAnchorRegions, visualSizes, visualPositions } from '../core/resourceVisual.js';
const props = defineProps({ adapter: String, kind: String, value: Object, labels: Object, globalSettings: Object, available: Object });
const emit = defineEmits(['change']);
const custom = ref(props.value?.custom === true || props.value?.custom === 1);
const draft = ref(toVisualRules(props.value));
const rules = computed(() => props.adapter && !custom.value ? toVisualRules(props.globalSettings) : draft.value);
const visibleRules = computed(() => rules.value.map((rule, index) => ({ rule, index })).filter(({ rule }) => props.kind !== 'items' || rule.asset !== 'identity'));
const assets = computed(() => props.kind === 'items' ? ['base', 'image'] : ['base', 'identity', 'image']);
const anchorRegions = computed(() => visualAnchorRegions(visibleRules.value.map(entry => entry.rule)));
const active = computed(() => new Set(selectVisualRules(rules.value, props.available || {}).map(rule => rule.ruleIndex)));
const commit = next => { custom.value = Boolean(props.adapter); draft.value = normalizeVisualRules(next); };
const change = (index, key, value) => commit(rules.value.map((rule, i) => i === index ? { ...rule, [key]: value } : rule));
const move = (index, direction) => {
  const row = visibleRules.value.findIndex(entry => entry.index === index), target = visibleRules.value[row + direction]?.index;
  if (target === undefined) return;
  const next = [...rules.value]; [next[index], next[target]] = [next[target], next[index]]; commit(next);
};
const remove = index => commit(rules.value.filter((_, i) => i !== index));
const add = () => commit([...rules.value, { asset: 'base', style: 'center', size: 'medium', position: 'top-left', anchor: 'item', priority: Math.max(0, ...rules.value.map(rule => rule.priority || 0)) + 1 }]);
const inherit = () => { custom.value = false; };
watch([draft, custom], () => emit('change', props.adapter && !custom.value ? { custom: false } : { rules: draft.value, ...(props.adapter ? { custom: true } : {}) }), { deep: true, immediate: true });
</script>
