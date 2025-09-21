<script setup>
import { onMounted, onBeforeUnmount, watch, watchEffect, nextTick } from 'vue';
import { useVueFlow } from '@vue-flow/core'
import { useMagicKeys, useActiveElement, whenever } from '@vueuse/core'

import Topbar from '@/components/layout/Topbar.vue';
import LeftPanel from '@/components/layout/LeftPanel.vue';
import NodeCanvas from '@/components/layout/NodeCanvas.vue';
import Gutter from '@/components/widgets/Gutter.vue';
import Modal from '@/components/layout/Modal.vue';

import { vueFlowInstance, flowStore, optionsStore, translationsStore, runtimeState, dialogueStore } from './stores';
import { saveToLocalStorage, loadFromLocalStorage, setTheme, saveProject } from '@/utils';
import historyStore from './stores/History';
import { useModal } from './useModal';
import RightPanel from './components/layout/RightPanel.vue';
import DialogueInfoBar from './components/layout/DialogueInfoBar.vue';
import Toaster from './components/layout/Toaster.vue';
import NODE_TYPES from './NodeTypes';

vueFlowInstance.value = useVueFlow();
loadFromLocalStorage();
setTheme();

const modal = useModal();

onMounted(() => {
  runtimeState.selectedDialogue = dialogueStore.state.dialogues[0]?.id;
  window.addEventListener("keydown", handler)

})
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handler)
})

watch(() => [optionsStore.state.theme], () => {
  setTheme();
})

// Watch for data change and save it to localstorage
watch(
  () => [dialogueStore.state, flowStore.state, translationsStore.state, optionsStore.state],
  (newValues) => {
    if (runtimeState.loaded && newValues) {
      saveToLocalStorage();
    }
  },
  { deep: true }
);

// Watch for command buffer and prevent destructive actions
watch(
  () => runtimeState.commandQueue,
  (async queue => {
    while (queue.length != 0) {
      const command = queue.shift();
      transaction.push(command);
      nextTick(tryCompleteTransaction());
    }

  }),
  { deep: true }
)

const transaction = [];

function tryCompleteTransaction() {
  if (runtimeState.commandQueue.length || !transaction.length) { return }
  const stack = [];
  while (transaction.length != 0) {
    stack.push(transaction.shift());
  }
  if (stack) {
    if (stack.map(c => c.type).includes("delete")) {
      modal.confirm({ title: "Confirm action", message: "Are you sure to delete?" }).then(
        (result) => {
          if (result) {
            historyStore.methods.executeCommand(stack);
          }
        }
      )
    }
    else {
      historyStore.methods.executeCommand(stack);
    }
  }
}

const keys = useMagicKeys();
const { ctrl, KeyZ, KeyY } = keys;
const activeElement = useActiveElement();

watchEffect(() => {
  if (ctrl.value && KeyZ.value) {
    if (activeElement.value.tagName !== "INPUT" && activeElement.value.tagName !== "TEXTAREA") {
      historyStore.methods.undo();
    }
  }
  if (ctrl.value && KeyY.value) {
    if (activeElement.value.tagName !== "INPUT" && activeElement.value.tagName !== "TEXTAREA") {
      historyStore.methods.redo();
    }
  }
});

whenever(keys.delete, () => {
  if (runtimeState.selectedNode && runtimeState.selectedNode.type != NODE_TYPES.START.type) {
    if (activeElement.value.tagName !== "INPUT" && activeElement.value.tagName !== "TEXTAREA") {
      flowStore.methods.removeNode(runtimeState.selectedNode.id, runtimeState.selectedDialogue);
    }
  }
});

const handler = (e) => {
  if (e.ctrlKey && (e.keyCode === 83 || e.code === 'KeyS')) {
    e.preventDefault()
    saveProject()
  }
}

</script>

<template>
  <LeftPanel />
  <Gutter v-model:width="optionsStore.state.leftPanelWidth" min-width="100" side="left" />
  <div class="main">
    <Topbar />
    <DialogueInfoBar />
    <Toaster />
    <NodeCanvas v-if="flowStore.state[runtimeState.selectedDialogue]" />
    <Modal />
  </div>
  <Gutter v-model:width="optionsStore.state.rightPanelWidth" min-width="100" side="right" />
  <RightPanel />
</template>

<style>
@import '@/styles/main.css';
@import '@/styles/typography.css';
@import '@/styles/layout.css';
@import '@/styles/widgets.css';
@import '@/styles/node.css';
@import '@/styles/animation.css';
</style>