<script setup lang="ts">
import { useGithubStore } from "@/stores/github.ts";
import {onMounted, ref} from "vue";
import { storeToRefs } from "pinia";
import { LucideArrowLeft } from "lucide-vue-next";
// import hljs from 'highlight.js';
// import {useRouter} from "vue-router";

const store = useGithubStore();
const { fetchFile, fileData } = store;
const { isLoading } = storeToRefs(store);

// const router = useRouter()

const props = defineProps<{
    file: string;
    sha: string;
    username: string;
    name: string;
    branch: string;
}>();

const { file, sha, username, name, branch } = props;

const fileContent = ref("");

// const codeHighlight = (code: string) => {
//     return hljs.highlightAuto(code)
// }

const convertFileContent = (content?: string) => {
    // fileContent.value = content ? codeHighlight(atob(content)).value : "";
    fileContent.value = content ? decodeBase64(content) : "";
};

const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const decoder = new TextDecoder("utf-8");
    return decoder.decode(bytes);
};

onMounted(() => {
    fetchFile(sha, username, name).then(() => {
        convertFileContent(fileData.current?.content);
    });
});

</script>

<template>
    <main class="p-8 bg-zinc-50 dark:bg-zinc-900 min-h-screen text-zinc-800 dark:text-zinc-100">
        <div
            v-if="isLoading"
            class="ml-2 h-10 w-40 rounded-lg border-2 border-black bg-zinc-300 dark:bg-zinc-700 animate-pulse"
        ></div>

        <div v-else class="flex-col items-center justify-between mb-5">
            <router-link :to="{ name: 'Repository', params: { username, name, branch } }">
                <LucideArrowLeft />
            </router-link>

            <div class="flex items-center">
                <h1 class="pr-2 mb-1 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                    {{ file }}
                </h1>
                <div
                    class="border-2 border-black rounded-lg p-2 mb-2 ml-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                >
                    {{ branch }}
                </div>
            </div>
            <highlightjs autodetect :code="fileContent"/>
        </div>
    </main>
</template>

<style scoped>
::v-deep(pre code.hljs) {
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: anywhere;
}
</style>

