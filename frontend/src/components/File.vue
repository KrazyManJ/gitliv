<script setup lang="ts">
import type GitFileFromTree from "@/model/GitFileFromTree.ts";
import { LucideFolder, LucideFile } from "lucide-vue-next";
import { useRouter, useRoute, RouterLink } from "vue-router";
import {computed} from "vue";

const router = useRouter();
const route = useRoute();

const props = defineProps<{
    file: GitFileFromTree;
    username: string;
    name: string;
    branch: string;
}>();

const isFolder = props.file.type === "tree";

const currentPath = computed(() => decodeURIComponent((route.params.pathMatch as string) || ""));

const openFolder = (treePath: string | undefined) => {
    if (treePath) {
        const newPath = currentPath.value ? `${currentPath.value}/${props.file.path}` : props.file.path;

        router.push({
            name: 'Repository',
            params: {
                username: props.username,
                name: props.name,
                branch: props.branch,
                pathMatch: newPath
            }
        });
    }
};

const linkData = computed(() => {
    const params = {
        name: props.name,
        username: props.username,
        branch: props.branch
    } as Record<string,string>
    const path = currentPath.value ? `${currentPath.value}/${props.file.path}` : props.file.path
    if (isFolder){
        params["pathMatch"] = path
    }
    else {
        params["file"] = path
        params["sha"] = props.file.sha
    }

    return {
        name: isFolder ? 'Repository' : 'File',
        params
    }
})

</script>

<template>
    <div class="
        flex items-center font-mono p-3 gap-3
        not-last:border-b-1 dark:not-last:border-zinc-700 not-last:border-zinc-300 text-sm ">
        <LucideFolder :size="20" v-if="isFolder"/>
        <LucideFile :size="20" v-else/>
        <RouterLink data-cy="file-link" :to="linkData" class="hover:text-primary hover:dark:text-primary-light hover:underline">{{ file.path }}</RouterLink>
    </div>
</template>
