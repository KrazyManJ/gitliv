<script setup lang="ts">
import { useThemeStore } from "@/stores/theme";
import { MonitorSmartphone, Moon, Sun } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import Tile from "./Tile.vue";

const { theme } = storeToRefs(useThemeStore());

const themeDef = {
    dark: Moon,
    light: Sun,
    system: MonitorSmartphone,
};
</script>

<template>
    <Tile class="flex flex-col gap-4">
        <h1 class="text-xl">Theme setting</h1>
        <div class="flex gap-4">
            <Tile
                v-for="(Icon, themeVal) of themeDef"
                :key="themeVal"
                class="flex flex-col grow basis-1 items-center gap-2 cursor-pointer"
                @click="() => (theme = themeVal)"
                variant="secondary"
            >
                <component :is="Icon" :size="48" />
                <div>
                    {{ themeVal[0].toLocaleUpperCase() + themeVal.substring(1) }}
                    <span v-if="theme === themeVal" class="dark:text-zinc-400 font-light">
                        (current)
                    </span>
                </div>
            </Tile>
        </div>
    </Tile>
</template>
