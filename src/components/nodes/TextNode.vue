<script setup>

import { defineProps, ref } from 'vue';
import { Handle, Position } from '@vue-flow/core';
import BaseNode from '@/components/nodes/BaseNode.vue';
import { flowStore, runtimeState } from '@/stores';

const props = defineProps(["id", "type", "data"])
const textCollapsed = ref(flowStore.state[runtimeState.selectedDialogue].nodesTextCollapsed.includes(props.id));

function onTextCollapsed() {
    textCollapsed.value = !textCollapsed.value;
    if (textCollapsed.value) {
        flowStore.state[runtimeState.selectedDialogue].nodesTextCollapsed.push(props.id);
    }
    else {
        flowStore.state[runtimeState.selectedDialogue].nodesTextCollapsed = flowStore.state[runtimeState.selectedDialogue].nodesTextCollapsed.filter(id => id != props.id);
    }
}

</script>
<template>
    <BaseNode v-bind="$props">
        <div class="title title-2" :class="{ 'collapsed': textCollapsed }"
            @click="onTextCollapsed">Text<span v-if="textCollapsed">⯈</span><span
                v-else>⯆</span>
        </div>
        <div class="row">
            <div class="handle-wrapper" :class="{ 'collapsed': textCollapsed }">
                <Handle class="node-input-handle" id="in" type="target" :position="Position.Left" />
            </div>
            <div class="section" v-if="!textCollapsed">
                <slot></slot>
            </div>
            <div class="handle-wrapper" :class="{ 'collapsed': textCollapsed }" v-if="data.outputs.length && type!='dialogue' && type!='branch'">
                <Handle :id="data.outputs[0].id" class="node-output-handle" type="source" :position="Position.Right"
                    connectable="single" />
            </div>
        </div>
    </BaseNode>
</template>

<style scoped>
.handle-wrapper.collapsed .node-input-handle {
    transform: translate(-50%, -32px);
    top: 100%;
}

.handle-wrapper.collapsed .node-output-handle {
    transform: translate(50%, -32px);
    top: 100%;
    position: absolute;
}
</style>