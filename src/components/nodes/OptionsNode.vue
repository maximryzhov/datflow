<script setup>
import { computed, ref, watch } from 'vue';
import { Handle, Position, useVueFlow } from '@vue-flow/core'

import TextNode from './TextNode.vue';
import { APP_ICONS } from '@/Icons';
import { runtimeState, flowStore, translationsStore } from '@/stores';
import BaseNode from './BaseNode.vue';

const props = defineProps(["id", "type", "data"]);

const { updateNodeInternals } = useVueFlow();
const { addOption, removeOption, moveOption } = flowStore.methods;

const dragChoice = ref(null);
const outputsCollapsed = computed(() => flowStore.state[runtimeState.selectedDialogue].nodesOutputsCollapsed.includes(props.id));

function onDragStart(e) {
    const ghostEl = e.target.parentElement;
    e.dataTransfer.setDragImage(ghostEl, ghostEl.offsetWidth / 2, ghostEl.offsetHeight / 2);
    dragChoice.value = e.target;
}

function onDrop(e) {
    // console.log(`${dragChoice.value.id} dropped on ${e.currentTarget.id}`);
    if (!dragChoice.value) { return };
    const outputA = props.data.outputs.find(o => o.id == dragChoice.value.id);
    if (!outputA) { return };
    const idxA = props.data.outputs.findIndex(o => o.id == dragChoice.value.id);
    const idxB = props.data.outputs.findIndex(o => o.id == e.currentTarget.id);
    props.data.outputs.splice(idxA, 1);
    props.data.outputs.splice(idxB, 0, outputA);
    dragChoice.value = null;
}

function onOutputsCollapsed() {
    if (!outputsCollapsed.value) {
        flowStore.state[runtimeState.selectedDialogue].nodesOutputsCollapsed.push(props.id);
    }
    else {
        flowStore.state[runtimeState.selectedDialogue].nodesOutputsCollapsed = flowStore.state[runtimeState.selectedDialogue].nodesOutputsCollapsed.filter(id => id != props.id);
    }
}

function outputTarget(nodeId, outputId) {
    const targets = flowStore.state[runtimeState.selectedDialogue].edges.filter(e => e.sourceHandle == outputId && e.source == nodeId).map(e => e.targetNode.data.label);
    if (targets.length) {
        return targets[0];
    }
}

watch(
    () => ([...props.data.outputs]),
    (newOutputs, oldOutputs) => {
        if (!newOutputs) return
        // Recalculate order in-place
        newOutputs.forEach((output, index) => {
            output.order = index
        })
    },
    { deep: true }
)

function onTransitionend(nodeId) {
    updateNodeInternals(nodeId);
}

</script>

<template>
    <TextNode v-bind="$props" v-if="type == 'dialogue'">
        <div class="pre"
            v-if="translationsStore.state.strings[data.textString]?.[translationsStore.state.selectedLanguage]">
            {{ translationsStore.state.strings[data.textString][translationsStore.state.selectedLanguage] }}
        </div>
        <div class="ghost italic" v-else>
            (no text)
        </div>
    </TextNode>
    <BaseNode v-bind="$props" v-else>
        <div class="handle-wrapper collapsed">
            <Handle class="node-input-handle" id="in" type="target" :position="Position.Left" />
        </div>
    </BaseNode>

    <div class="title title-2" @click="onOutputsCollapsed">
        Options<span v-if="outputsCollapsed">⯈</span><span v-else>⯆</span> </div>

    <transition-group name="list" tag="div" v-if="!outputsCollapsed" @transitionend="onTransitionend(id)">
        <div key="wrapper" class="boundary-wrapper">
            <button class="btn square small boundary" @click="addOption(id, null, runtimeState.selectedDialogue)">+</button>
        </div>
        <div class="node-option" :id="output.id" :key="output.id" v-for="output in data.outputs" @drop="onDrop"
            @dragover.prevent>
            <div class="title title-3" :id="output.id" draggable="true" @dragstart="onDragStart">
                <button class="btn square small" @click="removeOption(id, output.id, runtimeState.selectedDialogue)">
                    <div v-html="APP_ICONS.Trash" />
                </button>
                <div class="text">Option {{ output.order + 1 }}</div>
                <div>
                    <button class="btn square small" @click="moveOption(id, output.id, -1, runtimeState.selectedDialogue)">⯅</button>
                    <button class="btn square small" @click="moveOption(id, output.id, 1, runtimeState.selectedDialogue)">⯆</button>
                </div>
            </div>
            <div class="row">
                <div class="section subsection dense">
                    <template v-if="type === 'dialogue'">
                        <div class="muted italic" v-if="output.if">
                            if {{ output.if }}:
                        </div>
                        <div class="pre"
                            v-if="translationsStore.state.strings[output.textString]?.[translationsStore.state.selectedLanguage]">
                            {{ translationsStore.state.strings[output.textString][translationsStore.state.selectedLanguage]
                            }}
                        </div>
                        <div class="ghost italic" v-else>
                            (no text)
                        </div>
                    </template>
                    <template v-if="type === 'branch'">
                        <div class="muted italic" v-if="output.if">
                            if {{ output.if }}:
                        </div>
                        <div class="ghost italic" v-else>
                            (no condition)
                        </div>
                    </template>
                    <div class="muted italic" v-if="outputTarget(props.id, output.id)">
                        -> {{ outputTarget(props.id, output.id) }}
                    </div>
                </div>
                <div class="handle-wrapper">
                    <Handle class="node-option-output-handle" :key="output.id" :id="output.id" type="source"
                        :position="Position.Right" connectable="single" />
                </div>
            </div>
            <div class="boundary-wrapper">
                <button class="btn square small boundary" @click="addOption(id, output.id, runtimeState.selectedDialogue)">+</button>
            </div>

        </div>
        <div class="section ghost" v-if="!data.outputs?.length && !outputsCollapsed">
            (no options)
        </div>
    </transition-group>
</template>
