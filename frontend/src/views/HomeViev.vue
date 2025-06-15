<script setup lang="ts">
import { useGithubAuthStore } from '@/stores/githubAuth';
import { LucideGithub } from 'lucide-vue-next';


</script>

<template>
    <div class="flex items-center flex-col gap-8">
        <h1 class="text-7xl font-mono pt-32 font-bold">GitLiv</h1>
        <p><i>Live your live without git-pain.</i></p>
        <button
            class="titlecase bg-primary p-2 px-6 flex gap-2 rounded-full cursor-pointer"
            @click="useGithubAuthStore().redirectToGithubOAuth()"
        >
            <LucideGithub color="white"/>
            <span class="text-white font-mono">Log in into GitHub</span>
        </button>
    </div>
</template>
