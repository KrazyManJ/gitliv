<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useGithubAuthStore } from "@/stores/githubAuth";
import { useGithubStore } from "@/stores/github";
import type Branch from "@/model/Branch.ts";

const props = defineProps<{
    owner: string;
    repo: string;
    show: boolean;
    branches: Branch[];      // <-- new prop
}>();

const emit = defineEmits<{
    (e: "close"): void;
    (e: "created", prUrl: string): void;
}>();

const authStore = useGithubAuthStore();
const githubStore = useGithubStore();

const fromBranch = ref("");
const toBranch = ref("");
const title = ref("");
const description = ref("");
const loading = ref(false);
const error = ref("");

const token = computed(() => authStore.user?.token ?? "");

// Watch for popup show toggle, reset fields and set defaults from props.branches
watch(
    () => props.show,
    (newVal) => {
        if (newVal) {
            // Use props.branches instead of fetching again
            if (props.branches.length > 0) {
                fromBranch.value = props.branches[0].name;
                toBranch.value = props.branches[0].name;
            } else {
                fromBranch.value = "";
                toBranch.value = "";
            }

            title.value = "";
            description.value = "";
            error.value = "";
        }
    }
);

const branchNames = computed(() =>
    props.branches.map((b: Branch) => b.name ?? "unknown")
);

async function createPullRequest() {
    if (!fromBranch.value || !toBranch.value || !title.value || !token.value) return;

    loading.value = true;
    error.value = "";

    try {
        const pr = await githubStore.createPullRequest(
            props.owner,
            props.repo,
            title.value,
            fromBranch.value,
            toBranch.value,
            description.value
        );
        emit("created", pr.html_url);
        emit("close");
    } catch (err: unknown) {
        if (err instanceof Error) {
            error.value = err.message;
        } else {
            error.value = "Failed to create pull request.";
        }
        console.error(err);
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div v-if="show"  class="fixed inset-0 flex items-center justify-center z-50"
         style="background-color: rgba(0, 0, 0, 0.5);">
        <div class="bg-white dark:bg-zinc-800 p-6 rounded-lg w-full max-w-lg space-y-4">
            <h2 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">Create a pull request</h2>

            <div class="flex items-center gap-2">
                <select v-model="fromBranch" class="flex-1 p-2 rounded border dark:bg-zinc-700 dark:text-white">
                    <option disabled value="">From branch</option>
                    <option v-for="b in branchNames" :key="b" :value="b">{{ b }}</option>
                </select>
                <span class="text-xl text-zinc-600">→</span>
                <select v-model="toBranch" class="flex-1 p-2 rounded border dark:bg-zinc-700 dark:text-white">
                    <option disabled value="">To branch</option>
                    <option v-for="b in branchNames" :key="b" :value="b">{{ b }}</option>
                </select>
            </div>

            <input
                v-model="title"
                placeholder="Pull request title"
                class="w-full p-2 rounded border dark:bg-zinc-700 dark:text-white"
            />
            <textarea
                v-model="description"
                placeholder="Description"
                rows="4"
                class="w-full p-2 rounded border dark:bg-zinc-700 dark:text-white"
            ></textarea>

            <div class="flex justify-end gap-2">
                <button @click="emit('close')" class="px-4 py-2 rounded bg-gray-300 dark:bg-zinc-600">Cancel</button>
                <button
                    :disabled="!fromBranch || !toBranch || !title || loading"
                    @click="createPullRequest"
                    class="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
                >
                    {{ loading ? "Creating..." : "Create" }}
                </button>
            </div>

            <p v-if="error" class="text-red-600 dark:text-red-400">{{ error }}</p>
        </div>
    </div>
</template>
