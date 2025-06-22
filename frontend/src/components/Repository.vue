<script setup lang="ts">
import type Repo from "@/model/Repo";
import { useLinguistStore } from "@/stores/linguist";
import { onMounted, reactive, ref } from "vue";
import Tile from "./Tile.vue";
import { LucideBook, LucideBookLock, LucidePencil, LucideTrash } from "lucide-vue-next";
import LanguageIcon from "./LanguageIcon.vue";
import { api } from "@/api";

const { repo } = defineProps<{
    repo: Repo;
}>();

const emit = defineEmits<{
    deleteButtonClick: [repo: Repo],
    editButtonClick: [repo: Repo]
}>()

const { getLanguageData } = useLinguistStore();

const state = reactive<{
    languages: string[]
}>({
    languages: []
})

const langColor = ref("var(--color-zinc-500)");



onMounted(() => {
    api.get<Record<string,number>>(repo.languages_url).then(({data}) => {
        state.languages = Object.entries(data).sort(([,a],[,b]) => b-a).map(([k,])=>k)
    })
    getLanguageData(repo.language).then((langData) => {
        if (langData) {
            langColor.value = langData.color;
        }
    });
})

</script>

<template>

    <Tile class="flex flex-col gap-4 grow">
        <router-link
            :to="`/repos/${repo.owner.login}/${repo.name}/commits/${repo.default_branch}`"
            class="flex w-fit"
        >
            <h3 class="text-xl font-bold flex items-center gap-2">
                <LucideBookLock class="stroke-primary" v-if="repo.visibility === 'private'"/>
                <LucideBook class="stroke-primary" v-else/>
                <span class="text-primary underline">{{ repo.name }}</span>
            </h3>
        </router-link>
        <div class="grow">
            <p v-if="repo.description">
                {{ repo.description }}
            </p>
            <p v-else class="italic">No description provided</p>
        </div>
        <div class="flex">
            <div class="ml-2 flex gap-2 items-center">
                <LanguageIcon v-for="(lang,i) in state.languages" :language="lang" :key="i" :size="20"/>
            </div>
            <!-- <div v-if="repo.language" class="ml-2 flex gap-2 items-center">
                <div class="rounded-full w-4 h-4" :style="`background-color: ${langColor};`"></div>
                <SimpleIcon :language="repo.language" :style="`fill: ${langColor};`"/>
                <span>{{ repo.language }}</span>
            </div> -->
            <div class="grow" />
            <div class="flex gap-4">
                <button @click="() => emit('deleteButtonClick',repo)" class="cursor-pointer">
                    <LucideTrash/>
                </button>
                <button @click="() => emit('editButtonClick',repo)" class="cursor-pointer">
                    <LucidePencil/>
                </button>
                <!-- <router-link
                    :to='{name: "Edit a Repository",params: {repo: repo.name}}'
                >
                    <LucidePencil/>
                </router-link> -->
            </div>
        </div>
    </Tile>
</template>
