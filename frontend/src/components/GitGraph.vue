<template>
    <div class="p-2 rounded bg-white dark:bg-zinc-800 shadow-md">
        <div ref="gitGraphContainer" class="w-full h-full" />
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import type { PropType } from "vue";
import {
    createGitgraph,
    templateExtend,
    TemplateName,
    type Branch,
} from "@gitgraph/js";
import type Commit from "@/model/Commit.ts";

export default defineComponent({
    name: "GitGraph",
    props: {
        commitSpacing: {
            type: Number as PropType<number>,
            default: 115,
        },
        commits: {
            type: Array as PropType<Commit[]>,
            default: () => [],
        },
    },
    setup(props) {
        const gitGraphContainer = ref<HTMLElement | null>(null);

        const drawGraph = () => {
            if (!gitGraphContainer.value) return;
            gitGraphContainer.value.innerHTML = "";

            const gitgraph = createGitgraph(gitGraphContainer.value, {
                template: templateExtend(TemplateName.Metro, {
                    colors: ["#F87171", "#60A5FA", "#34D399", "#FBBF24"],
                    branch: {
                        lineWidth: 4,
                        spacing: 40,
                        label: { display: false },
                    },
                    commit: {
                        spacing: props.commitSpacing,
                        dot: { size: 8 },
                        message: { display: false },
                    },
                }),
            });

            const branches = new Map<string, Branch>();
            const commitMap = new Map<string, { branch: Branch; sha: string }>();
            const mainBranch = gitgraph.branch("main");
            branches.set("main", mainBranch);

            // Topological sort
            const commitsBySha = new Map(props.commits.map((c) => [c.sha, c]));
            const visited = new Set<string>();
            const sortedCommits: Commit[] = [];

            function visit(commit: Commit) {
                if (visited.has(commit.sha)) return;
                visited.add(commit.sha);
                for (const parent of commit.parents ?? []) {
                    const parentCommit = commitsBySha.get(parent.sha);
                    if (parentCommit) visit(parentCommit);
                }
                sortedCommits.push(commit);
            }

            for (const commit of props.commits) visit(commit);

            // Draw commits
            for (const commit of sortedCommits) {
                const sha = commit.sha;
                const parents = commit.parents ?? [];

                const firstParentSha = parents[0]?.sha;
                const branchName =
                    (commit as Commit & { firstSeenOn?: string }).firstSeenOn ??
                    commit.branch?.[0] ??
                    "main";

                let branch: Branch;

                if (branches.has(branchName)) {
                    branch = branches.get(branchName)!;
                } else {
                    // Base new branch off first parent if available
                    let fromBranch = mainBranch;
                    if (firstParentSha && commitMap.has(firstParentSha)) {
                        fromBranch = commitMap.get(firstParentSha)!.branch;
                    }
                    branch = fromBranch.branch(branchName);
                    branches.set(branchName, branch);
                }

                // Add commit to branch
                branch.commit({
                    subject: commit.commit.message,
                    hash: sha.slice(0, 7),
                });

                // Handle merges from second+ parents
                for (let i = 1; i < parents.length; i++) {
                    const mergeFromSha = parents[i].sha;
                    const mergeFromBranch = commitMap.get(mergeFromSha)?.branch;
                    if (mergeFromBranch && mergeFromBranch !== branch) {
                        branch.merge(mergeFromBranch);
                    }
                }

                // Track the commit
                commitMap.set(sha, { branch, sha });
            }
        };

        onMounted(drawGraph);
        watch(() => props.commitSpacing, drawGraph);
        watch(() => props.commits, drawGraph, { deep: true });

        return { gitGraphContainer };
    },
});
</script>
