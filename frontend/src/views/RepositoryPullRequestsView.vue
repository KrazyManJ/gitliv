<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useGithubStore } from "@/stores/github";
import PullRequest from "@/components/PullRequest.vue"; // component to display a PR item
import PullRequestPopup from "@/components/PullRequestPopup.vue";
import {LucideArrowLeft} from "lucide-vue-next"; // your PR creation popup

const route = useRoute();
const owner = route.params.owner as string;
const repo = route.params.repo as string;

const { pullRequests, fetchPullRequests, branches, fetchBranches } = useGithubStore();

const isLoading = ref(true);
const error = ref<string | null>(null);

const showPullRequestPopup = ref(false);

onMounted(async () => {
    try {
        fetchPullRequests(owner, repo);
        fetchBranches(owner, repo)
    } catch (err) {
        error.value = (err as Error).message;
    } finally {
        isLoading.value = false;
    }
});

function openNewPullRequest() {
    fetchBranches(owner, repo);
    showPullRequestPopup.value = true;
}

async function onPullRequestCreated() {
    fetchPullRequests(owner, repo);
    fetchBranches(owner, repo);
    showPullRequestPopup.value = false;
}
</script>

<template>
    <main class="p-8 bg-zinc-50 dark:bg-zinc-900 min-h-screen text-zinc-800 dark:text-zinc-100">
        <div class="mb-2">
            <router-link :to="{ name: 'Commits', params: { owner:owner, repo:repo, branch:'main' } }">
                <LucideArrowLeft />
            </router-link>
        </div>
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                Pull Requests <span class="text-blue-600 text-2xl ml-2">{{ owner }}/{{ repo }}</span>
            </h1>
            <button
                @click="openNewPullRequest"
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
                New
            </button>
        </div>

        <!-- Pull Requests Box -->
        <div
            class="border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-100 dark:bg-zinc-800 max-h-[70vh] overflow-auto"
        >
            <div v-if="isLoading" class="p-6 text-center">Loading pull requests...</div>
            <div v-else-if="error" class="p-6 text-center text-red-600 dark:text-red-400">{{ error }}</div>
            <ul v-else class="space-y-6 p-6">
                <li v-if="pullRequests.length === 0" class="text-center text-gray-600 dark:text-gray-400">
                    No open pull requests.
                </li>
                <li v-for="pr in pullRequests" :key="pr.id">
                    <PullRequest :pullRequest="pr" />
                </li>
            </ul>
        </div>

        <!-- Pull Request Creation Popup -->
        <PullRequestPopup
            v-if="showPullRequestPopup"
            :owner="owner"
            :repo="repo"
            :show="showPullRequestPopup"
            :branches="branches"
            @close="showPullRequestPopup = false"
            @created="onPullRequestCreated"
        />
    </main>
</template>
