<script setup lang="ts">
import { useGithubStore } from "@/stores/github.ts";
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { LucideArrowLeft } from "lucide-vue-next";
// import {useRouter} from "vue-router";

// store
const store = useGithubStore();
const { fetchFile, fileData } = store;
const { isLoading } = storeToRefs(store);

// const router = useRouter()

// props
const props = defineProps<{
    file: string;
    sha: string;
    username: string;
    name: string;
    branch: string;
}>();

// destrukturalizace props
const { file, sha, username, name, branch } = props;

const fileContent = ref("");

// funkce pro převod base64 obsahu na text
const convertFileContent = (content?: string) => {
    fileContent.value = content ? atob(content) : "";
};

// načtení souboru při mountu
onMounted(() => {
    console.log(branch);
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

        <div v-else class="flex-col items-center justify-between mb-4">
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

            <div>{{ fileContent }}</div>
        </div>
    </main>
</template>

<style scoped>
</style>
