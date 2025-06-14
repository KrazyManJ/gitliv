<script setup lang="ts">
import type Repo from "@/model/Repo";
import { useLinguistStore } from "@/stores/linguist";
import { ref } from "vue";
import Tile from "./Tile.vue";
import {useGithubStore} from "@/stores/github.ts";
import {useGithubAuthStore} from "@/stores/githubAuth.ts";
import { api } from "@/api";
import { useGithubAuthStore } from "@/stores/githubAuth";
import { LucideTrash } from "lucide-vue-next";

const { repo } = defineProps<{
    repo: Repo;
    onDelete?: () => void
}>();

const { user } = useGithubAuthStore();


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

    <Tile class="flex flex-col gap-4 grow">
        <router-link
            :to="`/repos/${user?.username}/${repo.name}/commits`"
            class="flex"
        >
        <!-- <router-link :to="{name: 'Repository',  params: {username: repo.owner.login, name: repo.name, branch: repo.default_branch}}"
                 class="v-tw-merge"></router-link> -->
            <h3 class="text-xl font-bold">
                {{ repo.name }}
            </h3>
        </router-link>
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
</template>
