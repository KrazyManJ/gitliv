<script setup lang="ts">
import { api } from '@/api';
import Button from '@/components/Button.vue';
import InlineCode from '@/components/InlineCode.vue';
import Input from '@/components/Input.vue';
import type Repo from '@/model/Repo';
import { useGithubAuthStore } from '@/stores/githubAuth';
import { useModalStore } from '@/stores/modal';
import { LucideTrash, LucideX } from 'lucide-vue-next';
import { computed, reactive } from 'vue';

const { repo } = defineProps<{
    repo: Repo
}>()

const state = reactive<{
    confirmInput: string,
    proceeding: boolean
}>({
    confirmInput: "",
    proceeding: false
})

const { hideModal } = useModalStore()

const githubAuth = useGithubAuthStore()

const fullRepoName = computed(() =>`${githubAuth.user?.username}/${repo.name}` )

const handleClick = async () => {
    if (state.proceeding) return
    if (state.confirmInput === `${githubAuth.user?.username}/${repo.name}`) {
        state.proceeding = true
        await api.delete(`/repos/${fullRepoName.value}`)
        hideModal("success")
    }
}

</script>

<template>
    <div class="flex flex-col justify-center gap-8">
        <h1 class="text-center text-2xl">Deleting <InlineCode class="text-2xl">{{ fullRepoName }}</InlineCode>...</h1>
        <p class="text-justify px-4">
            You are about to delete repository <InlineCode>{{ fullRepoName }}</InlineCode>. This
            action cannot be undone, so please think about it at least once.
        </p>
        <div class="flex justify-center">
            <LucideTrash class="stroke-red-600" :size="128"/>
        </div>
        <div class="">
            <p class="select-none pointer-none mb-2 text-center text-sm">
                To delete repository, enter <InlineCode>{{ fullRepoName }}</InlineCode> and confirm below.
            </p>
            <Input data-cy="repository-name-input" v-model="state.confirmInput" />
        </div>
        <div class="flex justify-evenly px-8 gap-16">
            <Button
                text-style="mono"
                @click="hideModal"
                class="grow"
                >
                <LucideX :size="20" class="stroke-zinc-100"/>
                Cancel
            </Button>
            <Button
                data-cy="confirm-delete"
                variant="important"
                text-style="mono"
                @click="handleClick"
                :disabled="state.confirmInput !== fullRepoName"
                :loading="state.proceeding"
                class="grow"
            >
                <LucideTrash :size="20" class="stroke-zinc-100"/>
                Delete
            </Button>
        </div>
    </div>
</template>
