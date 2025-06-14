import { defineStore } from "pinia";
import { reactive } from "vue";
import type GithubUser from "../model/GithubUser";
import type Repo from "../model/Repo";
import { api } from "@/api";
import type Commit from "@/model/Commit.ts";

export const useGithubStore = defineStore("github", () => {

    const user = reactive<{ current: GithubUser | null }>({ current: null });
    const repos = reactive<Repo[]>([]);
    const commits = reactive<Commit[]>([]);

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

    return { user, repos, commits, fetchRepos, fetchCommits };
});
