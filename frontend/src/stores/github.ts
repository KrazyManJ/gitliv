// import { ref, computed, reactive } from 'vue'
import { defineStore } from "pinia";
import axios from "axios";
import { reactive } from "vue";
import type GithubUser from "../model/GithubUser";
import type Repo from "../model/Repo";

export const useGithubStore = defineStore("github", () => {

    const BASE_URL = "https://api.github.com";
    const username = "krazymanj";

    const user = reactive<{ current: GithubUser | null }>({ current: null });
    const repos = reactive<Repo[]>([]);

    axios.get<GithubUser | null>(`${BASE_URL}/users/${username}`).then((response) => {
        user.current = response.data;
    });

    axios.get<Repo[]>(`${BASE_URL}/users/${username}/repos`).then((response) => {
        repos.splice(0, repos.length);
        response.data
            .sort((a, b) => -a.updated_at.localeCompare(b.updated_at))
            .forEach((repo: Repo) => repos.push(repo));
    });

    return { user, repos };
});
