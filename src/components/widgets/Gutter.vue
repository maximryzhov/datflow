<template>
    <div class="gutter" @mousedown="startResize"></div>
</template>

<script setup>
import { useVueFlow } from '@vue-flow/core';

const props = defineProps(["width", "minWidth", "side"]);
const emit = defineEmits(["update:width"]);

const { panOnDrag } = useVueFlow();

let startX = 0
let startWidth = 0

const startResize = (e) => {
    panOnDrag.value = false;
    startX = e.clientX
    startWidth = props.width;
    window.addEventListener('mousemove', onResize)
    window.addEventListener('mouseup', stopResize)
}

const onResize = (e) => {
    let newWidth;
    if (props.side == "left") {
        newWidth = startWidth + (e.clientX - startX)
    }
    else if (props.side === 'right') {
        newWidth = startWidth - (e.clientX - startX)
    }
    emit("update:width", Math.max(props.minWidth, newWidth));
}

const stopResize = () => {
    panOnDrag.value = true;
    window.removeEventListener('mousemove', onResize);
    window.removeEventListener('mouseup', stopResize);
}

</script>

<style scoped>
.gutter {
    width: 5px;
    cursor: col-resize;
    background: var(--bg-2);
}

.gutter:hover {
    background-color: var(--text-ghost);
}

.gutter:active {
    background-color: var(--accent);
}
</style>