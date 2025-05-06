<script setup lang="ts">
  import { Repo } from "@/stores/github-user";
  const { repo } = defineProps<{
    repo: Repo
  }>()
</script>

<template>
  <div style="max-width: 300px; display: flex; flex-direction: column; gap: 1em; margin: 4em; background: gray; padding: 1em">
    <h3>{{ repo.name }} </h3>
    <div>{{ repo.description ? repo.description : "no" }}</div>
    <div>{{ repo.language }}</div>
  </div>
</template>

<style scoped>

</style>
