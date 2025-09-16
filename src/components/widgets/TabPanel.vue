<template>
    <div class="tab-panel">
        <div class="tab-buttons">
            <button v-for="tab in tabNames" :key="tab" :class="['tab-button', { active: modelValue === tab }]"
                @click="selectTab(tab)">
                <div v-if="props.icons?.[tab]" v-html="props.icons[tab]" />
                <div>{{ tab }}</div>
            </button>
        </div>
        <div class="tab-content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import { computed, useSlots, provide } from 'vue'

const props = defineProps({
    modelValue: {
        type: String,
        required: true
    },
    icons: Object
})

const emit = defineEmits(['update:modelValue'])

const slots = useSlots()

// Provide the active tab to child Tab components
provide('activeTab', computed(() => props.modelValue))

const tabNames = computed(() => {
    if (!slots.default) return []
    return slots.default()
        .map(slot => slot.props?.name)
        .filter(name => name !== undefined)
})

const selectTab = (tabName) => {
    emit('update:modelValue', tabName)
}
</script>

<style>
.tab-panel {
    min-width: 300px;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--bg-1);
    scrollbar-color: inherit;
    user-select: none;
}

.tab-buttons {
    display: flex;
    height: 40px;
}

.tab-button {
    flex: 1;
    display: flex;
    place-items: anchor-center;
    justify-content: left;
    gap: 16px;
    padding: 0 8px;
    cursor: pointer;
    border-radius: 4px 4px 0 0;
    background-color: inherit;
    border: 1px solid var(--border-color);
    border-left: 1px solid transparent;
    color: var(--text-muted);
    transition: all 0.2s ease;
}

.tab-button svg {
    width: 16px;
}

.tab-button:hover {
    background: var(--btn-hover);
}

.tab-button.active {
    color: var(--text-color);
    border-bottom: 1px solid transparent;
    font-weight: 500;
}

.tab-content {
    flex: 1;
    overflow-y: scroll;
    border-left: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
    /* padding-bottom: 50%; */
}


</style>