<script setup lang="ts">
import { useGithubStore } from "@/stores/github";
import Repository from "@/components/Repository.vue";
import { LucideBookPlus, LucideSearch } from "lucide-vue-next";
import { useModalStore } from "@/stores/modal";
import CreateEditRepositoryModal from "./modal/CreateEditRepositoryModal.vue";
import { onMounted, reactive } from "vue";
import DeleteRepositoryModal from "./modal/DeleteRepositoryModal.vue";
import Input from "@/components/Input.vue";
import GithubLanguageStats from "@/components/GithubLanguageStats.vue";
import Button from "@/components/Button.vue";

const { repos,fetchRepos } = useGithubStore();

onMounted(() => {
    fetchRepos()
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
        <GithubLanguageStats/>
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
                @click="showModal(CreateEditRepositoryModal,{},{onHide: fetchRepos})"
            >
                <LucideBookPlus class="stroke-zinc-100"/> Create a Repository
            </Button>
        </div>
        <div data-cy="repositories" class="grid lg:grid-cols-3 gap-8 md:grid-cols-2 grid-cols-1">
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
