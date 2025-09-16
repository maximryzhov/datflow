<template>
    <div style="position: relative;">
        <div v-if="dialogue" class="info-bar">{{ dialogue.name }}</div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { runtimeState, dialogueStore } from '@/stores';
const dialogue = computed(() => {
    return dialogueStore.state.dialogues.find(d => d.id == runtimeState.selectedDialogue);
})
</script>

<style scoped>
.info-bar {
    position: absolute;
    z-index: 1;
    color: var(--text-ghost);
    padding: 8px;
    user-select: none;
}
</style>