<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { useGithubAuthStore } from "./stores/githubAuth";
import NavBar from "./components/NavBar.vue";

const { loadUserFromCookies } = useGithubAuthStore()

onMounted(() => {
    loadUserFromCookies()
})
</script>

<template>
    <NavBar></NavBar>
    <div class="max-w-7xl mx-auto min-h-screen">
        <RouterView />
    </div>
</template>
