<script setup lang="ts">
import type Repo from "@/model/Repo";
import { useLinguistStore } from "@/stores/linguist";
import { ref } from "vue";
import Tile from "./Tile.vue";
const { repo } = defineProps<{
    repo: Repo;
}>();

const { getLanguageData } = useLinguistStore();

const langColor = ref("var(--color-zinc-500)");

getLanguageData(repo.language).then((langData) => {
    if (langData) {
        langColor.value = langData.color;
    }
});
</script>

<template>
    <a :href="repo.svn_url" target="_blank" class="flex">
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
                {{ repo.language }}
            </div>
        </Tile>
    </a>
</template>
