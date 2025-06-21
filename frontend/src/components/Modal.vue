<script setup lang="ts">

import { useModalStore } from '@/stores/modal'
import Tile from './Tile.vue';
import { ref, watch } from 'vue';
import { LucideX } from 'lucide-vue-next';
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


const scrollbarWidth = ref(0)

function getScrollbarWidth(): number {
  return window.innerWidth - document.documentElement.clientWidth
}

watch(() => state.isVisible, (visible) => {
    const appElement = document.getElementById("app") as HTMLElement
    if (visible) {
        scrollbarWidth.value = getScrollbarWidth()
        appElement.style.paddingRight = `${getScrollbarWidth()}px`
        document.body.style.overflow = 'hidden'
    } else {
        setTimeout(() => {
            document.body.style.overflow = ''
            appElement.style.paddingRight = ''
        },200)
    }
})

</script>

<template>
    <Transition name="fade">
        <div
            v-if="state.isVisible"
            class="fixed inset-0 flex items-center justify-center z-50 bg-zinc-900/15 backdrop-blur-xs p-4"
            @click="handleModalOutsideClick"
            ref="modalRef"
            @keyup="handleModalKeyUp"
        >
            <Tile class="max-w-lg w-full shadow-xl">
                <div v-if="state.options.canClose" class="flex justify-end">
                    <LucideX :size="16" class="stroke-red-400"/>
                </div>
                <component :is="state.content" v-bind="state.props"/>
            </Tile>
        </div>
    </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
