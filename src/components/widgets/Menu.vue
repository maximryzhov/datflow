<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps(["title", "menuItems", "show"]);
const emit = defineEmits(["update:show"]);

function handleClick(item) {
    if (typeof item.onClick === 'function') {
        item.onClick();
        emit("update:show", false); // parent ref updates automatically
    }
}

</script>

<template>
    <ul class="dropdown-menu">
        <li :class="item.onClick ? 'selectable' : 'title title-3'" v-for="item in menuItems" @click="handleClick(item)">
            <div class="icon" v-if="item.icon" v-html="item.icon"></div>
            <div class="label">{{ item.label }}</div>
        </li>
    </ul>
</template>

<style scoped>
.dropdown {
    position: relative;
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--bg-1);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    min-width: 120px;
    border-radius: 4px;
    list-style: none;
    padding: 0;
    margin: 4px 0 0 0;
    z-index: 1000;
    user-select: none;
}

.dropdown-menu li .icon {
    width: 24px;
    height: 24px;
}

.dropdown-menu li {
    display: flex;
    padding: 4px 16px;
    cursor: default;
    gap: 8px;
}

.dropdown-menu li.title {
    padding: 2px 4px;
    background-color: var(--bg-2);
    color: var(--text-muted);
}

.dropdown-menu li .label {
    text-wrap: nowrap;
}

.dropdown-menu li.selectable:hover {
    background-color: var(--btn-hover);
}

.dropdown-menu li:first-child {
    border-radius: 4px 4px 0 0;
}

.dropdown-menu li:last-child {
    border-radius: 0 0 4px 4px;
}
</style>