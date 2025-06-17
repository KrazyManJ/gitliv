<script setup lang="ts">
import { LucideChevronDown } from 'lucide-vue-next';


type OptionValueString = string
type OptionLabelString = string

const {label,options} = defineProps<{
    label: string,
    options: Record<OptionValueString, OptionLabelString>,
}>()

const model = defineModel()

</script>

<template>
    <label class="flex flex-col gap-1">
        <span class="text-xs dark:text-zinc-400 ml-1">{{ label }}</span>
        <div class="relative">
            <select
                v-bind="$attrs"
                v-model="model"
                class="bg-zinc-100 border-zinc-400 appearance-none w-full dark:bg-zinc-900 rounded p-1 px-2 border dark:border-zinc-700 dark:focus-visible:outline-zinc-500 focus-visible:outline-1"
            >
                <option
                    v-for="([optValue,optLabel],i) in Object.entries(options)"
                    :value="optValue"
                    :key="i"
                >
                    {{ optLabel }}
                </option>
            </select>
            <LucideChevronDown :size="16" class="absolute dark:stroke-zinc-300 right-2.25 top-2.25"/>
        </div>
    </label>
</template>
