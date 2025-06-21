<script setup lang="ts">
import Button from '@/components/Button.vue';
import { useGithubAuthStore } from '@/stores/githubAuth';
import { LucideGithub } from 'lucide-vue-next';


</script>

<template>
    <div class="flex items-center flex-col gap-8">
        <h1 class="text-7xl font-mono pt-32 font-bold">GitLiv</h1>
        <p><i>Live your live without git-pain.</i></p>
        <Button
            data-cy="login"
            @click="useGithubAuthStore().redirectToGithubOAuth()"
            variant="primary"
            text-style="mono"
        >
            <LucideGithub color="white"/> Log in into GitHub
        </Button>
    </div>
</template>
