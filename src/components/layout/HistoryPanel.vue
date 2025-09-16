<template>
    <div class="section" v-if="!historyStore.state.past.length && !historyStore.state.future.length">
        <div class="text ghost">
            No changes made yet
        </div>
    </div>
    <div class="history-item past" v-for="transaction, idx in historyStore.state.future" @click="onFutureClick(idx)"
        style="border-bottom: 1px solid var(--border-color);">
        <div v-for="command in transaction">{{ command.type + " " + command.object }}</div>
    </div>
    <div class="history-item" v-for="transaction, idx in historyStore.state.past.toReversed()"
        @click="onPastClick(idx)">
        <div v-for="command in transaction">{{ command.type + " " + command.object }}</div>
    </div>
</template>

<script setup>
import { historyStore } from '@/stores';

function onPastClick(historyIdx) {
    // const times = historyStore.state.past.length - historyIdx;
    for (let i = 0; i < historyIdx + 1; i++) {
        historyStore.methods.undo();
    }
}
function onFutureClick(historyIdx) {
    const times = historyStore.state.future.length - historyIdx;
    for (let i = 0; i < times; i++) {
        historyStore.methods.redo();
    }
}
</script>

<style scoped>
.history-item {
    border-bottom: 1px solid var(--border-color);
    padding: 4px 8px;
    color: var(--text-muted);
}

.history-item.past {
    color: var(--text-ghost);
}

.history-item:hover {
    background-color: var(--bg-3);
}
</style>