export default interface PullRequest {
    id: number;
    title: string;
    user: { login: string; avatar_url: string };
    html_url: string;
    created_at: string;
    state: string;
    base: {
        ref: string; // target branch name
    };
}
