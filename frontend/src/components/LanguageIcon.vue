<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import * as simpleIcons from 'simple-icons'
import { useLinguistStore } from '@/stores/linguist';

const { language, size = 24 } = defineProps<{
    language: string,
    size?: number
}>()

const DEVICON_MAP: Record<string,string> = {
    "c#": "devicon-csharp-plain",
    "java": "devicon-java-plain"
}

const isDevicon = computed(() => Object.keys(DEVICON_MAP).includes(language.toLowerCase()))

const iconId = (
    ({
        "vue": "vuedotjs",
        "c++": "cplusplus",
        "html": "html5",
        "scss": "sass",
        "c#": "sharp",
        "qml": "qt",
    })[language.toLowerCase()] ?? language
).toLowerCase()

const simpleIconPath = computed<string | null>(() => {
    if (isDevicon.value) return null
    const key = Object.keys(simpleIcons).find(k => k.toLowerCase() === `si${iconId}`)
    return key ? (simpleIcons as unknown as Record<string,{path: string}>)[key].path : null
})

const state = reactive<{
    color: string
}>({
    color: "var(--color-zinc-500)"
})

const {getLanguageData} = useLinguistStore()

onMounted(async () => {
    const langData = await getLanguageData(language)
    if (langData) state.color = langData.color
})

</script>

<template>
    <i
        v-if="isDevicon"
        :class="DEVICON_MAP[language.toLowerCase()]"
        :style="`color: ${state.color}; font-size: ${size}px`"/>
    <svg
        view-box="0 0 24 24"
        :width="size"
        :height="size"
        v-if="simpleIconPath != null"
        :name="language"
        :style="`fill: ${state.color}`"
        v-tw-merge
    >
        <path :d="simpleIconPath"/>
    </svg>
</template>
