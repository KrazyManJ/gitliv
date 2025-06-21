<script setup lang="ts">

import { useGithubAuthStore } from '@/stores/githubAuth';
import { useRouter } from 'vue-router';
import { LucideChevronDown, LucideChevronUp, LucideLogOut, LucideSettings } from 'lucide-vue-next';
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import Tile from './Tile.vue';
import ThemePicker from './ThemePicker.vue';

const authStore = useGithubAuthStore()
const router = useRouter()

const logout = () => {
    authStore.logout()
    router.push("/")
}

const menuOpened = ref(false)

const button = useTemplateRef("button")
const rightSide = useTemplateRef("rightSide")

const handleOutsideClick = (event: MouseEvent) => {
    if (event.target != button.value && !rightSide.value?.contains(event.target as HTMLElement))
        menuOpened.value = false
}

onMounted(() => window.addEventListener('click', handleOutsideClick))
onUnmounted(() => window.removeEventListener('click', handleOutsideClick))

</script>
<template>
    <div class="max-w-7xl mx-auto p-4" v-tw-merge>
        <div class="flex items-center">
            <RouterLink to="/">
                <div class="flex items-center gap-4">
                    <img src="/icon.svg" width="32" height="32">
                    <span class="font-mono font-black text-xl">GitLiv</span>
                </div>
            </RouterLink>

            <div class="grow"/>

            <div
                class="flex items-center gap-8 relative"
                ref="rightSide"
            >
                <div
                    data-cy="dropDown"
                    class="flex items-center gap-2"
                    ref="button"
                    @click="() => menuOpened = !menuOpened"
                    v-if="authStore.user"
                >
                    <span class="font-mono font-light text-sm">{{ authStore.user.username }}</span>
                    <img :src="authStore.user.avatar" width="32" height="32" class="rounded-full">
                    <LucideChevronUp v-if="!menuOpened" :size="16"/>
                    <LucideChevronDown v-else :size="16"/>
                </div>
                <div
                    v-else
                    @click="() => menuOpened = !menuOpened"
                    class="cursor-pointer"
                >
                    <LucideSettings/>
                </div>

                <div
                    v-if="menuOpened"
                    class="absolute top-[100%] right-0 mt-2 select-none"
                >
                    <Tile class="p-0 shadow-xl overflow-hidden">
                        <ThemePicker class="dark:not-last:border-b-zinc-700 not-last:border-b-zinc-200 not-last:border-b-1"/>
                        <div
                            data-cy="logout"
                            v-if="authStore.user"
                            @click="logout"
                            class="flex p-2 gap-3 px-4 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                        >
                            <span class="text-red-500">
                                Logout
                            </span>
                            <div class="grow"></div>
                            <LucideLogOut class="stroke-red-500"/>
                        </div>
                    </Tile>
                </div>
            </div>
        </div>
    </div>
</template>
