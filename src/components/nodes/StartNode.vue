<script setup>

import { defineProps } from 'vue';
import { Position, Handle } from '@vue-flow/core';
import BaseNode from './BaseNode.vue';

const props = defineProps(["id", "type", "data"])

</script>
<template>
    <BaseNode v-bind="$props" type="start">
        <div class="row">
            <div class="section">
                <div class="ghost italic">
                    Marks dialogue entry point.
                </div>
            </div>
            <div class="handle-wrapper">
                <Handle :id="props.data.outputs[0].id" class="node-output-handle" type="source"
                    :position="Position.Right" connectable="single" />
            </div>
        </div>
    </BaseNode>
</template>