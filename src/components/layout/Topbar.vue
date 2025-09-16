<script setup>
import { computed, onMounted, ref } from 'vue';
import { useVueFlow } from '@vue-flow/core';
import ContextMenu from '@/components/widgets/Menu.vue';
import { newProject, saveProject, saveProjectAs, loadProject, toggleTheme } from '@/utils';
import { dialogueStore, translationsStore, flowStore, runtimeState } from '@/stores';
import historyStore from '@/stores/History';
import { APP_ICONS } from '@/Icons';

const menuRefs = [
    { el: ref(null), show: ref(false) },
    { el: ref(null), show: ref(false) },
    { el: ref(null), show: ref(false) },
];

const { fitView } = useVueFlow();

onMounted(() => {
    document.addEventListener('click', handleClick);
})

const editMenuItems = computed(() => {
    let undoLabel = "Undo";
    const lastUndo = historyStore.state.past[historyStore.state.past.length - 1];
    if (lastUndo) {
        undoLabel += ` ${lastUndo.at(-1).type} ${lastUndo.at(-1).object}`;
    }
    let redoLabel = "Redo";
    const lastRedo = historyStore.state.future[0];
    if (lastRedo) {
        redoLabel += ` ${lastRedo.at(-1).type} ${lastRedo.at(-1).object}`;
    }
    return [
        { label: undoLabel, onClick: undo },
        { label: redoLabel, onClick: redo }
    ];
})
const fileMenuItems = [
    { label: "New", onClick: newProject },
    { label: "Save", onClick: saveProject },
    { label: "Save as", onClick: saveProjectAs },
    { label: "Load", onClick: loadProject },
]
const languageMenuItems = computed(() => {
    return [
        { label: "Language" },
        ...translationsStore.state.languages.map(l => ({ label: l, onClick: () => translationsStore.state.selectedLanguage = l }))
    ];
});

function toggleMenu(idx) {
    menuRefs.forEach(r => r.show.value = false);
    menuRefs[idx].show.value = !menuRefs[idx].show.value;
}

function handleClick(event) {
    menuRefs.forEach(r => {
        if (r.el.value && !r.el.value.contains(event.target)) {
            r.show.value = false
        }
    })
}

function undo() {
    historyStore.methods.undo();
}
function redo() {
    historyStore.methods.redo();
}
function rearrange() {
    flowStore.methods.rearrangeNodes(runtimeState.selectedDialogue);
}

function newDialogue() {
    dialogueStore.methods.newDialogue();
}

</script>

<template>
    <div class="topbar">
        <div style="display: flex;flex:1;justify-content: start;gap: 6px;">
            <div class="dropdown" @click.stop>
                <button :class="{ 'selected': menuRefs[0].show.value }" class="fit transparent" :ref="menuRefs[0].el"
                    @click="toggleMenu(0)">File</button>
                <ContextMenu v-if="menuRefs[0].show.value" :menu-items="fileMenuItems"
                    v-model:show="menuRefs[0].show.value" />
            </div>
            <div class="dropdown" @click.stop>
                <button :class="{ 'selected': menuRefs[1].show.value }" class="fit transparent" :ref="menuRefs[1].el"
                    @click="toggleMenu(1)">Edit</button>
                <ContextMenu v-if="menuRefs[1].show.value" :menu-items="editMenuItems"
                    v-model:show="menuRefs[1].show.value" />
            </div>
            <div class="dropdown" @click.stop>
                <button :class="{ 'selected': menuRefs[2].show.value }" class="fit transparent" :ref="menuRefs[2].el"
                    @click="toggleMenu(2)">{{
                        translationsStore.state.selectedLanguage }}</button>
                <ContextMenu v-if="menuRefs[2].show.value" :menu-items="languageMenuItems"
                    v-model:show="menuRefs[2].show.value" />
            </div>
            <button class="square" @click="fitView" v-html="APP_ICONS.Fit" title="Fit to view" />
            <button class="square" @click="rearrange" v-html="APP_ICONS.Rearrange" title="Rearrange icons" />
        </div>
        <div style="display: flex;flex:1;justify-content: center;gap: 6px;">
            <span class="ghost">{{ runtimeState.projectHandle?.name || 'Untitled (Not saved)' }}</span>
        </div>

        <div style="display: flex;flex:1;justify-content: end;gap: 6px;">
            <button class="square" @click="toggleTheme" v-html="APP_ICONS.Light" />
        </div>

    </div>
</template>

<style>
.topbar {
    display: flex;
    align-items: center;
    height: 35 px;
    min-width: 400px;
    background: var(--bg-1);
    border-bottom: 1px solid var(--border-color);
    user-select: none;
    padding: 4px;
    margin: 0;
}

.dropdown {
    position: relative;
    /* width: 100%; */
}
</style>