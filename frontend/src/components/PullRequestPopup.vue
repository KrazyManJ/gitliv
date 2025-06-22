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
import { usePopupStore } from '@/stores/popup'; // import popup store

const popupStore = usePopupStore();

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
    // no need to reset error.value anymore
    // error.value = "";

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
        let message = "Failed to create pull request.";

        if (
            typeof err === "object" &&
            err !== null &&
            "response" in err &&
            typeof (err as { response?: unknown }).response === "object" &&
            (err as { response?: { status?: unknown } }).response !== null
        ) {
            const response = (err as { response: { status?: unknown } }).response;
            const status = typeof response.status === "number" ? response.status : undefined;

            if (status === 422) {
                message = "Invalid input. Please check your data and try again.";
            } else if (status === 403) {
                message = "Access denied. You might not have permissions.";
            } else if (status === 404) {
                message = "Repository not found.";
            } else if (
                "message" in err &&
                typeof (err as { message?: unknown }).message === "string"
            ) {
                message = (err as { message: string }).message;
            }
        } else if (err instanceof Error) {
            message = err.message || message;
        }

        popupStore.showPopup("error", message);

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
    </div>
</template>
