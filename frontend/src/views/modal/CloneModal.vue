<script setup lang="ts">

import {onMounted, ref} from "vue";
import {useGithubStore} from "@/stores/github.ts";
import {storeToRefs} from "pinia";
import LoadingTile from "@/components/LoadingTile.vue";

// const {fetchRepo, repoData, isLoading} = useGithubStore()

const store = useGithubStore();
const { fetchRepo } = store;
const { repoData } = storeToRefs(store);

const isLoading = ref(true)

const props = defineProps< {
    owner: string,
    repo: string
}>()

onMounted(() => {
   fetchRepo(props.owner, props.repo).then(() => {
       isLoading.value = false
   })
})

</script>

<template>
    <div v-if="isLoading"><LoadingTile class="w-16 h-2 rounded"/></div>
    <div v-else>{{repoData.current?.clone_url}}</div>
</template>

<style scoped>

</style>
