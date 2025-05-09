import "./styles/global.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import twMergeDirective from "tailwind-merge-vue-directive";
import { initializeTheme } from "./stores/theme";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(twMergeDirective);

initializeTheme();

app.mount("#app");
