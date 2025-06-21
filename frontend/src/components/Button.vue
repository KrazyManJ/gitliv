<script setup lang="ts">

const {
    variant = "normal",
    loading = false,
    textStyle = 'normal'
} = defineProps<{
    variant?: "normal" | "primary" | "important",
    textStyle?: "normal" | "mono"
    loading?: boolean
}>()

</script>

<template>
    <button
        :class='[
            `
                rounded-lg p-2 px-4 text-center transition-[filter] cursor-pointer flex items-center justify-center relative
                enabled:hover:brightness-110
                disabled:cursor-not-allowed disabled:opacity-50
            `,
            {
                "bg-zinc-600": variant === "normal",
                "bg-primary": variant === "primary",
                "bg-red-700": variant === "important"
            },
            {
                "font-mono font-bold": textStyle === "mono",
                "": textStyle === "normal"
            }
        ]'
        type="button"
        v-tw-merge
    >
        <div :class='["text-zinc-50 flex items-center justify-center gap-2",{
            "opacity-0": loading,
            "opacity-100": !loading
        }]'>
            <slot />
        </div>
        <div v-if="loading" class="absolute flex gap-2 inset-0 items-center justify-center">
            <div class="w-2 h-2 rounded-full bg-zinc-50 animate-[bounce_1s_infinite_0.1s]"/>
            <div class="w-2 h-2 rounded-full bg-zinc-50 animate-[bounce_1s_infinite_0.2s]"/>
            <div class="w-2 h-2 rounded-full bg-zinc-50 animate-[bounce_1s_infinite_0.3s]"/>
        </div>
    </button>
</template>
