<script setup lang="ts">
import { api } from '@/api';
import type Repo from '@/model/Repo';
import { useLinguistStore } from '@/stores/linguist';
import { reactive } from 'vue';
import LoadingTile from './LoadingTile.vue';
import LanguageIcon from './LanguageIcon.vue';

interface LangBytesData {
    lang: string,
    bytes: number,
    color: string
}

const state = reactive<{
    loading: boolean
    totalBytes: number
    data: LangBytesData[]
}>({
    loading: true,
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
        state.loading = false
    }

    fetchLangData()
</script>

<template>
    <div class="flex flex-col gap-2">
        <LoadingTile v-if="state.loading" class="h-4 bg-zinc-500 rounded-full flex overflow-hidden" />
        <div v-else class="h-4 bg-zinc-500 rounded-full flex overflow-hidden">
            <div
                v-for="(data,index) in state.data"
                :key="index"
                :style="`width: ${data.bytes/state.totalBytes*100}%; background-color: ${data.color}`"
                class="h-full"
                :name="data.lang"
            />
        </div>
        <div v-if="state.data.length === 0 && !state.loading" class="text-center italic text-zinc-500">No language data found</div>
        <div class="md:columns-2 lg:columns-3 px-8 gap-16 mt-10">
            <div
                v-for="(data,index) in state.data"
                :key="index"
                class="flex items-center gap-2 mb-2"
            >
                <span class="flex gap-2">
                    <LanguageIcon :language="data.lang"/>
                    {{ data.lang }}
                </span>
                <span class="grow"/>
                {{ (data.bytes/state.totalBytes*100).toFixed(2) }}%
            </div>
        </div>
    </div>
</template>
