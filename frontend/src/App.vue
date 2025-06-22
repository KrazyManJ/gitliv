<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView, useRouter } from "vue-router";
import { useGithubAuthStore } from "./stores/githubAuth";
import NavBar from "./components/NavBar.vue";
import Modal from "./components/Modal.vue";
import { useModalStore } from "./stores/modal";
import { usePopupStore } from "./stores/popup";
import Popup from "./components/Popup.vue";

const { loadUserFromCookies, logout } = useGithubAuthStore()
const { state } = useModalStore()
const { popups } = usePopupStore()

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
    <div class="min-h-screen flex flex-col">
        <NavBar :class="{ 'pointer-events-none': state.isVisible }" class="w-full"/>
        <div :class="{ 'pointer-events-none': state.isVisible }" class="max-w-7xl mx-auto w-full flex flex-col grow">
            <RouterView class="w-full" />
        </div>
        <Modal/>
        <div class="fixed inset-0 z-50 flex pointer-events-none flex-col items-center gap-4 p-2">
            <Popup v-for="(popupInfo,i) in popups" :key="i" :popup-info="popupInfo"/>
        </div>
    </div>
</template>
