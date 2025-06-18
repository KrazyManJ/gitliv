export default interface Repo {
    id: number;
    name: string;
    description: string;
    language: string;
    svn_url: string;
    pushed_at: string;
    updated_at: string;
    default_branch: string;
    languages_url: string;
    owner: {
        login: string
    };
    visibility: "public" | "private"
}
