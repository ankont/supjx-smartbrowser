<template>
  <div class="sb-appearance-editor">
    <component :is="adapter ? 'details' : 'div'" class="sb-appearance-overrides">
      <summary v-if="adapter">{{ labels.adapter_title }}</summary>
      <section class="sb-appearance-profile">
        <h4>{{ labels.nodes }}</h4>
        <VisualProfileSettings :adapter="adapter" kind="nodes" :labels="labels" :value="value?.nodes || value || {}" :global-settings="globalSettings?.nodes" :available="available.nodes" @change="update('nodes', $event)" />
      </section>
      <div class="sb-appearance-previews">
        <figure v-for="kind in ['nodes', 'items']" :key="kind" class="sb-appearance-preview">
          <figcaption>{{ labels.preview }}: {{ labels[kind] }}</figcaption>
          <div class="sb-preview-body">
          <span class="sb-appearance-preview-tile"><ResourceVisual :resource="example(kind)" :settings="effective(kind)" :available-assets="available[kind]" :background="background" /></span>
          <div class="sb-preview-assets"><label v-for="asset in kind === 'nodes' ? ['base', 'identity', 'image'] : ['base', 'image']" :key="asset"><input v-model="available[kind][asset]" type="checkbox">{{ labels[asset] }}</label></div>
          </div>
        </figure>
      </div>
      <section class="sb-appearance-profile">
        <h4>{{ labels.items }}</h4>
        <VisualProfileSettings :adapter="adapter" kind="items" :labels="labels" :value="value?.items || value || {}" :global-settings="globalSettings?.items" :available="available.items" @change="update('items', $event)" />
      </section>
    </component>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue';
import VisualProfileSettings from './VisualProfileSettings.vue';
import ResourceVisual from './ResourceVisual.vue';
import { toVisualRules } from '../core/resourceVisual.js';
const props = defineProps({ adapter: String, value: Object, labels: Object, globalSettings: Object, sampleImage: String, background: { type: String, default: 'auto' } });
const emit = defineEmits(['change']);
const output = ref({ nodes: props.value?.nodes || props.value || {}, items: props.value?.items || props.value || {} });
const available = reactive({ nodes: { base: true, identity: true, image: true }, items: { base: true, identity: false, image: true } });
const effective = kind => ({ rules: toVisualRules(props.adapter && !output.value[kind]?.custom ? props.globalSettings?.[kind] : output.value[kind]) });
const example = kind => ({ kind: kind === 'nodes' ? 'node' : 'item', type: kind === 'nodes' ? 'category' : 'article', icon: kind === 'nodes' ? 'fas fa-folder' : 'fas fa-file-alt', badgeIcon: kind === 'nodes' ? 'fas fa-book' : '', image: props.sampleImage });
const update = (kind, value) => { output.value[kind] = value; emit('change', { ...output.value }); };
</script>
