<script setup lang="ts">
import { api } from '@/api';
import type Repo from '@/model/Repo';
import { useLinguistStore } from '@/stores/linguist';
import { reactive } from 'vue';

interface LangBytesData {
    lang: string,
    bytes: number,
    color: string
}

const state = reactive<{
    totalBytes: number
    data: LangBytesData[]
}>({
    totalBytes: 0,
    data: []
})

    const {getLanguageData} = useLinguistStore()

    const fetchLangData = async () => {
        await api.get<Repo[]>("user/repos",{
            params: {
                visibility: "public"
            }
        }).then(async ({data: repos}) => {
            let sum = 0
            const langs: Record<string,number> = {}
            await Promise.all(
                repos.map(async repo => {
                    return await api.get<Record<string,number>>(repo.languages_url).then(({data}) => {
                        Object.entries(data).forEach(([lang,bytes]) => {
                            sum += bytes;
                            if (!langs[lang]) langs[lang] = 0;
                            langs[lang] += bytes;
                        })
                    })
                })
            )

            state.data = await Promise.all(
                Object.entries(langs)
                    .sort(([,a],[,b]) => b-a)
                    .map(async ([lang,bytes]) => ({lang:lang,bytes:bytes,color:(await getLanguageData(lang))?.color as string}))
            )
            state.totalBytes = sum
        })
    }

    fetchLangData()
</script>

<template>
    <div class="h-4 bg-zinc-500 rounded-full flex overflow-hidden">
        <div
            v-for="(data,index) in state.data"
            :key="index"
            :style="`width: ${data.bytes/state.totalBytes*100}%; background-color: ${data.color}`"
            class="h-full"
            :name="data.lang"
        />
    </div>
    <div class="columns-3 px-8">
        <div
            v-for="(data,index) in state.data"
            :key="index"
            class="flex items-center gap-2"
        >
            <div
                class="h-3 aspect-square rounded-full"
                :style="`background-color: ${data.color}`"
            />
            {{ data.lang }} ({{ (data.bytes/state.totalBytes*100).toFixed(2) }}%)
        </div>
    </div>
</template>
