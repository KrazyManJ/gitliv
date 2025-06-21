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
    <div class="flex gap-2 p-2">
        <Tile
            v-for="(Icon, themeVal) of themeDef"
            :key="themeVal"
            :class='[
                "flex p-1 flex-col items-center justify-center gap-1 cursor-pointer w-16 h-16",
                {
                    "bg-zinc-300 dark:bg-zinc-500": theme == themeVal
                }
            ]'
            :data-cy="themeVal"
            @click="() => (theme = themeVal)"
            variant="secondary"
        >
            <component :is="Icon" :size="24" />
            <div class="text-xs">
                {{ themeVal[0].toLocaleUpperCase() + themeVal.substring(1) }}
            </div>
        </Tile>
    </div>
</template>
