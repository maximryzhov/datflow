<template>
    <div class="title title-1">Strings</div>
    <div class="section">
        <div class="col">
            <div class="button-group" style="max-width: 367px;">
                <button class="btn" @click="() => { csvFile.value = ''; csvFile.click() }">Import CSV</button>
                <button class="btn" @click="onExportCSV">Export CSV</button>
                <input ref="csvFile" type="file" accept=".csv" style="display: none"
                    @change="onImportCSV($event.target.files[0])" />
            </div>
        </div>
        <div class="col">
            <SelectList style="max-height: 300px;" :rows="rows" :columns="columns" v-model:selected="selectedLabel" />
        </div>

        <div class="col">
            <div class="button-group" style="max-width: 367px;">
                <button class="btn" @click="() => moveTranslation(selectedLabel, -1)"
                    :disabled="!selectedLabel">↑</button>
                <button class="btn" @click="() => moveTranslation(selectedLabel, 1)"
                    :disabled="!selectedLabel">↓</button>
                <button class="btn" @click="newTranslation">Add</button>
                <button class="btn" @click="deleteEntry" :disabled="!selectedLabel">Delete</button>
            </div>
        </div>
        <div class="col">
            <div class="button-group" style="max-width: 367px;">
                <button class="btn" @click="removeEmptyStrings">Remove empty</button>
                <button class="btn" @click="autoNameLabels">Auto name labels</button>
            </div>
        </div>
        <!-- Label and Text Editing -->
        <div v-if="selectedLabel" class="section">
            <div class="col">
                <label>Label:</label>
                <ValidatedField v-model="translationsStore.state.labels[selectedLabel]"
                    :validators="stringLabelValidators">
                    <input :id="selectedLabel">
                </ValidatedField>
            </div>
            <div v-for="lang in translationsStore.state.languages" class="col">
                <label>Text for {{ lang }}:</label>
                <CustomTextarea style="resize: vertical;" v-if="translationsStore.state.strings[selectedLabel]"
                    v-model="translationsStore.state.strings[selectedLabel][lang]">
                </CustomTextarea>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { flowStore, runtimeState, translationsStore, dialogueStore } from "@/stores"
import CustomTextarea from '@/components/widgets/CustomTextarea.vue';
import SelectList from '@/components/widgets/SelectList.vue';
import ValidatedField from '@/components/widgets/ValidatedField.vue';
import { stringsFromCSV, stringsToCSV } from '@/utils';
import { stringLabelValidators } from '@/utils/Validators';
import NODE_TYPES from '@/NodeTypes';

const { newTranslation, removeTranslation, moveTranslation } = translationsStore.methods;

const selectedLabel = ref('')
const csvFile = ref();

const columns = computed(() => ["key", ...translationsStore.state.languages]);
const rows = computed({
    get: () => {
        const rows = Object.keys(translationsStore.state.labels).map(id => {
            const row = {
                id: id,
                key: translationsStore.state.labels[id],
            };
            translationsStore.state.languages.forEach(lang => {
                row[lang] = translationsStore.state.strings[id]?.[lang] || '';
            });

            return row;
        });
        return rows;
    }
})

const deleteEntry = () => {
    if (!selectedLabel.value) return
    removeTranslation(selectedLabel.value);
    selectedLabel.value = '';
}

function onImportCSV(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => stringsFromCSV(e.target.result);
    reader.readAsText(file);
}

async function onExportCSV() {
    const csvContent = stringsToCSV(translationsStore.state.labels, translationsStore.state.strings);
    let fileHandle = await window.showSaveFilePicker({
        types: [
            {
                description: "CSV Files",
                accept: { "text/csv": [".csv"] },
            },
        ],
    });

    const writable = await fileHandle.createWritable();
    await writable.write(csvContent);
    await writable.close();
}

function removeEmptyStrings() {
    Object.keys(translationsStore.state.labels).forEach(key => {
        const translation = translationsStore.state.strings[key];
        if (Object.values(translation).every(v => v === null || v === "")) {
            translationsStore.methods.removeTranslation(key)
        };
    });
}

function autoNameLabels() {
    flowStore.state[runtimeState.selectedDialogue].nodes.forEach(n => {
        if (n.type != NODE_TYPES.DIALOGUE.type) {
            return;
        }
        if (n.data.textString) {
            const label = translationsStore.state.labels[n.data.textString];
            const newLabel = renameLabel(label);
            if (!label) return;
            if (newLabel != label)
                translationsStore.methods.renameLabel(n.data.textString, newLabel);

        }
        if (n.data.outputs) {
            n.data.outputs.forEach(o => {
                if (o.textString) {
                    const label = translationsStore.state.labels[o.textString];
                    if (!label) return;
                    const newLabel = renameLabel(label);
                    if (newLabel != label)
                        translationsStore.methods.renameLabel(o.textString, newLabel);
                }
            })
        }
    })
}

function renameLabel(label) {
    const parts = label.split("_");
    const suffix = parts[parts.length - 1];
    let prefix = dialogueStore.state.dialogues.find(d => d.id == runtimeState.selectedDialogue).name;
    prefix = prefix.replace(" ", "_");
    const newLabel = `${prefix}_${suffix}`;
    return newLabel;
}
</script>