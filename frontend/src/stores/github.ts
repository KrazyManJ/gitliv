// import { ref, computed, reactive } from 'vue'
import { defineStore } from "pinia";
import { reactive } from "vue";
import type GithubUser from "../model/GithubUser";
import type Repo from "../model/Repo";
import { api } from "@/api";

export const useGithubStore = defineStore("github", () => {

    const user = reactive<{ current: GithubUser | null }>({ current: null });
    const repos = reactive<Repo[]>([]);

    // axios.get<GithubUser | null>(`${BASE_URL}/users/${username}`).then((response) => {
    //     user.current = response.data;
    // });

    const fetchRepos = () => {
        api.get<Repo[]>(`user/repos`,{
            params: {
                // visibility: "private"
            }
        }).then((response) => {
            repos.splice(0, repos.length);
            console.log(response)
            response.data
                .sort((a, b) => -a.updated_at.localeCompare(b.updated_at))
                .forEach((repo: Repo) => repos.push(repo));
        });
    }


    return { user, repos, fetchRepos };
});
