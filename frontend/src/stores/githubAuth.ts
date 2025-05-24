import Config from "@/config";
import { defineStore } from "pinia";

export const useGithubAuthStore = defineStore("githubAuth", () => {
    const CLIENT_ID = Config.githubClientId;
    const CLIENT_SECRET = Config.githubClientSecret;



    return {};
});
