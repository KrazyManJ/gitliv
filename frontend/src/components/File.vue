<script setup lang="ts">

import type GitFile from "@/model/GitFile.ts";
import {useGithubStore} from "@/stores/github.ts";
import {storeToRefs} from "pinia";
import { LucideFolder, LucideFile } from "lucide-vue-next";

const store = useGithubStore()
const {fetchFilesFromRepo} = store
const {treeHistory} = storeToRefs(store)

const props = defineProps<{
    file: GitFile,
    username: string,
    name: string
}>();

const changeDisplayedFiles = (treePath: string | undefined) => {
    if(treePath){
        treeHistory.value.push(treePath)
        fetchFilesFromRepo(props.username, props.name, treePath)
    }
}

</script>

<template>
    <button
        class="flex items-center rounded-lg border-2 border-solid border-black w-full p-4 mb-1"
        v-if="file.type === 'tree'"
        @click="changeDisplayedFiles(file.url.split('/').pop())"
    >
        <LucideFolder />
        <span class="pl-2">{{ file.path }}</span>
    </button>

    <div class="flex items-center rounded-lg border-2 border-solid border-black w-full p-4 mb-1" v-else>
        <LucideFile />
        <div class="pl-2">{{ file.path }}</div>
    </div>

</template>

<style scoped>

</style>
