<script setup lang="ts">
import { nextTick, onMounted, ref, watch, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { useGithubStore } from "@/stores/github";
import Commit from "@/components/Commits.vue";
import GitGraph from "@/components/GitGraph.vue";

const route = useRoute();
const owner = route.params.owner as string;
const repo = route.params.repo as string;

const { commits, fetchCommits } = useGithubStore();

const isLoading = ref(true);
const error = ref<string | null>(null);

const commitListRef = ref<HTMLElement | null>(null);
const commitHeight = ref(115);

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
    } catch (err) {
        error.value = (err as Error).message;
    } finally {
        isLoading.value = false;
        await measureCommitHeight(); // initial measurement after loading
    }

    window.addEventListener("resize", measureCommitHeight);
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", measureCommitHeight);
});

// Re-measure when commits change
watch(commits, async (newVal) => {
    if (newVal.length) {
        await measureCommitHeight();
    }
});
</script>



<template>
    <main class="p-8 bg-zinc-50 dark:bg-zinc-900 min-h-screen text-zinc-800 dark:text-zinc-100">
        <!-- Top Controls -->
        <div class="flex justify-between items-center mb-6">
            <div class="flex gap-4">
                <button class="bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 px-4 py-2 rounded" disabled>
                    Source
                </button>
                <button class="bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 px-4 py-2 rounded" disabled>
                    PullRequest
                </button>
            </div>
            <button class="bg-zinc-700 text-white px-6 py-2 rounded hover:bg-zinc-600">Clone</button>
        </div>

        <!-- Header with Branch & Repo -->
        <div class="flex items-center justify-between mb-4">
            <h1 class="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                Commits <span class="text-blue-600 text-2xl ml-2">{{ owner }}/{{ repo }}</span>
            </h1>
            <select
                class="border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 px-4 py-2 rounded"
            >
                <option>Branch</option>
            </select>
        </div>

        <!-- Commit Box -->
        <div
            class="border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden"
        >

            <div class="max-h-[70vh] overflow-auto px-6 py-4 flex gap-6">
                <div class="w-[100px] min-w-[100px] pt-6"> <!-- pt-6 = padding-top: 1.5rem = 24px -->
                    <GitGraph :commitSpacing="commitHeight" />
                </div>

                <div class="flex-1 min-w-0">
                    <div v-if="isLoading">Loading commits...</div>
                    <div v-else-if="error" class="text-red-600 dark:text-red-400">{{ error }}</div>
                    <ul v-else ref="commitListRef" class="space-y-6">
                        <li v-for="commit in commits" :key="commit.sha" class="commit-item">
                            <Commit :commit="commit" />
                        </li>
                    </ul>
                </div>
            </div>
        </div>


    </main>
</template>



