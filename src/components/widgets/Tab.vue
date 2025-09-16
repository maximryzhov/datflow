<template>
  <div v-if="isActive" class="tab-content-item">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  }
})

// Inject the active tab from the parent TabPanel
const activeTab = inject('activeTab', '')

const isActive = computed(() => {
  return activeTab.value === props.name
})
</script>

<style scoped>
.tab-content-item {
  width: 100%;
}
</style>