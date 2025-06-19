<script setup lang="ts">
import { nextTick, onMounted, ref, watch, onBeforeUnmount, computed } from "vue";
import { useRoute } from "vue-router";
import { useGithubStore } from "@/stores/github";
import Commit from "@/components/Commits.vue";
import GitGraph from "@/components/GitGraph.vue";
import {LucideArrowLeft} from "lucide-vue-next";
import {useModalStore} from "@/stores/modal.ts";
import CloneModal from "@/views/modal/CloneModal.vue";

const route = useRoute();
const owner = route.params.owner as string;
const repo = route.params.repo as string;
const branch = route.params.branch as string;

const { commits, fetchCommits } = useGithubStore();
const {showModal} = useModalStore()

const isLoading = ref(true);
const error = ref<string | null>(null);

const commitListRef = ref<HTMLElement | null>(null);
const commitHeight = ref(115);

const selectedBranch = ref("All branches");

const branches = computed(() => {
    const branchSet = new Set<string>();
    for (const commit of commits) {
        if (commit.branch && commit.branch.length) {
            commit.branch.forEach(b => branchSet.add(b));
        }
    }
    return Array.from(branchSet).sort();
});

const filteredCommits = computed(() => {
    if (selectedBranch.value === "All branches") {
        return commits;
    }
    return commits.filter(c => c.branch?.includes(selectedBranch.value));
});

async function measureCommitHeight() {
    await nextTick();
    const listEl = commitListRef.value;
    if (listEl) {
        const firstItem = listEl.querySelector(".commit-item") as HTMLElement | null;
        if (firstItem) {
            commitHeight.value = firstItem.clientHeight + 23;
        }
    }
}

onMounted(async () => {
    try {
        await fetchCommits(owner, repo);
        console.log("Fetched commits:", commits);
    } catch (err) {
        error.value = (err as Error).message;
    } finally {
        isLoading.value = false;
        await measureCommitHeight();
    }

    window.addEventListener("resize", measureCommitHeight);
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", measureCommitHeight);
});

watch(filteredCommits, async (newVal) => {
    if (newVal.length) {
        await measureCommitHeight();
    }
});
</script>




<template>
    <main class="p-8 bg-zinc-50 dark:bg-zinc-900 min-h-screen text-zinc-800 dark:text-zinc-100">
        <!-- Top Controls -->
        <div class="mb-2">
            <router-link :to="{ name: 'Repositories'}">
                <LucideArrowLeft />
            </router-link>
        </div>
        <div class="flex justify-between items-center mb-6">
            <div class="flex gap-4">
                <button class="bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 px-4 py-2 rounded">
                    <router-link :to="{name: 'Repository',  params: {username: owner, name: repo, branch: branch}}"
                                 class="v-tw-merge">Source</router-link>
                </button>
                <router-link
                    :to="`/repos/${owner}/${repo}/pull-requests`"
                    class="bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 px-4 py-2 rounded hover:bg-zinc-400 dark:hover:bg-zinc-600 inline-block text-center"
                >
                    PullRequest
                </router-link>
            </div>
            <button @click="showModal(CloneModal, {owner, repo})" class="bg-zinc-700 text-white px-6 py-2 rounded hover:bg-zinc-600">Clone</button>
        </div>

        <!-- Header with Branch & Repo -->
        <div class="flex items-center justify-between mb-4">
            <h1 class="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                Commits <span class="text-primary text-2xl ml-2">{{ owner }}/{{ repo }}</span>
            </h1>
            <select
                v-model="selectedBranch"
                class="border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 px-4 py-2 rounded"
            >
                <option value="All branches">All branches</option>
                <option v-for="branch in branches" :key="branch" :value="branch">
                    {{ branch }}
                </option>
            </select>

        </div>

        <!-- Commit Box -->
        <div
            class="border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden"
        >

            <div class="max-h-[70vh] overflow-auto px-6 py-4 flex gap-6">
                <div class="pt-6 w-auto"><!-- pt-6 = padding-top: 1.5rem = 24px -->
                    <GitGraph :commitSpacing="commitHeight" :commits="filteredCommits" />
                </div>

                <div class="flex-1 min-w-0">
                    <div v-if="isLoading">Loading commits...</div>
                    <div v-else-if="error" class="text-red-600 dark:text-red-400">{{ error }}</div>
                    <ul v-else ref="commitListRef" class="space-y-6">
                        <li v-for="commit in filteredCommits" :key="commit.sha" class="commit-item">
                            <Commit :commit="commit" :repo-name="repo" />
                        </li>
                    </ul>
                </div>
            </div>
        </div>


    </main>
</template>



