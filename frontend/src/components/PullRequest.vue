<script setup lang="ts">
import type PullRequest from '@/model/PullRequest';
import Tile from "@/components/Tile.vue";

interface PullRequestProps {
    pullRequest: PullRequest;
    variant?: 'primary' | 'secondary';
    repoName: string;
}

const { pullRequest, variant = 'primary', repoName } = defineProps<PullRequestProps>();

const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};
</script>

<template>

    <RouterLink
        :to="`/repos/${pullRequest.user.login ?? 'unknown-owner'}/${repoName}/pull-requests/${pullRequest.number}`"
        class="block group no-underline"
    >
        <Tile variant="secondary" class="min-h-[96px] flex items-center justify-between">
        <!-- Left side: PR title and user avatar + login -->
        <div class="flex items-center gap-4 min-w-0 overflow-hidden">
            <img
                v-if="pullRequest.user?.avatar_url"
                :src="pullRequest.user.avatar_url"
                alt="User avatar"
                class="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div class="flex flex-col min-w-0 overflow-hidden">
                <a
                    :href="pullRequest.html_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="font-semibold text-base text-gray-900 dark:text-white line-clamp-2 overflow-hidden hover:underline"
                    :title="pullRequest.title"
                >
                    {{ pullRequest.title }}
                </a>
                <div class="text-sm text-gray-600 dark:text-gray-300 mt-1 whitespace-nowrap truncate">
                    by <span class="font-medium">{{ pullRequest.user?.login }}</span>
                </div>
            </div>
        </div>

        <!-- Right side: target branch and creation date -->
        <div class="text-sm text-gray-500 dark:text-gray-400 ml-auto text-right break-words max-w-[120px] whitespace-pre-line sm:whitespace-nowrap">
            <div class="text-sm text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
                → {{ pullRequest.base.ref }}
            </div>
            <div class="text-xs text-gray-400 mt-1 whitespace-nowrap">
                {{ formatDate(pullRequest.created_at) }}
            </div>
        </div>
        </Tile>
    </RouterLink>
</template>
