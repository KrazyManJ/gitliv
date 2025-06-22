<script setup lang="ts">

import {ref} from "vue";
import {useGithubStore} from "@/stores/github.ts";
import {storeToRefs} from "pinia";
import LoadingTile from "@/components/LoadingTile.vue";
import { LucideClipboardCopy, LucideCheck, LucideExternalLink } from "lucide-vue-next"
import InlineCode from "@/components/InlineCode.vue";

const store = useGithubStore();
const { repoData } = storeToRefs(store);

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

</script>

<template>
    <div class="flex gap-6 mb-3">
        <div v-for="(ch,i) of choice" :key="i">
            <button class="mb-0.5 text-lg cursor-pointer" @click="madeChoice = ch">{{ch}}</button>
            <hr v-if="ch == madeChoice" class="w-full h-1 bg-primary">
        </div>
    </div>
    <div>
        <div v-if="madeChoice == choice.HTTPS">
            <div class="flex mt-2 gap-5">
                <InlineCode>{{repoData.current?.clone_url}}</InlineCode>
                <LucideCheck v-if="copied" />
                <LucideClipboardCopy class="cursor-pointer" v-else @click="copyToClipboard(repoData.current?.clone_url)"/>
            </div>
            <div class="mt-3 flex flex-col">
                <span class="text-gray-400 text-sm">Clone using the web URL.</span>
            </div>
        </div>
        <div v-if="madeChoice == choice.SSH">
            <div class="flex mt-2 gap-5">
                <InlineCode>{{repoData.current?.ssh_url}}</InlineCode>
                <LucideCheck v-if="copied" />
                <LucideClipboardCopy class="cursor-pointer" v-else @click="copyToClipboard(repoData.current?.ssh_url)"/>
            </div>
            <div class="mt-3 flex flex-col">
                <span class="text-gray-400 text-sm">Use a password-protected SSH key.</span>
            </div>
        </div>
        <div v-if="madeChoice == choice.CLI">
            <div class="flex mt-2 gap-5">
                <InlineCode>git repo clone {{owner}}/{{repo}}</InlineCode>
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
                class="flex gap-2.5 items-center"
            >
                <i class="devicon-vscode-plain"/><span>Open in Visual Studio Code</span> <LucideExternalLink/>
            </a>
<!--            <button @click="downloadZip()">Download a ZIP file</button>-->
        </div>
    </div>
</template>

<style scoped>

</style>
