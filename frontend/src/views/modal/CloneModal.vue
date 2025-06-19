<script setup lang="ts">

import {onMounted, ref} from "vue";
import {useGithubStore} from "@/stores/github.ts";
import {storeToRefs} from "pinia";
import LoadingTile from "@/components/LoadingTile.vue";
import { LucideClipboardCopy, LucideCheck, LucideExternalLink } from "lucide-vue-next"

const store = useGithubStore();
const { fetchRepo } = store;
const { repoData } = storeToRefs(store);

const isLoading = ref(true)

const choice = {
    HTTPS: "HTTPS",
    SSH: "SSH",
    CLI: "GitHub CLI"
}

const madeChoice = ref(choice.HTTPS)

const props = defineProps< {
    owner: string,
    repo: string
}>()

const copied = ref(false)

const copyToClipboard = async (text: string | undefined) => {
    if (text){
        try {
            await navigator.clipboard.writeText(text)
            copied.value = true
            setTimeout(() => copied.value = false, 2000)
        } catch (err) {
            console.error('Error during copying: ', err)
        }
    }
}

onMounted(() => {
   fetchRepo(props.owner, props.repo).then(() => {
       isLoading.value = false
   })
})

</script>

<template>
    <div class="flex gap-6 mb-3">
        <div v-for="ch of choice">
            <button class="mb-0.5 text-lg cursor-pointer" @click="madeChoice = ch">{{ch}}</button>
            <hr v-if="ch == madeChoice" class="w-full h-1 bg-primary">
        </div>
    </div>
    <div v-if="isLoading">
        <div class="flex mt-2 gap-3">
            <LoadingTile class="w-full h-5 rounded"/>
            <LoadingTile class="w-5 h-5 rounded"/>
        </div>
        <div class="mt-3 flex flex-col gap-1">
            <LoadingTile class="w-64 h-4 rounded"/>
            <LoadingTile class="w-80 h-4 rounded"/>
        </div>
    </div>
    <div v-else>
        <div v-if="madeChoice == choice.HTTPS">
            <div class="flex mt-2 gap-5">
                <div>{{repoData.current?.clone_url}}</div>
                <LucideCheck v-if="copied" />
                <LucideClipboardCopy class="cursor-pointer" v-else @click="copyToClipboard(repoData.current?.clone_url)"/>
            </div>
            <div class="mt-3 flex flex-col">
                <span class="text-gray-400 text-sm">Clone using the web URL.</span>
<!--                <span class="text-gray-400 text-sm">Recommended option by web developers for beginners.</span>-->
            </div>
        </div>
        <div v-if="madeChoice == choice.SSH">
            <div class="flex mt-2 gap-5">
                <div>{{repoData.current?.ssh_url}}</div>
                <LucideCheck v-if="copied" />
                <LucideClipboardCopy class="cursor-pointer" v-else @click="copyToClipboard(repoData.current?.ssh_url)"/>
            </div>
            <div class="mt-3 flex flex-col">
                <span class="text-gray-400 text-sm">Use a password-protected SSH key.</span>
            </div>
        </div>
        <div v-if="madeChoice == choice.CLI">
            <div class="flex mt-2 gap-5">
                <div>git repo clone {{owner}}/{{repo}}</div>
                <LucideCheck v-if="copied" />
                <LucideClipboardCopy class="cursor-pointer" v-else
                                     @click="copyToClipboard(`git repo clone ${owner}/${repo}`)"/>
            </div>
            <div class="mt-3 flex flex-col">
                <span class="text-gray-400 text-sm">Work fast with GitHub official CLI.</span>
            </div>
        </div>
        <div class="flex flex-col gap-2 mt-4">
            <a
                :href="`vscode://vscode.git/clone?url=${encodeURIComponent(repoData.current?.clone_url || '')}`"
                class="flex gap-2.5"
            >
                Open in Visual Studio Code <LucideExternalLink/>
            </a>
        </div>
    </div>
</template>

<style scoped>

</style>
