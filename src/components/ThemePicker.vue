<script setup lang="ts">
import { useThemeStore } from "@/stores/theme";
import { MonitorSmartphone, Moon, Sun } from "lucide-vue-next";
import { storeToRefs } from "pinia";

const { theme } = storeToRefs(useThemeStore());

const themeDef = {
    dark: Moon,
    light: Sun,
    system: MonitorSmartphone,
};
</script>

<template>
    <div
        class="dark:bg-zinc-800 border border-zinc-300 bg-zinc-50 dark:border-zinc-600 rounded-2xl p-8 flex flex-col gap-4"
    >
        <h1 class="text-xl">Theme setting</h1>
        <div class="flex gap-4">
            <button
                type="button"
                v-for="(Icon, themeVal) of themeDef"
                :key="themeVal"
                class="dark:bg-zinc-700 border dark:border-zinc-600 grow basis-1 p-2 flex flex-col items-center gap-2 rounded-xl border-zinc-300 bg-zinc-100 py-6"
                @click="() => (theme = themeVal)"
            >
                <component :is="Icon" :size="48" />
                <div>
                    {{ themeVal[0].toLocaleUpperCase() + themeVal.substring(1) }}
                    <span v-if="theme === themeVal" class="dark:text-zinc-400 font-light">
                        (current)
                    </span>
                </div>
            </button>
        </div>
    </div>
</template>

<style scoped>
.lolec {
    width: 0;
    transition: width 1s;
}

.btn:hover .lolec {
    width: 100px;
}
</style>
