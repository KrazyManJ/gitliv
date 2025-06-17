<script setup lang="ts">
import { useGithubStore } from "@/stores/github";
import Repository from "@/components/Repository.vue";
import ThemePicker from "@/components/ThemePicker.vue";
import { LucidePlus } from "lucide-vue-next";
import { useModalStore } from "@/stores/modal";
import CreateEditRepositoryView from "./modal/CreateEditRepositoryModal.vue";
import { onMounted } from "vue";
import DeleteRepositoryModal from "./modal/DeleteRepositoryModal.vue";

const { repos,fetchRepos } = useGithubStore();

onMounted(() => {
    fetchRepos()
})

const {showModal} = useModalStore()


</script>

<template>
    <main class="p-8 flex flex-col gap-8">
        <button @click="showModal(CreateEditRepositoryView,{})">
            <LucidePlus></LucidePlus>
        </button>
        <div class="grid grid-cols-3 gap-8">
            <Repository
                v-for="repo in repos"
                :key="repo.id"
                :repo="repo"
                @edit-button-click="(repo) => showModal(CreateEditRepositoryView,{repo: repo.name}, {onHide: fetchRepos})"
                @delete-button-click="(repo) => showModal(DeleteRepositoryModal,{repo: repo}, {onHide: fetchRepos})"
            />
        </div>
        <ThemePicker />
    </main>
</template>
