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
    LucideChevronUp
} from "lucide-vue-next";
import CommitComponent from "@/components/Commits.vue";
import { useGithubStore } from "@/stores/github.ts";
import MyButton from "@/components/Button.vue";
import Loading from "@/components/LoadingTile.vue";
import Tile from "@/components/Tile.vue";
import { usePopupStore } from '@/stores/popup'; // import popup store

const popupStore = usePopupStore();

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
        const msg = (e as Error).message || "Failed to load data.";
        error.value = msg;
        popupStore.showPopup("error", msg);
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

        // ✅ Show success popup
        popupStore.showPopup("success", "Pull request merged successfully!");

        // Update PR state locally after merge:
        pullRequest.value.state = "closed";

        // Redirect after delay
        setTimeout(() => {
            router.replace(`/repos/${owner}/${repo}/pull-requests`);
        }, 2000);
    } catch (e) {
        mergeStatus.value = 'error';
        notification.value = "Failed to merge pull request.";

        // ✅ Show error popup
        const msg = (e as Error).message || "Failed to merge pull request.";
        popupStore.showPopup("error", msg);
    }
};


onMounted(fetchPullRequestData);
</script>

<template>
    <main class="p-4">
        <h1 class="text-4xl text-primary font-bold mb-8" data-cy="repo-heading">{{owner}}/{{ repo }}</h1>
        <div>
            <!-- Pull Request Header -->
            <div class="flex justify-between items-center mb-4">
                <h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                    {{ pullRequest?.title }}
                </h1>

                <MyButton
                    v-if="pullRequest?.state === 'open'"
                    variant="primary"
                    @click="mergePullRequest"
                    :disabled="mergeStatus === 'loading'"
                >
                    {{ mergeStatus === 'loading' ? 'Merging...' : 'Merge' }}
                </MyButton>
            </div>

            <p class="text-sm text-zinc-600 dark:text-zinc-400">
                <strong>{{ pullRequest?.head.ref }}</strong>
                <span class="mx-1">→</span>
                <strong>{{ pullRequest?.base.ref }}</strong>
            </p>
            <p class="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
                #{{ pullRequest?.number }} opened by <strong>{{ pullRequest?.user.login }}</strong>
            </p>

            <!-- Commits Section -->
            <section class="mb-10">
                <h2 class="text-xl font-semibold mb-4">Commits ({{ commits.length }})</h2>
                <Tile
                    class="overflow-hidden"
                >
                    <div v-if="isLoading" class="space-y-6 p-6">
                        <Loading
                            v-for="n in 5"
                            :key="'commit-loading-' + n"
                            class="h-[96px] w-full rounded-lg shadow-sm border"
                        />
                    </div>
                    <ul v-else class="divide-y divide-zinc-200 dark:divide-zinc-700">
                        <li v-for="commit in commits" :key="commit.sha" class="p-6">
                            <CommitComponent :commit="commit" :repo-name="repo" :branch="commit.branch?.toString() ?? 'main'" :owner="owner"/>
                        </li>
                    </ul>
                </Tile>
            </section>

            <!-- Files Changed Section -->
            <section>
                <h2 class="text-xl font-semibold mb-4">Files changed ({{ files.length }})</h2>
                <div class="space-y-4">
                    <div v-if="isLoading" class="space-y-4">
                        <Loading
                            v-for="n in 3"
                            :key="'file-loading-' + n"
                            class="h-[60px] w-full rounded-lg shadow-sm border"
                        />
                    </div>
                    <div v-else>
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
                                    <LucideTrash2
                                        v-else-if="file.status === 'removed' || file.status === 'deleted'"
                                        class="text-red-500"
                                    />
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
                </div>
            </section>
        </div>
    </main>
</template>

