<script setup lang="ts">
import type Repo from "@/model/Repo";
import { useLinguistStore } from "@/stores/linguist";
import { ref } from "vue";
import Tile from "./Tile.vue";
import { api } from "@/api";
import { useGithubAuthStore } from "@/stores/githubAuth";
import { LucidePencil, LucideTrash } from "lucide-vue-next";

const { repo } = defineProps<{
    repo: Repo;
}>();

// const { user } = useGithubAuthStore();


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

const deleteRepo = async (repo: string) => {
    await api.delete(`/repos/${githubAuth.user?.username}/${repo}`)
    emit("on-delete")
}

</script>

<template>

    <Tile class="flex flex-col gap-4 grow">
        <router-link
            :to="`/repos/${repo.owner.login}/${repo.name}/commits/${repo.default_branch}`"
            class="flex"
        >
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
        <div class="flex">
            <div v-if="repo.language" class="ml-2 flex gap-2 items-center">
                <div class="rounded-full w-4 h-4" :style="`background-color: ${langColor};`"></div>
                <span>{{ repo.language }}</span>
            </div>
            <div class="grow" />
            <div class="flex gap-4">
                <button @click="() => deleteRepo(repo.name)" class="cursor-pointer">
                    <LucideTrash/>
                </button>
                <router-link
                    :to='{name: "Edit a Repository",params: {repo: repo.name}}'
                >
                    <LucidePencil/>
                </router-link>
            </div>
        </div>
    </Tile>
</template>
