<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import { storeToRefs } from "pinia";
import { useGithubStore } from "@/stores/github.ts";
import File from "@/components/File.vue";
import { LucideCornerLeftUp } from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";
import Loading from "@/components/LoadingTile.vue";
import Select from "@/components/Select.vue";
import type Branch from "@/model/Branch.ts";

const store = useGithubStore();
const { fetchFilesFromRepo, fetchBranchesFromRepo, resolvePathToTreeSha } = store;
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

const goUp = () => {
    const currentPath = path.value;
    const segments = currentPath.split("/").filter(Boolean);
    segments.pop();
    const newPath = segments.join("/");

    router.push({
        name: "Repository",
        params: {
            username: username.value,
            name: name.value,
            branch: branch.value,
            pathMatch: newPath || undefined,
        },
    });
};

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
    <main class="p-8 min-h-screen">

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h1 class="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                Source <span class="text-primary text-2xl ml-2 break-words">{{ username }}/{{ name }}</span>
            </h1>
            <Select
                v-model="selectedBranch"
                :options="branchOptions"
                label=""
                blankLabel="Choose a branch"
                @change="changeBranch"
                class="max-w-[200px]"
            />
        </div>

        <div
            class="border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden px-6 py-4 space-y-4"
        >

            <div v-if="path" class="mb-2">
                <button @click="goUp">
                    <LucideCornerLeftUp />
                </button>
            </div>


            <div v-if="isLoadingFiles || (files.length === 0 && !hasLoadedOnce)" class="space-y-4">
                <Loading v-for="i in 8" :key="i" class="h-[48px] w-full rounded-lg shadow-sm border" />
            </div>

            <div v-else-if="hasLoadedOnce && files.length === 0" class="text-center text-gray-500">
                This folder is empty.
            </div>

            <div v-else class="flex flex-col">
                <File
                    data-cy="file"
                    v-for="file in files"
                    :key="file.sha"
                    :file="file"
                    :username="username"
                    :name="name"
                    :branch="selectedBranch || 'main'"
                />
            </div>
        </div>
    </main>
</template>
