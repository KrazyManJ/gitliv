<script setup lang="ts">
import { useGithubStore } from "@/stores/github";
import Repository from "@/components/Repository.vue";
import User from "@/components/User.vue";
import ThemePicker from "@/components/ThemePicker.vue";
import { useGithubAuthStore } from "@/stores/githubAuth";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

const { user: githubUser, repos,fetchRepos } = useGithubStore();
const useAuthStore = useGithubAuthStore()
const { redirectToGithubOAuth, logout } = useAuthStore

const router = useRouter()

const handleLogout = () => {
    logout()
    router.push("/")
}

onMounted(() => {
    fetchRepos()
})

</script>

<template>
    <main class="p-8 flex flex-col gap-8">
        <div v-if="useAuthStore.user" class="flex gap-16">
            <div class="flex items-center gap-4">
                <img :src="useAuthStore.user.avatar" width="48" height="48" class="rounded-full">
                <div>{{ useAuthStore.user.username }}</div>
            </div>
            <button @click="handleLogout">Logout</button>
        </div>
        <button v-else @click="redirectToGithubOAuth">
            Login
        </button>
        <User v-if="githubUser.current" :user="githubUser.current" />
        <div v-if="useAuthStore.user" class="grid grid-cols-3 gap-8">
            <Repository v-for="repo in repos" :key="repo.id" :repo="repo"/>
        </div>
        <ThemePicker />
    </main>
</template>
