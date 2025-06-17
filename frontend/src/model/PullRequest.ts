export default interface PullRequest {
    id: number;
    number: number;
    title: string;
    user: { login: string; avatar_url: string };
    html_url: string;
    created_at: string;
    state: string;
    merged: boolean;
    mergeable: boolean | null;
    body: string;
    base: {
        ref: string; // target branch
    };
    head: {
        ref: string; // source branch
        sha: string; // head commit SHA
    };
}
