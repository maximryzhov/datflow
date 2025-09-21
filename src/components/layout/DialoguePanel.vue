<template>
    <div class="title title-1">Dialogues in project</div>
    <div class="section">
        <div class="col">
            <SelectList style="max-height: 300px;" :rows="dialogueStore.state.dialogues" :columns="['name']"
                v-model:selected="runtimeState.selectedDialogue" />
        </div>
        <div class="col">
            <div class="button-group" style="max-width: 367px;">
                <button @click="onNewDialogue">New</button>
                <button @click="onImportYAML">Import</button>
                <button @click="onDeleteDialogue">Delete</button>
            </div>
        </div>
    </div>
    <template v-if="dialogue">
        <div class="section">
            <div class="col">
                <label>Dialogue name:</label>
                <ValidatedField v-model="dialogue.name" :validators="dialogueNameValidators">
                    <input :id="runtimeState.selectedDialogue">
                </ValidatedField>
            </div>
        </div>
        <div class="title title-2">Export</div>
        <div class="section">
            <div class="text muted">Exports selected dialogue graph to YAML.</div>
            <div class="text ghost">No options currently available</div>
        </div>
        <div class="section">
            <button style="max-width: 138px;" @click="exportYAML">Export</button>
        </div>
    </template>
</template>

<script setup>
import { computed, nextTick } from 'vue';
import { useVueFlow } from '@vue-flow/core';
import { runtimeState, dialogueStore } from '@/stores';
import { defaultState } from '@/Defaults';
import SelectList from '@/components/widgets/SelectList.vue';
import ValidatedField from '@/components/widgets/ValidatedField.vue';
import { dialogueNameValidators } from '@/utils/Validators';
import { exportYAML, importYAML } from "@/utils"

const { newDialogue, removeDialogue } = dialogueStore.methods;
const { fitView, setViewport } = useVueFlow();

const dialogue = computed(() => {
    return dialogueStore.state.dialogues.find(d => d.id == runtimeState.selectedDialogue);
})

function onNewDialogue() {
    const dialogue = newDialogue();
    runtimeState.selectedDialogue = dialogue.id;
    nextTick(() => {
        fitView();
        nextTick(() => {
            setViewport((defaultState.flow.defaultViewport));
        })
    })
}

function onDeleteDialogue() {
    if (!runtimeState.selectedDialogue) return
    removeDialogue(runtimeState.selectedDialogue);
}

function onImportYAML() {
    importYAML().then(newDialogue => {
        runtimeState.selectedDialogue = newDialogue.id;
    });
}
</script>