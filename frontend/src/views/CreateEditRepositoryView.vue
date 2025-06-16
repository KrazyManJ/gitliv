<script setup lang="ts">
import { api } from "@/api";
import Input, { type Rule } from "@/components/Input.vue";
import Select from "@/components/Select.vue";
import Tile from "@/components/Tile.vue";
import type Repo from "@/model/Repo";
import { useGithubAuthStore } from "@/stores/githubAuth";
import { computed, onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter()

type RepositoryVisibility = "public" | "private"

const formData = reactive<{
    name: string
    description: string,
    visibility: RepositoryVisibility,
    initWithReadme: boolean,
}>({
    name: "",
    description: "",
    visibility: "public",
    initWithReadme: false
});

const {user} = useGithubAuthStore()

const submit = async () => {
    if (isInputValid.value) return

    const body = {
        name: formData.name,
        description: formData.description.length === 0 ? undefined : formData.description,
        private: formData.visibility === "private",
        auto_init: formData.initWithReadme
    }

    if (routeRepo){
        await api.patch(`repos/${user?.username}/${routeRepo}`, body)
    }
    else {
        await api.post(`user/repos`, body);
    }

    router.replace("/")
};

const isInputValid = computed(() => !nameRules.every(rule => rule(formData.name) === true))

const nameRules: Rule[] = [
    (v) => !!v || 'Required',
    (v) => /^[a-z0-9\-\.\_]+$/i.test(v as string) || 'The repository name can only contain ASCII letters, digits, and the characters ., -, and _.',
]

const route = useRoute()
const routeRepo = route.params.repo

onMounted(() => {
    if (!routeRepo) return;
    api.get<Repo>(`/repos/${user?.username}/${routeRepo}`).then(({data: repo}) => {
        formData.name = repo.name
        formData.description = repo.description
        formData.visibility = repo.visibility
    })
})

</script>

<template>
    <main class="flex justify-center pt-8">
        <Tile class="max-w-lg w-full flex flex-col gap-8 select-none mx-4">
            <h1 class="text-3xl text-center">{{ routeRepo ? "Edit" : "Create" }} a Repository</h1>
            <form
                class="flex flex-col gap-12"
                @submit.prevent="submit"
            >
                <div class="flex flex-col gap-4">
                    <Input
                    label="Name*"
                    v-model="formData.name"
                    :rules="nameRules"/>
                    <Input label="Description" v-model="formData.description" />
                    <Select
                        label="Visibility"
                        v-model="formData.visibility"
                        :options="{
                            public: 'Public',
                            private: 'Private',
                        }"
                    />
                    <Input v-if="!routeRepo" label="Initialize with README.md file" v-model="formData.initWithReadme" type="checkbox"/>
                </div>
                <input type="submit" class="bg-primary p-2 rounded-lg text-zinc-100 font-mono font-bold disabled:opacity-50 cursor-pointer hover:brightness-110 disabled:cursor-not-allowed" :disabled="isInputValid">
            </form>
        </Tile>
    </main>
</template>
