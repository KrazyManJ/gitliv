import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeViev.vue";
import LoginSuccessView from "@/views/LoginSuccessView.vue";
import RepositoryCommitsView from "@/views/RepositoryCommitsView.vue";
import { useGithubAuthStore } from "@/stores/githubAuth";
import CreateEditRepositoryView from "@/views/CreateEditRepositoryView.vue";
import RepositoriesView from "../views/RepositoriesView.vue";
import RepositoryView from "@/views/RepositoryView.vue";
import RepositoryPullRequestsView from "@/views/RepositoryPullRequestsView.vue";
import FileView from "@/views/FileView.vue";

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
            path: "/:username/repo/:name/:branch/:file/:sha",
            name: "File",
            component: FileView,
            meta: { requiresAuth: true },
            props: true
        },
        {
            path: "/:username/repo-view/:name/:branch?",
            name: "Repository",
            component: RepositoryView,
            meta: { requiresAuth: true },
        },
        {
            path: "/repos/:owner/:repo/commits/:branch",
            name: "Commits",
            component: RepositoryCommitsView,
            meta: { requiresAuth: true },
        },
        {
            path: "/create-repo",
            name: "Create a Repository",
            component: CreateEditRepositoryView,
            meta: { requiresAuth: true },
        },
        {
            path: "/repos/:repo/edit",
            name: "Edit a Repository",
            component: CreateEditRepositoryView,
            meta: { requiresAuth: true },
        },
        {
            path: '/repos/:owner/:repo/pull-requests',
            name: "pull-requests",
            component: RepositoryPullRequestsView,
            meta: { requiresAuth: true },
            props: true,
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
    }
    else {
        next();
    }
});

router.afterEach((to) => {
    if (to.name) document.title = `${to.name.toString()} | GitLiv`;
})

export default router;
