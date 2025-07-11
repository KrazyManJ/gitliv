<script setup lang="ts" generic="T extends string | number | symbol">
import { LucideChevronDown, type LucideProps } from 'lucide-vue-next';
import { onMounted, type FunctionalComponent } from 'vue';


type OptionLabelString = string

const {
    label,
    options,
    defaultValue = undefined,
    blankLabel = undefined,
    icon
} = defineProps<{
    label: string
    options: Record<T, OptionLabelString>
    defaultValue?: T
    blankLabel?: string
    icon?: FunctionalComponent<LucideProps>
}>()

const model = defineModel<T | "">()

onMounted(() => {
    if (defaultValue) {
        model.value = defaultValue
    }
    else if (blankLabel) {
        model.value = ""
    }
})

</script>

<template>
    <label class="flex flex-col gap-1">
        <span class="text-xs dark:text-zinc-400 ml-1">{{ label }}</span>
        <div class="relative">
            <component v-if="icon" :is="icon" :size="20" class="absolute left-2 top-2 stroke-zinc-800 dark:stroke-zinc-200 "/>
            <select
                v-bind="$attrs"
                v-model="model"
                :class='[
                    "bg-zinc-100 border-zinc-400 appearance-none w-full rounded p-1 px-2 border  focus-visible:outline-1 pr-8",
                    "dark:bg-zinc-900 dark:border-zinc-700 dark:focus-visible:outline-zinc-500",
                    {"text-zinc-500": model === ""},
                    {"pl-10": icon}
                ]'
            >
                <option v-if="blankLabel" disabled selected value>--{{ blankLabel }}--</option>
                <option
                    v-for="([optValue,optLabel],i) in Object.entries(options)"
                    :value="optValue"
                    :key="i"
                >
                    {{ optLabel }}
                </option>
            </select>
            <LucideChevronDown :size="16" class="absolute dark:stroke-zinc-300 right-2.25 top-2.25 pointer-events-none"/>
        </div>
    </label>
</template>
