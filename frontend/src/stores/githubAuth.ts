import type GithubOAuthUser from "@/model/GIthubOAuthUser";
import { defineStore } from "pinia";
import { ref } from "vue";
import Cookies from "js-cookie";
import type GithubUser from "@/model/GithubUser";
import { api, setBearerAuthToken } from "@/api";

const TOKEN_COOKIE_NAME = "auth_token";

export const useGithubAuthStore = defineStore("githubAuth", () => {

    const user = ref<GithubOAuthUser | null>()

    const redirectToGithubOAuth = () => {
window.location.href = `http://localhost:3001/github/login`
    }

    const loadUserFromCookies = async () => {
        const token = Cookies.get(TOKEN_COOKIE_NAME)
        if (!token) return;
        setBearerAuthToken(token)

        const {data} = await api.get<GithubUser>('/user');
        user.value = {
            avatar: data.avatar_url,
            token: token,
            username: data.login
        }
    }

    const processAuthData = (userData: GithubOAuthUser) => {
        Cookies.set(TOKEN_COOKIE_NAME, userData.token)
        user.value = userData
        setBearerAuthToken(userData.token)
    }

    const logout = () => {
        Cookies.remove(TOKEN_COOKIE_NAME)
        user.value = null
        setBearerAuthToken(null)
    }

    return {
        redirectToGithubOAuth,
        user,
        processAuthData,
        logout,
        loadUserFromCookies
    };
});
