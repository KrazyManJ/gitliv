<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { useGithubAuthStore } from "./stores/githubAuth";

const { loadUserFromCookies } = useGithubAuthStore()

onMounted(() => {
    loadUserFromCookies()
})
</script>

<template>
    <div class="max-w-7xl mx-auto min-h-screen">
        <RouterView />
    </div>
</template>
