<template>
    <div class="node-option" :style="{ minWidth: nodeOptionWidth }">
        <div class="title title-3">
            <button class="btn square small" v-if="selectedNode.type === 'dialogue' || selectedNode.type === 'branch'"
                @click="removeOption(selectedNode.id, opt.id, runtimeState.selectedDialogue)">
                <div v-html="APP_ICONS.Trash" />
            </button>
            <div class="text">Option {{ opt.order + 1 }}</div>
            <div v-if="selectedNode.type === 'dialogue' || selectedNode.type === 'branch'">
                <button class="btn square small" @click="moveOption(selectedNode.id, opt.id, -1, runtimeState.selectedDialogue)">⯅</button>
                <button class="btn square small" @click="moveOption(selectedNode.id, opt.id, 1, runtimeState.selectedDialogue)">⯆</button>
            </div>
        </div>
        <div class="section dense subsection">
            <div class="col" v-if="selectedNode.type === 'dialogue'">
                <label>String</label>
                <select v-model="opt.textString">
                    <option value="">—</option>
                    <option v-for="(value, key, idx) in translationsStore.state.labels" :value="key">{{
                        value }}
                    </option>
                </select>
            </div>
            <div class="col" v-if="translationsStore.state.strings[opt.textString]">
                <label>Text  ({{ translationsStore.state.selectedLanguage }})</label>
                <CustomTextarea style="resize: none;"
                    v-model="translationsStore.state.strings[opt.textString][translationsStore.state.selectedLanguage]" />
            </div>
            <div class="col" v-if="selectedNode.type === 'dialogue' || selectedNode.type === 'branch'">
                <label>Condition</label>
                <input v-model="opt.if"/>
            </div>
            <div class="col">
                <label>Target</label>
                <select :id="opt.id" :key="targetRef" v-model="target">
                    <option value="">—</option>
                    <option v-for="n in flowStore.state[runtimeState.selectedDialogue].nodes.filter(n => n.id != selectedNode.id && n.type != 'start')"
                        :key="n.id" :value="n.id">{{
                            n.data.label }}</option>
                </select>
            </div>
        </div>
        <div class="boundary-wrapper" v-if="selectedNode.type === 'dialogue' || selectedNode.type === 'branch'">
            <button class="btn square small boundary" @click="addOption(selectedNode.id, opt.id, runtimeState.selectedDialogue)">+</button>
        </div>
    </div>
</template>

<script setup>
import { defineProps, computed, ref } from 'vue';
import { runtimeState, flowStore, optionsStore, translationsStore } from '@/stores';
import { APP_ICONS } from '@/Icons';
import CustomTextarea from '@/components/widgets/CustomTextarea.vue';
import { makeEdgeId } from '@/utils/MakeID';

const props = defineProps(["selectedNode", "opt"]);

const { addOption, removeOption, moveOption, addEdge, removeEdge, updateEdge } = flowStore.methods;

// Dynamic width for correct list animations
const nodeOptionWidth = computed(() => {
    const margin = 17;
    return optionsStore.state.rightPanelWidth - margin + 'px';
})


const targetRef = ref(flowStore.state[runtimeState.selectedDialogue].edges.find(e => e.source == props.selectedNode.id && e.sourceHandle == props.opt.id)?.target ?? "");
const target = computed({
    get: () => {
        targetRef.value = flowStore.state[runtimeState.selectedDialogue].edges.find(e => e.source == props.selectedNode.id && e.sourceHandle == props.opt.id)?.target ?? "";
        return targetRef.value;
    },
    set: (value) => {
        const edge = flowStore.state[runtimeState.selectedDialogue].edges.find(e => e.source == props.selectedNode.id && e.sourceHandle == props.opt.id);
        if (edge) {

            if (value) {
                updateEdge(edge.id, { target: value }, runtimeState.selectedDialogue);
            }
            else {
                removeEdge(edge, runtimeState.selectedDialogue);
            }
        }
        else {
            const source = props.selectedNode.id;
            const target = value;
            const sourceHandle = props.opt.id;
            const targetHandle = "in";
            const newConnection = {
                id: makeEdgeId(source, target, sourceHandle, targetHandle),
                source,
                target,
                sourceHandle,
                targetHandle
            }
            addEdge(newConnection, runtimeState.selectedDialogue);
        }
        targetRef.value = value;

    }
})

</script>