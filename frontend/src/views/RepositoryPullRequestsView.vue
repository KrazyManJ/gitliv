<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useGithubStore } from "@/stores/github";
import PullRequest from "@/components/PullRequest.vue";
import PullRequestPopup from "@/components/PullRequestPopup.vue";
import MyButton from "@/components/Button.vue";
import { useModalStore } from "@/stores/modal";
import Tile from "@/components/Tile.vue";
import { usePopupStore } from '@/stores/popup'; // import popup store

const popupStore = usePopupStore();

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
        const msg = (err as Error).message || "Failed to load data.";
        error.value = msg;
        popupStore.showPopup("error", msg); // ✅ Move this here
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
        class="p-4"
    >
        <h1 class="text-4xl text-primary font-bold mb-8" data-cy="repo-heading">{{owner}}/{{ repo }}</h1>
        <div
            class="flex flex-col md:flex-row md:items-center justify-between mb-6"
        >
            <h2 class="text-2xl font-bold">
                Pull Requests
            </h2>

            <div class="mt-3 md:mt-0 self-start md:self-auto">
                <MyButton variant="primary" @click="openPullRequestModal" data-cy="new-pr-button">
                    New
                </MyButton>
            </div>
        </div>

        <!-- Pull Requests Box -->
        <Tile
            class="overflow-hidden"
        >
            <div v-if="isLoading" class="p-6 text-center">
                Loading pull requests...
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
        </Tile>
    </main>
</template>
