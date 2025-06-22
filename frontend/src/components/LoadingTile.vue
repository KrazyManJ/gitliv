<template>
    <div
        class="relative bg-zinc-300 dark:bg-zinc-700 overflow-hidden animate-pulse rounded"
        v-tw-merge
    >
        <div class="select-none opacity-0">
            <slot/>
        </div>
    </div>
</template>
