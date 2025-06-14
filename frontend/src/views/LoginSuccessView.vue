<script setup lang="ts">
import { useGithubAuthStore } from '@/stores/githubAuth';
import { useRoute, useRouter } from 'vue-router';

    const { processAuthData } = useGithubAuthStore()

    const route = useRoute();
    const router = useRouter();

    const { token, username, avatar } = route.query;

    if (token && username && avatar) {
        processAuthData({
            token: token as string,
            username: username as string,
            avatar: avatar as string
        });
        router.replace('/')
    } else {
        console.error('Missing login information.');
        router.replace('/login');
    }

</script>

<template>
    <div>Redirecting...</div>
</template>
