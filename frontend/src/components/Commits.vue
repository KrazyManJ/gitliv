<script setup lang="ts">
import type Commit from "@/model/Commit.ts";
import Tile from "./Tile.vue";

interface CommitProps {
    commit: Commit;
    repoName: string;
    branch: string;
}

const { commit, repoName, branch } = defineProps<CommitProps>();

const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const dayMonth = date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "numeric",
    });
    const year = date.getFullYear();
    return `${dayMonth}\n${year}`;
};

const byLineMinWidth = 180;
</script>

<template>
    <RouterLink
        :to="`/repos/${commit.author?.login ?? 'unknown-owner'}/${repoName}/${branch}/commit/${commit.sha}`"
        class="block group no-underline"
    >
    <Tile variant="secondary" class="min-h-[96px]">
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

                    <div
                        class="text-sm text-gray-600 dark:text-gray-300 mt-1 whitespace-nowrap flex-shrink-0"
                        :style="{ minWidth: byLineMinWidth + 'px' }"
                        ref="byLineRef"
                    >
                        by
                        <span class="font-medium">
          {{ commit.author?.login ?? commit.commit.author.name }}
        </span>
                        <span class="ml-2 text-gray-400 hidden sm:inline">({{ commit.sha.slice(0, 7) }})</span>
                    </div>
                </div>
            </div>

            <div
                class="text-sm text-gray-500 dark:text-gray-400 ml-auto text-right break-words max-w-[120px] whitespace-pre-line sm:whitespace-nowrap"
            >
                {{ formatDate(commit.commit.author.date) }}
            </div>
        </div>
    </Tile>
    </RouterLink>
</template>

