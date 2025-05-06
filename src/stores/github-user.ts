// import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import {reactive} from "vue";

interface GithubUserData {
  name: string
  bio: string
  avatar_url: string
}

interface GithubUser {
  user: GithubUserData | null
}

export interface Repo {
  id: number
  name: string
  description: string
  language: string
}


export const useGithubUserStore = defineStore('githubUser', () => {

  const BASE_URL = 'https://api.github.com'
  const username = 'krazymanj'

  const user = reactive<GithubUser>({ user: null })
  const repos = reactive<Repo[]>([])

  axios.get(`${BASE_URL}/users/${username}`).then(response => {
    user.user = response.data
  })

  axios.get(`${BASE_URL}/users/${username}/repos`).then(response => {
    repos.splice(0,repos.length)
    response.data.forEach((repo: Repo) => repos.push(repo))
  })

  return { user, repos }
})
