<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import type Commit from "@/model/Commit.ts";
import {
    LucideFilePlus2,
    LucidePencil,
    LucideTrash2,
    LucideChevronDown,
    LucideChevronUp,
} from "lucide-vue-next";

const route = useRoute();
const commit = ref<Commit | null>(null);
const expandedFiles = ref<Record<string, boolean>>({});

const fetchCommit = async () => {
    const { owner, repo, sha } = route.params;
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${sha}`);
    commit.value = await res.json();
};

const toggleFile = (filename: string) => {
    expandedFiles.value[filename] = !expandedFiles.value[filename];
};

onMounted(fetchCommit);
</script>

<template>
    <main class="p-8" data-cy="commit-detail-page">
        <!-- Top Controls -->
        <div v-if="commit" class="space-y-4 py-4 w-full max-w-none">

            <!-- Commit Description Styled Like a Page Title -->
            <div class="mb-6">
                <!-- Top: User Info -->
                <div class="flex items-center gap-4 mb-4">
                    <img v-if="commit.author?.avatar_url" :src="commit.author.avatar_url" alt="Author Avatar" class="w-14 h-14 rounded-full" />
                    <div v-else class="inline-block rounded-full shadow-sm"> <!-- shadow layer -->
                        <div class="bg-white rounded-full p-2 w-14 h-14 flex items-center justify-center"> <!-- white circle -->
                            <img
                                src="/icon.svg"
                                alt="App Logo"
                                class="w-12 h-12 grayscale opacity-12"
                            />
                        </div>
                    </div>
                    <span class="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
      {{ commit.commit.author.name }}
    </span>
                </div>

                <!-- Bottom: Description with Branch + Date to the Right -->
                <div class="flex items-end justify-between">
                <h1 class="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                        {{ commit.commit.message }}
                    </h1>
                    <div class="text-right ml-4">
                        <div class="text-sm text-primary dark:text-primary font-mono">
                            Branch: {{ route.params.branch || 'main' }}
                        </div>
                        <div class="text-sm text-zinc-600 dark:text-zinc-400">
                            {{ new Date(commit.commit.author.date).toLocaleString() }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Changed Files -->
            <div v-for="file in commit.files" :key="file.filename"
                 @click="toggleFile(file.filename)"
                 class="cursor-pointer p-4 rounded-lg border shadow-sm bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 transition hover:ring-1 hover:ring-blue-400"
            >
                <!-- File Header -->
                <div class="flex items-start justify-between gap-4">
                    <div class="flex items-center gap-3">
                        <LucideFilePlus2
                            v-if="file.status === 'added'"
                            :size="15"
                            class="text-green-500 w-[20px] h-[20px]] flex-shrink-0"
                        />
                        <LucidePencil
                            v-else-if="file.status === 'modified'"
                            :size="15"
                            class="text-yellow-500 w-[20px] h-[20px] flex-shrink-0"
                        />
                        <LucideTrash2
                            v-else-if="file.status === 'removed' || file.status === 'deleted'"
                            :size="15"
                            class="text-red-500 w-[20px] h-[20px] flex-shrink-0"
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

        <div v-else class="text-center text-gray-500 dark:text-gray-400">Loading commit data...</div>
    </main>
</template>









