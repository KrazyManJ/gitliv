<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView, useRouter } from "vue-router";
import { useGithubAuthStore } from "./stores/githubAuth";
import NavBar from "./components/NavBar.vue";

const { loadUserFromCookies, logout } = useGithubAuthStore()

const router = useRouter()

onMounted(() => {
    loadUserFromCookies().then(v => {
        if (v) return;
        logout()
        router.push("/")
    })
})
</script>

<template>
    <NavBar/>
    <div class="max-w-7xl mx-auto min-h-screen">
        <RouterView />
    </div>
</template>
