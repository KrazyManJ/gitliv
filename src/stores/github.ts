// import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import {reactive} from "vue";

export interface GithubUserData {
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
  updated_at: string
}


export const useGithubStore = defineStore('github', () => {

  const BASE_URL = 'https://api.github.com'
  const username = 'krazymanj'

  const user = reactive<GithubUser>({ user: null })
  const repos = reactive<Repo[]>([])

  axios.get(`${BASE_URL}/users/${username}`).then(response => {
    user.user = response.data
  })

  axios.get<Repo[]>(`${BASE_URL}/users/${username}/repos`).then(response => {
    repos.splice(0,repos.length)
    response.data
      .sort((a,b) => -a.updated_at.localeCompare(b.updated_at))
      .forEach((repo: Repo) => repos.push(repo))
  })

  return { user, repos }
})
