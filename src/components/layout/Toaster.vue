<script setup lang="ts">
import { runtimeState } from '@/stores';
import { watch } from 'vue';

// Remove toasts
watch(() => runtimeState.toasts.length, (newValues, oldValues) => {
    if (newValues > oldValues) {
        setTimeout(() => {
            runtimeState.toasts.pop();
        }, 3000)
    }
})
</script>

<template>
    <div style="position: relative;">
        <!-- <div > -->
        <TransitionGroup name="list" tag="div" class="toast-box">
            <div class="toast" v-for="toast, idx in runtimeState.toasts" :key="idx">
                {{  toast.text }}
            </div>
        </TransitionGroup>
        <!-- </div> -->
    </div>
</template>
<style scoped>
.toast-box {
    position: absolute;
    top: 100%;
    width: 100%;
    display: flex;
    padding: 8px;
    gap: 8px;
    flex-direction: column;
    text-align: center;
    align-items: center;
    z-index: 1;
}

.toast {
    padding: 8px;
    background-color: var(--bg-1);
    border-radius: 6px;
    color: var(--text-muted);
}

/* Transition animation */
.list-move,
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateY(100%);
}

.list-leave-active {
    position: absolute;
}
</style>