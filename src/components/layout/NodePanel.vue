<script setup>
import { ref, watch } from 'vue';
import { useVueFlow } from '@vue-flow/core';

import CustomTextarea from '@/components/widgets/CustomTextarea.vue';
import SelectList from '@/components/widgets/SelectList.vue';
import ValidatedField from '@/components/widgets/ValidatedField.vue';

import { runtimeState, flowStore, translationsStore } from '@/stores';
import { APP_ICONS } from '@/Icons';
import { nodeLabelValidators } from '@/utils/Validators';
import NODE_TYPES from '@/NodeTypes';
import NodePanelOption from './NodePanelOption.vue';

const props = defineProps(["selectedNode"]);

const { updateNodeInternals, addSelectedNodes } = useVueFlow();
const { removeNode, addOption } = flowStore.methods;

const noTransition = ref(true);

function onNodeSelected(nodeId) {
    addSelectedNodes(flowStore.state[runtimeState.selectedDialogue].nodes.filter(n => n.id == nodeId));
}

function onTransitionend(nodeId) {
    updateNodeInternals(nodeId);
}

watch(() => props.selectedNode?.id, () => {
    // Prevent list animation when changing selected nodes
    noTransition.value = true;
    setTimeout(() => noTransition.value = false, 100);
})

</script>

<template>
    <div class="nodePanel">
        <template v-if="flowStore.state[runtimeState.selectedDialogue]">
            <template v-if="selectedNode">
                <div class="title title-1">
                    <div class="text">{{ selectedNode.data.label }}
                        <div class="ghost subtitle">{{ "ID: " + selectedNode.id }}</div>
                    </div>
                    <button class="btn square" @click="removeNode(selectedNode.id, runtimeState.selectedDialogue)"
                        v-if="selectedNode.type != NODE_TYPES.START.type">
                        <div v-html="APP_ICONS.Trash" />
                    </button>
                </div>
                <div class="section dense">
                    <div class="col">
                        <label for="node-label">Label</label>
                        <ValidatedField v-model="selectedNode.data.label" :validators="nodeLabelValidators">
                            <input :id="selectedNode.id" />
                        </ValidatedField>
                    </div>
                    <template v-if="selectedNode.type === 'dialogue'">
                        <div class="col">
                            <label>String</label>
                            <select v-model="selectedNode.data.textString">
                                <option value="">—</option>
                                <option v-for="(value, key, idx) in translationsStore.state.labels" :value="key">{{
                                    value }}
                                </option>
                            </select>
                        </div>
                        <div class="col" v-if="translationsStore.state.strings[selectedNode.data.textString]">
                            <label>Text ({{ translationsStore.state.selectedLanguage }})</label>
                            <CustomTextarea style="resize: none;"
                                v-model="translationsStore.state.strings[selectedNode.data.textString][translationsStore.state.selectedLanguage]" />
                        </div>
                    </template>
                    <template v-if="selectedNode.type === 'script'">
                        <div class="col">
                            <label>Script source</label>
                            <CustomTextarea style="resize: vertical;" v-model="selectedNode.data.script" />
                        </div>
                    </template>
                </div>
                <div class="title title-2">{{ `Options (${selectedNode.data.outputs.length})` }}</div>
                <div class="boundary-wrapper" v-if="selectedNode.type === 'dialogue' || selectedNode.type === 'branch'">
                    <button class="btn square small boundary"
                        @click="addOption(selectedNode.id, null, runtimeState.selectedDialogue)">+</button>
                </div>
                <transition-group :class="{ 'no-transition': noTransition }" name="list" tag="div"
                    @transitionend="onTransitionend(id)">
                    <NodePanelOption v-bind="$props" :id="opt.id" :key="opt.id"
                        v-for="(opt, optIdx) in (selectedNode.data.outputs || (selectedNode.data.outputs = []))"
                        :opt="opt" :opt-idx="optIdx" />
                </transition-group>
            </template>

            <template v-else>
                <div class="section">
                    <div class="ghost">Select a node</div>
                    <div class="col">
                        <SelectList style="max-height: 300px;"
                            :rows="flowStore.state[runtimeState.selectedDialogue].nodes"
                            :columns="['type', 'data.label']" :on-select="onNodeSelected" />
                    </div>
                </div>
            </template>
        </template>
        <template v-else>
            <div class="section">
                <div class="ghost">No dialogue graph selected</div>
            </div>
        </template>
    </div>
</template>