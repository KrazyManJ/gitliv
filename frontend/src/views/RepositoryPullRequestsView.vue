<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useGithubStore } from "@/stores/github";
import PullRequest from "@/components/PullRequest.vue";
import PullRequestPopup from "@/components/PullRequestPopup.vue";
import { LucideArrowLeft } from "lucide-vue-next";
import MyButton from "@/components/Button.vue";
import { useModalStore } from "@/stores/modal";

const modalStore = useModalStore();

const route = useRoute();
const owner = route.params.owner as string;
const repo = route.params.repo as string;

const { pullRequests, fetchPullRequests, branches, fetchBranches } = useGithubStore();

const isLoading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
    try {
        await fetchPullRequests(owner, repo);
        await fetchBranches(owner, repo);
    } catch (err) {
        error.value = (err as Error).message;
    } finally {
        isLoading.value = false;
    }
});

function openPullRequestModal() {
    modalStore.showModal(
        PullRequestPopup,
        {
            owner,
            repo,
            branches,
            onCreated: async () => {
                await fetchPullRequests(owner, repo);
                await fetchBranches(owner, repo);
                modalStore.hideModal();
            },
        },
        {} // or options if you have any, otherwise just empty object
    );
}
</script>

<template>
    <main
        class="p-8"
    >
        <div class="mb-5">
            <router-link
                :to="{ name: 'Commits', params: { owner, repo, branch: 'main' } }"
            >
                <LucideArrowLeft />
            </router-link>
        </div>

        <div
            class="flex flex-col md:flex-row md:items-center justify-between mb-6"
        >
            <h1 class="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                Pull Requests
            </h1>

            <div class="mt-3 md:mt-0 self-start md:self-auto">
                <MyButton variant="primary" @click="openPullRequestModal" data-cy="new-pr-button">
                    New
                </MyButton>
            </div>
        </div>

        <!-- Pull Requests Box -->
        <div
            class="border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-100 dark:bg-zinc-800 max-h-[70vh] overflow-auto"
        >
            <div v-if="isLoading" class="p-6 text-center">
                Loading pull requests...
            </div>
            <div
                v-else-if="error"
                class="p-6 text-center text-red-600 dark:text-red-400"
            >
                {{ error }}
            </div>
            <ul v-else class="space-y-4 p-6">
                <li
                    v-if="pullRequests.length === 0"
                    class="text-center text-gray-600 dark:text-gray-400"
                >
                    No open pull requests.
                </li>
                <li v-for="pr in pullRequests" :key="pr.id">
                    <PullRequest :pullRequest="pr" :repo-name="repo" />
                </li>
            </ul>
        </div>
    </main>
</template>
