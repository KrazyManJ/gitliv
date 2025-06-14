<script setup lang="ts">
    import { useGithubAuthStore } from '@/stores/githubAuth';
import { LucideLogIn } from 'lucide-vue-next';

    const authStore = useGithubAuthStore()
</script>
<template>
    <div class="max-w-7xl mx-auto p-4">
        <div class="flex items-center">
            <RouterLink to="/">
                <div class="flex items-center gap-4">
                    <img src="/icon.svg" width="32" height="32">
                    <span class="font-mono font-black text-xl">GitLiv</span>
                </div>
            </RouterLink>
            <div class="grow"></div>
            <div>
                <div v-if="authStore.user" class="flex items-center gap-4" @click="authStore.logout">
                    <div>{{ authStore.user.username }}</div>
                    <img :src="authStore.user.avatar" width="32" height="32" class="rounded-full">
                </div>
                <div v-else class="flex gap-2" @click="authStore.redirectToGithubOAuth()">
                    Login
                    <LucideLogIn/>
                </div>
            </div>
        </div>
    </div>
</template>
