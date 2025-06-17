<script setup lang="ts">
import {onMounted, ref} from "vue";
import {storeToRefs} from "pinia";
import {useGithubStore} from "@/stores/github.ts";
import File from "@/components/File.vue";
import { LucideCornerLeftUp } from "lucide-vue-next";

    // const {fetchFilesFromRepoFirst, fetchFilesFromRepo} = useGithubStore()

const store = useGithubStore()
const {fetchFilesFromRepoFirst, fetchFilesFromRepo, fetchBranchesFromRepo} = store
const { treeHistory, isLoading, files, branches } = storeToRefs(store)


const selectedBranch = ref("")

const props = defineProps<{
        username: string,
        name: string,
        branch: string
    }>()

    const goUp = () => {
        treeHistory.value.pop()
        // console.log(treeHistory.value.length)
        const parentPath = treeHistory.value[treeHistory.value.length-1]
        fetchFilesFromRepo(props.username, props.name, parentPath)
    }

    const changeBranch = () => {
        files.value.splice(0, files.value.length)
        fetchFilesFromRepoFirst(props.username,props.name,selectedBranch.value)
    }

    onMounted(() => {
        selectedBranch.value = props.branch
        treeHistory.value.splice(0,treeHistory.value.length)
        files.value.splice(0, files.value.length)
        fetchFilesFromRepoFirst(props.username,props.name,props.branch)
        fetchBranchesFromRepo(props.username, props.name)
    })
</script>

<template>
    <main class="p-8 bg-zinc-50 dark:bg-zinc-900 min-h-screen text-zinc-800 dark:text-zinc-100">
        <div class="flex-col items-center justify-between mb-4">
            <div class="flex items-center">
                <h1 class="pl-2 mb-1 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                    Source
                </h1>

                <div v-if="isLoading"
                     class="ml-2 h-10 w-40 rounded-lg border-2 border-black bg-zinc-300 dark:bg-zinc-700 animate-pulse"
                ></div>

                <select
                    v-model="selectedBranch"
                    @change="changeBranch()"
                    v-else
                    class="border-2 border-black rounded-lg p-2 mb-2 ml-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                >
                    <option v-for="branch in branches" :key="branch.name" :value="branch.name" >
                        {{ branch.name }}
                    </option>
                </select>
            </div>
            <div v-if="isLoading" class="p-4 border-2 border-solid border-black rounded-lg space-y-1">
                <div
                    v-for="i in 8"
                    :key="i"
                    class="rounded-lg border-2 border-solid border-black w-full h-12 mb-1 bg-zinc-300 dark:bg-zinc-700 animate-pulse"
                ></div>
            </div>
            <div class="p-4 border-2 border-solid border-black rounded-lg" v-else>
                <button v-if="treeHistory.length > 1" @click="goUp()"><LucideCornerLeftUp/></button>
                <div v-for="file in files">
                    <File :file="file" :username="props.username" :name="props.name"/>
                </div>
            </div>
        </div>
    </main>

</template>

<style scoped>

</style>
