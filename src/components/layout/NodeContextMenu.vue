<template>
    <div v-if="runtimeState.showMenu" ref="menuRef">
        <ContextMenu title="Add node" :menuItems="menuItems"
            :style="{ left: runtimeState.menuPosition.x + 'px', top: runtimeState.menuPosition.y + 'px' }" />
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import ContextMenu from '@/components/widgets/Menu.vue';
import NODE_TYPES from '@/NodeTypes';
import { flowStore, runtimeState } from '@/stores';
import { makeEdgeId } from '@/utils/MakeID';
import { makeNode } from '@/utils/Nodes';

const menuRef = ref(null);

const menuItems = computed(() => {
    let nodeTypes = Object.values(NODE_TYPES);
    if (flowStore.state[runtimeState.selectedDialogue].nodes.map(n => n.type).includes(NODE_TYPES.START.type)) {
        nodeTypes = nodeTypes.filter(n => n.type != NODE_TYPES.START.type);
    }
    return [
        { label: "Add node" },
        ...nodeTypes.map(nt => ({ label: nt.label, icon: nt.icon, onClick: () => onNodeAdd(nt.type) })),
    ]
})


function onNodeAdd(nodeType) {
    const newNode = makeNode(nodeType, runtimeState.endPosition);
    flowStore.methods.addNode(newNode, runtimeState.selectedDialogue);
    if (runtimeState.pendingConnection) {
        const source = runtimeState.pendingConnection.nodeId;
        const target = newNode.id;
        const sourceHandle = runtimeState.pendingConnection.handleId;
        const targetHandle = "in";
        const newConnection = {
            id: makeEdgeId(source, target, sourceHandle, targetHandle),
            source,
            target,
            sourceHandle,
            targetHandle
        }
        flowStore.methods.addEdge(newConnection, runtimeState.selectedDialogue);
        runtimeState.pendingConnection = null;
    }
    runtimeState.showMenu = false;
}

onMounted(() => {
    document.addEventListener('mousedown', e => {
        if (menuRef.value && !menuRef.value.contains(e.target)) {
            runtimeState.showMenu = false;
            runtimeState.pendingConnection = null;
        }
    })
})

</script>