<script setup lang="ts">
import type GitFileFromTree from "@/model/GitFileFromTree.ts";
import { useGithubStore } from "@/stores/github.ts";
import { storeToRefs } from "pinia";
import { LucideFolder, LucideFile } from "lucide-vue-next";

const store = useGithubStore();
const { fetchFilesFromRepo } = store;
const { treeHistory } = storeToRefs(store);

const props = defineProps<{
    file: GitFileFromTree;
    username: string;
    name: string;
    branch: string;
}>();

const isFolder = props.file.type === "tree";

const openFolder = (treePath: string | undefined) => {
    if (treePath) {
        treeHistory.value.push(treePath);
        fetchFilesFromRepo(props.username, props.name, treePath);
    }
};
</script>

<template>
    <div
        class="group block"
        v-tw-merge
    >
        <button
            v-if="isFolder"
            @click="openFolder(file.url.split('/').pop())"
            :class="[
        'w-full flex items-center gap-4 p-4 rounded-lg border shadow-sm transition hover:brightness-105',
        'bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 no-underline',
      ]"
        >
            <LucideFolder class="w-6 h-6 text-zinc-600 dark:text-zinc-300 flex-shrink-0" />
            <span class="text-sm font-mono text-zinc-800 dark:text-white truncate">
        {{ file.path }}
      </span>
        </button>

        <RouterLink
            v-else
            :to="{
        name: 'File',
        params: {
          file: file.path,
          name: name,
          username: username,
          branch: branch,
          sha: file.sha,
        },
      }"
            :class="[
        'w-full flex items-center gap-4 p-4 rounded-lg border shadow-sm transition hover:brightness-105',
        'bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 no-underline',
      ]"
        >
            <LucideFile class="w-6 h-6 text-zinc-600 dark:text-zinc-300 flex-shrink-0" />
            <span class="text-sm font-mono text-zinc-800 dark:text-white truncate">
        {{ file.path }}
      </span>
        </RouterLink>
    </div>
</template>
