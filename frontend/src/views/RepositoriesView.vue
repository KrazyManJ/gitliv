<script setup lang="ts">
import { useGithubStore } from "@/stores/github";
import Repository from "@/components/Repository.vue";
import { LucidePlus } from "lucide-vue-next";
import { useModalStore } from "@/stores/modal";
import CreateEditRepositoryModal from "./modal/CreateEditRepositoryModal.vue";
import { onMounted, reactive } from "vue";
import DeleteRepositoryModal from "./modal/DeleteRepositoryModal.vue";
import Input from "@/components/Input.vue";
import GithubLanguageStats from "@/components/GithubLanguageStats.vue";

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
    <main class="p-8 flex flex-col gap-8">
        <button data-cy="add" @click="showModal(CreateEditRepositoryModal,{},{onHide: fetchRepos})">
            <LucidePlus/>
        </button>
        <GithubLanguageStats/>
        <Input v-model="state.searchInput" placeholder="Search..." />
        <div data-cy="repositories" class="grid grid-cols-3 gap-8">
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
