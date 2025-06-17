<script setup lang="ts">
import type Commit from "@/model/Commit.ts";

interface CommitProps {
    commit: Commit;
    variant?: "primary" | "secondary";
    repoName: string;
}

const { commit, variant = "primary", repoName } = defineProps<CommitProps>();

const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};
const byLineMinWidth = 180;
</script>

<template>
    <RouterLink
        :to="`/repos/${commit.commit.author.name ?? 'unknown-owner'}/${repoName}/commit/${commit.sha}`"
        class="block group no-underline"
    >
    <div
        :class="[
      variant === 'primary'
        ? 'bg-zinc-50 border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700'
        : 'border-zinc-300 bg-zinc-100 dark:bg-zinc-700 dark:border-zinc-600',
      'p-4 rounded-lg border shadow-sm min-h-[96px]',
    ]"
        v-tw-merge
    >
        <div class="flex items-center gap-4 min-w-0">
            <div class="flex items-center gap-3 flex-1 min-w-0 overflow-hidden">
                <img
                    v-if="commit.author?.avatar_url"
                    :src="commit.author.avatar_url"
                    alt="User avatar"
                    class="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
                    <div
                        class="font-semibold text-base text-gray-900 dark:text-white line-clamp-2 overflow-hidden"
                        :title="commit.commit.message"
                    >
                        {{ commit.commit.message }}
                    </div>

                    <!-- Wrap the by/author/sha line with min-width so it never truncates -->
                    <div
                        class="text-sm text-gray-600 dark:text-gray-300 mt-1 whitespace-nowrap flex-shrink-0"
                        :style="{ minWidth: byLineMinWidth + 'px' }"
                        ref="byLineRef"
                    >
                        by
                        <span class="font-medium">
          {{ commit.author?.login ?? commit.commit.author.name }}
        </span>
                        <span class="ml-2 text-gray-400">({{ commit.sha.slice(0, 7) }})</span>
                    </div>
                </div>
            </div>

            <div
                class="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap ml-auto flex-shrink-0 max-w-full truncate text-right"
            >
                {{ formatDate(commit.commit.author.date) }}
            </div>
        </div>
    </div>
    </RouterLink>
</template>

