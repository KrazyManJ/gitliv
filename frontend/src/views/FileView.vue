<script setup lang="ts">
import { useGithubStore } from "@/stores/github.ts";
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import Tile from "@/components/Tile.vue";
import { LucideFile, LucideGitBranch } from "lucide-vue-next";
import LoadingTile from "@/components/LoadingTile.vue";

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
    <main class="p-4 flex flex-col grow">
        <h1 class="text-4xl text-primary font-bold mb-8" data-cy="repo-heading">{{username}}/{{ name }}</h1>
        <Tile class="p-0 overflow-hidden grow flex flex-col">
            <div class="font-mono p-2 px-4 border-b-1 border-zinc-200 dark:border-zinc-700 flex items-center gap-2">
                <LucideFile :size="16" class="shrink-0"/>
                <div data-cy="file-title" class="break-words min-w-0 w-full text-sm">
                    {{ file }}
                </div>
                <div class="grow" />
                <LucideGitBranch :size="20" class="shrink-0 ml-4"/>
                <span>{{ branch }}</span>
            </div>
            <LoadingTile v-if="isLoading" class="rounded-none grow"/>
            <div v-else class="flex flex-col grow" data-cy="file-content">
                <highlightjs autodetect :code="fileContent" class="flex flex-col grow"/>
            </div>
        </Tile>
    </main>
</template>

<style scoped>
::v-deep(pre code.hljs) {
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: anywhere;
}
</style>
