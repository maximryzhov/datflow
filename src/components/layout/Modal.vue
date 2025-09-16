<script setup>
import { useModalState } from '@/useModal.js'

const { state, resolve } = useModalState()

function onConfirm() {
    resolve(true)
    state.isVisible = false
}

function onCancel() {
    resolve(false)
    state.isVisible = false
}
</script>

<template>
    <div v-if="state.isVisible" class="modal-overlay">
        <div class="vue-flow__node" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div class="title title-1 drag-handle">{{ state.title }}</div>
            <div class="section">
                <div class="row">{{ state.message }}</div>

                <div class="row">
                    <div class="col">
                        <div class="button-group">
                            <button class="btn" @click="onConfirm">OK</button>
                            <button class="btn" @click="onCancel">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.modal-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
}
</style>
