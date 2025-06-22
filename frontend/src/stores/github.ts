import { defineStore } from "pinia";
import {reactive, ref } from "vue";
import type GithubUser from "../model/GithubUser";
import type Repo from "../model/Repo";
import { api } from "@/api";
import type Branch from "@/model/Branch.ts";
import type GitFileFromTree from "@/model/GitFileFromTree.ts";
import type GitTree from "@/model/GitTree.ts";
import type Commit from "@/model/Commit.ts";
import type PullRequest from "@/model/PullRequest.ts";
import type GitFileSingle from "@/model/GitFileSingle.ts";
import type PullRequestFile from "@/model/PullRequestFile.ts";

export const useGithubStore = defineStore("github", () => {

    const userNotOAuth = reactive<{ current: GithubUser | null }>({ current: null });
    const repos = reactive<Repo[]>([]);
    const branches = reactive<Branch[]>([]);
    const isLoading = ref(true)
    const isLoadingBranches = ref(false);
    const isLoadingFiles = ref(false);
    const files = reactive<GitFileFromTree[]>([])
    const commits = reactive<Commit[]>([]);
    const pullRequests = reactive<PullRequest[]>([]);
    const fileData = reactive<{current: GitFileSingle | null}>({current: null})
    const repoData = reactive<{current: Repo | null}>({current: null})
    const hasLoadedOnce = ref(false);

    const fetchFile = async (file: string, username: string, name: string) => {
        fileData.current = null
        isLoading.value = true
        try {
            await api.get<GitFileSingle>(`/repos/${username}/${name}/git/blobs/${file}`).then((response) => {
                fileData.current = response.data
            });
        }finally {
            isLoading.value = false
        }
    }

    const fetchBranchesFromRepo = async (username: string, name: string) => {
        isLoadingBranches.value = true;
        try {
            const response = await api.get<Branch[]>(`/repos/${username}/${name}/branches`);
            branches.splice(0, branches.length);
            response.data.forEach((branch: Branch) => branches.push(branch));
        } finally {
            isLoadingBranches.value = false;
        }
    };

    const fetchFilesFromBranchRoot = async (username: string, name: string, branch: string) => {
        files.splice(0, files.length);
        isLoadingFiles.value = true;
        hasLoadedOnce.value = false;
        try {
            const { data: branchData } = await api.get<Branch>(`/repos/${username}/${name}/branches/${branch}`);
            const response = await api.get<GitTree>(branchData.commit.commit.tree.url);
            response.data.tree.forEach((file: GitFileFromTree) => files.push(file));
        } finally {
            isLoadingFiles.value = false;
            hasLoadedOnce.value = true;
        }
    };

    const fetchFilesFromRepo = async (username: string, name: string, treePath: string) => {
        files.splice(0, files.length);
        isLoadingFiles.value = true;
        try {
            const response = await api.get<GitTree>(`/repos/${username}/${name}/git/trees/${treePath}`);
            response.data.tree
            .sort((a, b) => {
                // First, folders before files
                if (a.type === 'tree' && b.type !== 'tree') return -1;
                if (a.type !== 'tree' && b.type === 'tree') return 1;

                // Then, alphabetical by path
                return a.path.localeCompare(b.path);
            })
            .forEach((file: GitFileFromTree) => {
                files.push(file)
            });
        } finally {
            isLoadingFiles.value = false;
        }
    };

    const resolvePathToTreeSha = async (username: string, name: string, branch: string, path: string) => {
        const { data: branchData } = await api.get<Branch>(`/repos/${username}/${name}/branches/${branch}`);

        const treeUrl = branchData.commit.commit.tree.url;
        const { data: rootTree } = await api.get<GitTree>(treeUrl);
        let currentSha = rootTree.sha;

        if (!path) return currentSha;

        const segments = path.split("/").filter(Boolean);

        for (const segment of segments) {
            const { data } = await api.get<GitTree>(`/repos/${username}/${name}/git/trees/${currentSha}`);
            const found = data.tree.find((item: GitFileFromTree) => item.path === segment && item.type === "tree");

            if (!found) throw new Error(`Path segment "${segment}" not found.`);

            currentSha = found.sha;
        }

        return currentSha;
    };


    // const fetchRepoZip = async (owner: string, repo: string) => {
    //     await api.get(`/repos/${owner}/${repo}/zipball`).then((response) => {
    //         console.log(response.data)
    //     })
    // }


    const fetchRepo = async (owner:string, repo:string) => {
        repoData.current = null
        await api.get<Repo>(`/repos/${owner}/${repo}`).then((response) => {
            repoData.current = response.data
        })
    }


    const fetchRepos = async () => {
        await api.get<Repo[]>(`user/repos`).then((response) => {
            repos.splice(0, repos.length);
            response.data
                .sort((a, b) => -a.pushed_at.localeCompare(b.pushed_at))
                .forEach((repo: Repo) => repos.push(repo));
        });
    }

    const fetchCommits = async (owner: string, repo: string) => {
        const { data: branches } = await api.get<{ name: string }[]>(`repos/${owner}/${repo}/branches`);

        const allCommits: Commit[] = [];

        for (const branch of branches) {
            const { data: branchCommits } = await api.get<Commit[]>(
                `repos/${owner}/${repo}/commits?sha=${branch.name}&per_page=100`
            );

            for (const commit of branchCommits) {
                if (!commit.branch) commit.branch = [];
                commit.branch.push(branch.name);
            }

            allCommits.push(...branchCommits);
        }

        // Deduplicate and merge branch arrays; assign firstSeenOn for the branch first encountered on
        const commitMap = new Map<string, Commit>();

        for (const commit of allCommits) {
            if (commitMap.has(commit.sha)) {
                const existing = commitMap.get(commit.sha)!;
                existing.branch = [...new Set([...(existing.branch ?? []), ...(commit.branch ?? [])])];
            } else {
                // Mark the branch where this commit was first seen
                if (commit.branch && commit.branch.length > 0) {
                    (commit as Commit & { firstSeenOn?: string }).firstSeenOn = commit.branch[0];
                }
                commitMap.set(commit.sha, commit);
            }
        }

        const uniqueCommits = Array.from(commitMap.values());

        commits.splice(0, commits.length, ...uniqueCommits);
    };


    const fetchPullRequests = (owner: string, repo: string) => {
        api.get<PullRequest[]>(`repos/${owner}/${repo}/pulls`)
            .then(response => {
                pullRequests.splice(0, pullRequests.length);
                response.data.forEach(pr => pullRequests.push(pr));
            })
            .catch(error => {
                console.error('Failed to fetch pull requests:', error);
            });
    };


    const fetchBranches = (owner: string, repo: string) => {
        api.get<Branch[]>(`/repos/${owner}/${repo}/branches`)
            .then(response => {
                branches.splice(0, branches.length);
                response.data.forEach(branch => branches.push(branch));
            })
            .catch(error => {
                console.error("Failed to fetch branches:", error);
            });
    };



    const createPullRequest = async (
        owner: string,
        repo: string,
        title: string,
        head: string,
        base: string,
        body?: string
    ) => {
        try {
            const response = await api.post<PullRequest>(`/repos/${owner}/${repo}/pulls`, {
                title,
                head,
                base,
                body
            });

            // Add the new PR to your list or re-fetch:
            pullRequests.unshift(response.data);
            return response.data;

        } catch (error) {
            console.error("Failed to create pull request:", error);
            throw error;
        }
    };

    const fetchCommitDetails = async (owner: string, repo: string, branch: string,sha: string) => {
        try {
            const { data } = await api.get(`repos/${owner}/${repo}/${branch}/commits/${sha}`);
            return data;
        } catch (error) {
            console.error("Failed to fetch commit details:", error);
            throw error;
        }
    };

    const fetchPullRequestCommits = async (owner: string, repo: string, prNumber: number) => {
        try {
            const { data } = await api.get<Commit[]>(`repos/${owner}/${repo}/pulls/${prNumber}/commits`);
            return data; // return commit array for the PR
        } catch (error) {
            console.error('Failed to fetch PR commits:', error);
            throw error;
        }
    };

    const fetchPullRequest = async (owner: string, repo: string, prNumber: number) => {
        try {
            const { data } = await api.get<PullRequest>(`repos/${owner}/${repo}/pulls/${prNumber}`);
            return data;
        } catch (error) {
            console.error("Failed to fetch pull request:", error);
            throw error;
        }
    };


    const fetchPullRequestFiles = async (owner: string, repo: string, prNumber: number) => {
        try {
            const { data } = await api.get<PullRequestFile[]>(`repos/${owner}/${repo}/pulls/${prNumber}/files`);
            return data; // return files changed in the PR
        } catch (error) {
            console.error('Failed to fetch PR files:', error);
            throw error;
        }
    };

    const mergePullRequest = async (owner: string, repo: string, prNumber: number) => {
        try {
            const { data } = await api.put(`repos/${owner}/${repo}/pulls/${prNumber}/merge`);
            return data; // you could return `merged`, `message`, etc.
        } catch (error) {
            console.error("Failed to merge pull request:", error);
            throw error;
        }
    };

    return { user: userNotOAuth, repos, commits, files, isLoading, branches, pullRequests,
        fileData, repoData, hasLoadedOnce,  isLoadingBranches,
        isLoadingFiles, fetchRepos, fetchCommits, fetchFilesFromRepo,
        fetchBranchesFromRepo, fetchPullRequests, createPullRequest, fetchBranches, fetchFile,
        fetchCommitDetails, fetchPullRequest, fetchPullRequestCommits, fetchPullRequestFiles,
        mergePullRequest, fetchRepo, fetchFilesFromBranchRoot, resolvePathToTreeSha};
});
