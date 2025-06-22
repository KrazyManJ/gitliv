<script setup lang="ts">
import { useGithubStore } from "@/stores/github";
import Repository from "@/components/Repository.vue";
import { LucideBookPlus, LucideFrown, LucideSearch } from "lucide-vue-next";
import { useModalStore } from "@/stores/modal";
import CreateEditRepositoryModal from "./modal/CreateEditRepositoryModal.vue";
import { Fragment, onMounted, reactive, ref } from "vue";
import DeleteRepositoryModal from "./modal/DeleteRepositoryModal.vue";
import Input from "@/components/Input.vue";
import GithubLanguageStats from "@/components/GithubLanguageStats.vue";
import Button from "@/components/Button.vue";
import LoadingTile from "@/components/LoadingTile.vue";
import HorizontalRule from "@/components/HorizontalRule.vue";
import { useGithubAuthStore } from "@/stores/githubAuth";
import { storeToRefs } from "pinia";

const { repos,fetchRepos } = useGithubStore();
const { user } = storeToRefs(useGithubAuthStore())

const loading = ref<boolean>(true);

onMounted(async () => {
    await fetchRepos()
    loading.value = false
})

const {showModal} = useModalStore()

const state = reactive<{
    searchInput: string
}>({
    searchInput: ""
})

</script>

<template>
    <main class="p-4 flex flex-col gap-8">
        <h1 class="text-2xl md:text-4xl font-mono flex gap-4 md:gap-8 items-center justify-center">
            <LoadingTile v-if="!user" class="rounded-full aspect-square md:w-[96px] w-[64px]"/>
            <img v-else :src="user.avatar" class="rounded-full aspect-square md:w-[96px] w-[64px]">
            <LoadingTile v-if="!user" class="break-all line-clamp-2 max-w-xl">Welcome username!</LoadingTile>
            <span v-else class="break-all line-clamp-2 max-w-xl">Welcome <b>{{ user.username }}</b>!</span>
        </h1>
        <h2 class="text-2xl font-semibord">Language statistics</h2>
        <GithubLanguageStats/>
        <h2 class="text-2xl font-semibord">Repositories</h2>
        <div class="flex w-full gap-8 items-center">
            <Input
                v-model="state.searchInput"
                placeholder="Search a repository..."
                data-cy="search"
                :icon="LucideSearch"
                container-class="grow"
                class="border-zinc-400/50"
            />
            <Button
                variant="primary"
                text-style="mono"
                data-cy="add"
                @click="showModal(CreateEditRepositoryModal,{},{onHide: fetchRepos})"
                class="fixed right-4 bottom-4 md:sticky py-4 md:py-2 shadow-lg shadow-zinc-700/50 md:shadow-none z-10 md:z-0"
            >
                <LucideBookPlus class="stroke-zinc-100 scale-150 md:scale-100"/>
                <span class="hidden md:inline text-zinc-100">Create a Repository</span>
            </Button>
        </div>
        <div v-if="!loading && repos.length === 0" class="flex items-center justify-center my-3">
            <div class="flex flex-col items-center gap-4">
                <LucideFrown class="stroke-zinc-500" :size="64"/>

                <i class="text-zinc-500 text-xl">No repository found!</i>
            </div>
        </div>
        <div data-cy="repositories" class="grid lg:grid-cols-3 gap-8 md:grid-cols-2 grid-cols-1 pb-18 md:pb-0">
            <LoadingTile v-if="loading" v-for="i in 12" :key="i" class="w-full h-40 rounded-xl"/>
            <Repository
                data-cy="repository"
                v-for="repo in repos.filter(repo => repo.name.toLocaleLowerCase().includes(state.searchInput.toLocaleLowerCase()))"
                :key="repo.id"
                :repo="repo"
                @edit-button-click="(repo) => showModal(CreateEditRepositoryModal,{repo: repo.name}, {onHide: fetchRepos})"
                @delete-button-click="(repo) => showModal(DeleteRepositoryModal,{repo: repo}, {onHide: fetchRepos})"
            />
        </div>
    </main>
</template>
