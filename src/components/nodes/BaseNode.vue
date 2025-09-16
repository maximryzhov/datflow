<script setup>

import { defineProps } from 'vue';
import { NODE_ICONS, APP_ICONS } from "@/Icons";
import NODE_TYPES from '@/NodeTypes';
import { runtimeState, flowStore } from '@/stores';

const props = defineProps(["id", "type", "data"])


</script>
<template>
    <div class="title title-1 drag-handle">
        <div class="icon" v-html="NODE_ICONS[type]" />
        <div class="text">{{ data.label }}</div>
        <button class="btn square small" @click="flowStore.methods.removeNode(id, runtimeState.selectedDialogue)" v-if="type != NODE_TYPES.START.type">
            <div v-html="APP_ICONS.Trash" />
        </button>
    </div>
    <slot></slot>
</template>