<script setup>

import { defineProps, ref } from 'vue';
import TextNode from './TextNode.vue';

const props = defineProps(["id", "data"])

</script>
<template>
    <TextNode v-bind="$props" type="script">
        <div class="muted italic pre" v-if="data.script">
            {{ data.script }}
        </div>
        <div v-else class="ghost italic">
            (no script)
        </div>
    </TextNode>
</template>