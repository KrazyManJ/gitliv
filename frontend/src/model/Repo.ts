export default interface Repo {
    id: number;
    name: string;
    description: string;
    language: string;
    svn_url: string;
    pushed_at: string;
    updated_at: string;
    svn_url: string;
    default_branch: string;
    owner: {
        login: string
    }
}
