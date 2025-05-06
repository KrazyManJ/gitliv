<script setup lang="ts">
  import { useGithubUserStore } from "@/stores/github-user.ts"
  import {onUpdated} from "vue";
  import Repository from "@/components/Repository.vue";
  const { user, repos } = useGithubUserStore()

  onUpdated(() => {
    console.log(user.user)
    if (repos.length > 0)
      console.log(repos[0])
  })
</script>

<template>
  <main>
    <div v-if="user.user">
      <div>{{ user.user.name }}</div>
      <div>{{ user.user.bio }}</div>
    </div>
    <div style="margin-top: 4em">
      <div v-for="repo in repos" :key="repo.id">
        <Repository :repo="repo" />
      </div>
    </div>
  </main>
</template>
