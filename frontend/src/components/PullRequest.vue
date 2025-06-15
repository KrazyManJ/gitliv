<script setup lang="ts">
import type PullRequest from '@/model/PullRequest';

interface PullRequestProps {
    pullRequest: PullRequest;
    variant?: 'primary' | 'secondary';
}

const { pullRequest, variant = 'primary' } = defineProps<PullRequestProps>();

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
    <div
        :class="[
      variant === 'primary'
        ? 'bg-zinc-50 border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700'
        : 'border-zinc-300 bg-zinc-100 dark:bg-zinc-700 dark:border-zinc-600',
      'p-4 rounded-lg border shadow-sm min-h-[96px] flex items-center justify-between'
    ]"
        v-tw-merge
    >
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
        <div class="flex flex-col items-end flex-shrink-0 ml-4 min-w-[120px] text-right">
            <div class="text-sm text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
                → {{ pullRequest.base.ref }}
            </div>
            <div class="text-xs text-gray-400 mt-1 whitespace-nowrap">
                {{ formatDate(pullRequest.created_at) }}
            </div>
        </div>
    </div>
</template>
