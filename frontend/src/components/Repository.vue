<script setup lang="ts">
import type Repo from "@/model/Repo";
import { useLinguistStore } from "@/stores/linguist";
import { ref } from "vue";
import Tile from "./Tile.vue";
import { api } from "@/api";
import { useGithubAuthStore } from "@/stores/githubAuth";
import { LucideTrash } from "lucide-vue-next";

const { repo } = defineProps<{
    repo: Repo;
    onDelete?: () => void
}>();

const emit = defineEmits<{
  (e: 'on-delete'): void
}>()

const { getLanguageData } = useLinguistStore();
const githubAuth = useGithubAuthStore();

const langColor = ref("var(--color-zinc-500)");

getLanguageData(repo.language).then((langData) => {
    if (langData) {
        langColor.value = langData.color;
    }
});

const deleteRepo = (repo: string) => {
    api.delete(`/repos/${githubAuth.user?.username}/${repo}`)
    emit("on-delete")
}

</script>

<template>
    <!-- <a :href="repo.svn_url" target="_blank" class="flex"> -->
        <Tile class="flex flex-col gap-4 grow">
            <h3 class="text-xl font-bold">
                {{ repo.name }}
            </h3>
            <div class="grow">
                <p v-if="repo.description">
                    {{ repo.description }}
                </p>
                <p v-else class="italic">No description provided</p>
            </div>
            <div v-if="repo.language" class="ml-2 flex gap-2 items-center">
                <div class="rounded-full w-4 h-4" :style="`background-color: ${langColor};`"></div>
                <span>{{ repo.language }}</span>
            </div>
            <button @click="() => deleteRepo(repo.name)">
                <LucideTrash/>
            </button>
        </Tile>
    <!-- </a> -->
</template>
