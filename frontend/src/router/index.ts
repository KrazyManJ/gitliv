import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginSuccessView from "@/views/LoginSuccessView.vue";
import { useGithubAuthStore } from "@/stores/githubAuth";
import CreateRepository from "@/views/CreateRepository.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "KrazyManJ Repo",
            component: HomeView,
        },
        {
            path: "/login-success",
            name: "Redirecting",
            component: LoginSuccessView,
        },
        {
            path: "/create-repo",
            name: "Create a Repository",
            component: CreateRepository,
            meta: { requiresAuth: true },
        }
        // {
        //   path: '/about',
        //   name: 'about',
        //   // route level code-splitting
        //   // this generates a separate chunk (About.[hash].js) for this route
        //   // which is lazy-loaded when the route is visited.
        //   component: () => import('../views/AboutView.vue'),
        // },
    ],
});

router.beforeEach((to, from, next) => {
    if (to.name) document.title = `${to.name.toString()} | GitLiv`;

    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const { isAuthenticated } = useGithubAuthStore();

    if (requiresAuth && !isAuthenticated()) {
        next("/")
    } else {
        next();
    }
});

export default router;
