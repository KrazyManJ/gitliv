<script setup lang="ts">
interface TileProps {
    variant?: "primary" | "secondary";
}

const { variant = "primary" } = defineProps<TileProps>();
</script>

<template>
    <div
        :class="[
            {
                'bg-zinc-50 border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700':
                    variant === 'primary',
                'border-zinc-300 bg-zinc-100 dark:bg-zinc-700 dark:border-zinc-600':
                    variant === 'secondary',
            },
            ' p-4 rounded-lg border',
        ]"
        v-tw-merge
    >
        <slot />
    </div>
</template>
