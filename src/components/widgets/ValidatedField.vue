<script setup>
import { ref, watch, h, cloneVNode } from "vue"

const props = defineProps({
  modelValue: [String, Number],
  validators: { type: Object, default: () => ({}) }
})
const emit = defineEmits(["update:modelValue"])

const localValue = ref(props.modelValue ?? "")
const errorText = ref("")

// Sync with external model
watch(() => props.modelValue, v => {
  if (v !== localValue.value) localValue.value = v ?? ""
})

function validate(e) {
  for (const key in props.validators) {
    const { test, errorText: text } = props.validators[key]
    if (!test(e.target.value, e)) {
      errorText.value = text
      return false
    }
  }
  errorText.value = ""
  return true
}

function onInput(e) {
  localValue.value = e.target.value;
  if (validate(e)) {
    emit("update:modelValue", e.target.value)
  }
}

function onBlur() {
  localValue.value = props.modelValue ?? ""
  errorText.value = "";
}
</script>

<template>
  <div class="validated-field">
    <component v-for="child in $slots.default?.() || []" :is="child.type" v-bind="child.props" :value="localValue"
      @input="e => onInput(e)" @change="e => onInput(e)" @blur="onBlur"
      :class="[child.props?.class, errorText ? 'error' : '']" :v-on="child.props?.on" :ref="child.props.ref" />
    <div v-if="errorText" class="error-text">{{ errorText }}</div>
  </div>
</template>

<style scoped>
.validated-field {
  display: flex;
  flex-direction: column;
}

.error {
  outline: 1px solid var(--danger-outline);
}

.error:focus {
  outline: 1px solid var(--danger-outline);
}

.error-text {
  color: var(--danger-text);
  font-size: 0.75rem;
  padding: 0 2px;
  /* height: 0; */
}
</style>
