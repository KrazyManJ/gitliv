<script setup lang="ts">
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useGithubStore } from "@/stores/github.ts";
import File from "@/components/File.vue";
import { LucideArrowLeft, LucideCornerLeftUp } from "lucide-vue-next";
import { useRoute } from "vue-router";
import MyButton from "@/components/Button.vue";
import Loading from "@/components/LoadingTile.vue";
import Select from "@/components/Select.vue";
import { computed } from "vue";

const branchOptions = computed(() =>
    Object.fromEntries(branches.value.map((b) => [b.name, b.name]))
);


const store = useGithubStore();
const { fetchFilesFromRepoFirst, fetchFilesFromRepo, fetchBranchesFromRepo } = store;
const { treeHistory, isLoading,hasLoadedOnce, files, branches } = storeToRefs(store);

const route = useRoute();
const username = route.params.username as string;
const name = route.params.name as string;
const branch = route.params.branch as string;

const selectedBranch = ref("");

const goUp = () => {
    treeHistory.value.pop();
    const parentPath = treeHistory.value[treeHistory.value.length - 1];
    fetchFilesFromRepo(username, name, parentPath);
};

const changeBranch = () => {
    files.value.splice(0);
    fetchFilesFromRepoFirst(username, name, selectedBranch.value);
};

onMounted(() => {
    selectedBranch.value = branch;
    treeHistory.value.splice(0);
    files.value.splice(0);
    fetchFilesFromRepoFirst(username, name, selectedBranch.value);
    fetchBranchesFromRepo(username, name);
});
</script>

<template>
    <main class="p-8 bg-zinc-50 dark:bg-zinc-900 min-h-screen text-zinc-800 dark:text-zinc-100">

        <!-- Top Controls -->
        <div class="mb-5">
            <router-link
                :to="{ name: 'Commits', params: { owner: username, repo: name, branch } }"
                data-cy="back"
            >
                <LucideArrowLeft />
            </router-link>
        </div>

        <!-- Header with Branch & Repo -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h1 class="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                Source <span class="text-primary text-2xl ml-2 break-words">{{ username }}/{{ name }}</span>
            </h1>
            <Select
                v-model="selectedBranch"
                :options="branchOptions"
                label=""
                blankLabel="Choose a branch"
                @change="changeBranch"
                class="max-w-[200px]"
            />
        </div>

        <!-- File List Container -->
        <div
            class="border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden px-6 py-4 space-y-4"
        >
            <!-- Go Up -->
            <div v-if="treeHistory.length > 1" class="mb-2">
                <button @click="goUp">
                    <LucideCornerLeftUp />
                </button>
            </div>

            <div v-if="isLoading || files.length === 0 && !hasLoadedOnce" class="space-y-4">
                <Loading v-for="i in 8" :key="i" class="h-[48px] w-full rounded-lg shadow-sm border" />
            </div>

            <!-- Empty state AFTER first load -->
            <div v-else-if="hasLoadedOnce && files.length === 0" class="text-center text-gray-500">
                This folder is empty.
            </div>

            <!-- File List -->
            <div v-else class="flex flex-col">
                <File
                    data-cy="file"
                    v-for="file in files"
                    :key="file.sha"
                    :file="file"
                    :username="username"
                    :name="name"
                    :branch="selectedBranch || 'main'"
                />
            </div>
        </div>
    </main>
</template>
