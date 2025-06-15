<script setup lang="ts">
import { api } from "@/api";
import Input, { type Rule } from "@/components/Input.vue";
import Select from "@/components/Select.vue";
import Tile from "@/components/Tile.vue";
import { useGithubStore } from "@/stores/github";
import { computed, reactive, watch } from "vue";
import { useRouter } from "vue-router";

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

const submit = async () => {
    if (isInputValid.value) return

    await api.post(`user/repos`, {
        name: formData.name,
        description: formData.description.length === 0 ? undefined : formData.description,
        private: formData.visibility === "private",
        auto_init: formData.initWithReadme
    });

    router.replace("/")
};

const isInputValid = computed(() => !nameRules.every(rule => rule(formData.name) === true))

const nameRules: Rule[] = [
    (v) => !!v || 'Required',
    (v) => /^[a-z0-9\-\.\_]+$/i.test(v as string) || 'The repository name can only contain ASCII letters, digits, and the characters ., -, and _.',
]

</script>

<template>
    <main class="flex justify-center pt-8">
        <Tile class="max-w-lg w-full flex flex-col gap-8 select-none mx-4">
            <h1 class="text-3xl text-center">Create a Repository</h1>
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
                    <Input label="Initialize with README.md file" v-model="formData.initWithReadme" type="checkbox"/>
                </div>
                <input type="submit" class="bg-primary p-2 rounded-lg text-zinc-100 font-mono font-bold disabled:opacity-50 cursor-pointer hover:brightness-110 disabled:cursor-not-allowed" :disabled="isInputValid">
            </form>
        </Tile>
    </main>
</template>
