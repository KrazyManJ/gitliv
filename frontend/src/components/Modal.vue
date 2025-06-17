<script setup lang="ts">

import { useModalStore } from '@/stores/modal'
import Tile from './Tile.vue';
const { state, hideModal } = useModalStore()

const handleModalOutsideClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget && state.options.canClose) {
        hideModal()
    }
}

const handleModalKeyUp = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return
    hideModal()
}

</script>

<template>
    <Transition name="fade">
        <div
            v-if="state.isVisible"
            class="fixed inset-0 flex items-center justify-center z-50 bg-zinc-900/15 backdrop-blur-xs shadow p-4"
            @click="handleModalOutsideClick"
            ref="modalRef"
            @keyup="handleModalKeyUp"
        >
            <Tile class="max-w-lg w-full">
                <component :is="state.content" v-bind="state.props"/>
            </Tile>
        </div>
    </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
