<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView, useRouter } from "vue-router";
import { useGithubAuthStore } from "./stores/githubAuth";
import NavBar from "./components/NavBar.vue";
import Modal from "./components/Modal.vue";
import { useModalStore } from "./stores/modal";

const { loadUserFromCookies, logout } = useGithubAuthStore()
const { state } = useModalStore()

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
    <div class="min-h-screen">
        <NavBar :class="{ 'pointer-events-none': state.isVisible }"/>
        <div :class="{ 'pointer-events-none': state.isVisible }" class="max-w-7xl mx-auto">
            <RouterView />
        </div>
        <Modal/>
    </div>
</template>
