<script setup lang="ts">
import { api } from "@/api";
import Button from "@/components/Button.vue";
import Input, { type Rule } from "@/components/Input.vue";
import Select from "@/components/Select.vue";
import type Repo from "@/model/Repo";
import { useGithubStore } from "@/stores/github";
import { useGithubAuthStore } from "@/stores/githubAuth";
import { useModalStore } from "@/stores/modal";
import { usePopupStore } from "@/stores/popup";
import type { AxiosError } from "axios";
import { LucideSave, LucideX } from "lucide-vue-next";
import { computed, onMounted, reactive, useTemplateRef } from "vue";

type RepositoryVisibility = "public" | "private"

const state = reactive<{
    name: string
    description: string,
    visibility: RepositoryVisibility,
    initWithReadme: boolean,
    loading: boolean
}>({
    name: "",
    description: "",
    visibility: "public",
    initWithReadme: false,
    loading: true
});

const { user } = useGithubAuthStore()
const { hideModal } = useModalStore()
const { showPopup } = usePopupStore()
const { repos } = useGithubStore()

const repoNames = computed(() => repos.map(v => v.name))

const submit = async () => {
    if (!isInputValid.value) return

    state.loading = true

    const body = {
        name: state.name,
        private: state.visibility === "private",
        description: state.description.length !== 0 ? state.description : undefined,
        auto_init: state.initWithReadme
    }

    try {
        if (repo){
            await api.patch(`repos/${user?.username}/${repo}`, body)
        }
        else {
            await api.post(`user/repos`, body);
        }
        showPopup("success",`Successfully ${repo ? "updated" : "added"} repository \`${state.name}\`.`)
    } catch (e) {
        const error = (e as AxiosError)
        const data = error.response?.data as { message?: string } | undefined
        const message = data?.message || error.message
        showPopup("error",`Error while ${repo ? "adding" : "editing"} repository: ${message}`)
    }
    hideModal()
};

const nameRules: Rule[] = [
    (v) => !!v || 'Required',
    (v) => /^[a-z0-9\-\.\_]+$/i.test(v as string) || 'The repository name can only contain ASCII letters, digits, and the characters ., -, and _.',
    (v) => (!repoNames.value.includes(v as string) || !!repo) || 'Repository already exists'
]

const isInputValid = computed(() => nameRules.every(rule => rule(state.name) === true))

const { repo } = defineProps<{
    repo?: string
}>()


onMounted(async () => {
    if (repo) {
        await api.get<Repo>(`/repos/${user?.username}/${repo}`).then(({data: repo}) => {
            state.name = repo.name
            state.description = repo.description ?? ""
            state.visibility = repo.visibility
        });
    }
    state.loading = false;
    (document.activeElement as HTMLElement).blur();
    (modalRef.value?.$refs.input as HTMLInputElement).focus()
})

const modalRef = useTemplateRef("modalRef");

</script>

<template>
    <div class="">
        <h1 class="text-3xl text-center">{{ repo ? "Edit" : "Create" }} a Repository</h1>
        <form
            class="flex flex-col gap-12"
            @submit.prevent="submit"
        >
        <div class="flex flex-col gap-4">
            <Input
                label="Name*"
                v-model="state.name"
                :rules="nameRules"
                ref="modalRef"
                class="font-mono"
            />
            <Input
                label="Description" v-model="state.description"
                placeholder="No description provided..."
            />
            <Select
                label="Visibility"
                v-model="state.visibility"
                :options="{
                    public: 'Public',
                    private: 'Private',
                }"
                :default-value="state.visibility"
            />
            <Input v-if="!repo" label="Initialize with README.md file" v-model="state.initWithReadme" type="checkbox"/>
            </div>
            <div class="flex justify-evenly px-8 gap-16">
                <Button
                    text-style="mono"
                    class="grow"
                    @click="hideModal"
                >
                    <LucideX :size="20" class="stroke-zinc-100"/>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    text-style="mono"
                    class="grow"
                    :disabled="!isInputValid || state.loading"
                    :loading="state.loading"
                    type="submit"
                >
                    <LucideSave :size="20" class="stroke-zinc-100"/>
                    {{ !repo ? "Create" : "Update" }}
                </Button>
            </div>
        </form>
    </div>
</template>
