<script setup lang="ts">

import type GitFileFromTree from "@/model/GitFileFromTree.ts";
import {useGithubStore} from "@/stores/github.ts";
import {storeToRefs} from "pinia";
import { LucideFolder, LucideFile } from "lucide-vue-next";

const store = useGithubStore()
const {fetchFilesFromRepo} = store
const {treeHistory} = storeToRefs(store)

const props = defineProps<{
    file: GitFileFromTree,
    username: string,
    name: string,
    branch: string
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

    <router-link :to="{name:'File', params:{file:file.path, name:name, username:username, branch:branch,
    sha:file.sha}}"
                 class="flex items-center rounded-lg
                 border-2 border-solid
                 border-black w-full p-4 mb-1" v-else>
        <LucideFile />
        <span class="pl-2">{{ file.path }}</span>
    </router-link>

</template>

<style scoped>

</style>
