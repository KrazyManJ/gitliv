export default interface Commit {
    sha: string;
    commit: {
        message: string;
        author: {
            name: string;
            email: string;
            date: string;
        };
    };
    author: {
        login: string;
        avatar_url: string;
    } | null;

    branch?: string;
}
