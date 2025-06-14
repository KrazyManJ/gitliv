import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeViev.vue";
import LoginSuccessView from "@/views/LoginSuccessView.vue";
import RepositoryCommitsView from "@/views/RepositoryCommitsView.vue";
import { useGithubAuthStore } from "@/stores/githubAuth";
import CreateRepository from "@/views/CreateRepository.vue";
import RepositoriesView from "../views/RepositoriesView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "Home",
            component: HomeView,
            meta: { prohibitsAuth: true }
        },
        {
            path: "/repositories",
            name: "Repositories",
            component: RepositoriesView,
            meta: { requiresAuth: true }
        },
        {
            path: "/login-success",
            name: "Redirecting",
            component: LoginSuccessView,
        },
        {
            path: '/repos/:owner/:repo/commits',
            name: "commits",
            component: RepositoryCommitsView,
            meta: { requiresAuth: true },
        },
        {
            path: "/create-repo",
            name: "Create a Repository",
            component: CreateRepository,
            meta: { requiresAuth: true },
        }
    ],
});

router.beforeEach((to, from, next) => {

    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const prohibitsAuth = to.matched.some((record) => record.meta.prohibitsAuth);


    const { isAuthenticated } = useGithubAuthStore();

    if (requiresAuth && !isAuthenticated()) {
        next("/")
    }
    else if (prohibitsAuth && isAuthenticated()) {
        next("/repositories")
        console.log("Authorized, to repositories")
    }
    else {
        next();
    }


});

router.afterEach((to) => {
    if (to.name) document.title = `${to.name.toString()} | GitLiv`;
})

export default router;
