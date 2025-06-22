<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useGithubAuthStore } from "@/stores/githubAuth";
import { useGithubStore } from "@/stores/github";
import { useModalStore } from '@/stores/modal';
import type Branch from "@/model/Branch.ts";

// Custom components
import Input from "@/components/Input.vue";
import Select from "@/components/Select.vue";
import Button from "@/components/Button.vue";

const props = defineProps<{
    owner: string;
    repo: string;
    branches: Branch[];
}>();

const emit = defineEmits<{
    (e: "created", prUrl: string): void;
}>();

const authStore = useGithubAuthStore();
const githubStore = useGithubStore();
const modalStore = useModalStore();

const fromBranch = ref("");
const toBranch = ref("");
const title = ref("");
const description = ref("");
const loading = ref(false);
const error = ref("");

// Initialize default branch selection when branches change
watch(() => props.branches, (branches) => {
    if (branches.length > 0) {
        fromBranch.value = branches[0].name;
        toBranch.value = branches[0].name;
    } else {
        fromBranch.value = "";
        toBranch.value = "";
    }
}, { immediate: true });

const branchNames = computed(() =>
    Object.fromEntries(props.branches.map((b) => [b.name ?? "unknown", b.name ?? "unknown"]))
);

async function createPullRequest() {
    if (!fromBranch.value || !toBranch.value || !title.value) return;

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
        modalStore.hideModal(); // Close modal on success
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

function cancel() {
    modalStore.hideModal();
}
</script>

<template>
    <div class="p-6 space-y-4" data-cy="pull-request-modal">
        <h2 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">Create a pull request</h2>

        <div class="flex items-center gap-2">
            <Select
                v-model="fromBranch"
                :label="'From branch'"
                :options="branchNames"
                blank-label="Source"
            />
            <span class="text-xl text-zinc-600">→</span>
            <Select
                v-model="toBranch"
                :label="'To branch'"
                :options="branchNames"
                blank-label="Destination"
            />
        </div>

        <Input
            v-model="title"
            label="Title"
            :rules="[(v) => !!v || 'Title is required']"
            placeholder="Pull request title"
        />

        <Input
            v-model="description"
            label="Description"
            placeholder="Description"
            type="textarea"
            rows="4"
        />

        <div class="flex justify-end gap-2">
            <Button @click="cancel" variant="normal"  data-cy="cancel-pr-button">Cancel</Button>
            <Button
                variant="primary"
                :loading="loading"
                :disabled="!fromBranch || !toBranch || !title"
                @click="createPullRequest"
            >
                Create
            </Button>
        </div>

        <p v-if="error" class="text-red-600 dark:text-red-400">{{ error }}</p>
    </div>
</template>
