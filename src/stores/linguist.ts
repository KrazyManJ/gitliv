import axios from "axios";
import { defineStore } from "pinia";
import * as yaml from 'js-yaml'
import type LinguistLanguage from "@/model/LinguistLanguage";

export const useLinguistStore = defineStore('linguist', () => {

    const URL = 'https://raw.githubusercontent.com/github-linguist/linguist/refs/heads/main/lib/linguist/languages.yml'

    type LinguistLanguageDictionary = Record<string,LinguistLanguage>

    let languages: LinguistLanguageDictionary | null = null

    const fetchLanguages = async () => {
        return await axios.get(URL)
            .then(response => {
                languages = yaml.load(response.data) as LinguistLanguageDictionary
            })
    }

    const getLanguageData = async (id: string): Promise<LinguistLanguage | undefined> => {
        if (!languages){
            await fetchLanguages()
        }
        return (languages as LinguistLanguageDictionary)[id]
    }

    return { getLanguageData }
})
