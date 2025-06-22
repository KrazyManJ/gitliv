import type GithubOAuthUser from "@/model/GIthubOAuthUser";
import { defineStore } from "pinia";
import { ref } from "vue";
import Cookies from "js-cookie";
import type GithubUser from "@/model/GithubUser";
import { api, setBearerAuthToken } from "@/api";

const TOKEN_COOKIE_NAME = "auth_token";

export const useGithubAuthStore = defineStore("githubAuth", () => {

    const user = ref<GithubOAuthUser | null>()
    const loading = ref<boolean>(false)

    const redirectToGithubOAuth = () => {
        const hostname = window.location.hostname
        const newPort = '3001'
        const newPath = '/github/login'

        window.location.href = `http://${hostname}:${newPort}${newPath}`
    }

    const loadUserFromCookies = async () => {
        const token = Cookies.get(TOKEN_COOKIE_NAME)
        if (!token) return true;
        setBearerAuthToken(token)

        try {
            loading.value = true
            const {data} = await api.get<GithubUser>('/user').catch();
            user.value = {
                avatar: data.avatar_url,
                token: token,
                username: data.login
            }
            loading.value = false
        } catch {
            return false
        }
        return true
    }

    const isAuthenticated = (): boolean => {
        return Cookies.get(TOKEN_COOKIE_NAME) != undefined
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
        loading,
        processAuthData,
        logout,
        loadUserFromCookies,
        isAuthenticated
    };
});
