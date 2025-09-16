<template>
    <div class="col select-list-wrapper" style="gap:16px">
        <div class="row">
            <input placeholder="Search..." style="width: 100%" v-model="q" @keydown.escape="() => q = ''" />
            <button @click="() => q = ''">×</button>
        </div>
        <div class="select-list">
            <div class="content">
                <div class="option" :class="{ selected: props.selected == row.id }" v-for="(row, idx) in rowsFiltered"
                    :key="row.id" :value="row.id" @click="onSelectClick(row.id)">
                    <div class="column" v-for="(column, idx) in props.columns">
                        <span>{{ accessor(row, column) }}</span>
                        <span class="ghost italic" v-if="!accessor(row, column)">( no text )</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { computed, defineProps, ref } from 'vue';
import { accessor } from '@/utils';

const props = defineProps(["rows", "columns", "selected", "onSelect"]);

const emit = defineEmits(["update:selected"]);
const q = ref(null);
const rowsFiltered = computed(() => {
    if (!q.value) return props.rows;
    const ql = q.value.toLowerCase();
    return props.rows.filter(r => {
        const values = props.columns.map(c => accessor(r, c));
        return values.some(v => v.toLowerCase().startsWith(ql));
    });
})

function onSelectClick(key) {
    emit("update:selected", key);
    if (typeof props.onSelect === 'function') {
        props.onSelect(key);
    }
}

</script>

<style scoped>
.select-list {
    min-height: 40px;
    cursor: default;
    overflow: auto;
    user-select: none;
}

.select-list .content {
    display: table;
    width: 100%;
}

.select-list .option {
    overflow: visible;
    display: table-row;
    border-bottom: 1px solid var(--border-color);
}

.select-list .option:hover {
    background-color: var(--bg-3);
}

.select-list .option.selected {
    background-color: var(--bg-4)
}

.select-list .option .column:last-child {
    border-right: none;
}

.select-list .option .column {
    display: table-cell;
    white-space: nowrap;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 4px 8px;
    border-right: 1px solid var(--border-color);
}

.select-list .option .column:first-child {
    color: var(--text-muted);
}

.select-list-wrapper input {
    border-radius: 4px 0 0 4px;
}

.select-list-wrapper button {
    border-radius: 0 4px 4px 0;
    margin: -1px;
}
</style>