<script setup lang="ts">
import { api } from "@/api";
import Tile from "@/components/Tile.vue";
import { useGithubStore } from "@/stores/github";
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter()

const props = reactive<{
    name: string;
}>({
    name: "",
});

const submit = () => {
    api.post(`user/repos`, {
        name: props.name,
    });
    useGithubStore().fetchRepos()
    router.replace("/")
};
</script>

<template>
    <main>
        <Tile>
            <form @submit.prevent="submit">
                <input type="text" v-model="props.name" />
                <input type="submit">
            </form>
        </Tile>
    </main>
</template>
