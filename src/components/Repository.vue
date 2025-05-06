<script setup lang="ts">
  import type { Repo } from '@/model/Repo';
  const { repo } = defineProps<{
    repo: Repo
  }>()
</script>

<template>
  <div class="flex flex-col gap-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-300">
    <h3 class="text-xl font-bold">
      {{ repo.name }}
    </h3>
    {{ repo.description ? repo.description : "no" }}
    <p class="grow">
      
    </p>
    <div class="ml-2 flex gap-2 items-center">
      <div class="rounded-full w-4 h-4 bg-zinc-900"></div>
      {{ repo.language }}
    </div>
  </div>
</template>
