<script setup lang="ts">
import { usePopupStore, type PopupInfo, type PopupType } from '@/stores/popup';
import { LucideCheck, LucideInfo, LucideTriangleAlert, LucideX } from 'lucide-vue-next';
import { nextTick, onMounted, ref, type Component } from 'vue';


const {popupInfo} = defineProps<{
    popupInfo: PopupInfo
}>()

const { dismissPopup } = usePopupStore()

const timeoutId = ref<number>()

const visible = ref(false)

const dismiss = () => {
    clearTimeout(timeoutId.value)
    visible.value = false
    setTimeout(() => dismissPopup(popupInfo), 100)
}

onMounted(async() => {
    await nextTick()
    visible.value = true

    timeoutId.value = setTimeout(() => {
        visible.value = false
        setTimeout(() => dismissPopup(popupInfo), 100)
    }, 5000)
})


const iconMap: Record<PopupType,Component> = {
    success: LucideCheck,
    error: LucideX,
    info: LucideInfo,
    warning: LucideTriangleAlert
}

</script>

<template>
    <Transition name="fade">
        <div
            v-if="visible"
            :class='[
                "m-2 p-2 px-4 rounded-xl shadow-lg flex items-center gap-4 pointer-events-auto max-w-full md:max-w-lg transition-opacity duration-300",
                {
                    "bg-lime-500": popupInfo.type === "success",
                    "bg-blue-400": popupInfo.type === "info",
                    "bg-yellow-400": popupInfo.type === "warning",
                    "bg-red-400": popupInfo.type === "error",
                }
            ]'
            @click="dismiss"
        >
            <component :is="iconMap[popupInfo.type]" class="shrink-0"/>
            <p class="text-sm" :title="popupInfo.message">{{ popupInfo.message }}</p>
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
