export default interface PullRequestFile {
    sha: string;
    filename: string;
    status: "added" | "modified" | "removed" | string;
    additions: number;
    deletions: number;
    changes: number;
    patch?: string;         // the diff patch text
    blob_url: string;
    raw_url: string;
    contents_url: string;
    // ...any other fields you might want
}
