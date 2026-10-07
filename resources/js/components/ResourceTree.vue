<template>
  <nav class="resource-sidebar" :aria-label="t('COM_SMARTBROWSER_VIEW')">
    <details v-for="adapter in adapters" :key="adapter.id" class="resource-adapter" :open="adapter.id === activeAdapter" @toggle="openAdapter($event, adapter.id)">
      <summary @click.prevent="openRoot(adapter.id)"><span :class="adapter.icon" aria-hidden="true" /> {{ adapter.title }}</summary>
      <div v-if="adapter.id !== activeAdapter || treeHasContent" class="resource-adapter-roots">
        <section v-for="root in adapter.id === activeAdapter ? roots : []" :key="root.id" class="resource-tree-root" :class="{ 'root-hidden': root.visible === false }">
          <button v-if="root.visible !== false" type="button" :class="{ active: selectedNode === root.id }" @click="$emit('open', root.id)">
            <span class="resource-tree-root-icon" :class="adapter.icon" aria-hidden="true" />
            <span>{{ root.title }}</span>
          </button>
          <div v-if="belongsTo(root)" class="resource-tree-branch">
            <button
              v-for="crumb in branch(root)"
              :key="crumb.id"
              type="button"
              :class="{ active: selectedNode === crumb.id }"
              :style="treeIndent(root, branch(root).indexOf(crumb))"
              @click="$emit('open', crumb.id)"
            >
              <ResourceNodeVisual :resource="crumb" :open="true" />
              <span>{{ crumb.title }}</span>
            </button>
            <template v-for="node in nodes" :key="node.id">
              <button v-if="node.navigable !== false" type="button" class="resource-tree-entry" :style="treeIndent(root, branch(root).length)" @click="$emit('open', node.id)">
                <ResourceNodeVisual :resource="node" />
                <span>{{ node.title }}</span>
              </button>
              <div v-else class="resource-tree-entry resource-tree-static" :style="treeIndent(root, branch(root).length)">
                <ResourceNodeVisual :resource="node" />
                <span>{{ node.title }}</span>
              </div>
            </template>
          </div>
        </section>
      </div>
    </details>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import ResourceNodeVisual from './ResourceNodeVisual.vue';

const props = defineProps({ adapters: Array, activeAdapter: String, roots: Array, nodes: Array, breadcrumb: Array, selectedNode: String, t: Function });
const emit = defineEmits(['open', 'adapter']);
const openAdapter = (event, id) => {
  if (event.target.open && id !== props.activeAdapter) emit('adapter', id);
};
const openRoot = (id) => {
  if (id !== props.activeAdapter) emit('adapter', id);
  else if (props.roots[0]) emit('open', props.roots[0].id);
};
const belongsTo = (root) => props.breadcrumb.some((crumb) => crumb.id === root.id);
const branch = (root) => props.breadcrumb.filter((crumb) => crumb.id !== root.id);
const treeHasContent = computed(() => props.roots.some((root) => root.visible !== false
  || (belongsTo(root) && (branch(root).length > 0 || props.nodes.length > 0))));
const treeIndent = (root, depth) => ({ paddingInlineStart: `${10 + (root.visible === false ? 0 : 18) + (depth * 18)}px` });
</script>
