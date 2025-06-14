import { defineStore } from "pinia";
import {reactive} from "vue";
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
    // const branch = reactive<{current: Branch | null}>({current: null})
    const files = reactive<GitFile[]>([])
    const commits = reactive<Commit[]>([]);

    // const fetchBranchFromRepo = async (username: string, name: string) => {
    //     await api.get<Branch>(`/repos/${username}/${name}/branches/main`).then((response) => {
    //         branch.current = response.data
    //     });
    // }



    const fetchFilesFromRepoFirst = (username: string, name: string, branch: string) => {
        api.get<Branch>(`/repos/${username}/${name}/branches/${branch}`)
            .then(({ data }) => {
                console.log(data.commit.commit.tree.url)
                return api.get<GitTree>(data.commit.commit.tree.url)
            })
            .then((response) => {
                files.splice(0, files.length)
                console.log(files)
                response.data.tree.forEach((file: GitFile) => files.push(file))
            })

        // api.get<GitTree>(`/repos/${username}/${name}/git/trees/${branch.current?.commit.commit.tree.url}`)
        //     .then((response) => {
        //     files.slice(0, files.length)
        //         console.log(files)
        //     response.data.tree.forEach((file: GitFile) => files.push(file))
        // });
    }

    const fetchFilesFromRepo = (username: string, name: string, treePath: string) => {
        api.get<GitTree>(`/repos/${username}/${name}/git/trees/${treePath}`)
            .then((response) => {
            files.splice(0, files.length)
                console.log(files)
            response.data.tree.forEach((file: GitFile) => files.push(file))
        });
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
                commits.splice(0, commits.length);
                response.data.forEach(commit => commits.push(commit));
            });
    }

    const fetchCommits = (owner: string, repo: string) => {
        api.get<Commit[]>(`repos/${owner}/${repo}/commits`)
            .then(response => {
                commits.splice(0, commits.length);
                response.data.forEach(commit => commits.push(commit));
            });
    }

    return { user: userNotOAuth, repos, commits, files, fetchRepos, fetchCommits, fetchFilesFromRepoFirst, fetchFilesFromRepo};
});
