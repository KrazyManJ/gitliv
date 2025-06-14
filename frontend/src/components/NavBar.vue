<script setup lang="ts">
    import { useGithubAuthStore } from '@/stores/githubAuth';

    const authStore = useGithubAuthStore()
</script>
<template>
    <div class="max-w-7xl mx-auto p-4">
        <div class="flex items-center">
            <div class="flex items-center gap-4">
                <img src="/icon.svg" width="32" height="32">
                <span class="font-mono font-black text-xl">GitLiv</span>
            </div>
            <div class="grow"></div>
            <div>
                <div v-if="authStore.user" class="flex items-center gap-4">
                    <div>{{ authStore.user.username }}</div>
                    <img :src="authStore.user.avatar" width="32" height="32" class="rounded-full">
                </div>
                <div v-else>
                    Login
                    <LucideLogIn/>
                </div>
            </div>
        </div>
    </div>
</template>
