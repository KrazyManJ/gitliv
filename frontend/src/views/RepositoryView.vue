<script setup lang="ts">
import {onMounted, ref} from "vue";
    import {useGithubStore} from "@/stores/github.ts";

    const {fetchFilesFromRepoFirst, files, fetchFilesFromRepo} = useGithubStore()

    const inner = ref(0)
    // const predecessor = ref("")

    const props = defineProps<{
        username: string,
        name: string,
        branch: string
    }>()

    const changeDisplayedFiles = (treePath: string | undefined) => {
        if(treePath){
            // predecessor.value =
            inner.value += 1
            fetchFilesFromRepo(props.username, props.name, treePath)
        }
    }

    onMounted(() => {
        console.log(props.branch)
        fetchFilesFromRepoFirst(props.username,props.name,props.branch)
    })
</script>

<template>
<!--    <button v-if="inner !== 0" @click="changeDisplayedFiles(file.url.split('/').pop())">UP</button>-->
    <div v-for="file in files">
        <button v-if="file.type === 'tree'" @click="changeDisplayedFiles(file.url.split('/').pop())">
            <div class="bg-fuchsia-500">{{file.path}}</div>
        </button>
        <div v-else>{{file.path}}</div>
    </div>
</template>

<style scoped>

</style>
