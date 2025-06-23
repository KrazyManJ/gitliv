<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import { storeToRefs } from "pinia";
import { useGithubStore } from "@/stores/github.ts";
import File from "@/components/File.vue";
import { LucideCornerLeftUp, LucideGitBranch } from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";
import LoadingTile from "@/components/LoadingTile.vue";
import Select from "@/components/Select.vue";
import type Branch from "@/model/Branch.ts";
import RepositoryDetails from "@/components/RepositoryDetails.vue";
import Tile from "@/components/Tile.vue";

const store = useGithubStore();
const { fetchFilesFromRepo, fetchBranchesFromRepo, resolvePathToTreeSha, fetchRepo, repoData } = store;
const { isLoadingFiles, hasLoadedOnce, files, branches } = storeToRefs(store);

const route = useRoute();
const router = useRouter();

const username = computed(() => route.params.username as string);
const name = computed(() => route.params.name as string);
const branch = computed(() => route.params.branch as string);

const path = computed(() => {
    const raw = (route.params.pathMatch as string) || "";
    return decodeURIComponent(raw);
});

const selectedBranch = ref("");

const goUp = computed(() => {
    const currentPath = path.value;
    const segments = currentPath.split("/").filter(Boolean);
    segments.pop();
    const newPath = segments.join("/");

    return {
        name: "Repository",
        params: {
            username: username.value,
            name: name.value,
            branch: branch.value,
            pathMatch: newPath || undefined,
        },
    }
})

const changeBranch = () => {
    router.push({
        name: "Repository",
        params: {
            username: username.value,
            name: name.value,
            branch: selectedBranch.value,
            pathMatch: undefined,
        },
    });
};

onMounted(() => {
    selectedBranch.value = branch.value;
    fetchBranchesFromRepo(username.value, name.value);
    if (!repoData.current) fetchRepo(username.value, name.value)
});

watch(
    () => route.fullPath,
    async () => {
        const newBranchRaw = route.params.branch as string;
        const newPath = decodeURIComponent((route.params.pathMatch as string) || "");
        files.value.splice(0, files.value.length);
        hasLoadedOnce.value = false;

        try {
            const sha = await resolvePathToTreeSha(username.value, name.value, newBranchRaw, newPath);
            await fetchFilesFromRepo(username.value, name.value, sha);
            selectedBranch.value = newBranchRaw;
            hasLoadedOnce.value = true;
        } catch (err) {
            console.error(err);
            hasLoadedOnce.value = true;
        }
    },
    { immediate: true }
);


const branchOptions = computed(() =>
    Object.fromEntries((branches.value || []).map((b: Branch) => [b.name, b.name]))
);
</script>

<template>
    <main class="p-4">
        <RepositoryDetails :repo="repoData.current"/>

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 class="text-2xl font-bold">
                Source
            </h2>
            <Select
                v-model="selectedBranch"
                :options="branchOptions"
                label=""
                blankLabel="Choose a branch"
                @change="changeBranch"
                class="max-w-[200px]"
                :icon="LucideGitBranch"
            />
        </div>

        <Tile class="p-0 overflow-hidden">
            <div v-if="path" class="p-3 gap-3 flex items-center not-last:border-b-1 dark:not-last:border-zinc-700 not-last:border-zinc-300 text-sm ">
                <LucideCornerLeftUp :size="20"/>
                <RouterLink :to="goUp" class="font-mono hover:text-primary hover:dark:text-primary-light hover:underline">...</RouterLink>
            </div>
            <div v-if="isLoadingFiles || (files.length === 0 && !hasLoadedOnce)">
                <LoadingTile v-for="i in 10" :key="i" :style="`animation-delay: ${i*200}ms`" class="h-[48px] rounded-none not-last:border-b-1 dark:not-last:border-zinc-600 not-last:border-zinc-400/50" />
            </div>

            <div v-else-if="hasLoadedOnce && files.length === 0" class="text-center text-zinc-500 p-4">
                This folder is empty...
            </div>

            <div v-else class="flex flex-col">
                <File
                    v-for="file in files"
                    :key="file.sha"
                    :file="file"
                    :username="username"
                    :name="name"
                    :branch="selectedBranch || 'main'"
                />
            </div>
        </Tile>





    </main>
</template>
