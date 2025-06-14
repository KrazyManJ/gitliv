import { defineStore } from "pinia";
import { reactive } from "vue";
import type GithubUser from "../model/GithubUser";
import type Repo from "../model/Repo";
import { api } from "@/api";

export const useGithubStore = defineStore("github", () => {

    const user = reactive<{ current: GithubUser | null }>({ current: null });
    const repos = reactive<Repo[]>([]);

    const fetchRepos = () => {
        api.get<Repo[]>(`user/repos`).then((response) => {
            repos.splice(0, repos.length);
            response.data
                .sort((a, b) => -a.pushed_at.localeCompare(b.pushed_at))
                .forEach((repo: Repo) => repos.push(repo));
        });
    }

    return { user, repos, fetchRepos };
});
