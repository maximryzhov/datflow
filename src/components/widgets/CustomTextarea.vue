<template>
    <textarea ref="textarea" v-model="innerValue" @input="autoResize" rows="1" />
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from "vue";

// accept v-model
const props = defineProps({
    modelValue: {
        type: String,
        default: "",
    },
});

const emit = defineEmits(["update:modelValue"]);

const innerValue = ref(props.modelValue);
const textarea = ref(null);

function autoResize() {
    const el = textarea.value;
    if (!el) return;
    el.style.height = "auto";
    // 8 - padding
    el.style.height = el.scrollHeight - 8 + "px";
}

// sync external changes → innerValue and resize
watch(
    () => props.modelValue,
    async (val) => {
        innerValue.value = val;
        await nextTick(); // wait until DOM updates with new text
        autoResize();
    }
);

// sync typing → emit updates
watch(innerValue, (val) => {
    emit("update:modelValue", val);
});

// --- Expose native methods ---
function focus() {
    textarea.value?.focus();
}
// function select() {
//     textarea.value?.select();
// }
defineExpose({ focus,  });

onMounted(() => {
    autoResize();
});
</script>