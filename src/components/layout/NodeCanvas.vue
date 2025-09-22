<script setup>
import { markRaw, onMounted, ref, watch, nextTick } from 'vue'
import { VueFlow, useVueFlow, ConnectionMode } from '@vue-flow/core'

import StartNode from '@/components/nodes/StartNode.vue';
import ScriptNode from '@/components/nodes/ScriptNode.vue';
import OptionsNode from '@/components/nodes/OptionsNode.vue';
import CustomEdge from '@/components/edges/CustomEdge.vue';

import NodeContextMenu from './NodeContextMenu.vue';
import { flowStore, runtimeState } from '@/stores';
import { saveToLocalStorage } from '@/utils';
import { makeEdgeId } from '@/utils/MakeID';

const {
    getSelectedNodes, addSelectedNodes, getSelectedEdges,
    onConnect, onConnectStart, onConnectEnd, onNodeDragStart, onNodeDragStop,
    onViewportChange, onPaneContextMenu,
    screenToFlowCoordinate,
} = useVueFlow();

const wasConnected = ref(false);
let draggedNodes = [];

function updateGrid(viewport) {
    const { zoom, x, y } = viewport;
    const gridContainer = document.querySelector(':root');
    gridContainer.style.setProperty('--grid-zoom', zoom);
    gridContainer.style.setProperty('--grid-offset-x', `${x}px`);
    gridContainer.style.setProperty('--grid-offset-y', `${y}px`);
}

onMounted(() => {
    // Set correct zoom and offset for the grid
    updateGrid(flowStore.state[runtimeState.selectedDialogue].defaultViewport);
    // Find last selected node, set it selected for the node inspector panel
    nextTick(() => {
        flowStore.state[runtimeState.selectedDialogue].nodes.toReversed().forEach(n => {
            if (!runtimeState.selectedNode && n.selected) {
                runtimeState.selectedNode = n;
            }
        })
    })
});

// Vueflow callbacks

onConnectStart(({ event, handleId, handleType, nodeId }) => {
    if (handleType == "target") { return }
    // Save connection to use with node add menu
    runtimeState.pendingConnection = {
        startEvent: event, handleId, handleType, nodeId
    };
})

onConnectEnd((event) => {
    if (wasConnected.value) {
        wasConnected.value = false;
        return
    }
    const target = event.target
    // Check if connection was dragged in empty place
    const isCanvas = target?.classList?.contains('vue-flow__pane')
    if (isCanvas) {
        const flowPos = screenToFlowCoordinate({
            x: event.clientX,
            y: event.clientY,
        });
        runtimeState.menuPosition = { x: event.layerX, y: event.layerY };
        if (runtimeState.pendingConnection) {
            runtimeState.endPosition = flowPos;
            runtimeState.showMenu = true
        }
    }
})

onConnect((connection) => {
    if (connection.source == connection.target) {
        console.warn('Attempted to connect node to itself');
        return;
    }
    connection.id = makeEdgeId({ connection });
    flowStore.methods.addEdge(connection, runtimeState.selectedDialogue);
    // Flag to prevent connection menu popping up after connection was made
    wasConnected.value = true;
})

onNodeDragStart(e => {
    draggedNodes = e.nodes.map(n => ({ id: n.id, position: n.position }));
})
onNodeDragStop(e => {
    const newNodes = e.nodes.map(n => ({ id: n.id, position: n.position }));
    flowStore.methods.moveNodes(draggedNodes, newNodes, runtimeState.selectedDialogue);
    draggedNodes = [];
})

onViewportChange((viewport) => {
    updateGrid(viewport);
    flowStore.state[runtimeState.selectedDialogue].defaultViewport = viewport;
    saveToLocalStorage();
})

onPaneContextMenu((e) => {
    runtimeState.menuPosition = { x: e.layerX, y: e.layerY };
    runtimeState.showMenu = true;
    runtimeState.endPosition = screenToFlowCoordinate({
        x: e.clientX,
        y: e.clientY,
    });
})

const onMoveStart = () => {
    runtimeState.showMenu = false;
    runtimeState.pendingConnection = null;
}

// Vueflow-related watchers

watch(getSelectedNodes, (newVal, oldVal) => {
    const added = newVal.filter(n => !oldVal.includes(n))
    if (added.length > 0) {
        // Select last node
        const lastSelected = added[added.length - 1]
        runtimeState.selectedNode = lastSelected;
        runtimeState.selectedEdge = null;
    }
    else {
        runtimeState.selectedNode = null;
    }
});

watch(getSelectedEdges, (newVal, oldVal) => {
    const added = newVal.filter(n => !oldVal.includes(n))
    if (added.length > 0) {
        // Select last node
        const lastSelected = added[added.length - 1]
        runtimeState.selectedEdge = lastSelected
        runtimeState.selectedNode = null;
    }
    else {
        runtimeState.selectedEdge = null;
    }
});

watch(() => flowStore.state[runtimeState.selectedDialogue].nodes, (newVal, oldVal) => {
    if (!newVal || !oldVal) return
    const added = newVal.filter(n => !oldVal.map(n => n.id).includes(n.id));
    // const removed = oldVal.filter(n => !newVal.map(n => n.id).includes(n.id));
    if (added.length > 0) {
        // console.log("ADDED " + removed.map(n => n.data.label));
        // Autoselect last created node
        const lastSelected = added[added.length - 1]
        addSelectedNodes([lastSelected]);
        // Update drag handle
        newVal.forEach(n => n.dragHandle = ".drag-handle");
    }
    else {
        runtimeState.selectedNode = null;
    }
});

</script>

<template>
    <VueFlow v-model:nodes="flowStore.state[runtimeState.selectedDialogue].nodes"
        v-model:edges="flowStore.state[runtimeState.selectedDialogue].edges"
        :edge-types="{ custom: markRaw(CustomEdge) }" :connection-mode="ConnectionMode.Strict"
        connection-line-type="smoothstep" :connection-line-style="{ strokeWidth: 2 }"
        :default-edge-options="{ type: 'custom' }"
        :default-viewport="flowStore.state[runtimeState.selectedDialogue].defaultViewport" @move-start="onMoveStart"
        :delete-key-code="null">
        <NodeContextMenu />
        <template #node-dialogue="props">
            <OptionsNode :id="props.id" :data="props.data" type="dialogue" />
        </template>
        <template #node-start="props">
            <StartNode :id="props.id" :data="props.data" />
        </template>
        <template #node-script="props">
            <ScriptNode :id="props.id" :data="props.data" />
        </template>
        <template #node-branch="props">
            <OptionsNode :id="props.id" :data="props.data" type="branch" />
        </template>
        <!-- <Dialog /> -->
    </VueFlow>
</template>

<style>
/* import the necessary styles for Vue Flow to work */
@import '@vue-flow/core/dist/style.css';

/* import the default theme, this is optional but generally recommended */
@import '@vue-flow/core/dist/theme-default.css';

/* Grid */
.vue-flow {
    flex: 1;
    background-color: var(--bg-3);
    background-image: linear-gradient(#00000022 1px, transparent 1px),
        linear-gradient(90deg, #00000022 1px, transparent 1px);
    background-size:
        var(--grid-size) var(--grid-size),
        var(--grid-size) var(--grid-size);
    background-position:
        var(--grid-offset-x) var(--grid-offset-y),
        var(--grid-offset-x) var(--grid-offset-y);
    position: relative;
}
</style>
