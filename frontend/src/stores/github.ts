import { defineStore } from "pinia";
import {reactive, ref} from "vue";
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
    const treeHistory = ref<string[]>([])
    const isLoading = ref(true)
    const files = reactive<GitFileFromTree[]>([])
    const commits = reactive<Commit[]>([]);
    const pullRequests = reactive<PullRequest[]>([]);
    const fileData = reactive<{current: GitFileSingle | null}>({current: null})
    const repoData = reactive<{current: Repo | null}>({current: null})


    // const fetchBranchFromRepo = async (username: string, name: string) => {
    //     await api.get<Branch>(`/repos/${username}/${name}/branches/main`).then((response) => {
    //         branch.current = response.data
    //     });
    // }

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
        isLoading.value = true
        try {
            await api.get<Branch[]>(`/repos/${username}/${name}/branches`).then((response) => {
                branches.splice(0,branches.length)
                response.data.forEach((branch: Branch) => branches.push(branch))
            });
        }finally {
            isLoading.value = false
        }
    }

    const fetchFilesFromRepoFirst = async (username: string, name: string, branch: string) => {
        files.splice(0, files.length);
        isLoading.value = true;

        try {
            const { data } = await api.get<Branch>(`/repos/${username}/${name}/branches/${branch}`);
            const response = await api.get<GitTree>(data.commit.commit.tree.url);
            treeHistory.value.splice(0, treeHistory.value.length)
            treeHistory.value.push(response.data.sha)
            response.data.tree.forEach((file: GitFileFromTree) => files.push(file));
            console.log(response.data)
        } finally {
            isLoading.value = false;
        }
    };


    const fetchFilesFromRepo = async (username: string, name: string, treePath: string) => {
        files.splice(0, files.length)
        isLoading.value = true;
        try {
           const response = await api.get<GitTree>(`/repos/${username}/${name}/git/trees/${treePath}`)
            console.log(response.data)
            response.data.tree.forEach((file: GitFileFromTree) => files.push(file))

        } finally {
            isLoading.value = false
        }
    }


    const fetchRepo = async (owner:string, repo:string) => {
        repoData.current = null
           await api.get<Repo>(`/repos/${owner}/${repo}`).then((response) => {
                repoData.current = response.data
                console.log(`Fetched repo: ${response.data}`)
            })
    }


    const fetchRepos = () => {
        api.get<Repo[]>(`user/repos`).then((response) => {
            repos.splice(0, repos.length);
            console.log(response.data)
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
        head: string, // source branch
        base: string, // target branch
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

    const fetchCommitDetails = async (owner: string, repo: string, sha: string) => {
        try {
            const { data } = await api.get(`repos/${owner}/${repo}/commits/${sha}`);
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

    return { user: userNotOAuth, repos, commits, files, isLoading, treeHistory, branches, pullRequests,
        fileData, repoData, fetchRepos, fetchCommits, fetchFilesFromRepoFirst, fetchFilesFromRepo,
        fetchBranchesFromRepo, fetchPullRequests, createPullRequest, fetchBranches, fetchFile,
        fetchCommitDetails, fetchPullRequest, fetchPullRequestCommits, fetchPullRequestFiles,
        mergePullRequest, fetchRepo};
});
