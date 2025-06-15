<script setup lang="ts">
    import { useGithubAuthStore } from '@/stores/githubAuth';
import { useRouter } from 'vue-router';
import LoadingTile from './LoadingTile.vue';

    const authStore = useGithubAuthStore()
    const router = useRouter()

    const logout = () => {
        authStore.logout()
        router.push("/")
    }
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
                <div v-if="authStore.user" class="flex items-center gap-4" @click="logout">
                    <div>{{ authStore.user.username }}</div>
                    <img :src="authStore.user.avatar" width="32" height="32" class="rounded-full">
                </div>
                <div v-else-if="$route.path!=='/'" class="flex items-center gap-4">
                    <LoadingTile class="w-16 h-2 rounded"/>
                    <LoadingTile class="w-8 h-8 rounded-full"/>
                </div>
            </div>
        </div>
    </div>
</template>
