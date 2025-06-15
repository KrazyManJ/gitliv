<script setup lang="ts">
import { ref, useAttrs } from 'vue';


const { label, rules } = defineProps<{
    label: string,
    rules?: [(v: unknown) => boolean | string]
}>()

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
            "flex",
            {
                "flex-col gap-1": !isCheckbox,
                "gap-2 flex-row-reverse justify-end ml-3": isCheckbox
            }
        ]'
    >
        <span
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
        <input
            v-model="model"
            :class='[
                "bg-zinc-100 dark:bg-zinc-900 rounded p-1 px-2 border focus-visible:outline-1",
                {
                    "border-zinc-400 dark:border-zinc-700 dark:focus-visible:outline-zinc-500": !errorMsg,
                    "border-red-500 focus-visible:outline-red-600": errorMsg,
                }
            ]'
            v-bind="$attrs"
            v-tw-merge
            @focusout="changeErrorState"
            @input="changeErrorState"
        >
        <span v-if="errorMsg" class="text-xs ml-1 text-red-500">{{ errorMsg }}</span>
    </label>
</template>
