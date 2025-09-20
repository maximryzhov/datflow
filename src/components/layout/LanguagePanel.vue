<template>
    <!-- Languages Section -->
    <div class="title title-1">Languages in project</div>
    <div class="section">
        <div v-for="lang in translationsStore.state.languages" :key="lang" class="button-group"
            style="max-width: 400px;">
            <label v-if="editingLang !== lang" style="font-size: 1rem; flex:1">
                <input type="radio" :value="lang" v-model="translationsStore.state.selectedLanguage" />
                <div class="bright">{{ lang }}</div>
            </label>

            <ValidatedField v-else v-model="tempName" :validators="languageCodeValidators">
                <input style="flex:1" type="text" @keyup.enter="onRenameConfirm(lang)" @blur="onRenameCancel"
                    @keydown.escape="onRenameCancel" :ref="el => renameInputRef = el" />
            </ValidatedField>

            <template v-if="editingLang !== lang">
                <button @click="onRenameLanguage(lang)">Rename</button>
                <button @click="onDeleteLanguage(lang)">Delete</button>
            </template>

            <template v-else>
                <button @click="onRenameConfirm(lang)">Save</button>
                <button @click="onRenameCancel">Cancel</button>
            </template>
        </div>
    </div>
    <div class="title title-2">Add language</div>
    <div class="section">
        <div class="button-group" style="max-width: 400px;">
            <ValidatedField v-model="newLanguage" :validators="languageCodeValidators">
                <input placeholder="Language code" @keyup.enter="onAddLanguage">
            </ValidatedField>

            <button style="margin: -1px;height: 29px;" @click="onAddLanguage">Add</button>
        </div>
    </div>

</template>
<script setup>
import { ref, nextTick } from 'vue';
import { translationsStore } from '@/stores';
import ValidatedField from '@/components/widgets/ValidatedField.vue';
import { languageCodeValidators } from '@/utils/Validators';

const { addLanguage, removeLanguage, renameLanguage } = translationsStore.methods;

const newLanguage = ref('')

const editingLang = ref(null);
const tempName = ref("");
const renameInputRef = ref(null);

function onRenameLanguage(lang) {
    editingLang.value = lang;
    tempName.value = lang;
    nextTick(() => {
        if (renameInputRef.value) {
            renameInputRef.value.focus();
            renameInputRef.value.select(); // optional: select text
        }
    })
}

function onRenameConfirm(oldLang) {
    renameLanguage(oldLang, tempName.value);
    editingLang.value = null;
    translationsStore.state.selectedLanguage = tempName.value;
    tempName.value = "";

}

function onRenameCancel() {
    editingLang.value = null;
    tempName.value = "";
}

const onAddLanguage = () => {
    const langCode = newLanguage.value.trim()
    if (!langCode) return;
    addLanguage(langCode);
    translationsStore.state.selectedLanguage = langCode;
    newLanguage.value = '';
    translationsStore.state.selectedLanguage = langCode;
}

const onDeleteLanguage = (langCode) => {
    removeLanguage(langCode);
    translationsStore.state.selectedLanguage = translationsStore.state.languages.length ? translationsStore.state.languages[0] : null;
}

</script>