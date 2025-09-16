<script setup>
import { computed } from 'vue'
import { getSmoothStepPath } from '@vue-flow/core'
import { flowStore, runtimeState } from "@/stores"

const props = defineProps({
    source: String,
    target: String,
    id: String,
    sourceX: Number,
    sourceY: Number,
    targetX: Number,
    targetY: Number,
    sourcePosition: String,
    targetPosition: String,
    markerEnd: String,
})

const { findNode } = flowStore.methods;

const sourceNode = findNode(props.source, runtimeState.selectedDialogue)
// const targetNode = findNode(props.target)

const path = computed(() => {
    let coords = {};
    if (flowStore.state[runtimeState.selectedDialogue].nodesOutputsCollapsed.includes(props.source)) {
        coords = {
            // Anchor at the middle of the "Options" title
            sourceX: props.sourceX + sourceNode.dimensions.width / 2,
            sourceY: props.sourceY - 12,
        }
    }
    else {
        coords = {
            sourceX: props.sourceX,
            sourceY: props.sourceY,
        }
    }
    return getSmoothStepPath({
        ...coords,
        targetX: props.targetX,
        targetY: props.targetY,
        sourcePosition: 'right', // force right
        targetPosition: 'left',  // force left
    })[0]
})
</script>
<script>
export default {
    inheritAttrs: false,
}
</script>
<template>
    <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerUnits="strokeWidth" markerWidth="5"
            markerHeight="10" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" stroke="context-stroke" />
        </marker>
    </defs>
    <path class="vue-flow__edge-path" :d="path" />
</template>

<style scoped>
.vue-flow__edge-path {
    stroke-width: 2;
    marker-end: url(#arrow);
    stroke: var(--text-muted);
}

.vue-flow__edge-path:hover {
    stroke: var(--text-color);
}

.vue-flow__edge.selected .vue-flow__edge-path,
.vue-flow__edge:focus .vue-flow__edge-path,
.vue-flow__edge:focus-visible .vue-flow__edge-path {
    stroke: var(--accent);
}
</style>