import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

export type Theme = "dark" | "light" | "system";

const THEME_STORAGE_KEY = "theme";

export const initializeTheme = () => {
    (document.body as HTMLElement).classList.toggle(
        "dark",
        localStorage.theme === "dark" ||
            (!(THEME_STORAGE_KEY in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
};

export const useThemeStore = defineStore("theme", () => {
    const COLOR_SCHEME_MEDIA_SELECTOR = "(prefers-color-scheme: dark)";

    const theme = ref<Theme>(
        !localStorage.getItem(THEME_STORAGE_KEY)
            ? "system"
            : (localStorage.getItem(THEME_STORAGE_KEY) as Theme)
    );

    const systemIsDark = ref(window.matchMedia(COLOR_SCHEME_MEDIA_SELECTOR).matches);

    watch<Theme>(theme, (newTheme, oldTheme) => {
        if (!["dark", "light", "system"].includes(newTheme)) {
            theme.value = oldTheme;
            return;
        }
        if (newTheme === "system") {
            localStorage.removeItem(THEME_STORAGE_KEY);
        } else {
            localStorage.setItem(THEME_STORAGE_KEY, newTheme);
        }
        updateClass();
    });

    const isDark = computed<boolean>(() => {
        if (theme.value === "system") {
            return systemIsDark.value;
        }
        return theme.value === "dark";
    });

    const updateClass = () => {
        const element = document.body;
        if (!element) return;
        element.classList.toggle("dark", isDark.value);
    };

    window.matchMedia(COLOR_SCHEME_MEDIA_SELECTOR).addEventListener("change", (mediaQuery) => {
        if (theme.value !== "system") return;
        systemIsDark.value = mediaQuery.matches;
        updateClass();
    });

    return {
        /** Current theme as reference, can change value to change theme preferences */
        theme,
        /** Returns if current theme is a dark theme */
        isDark,
    };
});
