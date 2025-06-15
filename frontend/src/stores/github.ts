import { defineStore } from "pinia";
import {reactive, ref} from "vue";
import type GithubUser from "../model/GithubUser";
import type Repo from "../model/Repo";
import { api } from "@/api";
import type Branch from "@/model/Branch.ts";
import type GitFile from "@/model/GitFile.ts";
import type GitTree from "@/model/GitTree.ts";
import type Commit from "@/model/Commit.ts";

export const useGithubStore = defineStore("github", () => {

    const userNotOAuth = reactive<{ current: GithubUser | null }>({ current: null });
    const repos = reactive<Repo[]>([]);
    const branches = reactive<Branch[]>([]);
    // const branch = reactive<{current: Branch | null}>({current: null})
    const treeHistory = ref<string[]>([])
    const isLoading = ref(true)
    const files = reactive<GitFile[]>([])
    const commits = reactive<Commit[]>([]);



    // const fetchBranchFromRepo = async (username: string, name: string) => {
    //     await api.get<Branch>(`/repos/${username}/${name}/branches/main`).then((response) => {
    //         branch.current = response.data
    //     });
    // }

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
            response.data.tree.forEach((file: GitFile) => files.push(file));
        } finally {
            isLoading.value = false;
        }
    };


    const fetchFilesFromRepo = async (username: string, name: string, treePath: string) => {
        files.splice(0, files.length)
        isLoading.value = true;
        try {
           const response = await api.get<GitTree>(`/repos/${username}/${name}/git/trees/${treePath}`)
            response.data.tree.forEach((file: GitFile) => files.push(file))
        } finally {
            isLoading.value = false
        }
    }



    const fetchRepos = () => {
        api.get<Repo[]>(`user/repos`).then((response) => {
            repos.splice(0, repos.length);
            response.data
                .sort((a, b) => -a.pushed_at.localeCompare(b.pushed_at))
                .forEach((repo: Repo) => repos.push(repo));
        });
    }

    const fetchCommits = (owner: string, repo: string) => {
        api.get<Commit[]>(`repos/${owner}/${repo}/commits`)
            .then(response => {
                console.log(response.data)
                commits.splice(0, commits.length);
                response.data.forEach(commit => commits.push(commit));
            });
    }

    return { user: userNotOAuth, repos, commits, files, isLoading, treeHistory, branches, fetchRepos, fetchCommits,
        fetchFilesFromRepoFirst, fetchFilesFromRepo, fetchBranchesFromRepo};
});
