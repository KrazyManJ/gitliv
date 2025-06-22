<script setup lang="ts">
import { nextTick, onMounted, ref, watch, onBeforeUnmount, computed } from "vue";
import { useRoute } from "vue-router";
import { useGithubStore } from "@/stores/github";
import Commit from "@/components/Commits.vue";
import GitGraph from "@/components/GitGraph.vue";
import {LucideArrowLeft} from "lucide-vue-next";
import {useModalStore} from "@/stores/modal.ts";
import CloneModal from "@/views/modal/CloneModal.vue";
import Loading from "@/components/LoadingTile.vue";
import BranchSelect from "@/components/Select.vue";
import MyButton from "@/components/Button.vue";

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

const branchOptions = computed(() => {
    return {
        "All branches": "All branches",
        ...branches.value.reduce((acc, b) => {
            acc[b] = b;
            return acc;
        }, {} as Record<string, string>)
    };
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
            commitHeight.value = firstItem.clientHeight + 16.5;
        }
    }
}
function debounce(fn: () => void, delay: number) {
    let timeout: number;
    return () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn();
        }, delay);
    };
}
const debouncedMeasure = debounce(measureCommitHeight, 200);

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

    window.addEventListener("resize", debouncedMeasure);
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", debouncedMeasure);
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
        <div class="mb-5">
            <router-link :to="{ name: 'Repositories'}">
                <LucideArrowLeft />
            </router-link>
        </div>
        <div class="flex flex-wrap gap-3 justify-between items-center mb-6">
            <!-- Left Buttons -->
            <div class="flex flex-wrap gap-3">
                <router-link
                    :to="{ name: 'Repository', params: { username: owner, name: repo, branch: branch } }"
                    custom
                    v-slot="{ navigate, href, isActive, isExactActive }"
                >
                    <MyButton variant="normal" @click="navigate" class="cursor-pointer">
                        Source
                    </MyButton>
                </router-link>

                <router-link
                    :to="`/repos/${owner}/${repo}/pull-requests`"
                    custom
                    v-slot="{ navigate, href, isActive, isExactActive }"
                >
                    <MyButton variant="normal" @click="navigate" class="cursor-pointer">
                        Pull Request
                    </MyButton>
                </router-link>
            </div>

            <!-- Clone Button -->
            <MyButton
                variant="primary"
                @click="showModal(CloneModal, { owner, repo }, {showCloseX: true})"
            >
                Clone
            </MyButton>
        </div>




        <!-- Header with Branch & Repo -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h1 class="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                Commits <span class="text-primary text-2xl ml-2 break-words">{{ owner }}/{{ repo }}</span>
            </h1>
            <BranchSelect
                label=""
                :options="branchOptions"
                v-model="selectedBranch"
                class="max-w-[200px] w-full sm:w-auto"
            />
        </div>

        <!-- Commit Box -->
        <div
            class="border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden pb-6"
        >

        <div class="max-h-[70vh] overflow-auto px-6 py-4 flex gap-6">
            <div
                v-if="!isLoading && filteredCommits.length"
                class="pt-6 w-auto hidden md:block"
            >
                <GitGraph :commitSpacing="commitHeight" :commits="filteredCommits" />
            </div>


            <div class="flex-1 min-w-0">
                    <div v-if="isLoading" class="flex-1 min-w-0 space-y-4">
                        <Loading
                            v-for="n in 5"
                            :key="n"
                            class="h-[96px] w-full rounded-lg shadow-sm border"
                        />
                    </div>
                    <div v-else-if="error" class="text-red-600 dark:text-red-400">{{ error }}</div>
                    <ul v-else ref="commitListRef" class="space-y-4">
                        <li v-for="commit in filteredCommits" :key="commit.sha" class="commit-item">
                            <Commit :commit="commit" :repo-name="repo" :branch="branch"/>
                        </li>
                    </ul>
                </div>
            </div>
        </div>


    </main>
</template>



