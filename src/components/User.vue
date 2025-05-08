<script setup lang="ts">
import type GithubUser from "@/model/GithubUser";

const { user } = defineProps<{
    user: GithubUser;
}>();
</script>

<template>
    <div
        class="flex gap-8 items-center rounded-2xl overflow-hidden p-4 justify-center border border-zinc-300 bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700"
    >
        <img :src="user.avatar_url" width="128" height="128" class="rounded-xl" />
        <div class="flex flex-col gap-1">
            <h1 class="text-4xl font-bold">{{ user.name }}</h1>
            <span class="text-zinc-500 text-lg">{{ user.bio }}</span>
        </div>
    </div>
</template>
