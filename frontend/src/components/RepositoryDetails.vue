<script setup lang="ts">
import type Repo from '@/model/Repo';
import { useGithubStore } from '@/stores/github';
import { useModalStore } from '@/stores/modal';
import CreateEditRepositoryModal from '@/views/modal/CreateEditRepositoryModal.vue';
import DeleteRepositoryModal from '@/views/modal/DeleteRepositoryModal.vue';
import { LucidePencil, LucideTrash, LucideX } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import LoadingTile from './LoadingTile.vue';

const {repo} = defineProps<{
    repo: Repo | null
}>()

const { showModal } = useModalStore()
const { fetchRepo } = useGithubStore()
const router = useRouter()

const editClick = () => {
    if (!repo) return
    showModal(
    CreateEditRepositoryModal,
    {
        repo: repo.name
    },
    {
        onHide(returnState) {
            if (returnState === "success") {
                fetchRepo(repo.owner.login, repo.name);
            }
        },
    }
)
}

const removeClick = () =>{
    if (!repo) return
    showModal(
       DeleteRepositoryModal,
       {
           repo: repo
       },
       {
           onHide(returnState) {
               if (returnState === "success") router.push("/")
           }
       }
    )
 }

</script>

<template>
    <div class="mb-8">
        <div class="flex mb-4 items-center">
            <h1 v-if="repo" class="text-4xl text-primary font-bold" data-cy="repo-heading">{{repo.owner.login}}/{{ repo.name }}</h1>
            <LoadingTile v-else class="text-4xl font-bold">Owner/Repository</LoadingTile>
            <div class="grow md:block hidden"/>
            <div v-if="repo" class="gap-8 md:flex hidden">
                <LucidePencil @click="editClick"/>
                <LucideTrash @click="removeClick"/>
            </div>
            <div v-else class="flex gap-8 items-center">
                <LoadingTile><LucideX/></LoadingTile>
                <LoadingTile><LucideX/></LoadingTile>
            </div>
        </div>
        <LoadingTile v-if="!repo">Description not provided</LoadingTile>
        <p v-else-if="repo?.description">{{ repo.description }}</p>
        <p v-else><i>Description not provided</i></p>
        <div v-if="repo" class="mt-8 md:hidden flex justify-end gap-16">
            <LucidePencil @click="editClick"/>
            <!-- <div class="grow"/> -->
            <LucideTrash @click="removeClick"/>
        </div>
    </div>
</template>
