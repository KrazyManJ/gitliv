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
    branch?: string[];              // All branches this commit appears on
    firstSeenOn?: string;           // Branch we first encountered this commit from
    parents: { sha: string }[];
    files: {
        filename: string;
        status: 'added' | 'modified' | 'removed';
        sha: string;
        additions: number;
        deletions: number;
        changes: number;
        patch?: string;
    }[];
}
