import "./styles/global.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import twMergeDirective from "tailwind-merge-vue-directive";
import { initializeTheme } from "./stores/theme";

import 'highlight.js/styles/github.css'
import 'highlight.js/styles/github-dark.css'
import 'highlight.js/lib/common';
import hljsVuePlugin from "@highlightjs/vue-plugin";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(twMergeDirective);
app.use(hljsVuePlugin)

initializeTheme();

app.mount("#app");
