<script setup lang="ts">
import { useGithubStore } from "@/stores/github.ts";
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { LucideArrowLeft } from "lucide-vue-next";

const store = useGithubStore();
const { fetchFile, fileData } = store;
const { isLoading } = storeToRefs(store);

const props = defineProps<{
    file: string;
    sha: string;
    username: string;
    name: string;
    branch: string;
}>();

const { file, sha, username, name, branch } = props;

const fileContent = ref("");



const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder("utf-8").decode(bytes);
};

const convertFileContent = (content?: string) => {
    fileContent.value = content ? decodeBase64(content) : "";
};

onMounted(() => {
    fetchFile(sha, username, name).then(() => {
        convertFileContent(fileData.current?.content);
    });
});
</script>

<template>
    <main class="p-8 min-h-screen">
        <!-- Loading -->
        <div v-if="isLoading" class="space-y-4">
            <div class="w-64 h-8 bg-zinc-300 dark:bg-zinc-700 rounded-lg animate-pulse" />
            <div class="h-80 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
        </div>

        <!-- File Display -->
        <div v-else class="space-y-8 py-4">
            <!-- Back Link -->
            <div class="mb-4">
                <router-link :to="{ name: 'Repository', params: { username, name, branch } }">
                    <LucideArrowLeft class="mr-3 w-6 h-6 text-zinc-600 dark:text-zinc-300" />
                </router-link>
            </div>

            <!-- File Header -->
            <div class="mb-2 space-y-4">
                <h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100 break-all"  data-cy="file-title">{{ file }}</h1>
                <p class="text-sm text-primary dark:text-primary font-mono">Branch: {{ branch }}</p>
            </div>

            <!-- File Content -->
            <div
                data-cy="file-content"
                class="overflow-x-auto whitespace-pre-wrap bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded p-4 font-mono text-sm leading-relaxed"
            >
                <highlightjs autodetect :code="fileContent" />
            </div>
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
