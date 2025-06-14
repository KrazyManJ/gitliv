<script setup lang="ts">
import { useGithubStore } from "@/stores/github";
import Repository from "@/components/Repository.vue";
import ThemePicker from "@/components/ThemePicker.vue";
import { onMounted } from "vue";
import { LucidePlus } from "lucide-vue-next";

const { repos,fetchRepos } = useGithubStore();

onMounted(() => {
    fetchRepos()
})

</script>

<template>
    <main class="p-8 flex flex-col gap-8">
        <router-link to="/create-repo">
            <LucidePlus></LucidePlus>
        </router-link>
        <div class="grid grid-cols-3 gap-8">
            <Repository v-for="repo in repos" :key="repo.id" :repo="repo" @on-delete="fetchRepos"/>
        </div>
        <ThemePicker />
    </main>
</template>
