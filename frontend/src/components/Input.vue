<script setup lang="ts">
import { LucideCheck, type LucideProps } from 'lucide-vue-next';
import { ref, useAttrs, type FunctionalComponent } from 'vue';


export type Rule = (v: unknown) => true | string

const { label, rules, icon, containerClass } = defineProps<{
    label?: string,
    rules?: Rule[],
    icon?: FunctionalComponent<LucideProps>
    containerClass?: unknown
}>()

defineOptions({
    inheritAttrs: false
})

const model = defineModel()

const attrs = useAttrs()

const isCheckbox = attrs.type === "checkbox";

const errorMsg = ref<string | null>(null)

const changeErrorState = async () => {
    errorMsg.value = (
        rules?.find(rule => typeof rule(model.value) !== "boolean") as (v: unknown) => string
        ?? (() => null)
    )(model.value)
}

</script>

<template>
    <label
        :class='[
            "flex relative",
            {
                "flex-col gap-1": !isCheckbox,
                "gap-2 flex-row-reverse justify-end ml-3": isCheckbox
            },
            containerClass
        ]'
    >
        <span
            v-if="label"
            :class='[
                "",
                {
                    "text-xs ml-1": !isCheckbox,
                    "text-sm": isCheckbox,
                    "text-red-500": errorMsg,
                    "dark:text-zinc-400": !isCheckbox && !errorMsg
                }
            ]'
        >
            {{ label }}
        </span>
        <div class="relative flex">

            <component v-if="icon" :is="icon" :size="20" class="absolute left-2 top-2 stroke-zinc-800 dark:stroke-zinc-200 "/>
            <input
            v-model="model"
            :class='[
                "bg-zinc-100 dark:bg-zinc-900 rounded p-1 px-2 border focus-visible:outline-1 peer grow",
                {
                    "border-zinc-400 dark:border-zinc-700 dark:focus-visible:outline-zinc-500": !errorMsg,
                    "border-red-500 focus-visible:outline-red-600": errorMsg,
                },
                {
                    "appearance-none checked:bg-primary w-5 h-5 p-0": isCheckbox
                },
                {
                    "pl-10": icon
                    }
                    ]'
            v-bind="$attrs"
            v-tw-merge
            ref="input"
            @focusout="changeErrorState"
            @input="changeErrorState"
            >
            <LucideCheck v-if="isCheckbox" class="absolute left-0.5 top-0.5 hidden peer-checked:block stroke-zinc-100" :size="16"/>
        </div>
        <span v-if="errorMsg" class="text-xs ml-1 text-red-500">{{ errorMsg }}</span>
    </label>
</template>
