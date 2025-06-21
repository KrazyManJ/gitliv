<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type PullRequest from "@/model/PullRequest";
import type Commit from "@/model/Commit";
import type PullRequestFile from "@/model/PullRequestFile";
import {
    LucideFilePlus2,
    LucidePencil,
    LucideTrash2,
    LucideChevronDown,
    LucideChevronUp,
    LucideArrowLeft
} from "lucide-vue-next";
import CommitComponent from "@/components/Commits.vue";
import { useGithubStore } from "@/stores/github.ts";

const route = useRoute();
const router = useRouter();

const owner = route.params.owner as string;
const repo = route.params.repo as string;
const prNumber = Number(route.params.number);

const githubStore = useGithubStore();

const pullRequest = ref<PullRequest | null>(null);
const commits = ref<Commit[]>([]);
const files = ref<PullRequestFile[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const expandedFiles = ref<Record<string, boolean>>({});
const mergeStatus = ref<'idle' | 'loading' | 'success' | 'error'>('idle');
const notification = ref<string | null>(null);

const toggleFile = (filename: string) => {
    expandedFiles.value[filename] = !expandedFiles.value[filename];
};

async function fetchPullRequestData() {
    isLoading.value = true;
    error.value = null;
    try {
        pullRequest.value = await githubStore.fetchPullRequest(owner, repo, prNumber);
        commits.value = await githubStore.fetchPullRequestCommits(owner, repo, prNumber);
        files.value = await githubStore.fetchPullRequestFiles(owner, repo, prNumber);
    } catch (e: unknown) {
        error.value = e instanceof Error ? e.message : String(e);
    } finally {
        isLoading.value = false;
    }
}

const mergePullRequest = async () => {
    if (!pullRequest.value) return;
    mergeStatus.value = 'loading';
    notification.value = null;

    try {
        await githubStore.mergePullRequest(owner, repo, prNumber);
        mergeStatus.value = 'success';
        notification.value = "Pull request merged successfully! Redirecting...";

        // Update PR state locally after merge:
        pullRequest.value.state = "closed";

        // Redirect back to PR list after 2 seconds
        setTimeout(() => {
            router.replace(`/repos/${owner}/${repo}/pull-requests`)
        }, 2000);
    } catch {
        mergeStatus.value = 'error';
        notification.value = "Failed to merge pull request.";
    }
};

onMounted(fetchPullRequestData);
</script>

<template>
    <main class="p-8 bg-zinc-50 dark:bg-zinc-900 min-h-screen text-zinc-800 dark:text-zinc-100">
        <div v-if="isLoading" class="text-center py-10">Loading pull request details...</div>
        <div v-else-if="error" class="text-center py-10 text-red-600 dark:text-red-400">{{ error }}</div>

        <div v-else>
            <div class="mb-5">
                <router-link :to="{ name: 'Pull Requests', params: { owner:owner, repo:repo, branch:'main' }}">
                    <LucideArrowLeft />
                </router-link>
            </div>
            <!-- Pull Request Header -->
            <div class="flex justify-between items-center mb-4">
                <h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                    {{ pullRequest?.title }}
                </h1>
                <button
                    v-if="pullRequest?.state === 'open'"
                    @click="mergePullRequest"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                    :disabled="mergeStatus === 'loading'"
                >
                    {{ mergeStatus === 'loading' ? 'Merging...' : 'Merge' }}
                </button>
            </div>

            <!-- Notification Message -->
            <div
                v-if="notification"
                class="mt-4 p-3 rounded text-center text-white"
                :class="{
          'bg-green-600': mergeStatus === 'success',
          'bg-red-600': mergeStatus === 'error'
        }"
            >
                {{ notification }}
            </div>

            <p class="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
                #{{ pullRequest?.number }} opened by <strong>{{ pullRequest?.user.login }}</strong>
            </p>

            <!-- Commits Section -->
            <section class="mb-10">
                <h2 class="text-xl font-semibold mb-4">Commits ({{ commits.length }})</h2>
                <div
                    class="border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden max-h-[70vh] overflow-auto"
                >
                    <ul class="divide-y divide-zinc-200 dark:divide-zinc-700">
                        <li v-for="commit in commits" :key="commit.sha" class="p-6">
                            <CommitComponent :commit="commit" :repo-name="repo" />
                        </li>
                    </ul>
                </div>
            </section>

            <!-- Files Changed Section -->
            <section>
                <h2 class="text-xl font-semibold mb-4">Files changed ({{ files.length }})</h2>
                <div class="space-y-4">
                    <div
                        v-for="file in files"
                        :key="file.filename"
                        @click="toggleFile(file.filename)"
                        class="cursor-pointer p-4 rounded-lg border shadow-sm bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 transition hover:ring-1 hover:ring-blue-400"
                    >
                        <!-- File Header -->
                        <div class="flex items-start justify-between gap-4">
                            <div class="flex items-center gap-3">
                                <LucideFilePlus2 v-if="file.status === 'added'" class="text-green-500" />
                                <LucidePencil v-else-if="file.status === 'modified'" class="text-yellow-500" />
                                <LucideTrash2 v-else-if="file.status === 'removed' || file.status === 'deleted'" class="text-red-500" />
                                <span class="font-mono text-sm break-all">{{ file.filename }}</span>
                            </div>
                            <div class="shrink-0 ml-auto">
                                <LucideChevronDown v-if="!expandedFiles[file.filename]" />
                                <LucideChevronUp v-else />
                            </div>
                        </div>

                        <!-- File Patch -->
                        <div
                            v-if="expandedFiles[file.filename]"
                            class="overflow-x-auto whitespace-pre-wrap bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded p-3 mt-3 text-sm font-mono space-y-1"
                        >
                            <div
                                v-for="(line, index) in (file.patch?.split('\n') || ['No diff available'])"
                                :key="index"
                                :class="{
                  'text-green-600 bg-green-100 dark:bg-green-900/30': line.startsWith('+') && !line.startsWith('+++'),
                  'text-red-600 bg-red-100 dark:bg-red-900/30': line.startsWith('-') && !line.startsWith('---'),
                  'text-gray-500': line.startsWith('@@'),
                }"
                            >
                                {{ line }}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>
</template>
