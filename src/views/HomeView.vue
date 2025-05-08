<script setup lang="ts">
import { useGithubStore } from "@/stores/github";
import Repository from "@/components/Repository.vue";
import User from "@/components/User.vue";
import ThemePicker from "@/components/ThemePicker.vue";
const { user, repos } = useGithubStore();
</script>

<template>
    <main class="p-8 flex flex-col gap-8">
        <User v-if="user.current" :user="user.current"></User>
        <div class="grid grid-cols-3 gap-8">
            <Repository v-for="repo in repos" :key="repo.id" :repo="repo" />
        </div>
        <ThemePicker />
    </main>
</template>
