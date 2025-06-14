export default interface Repo {
    id: number;
    name: string;
    description: string;
    language: string;
    updated_at: string;
    svn_url: string;
    default_branch: string;
    owner: {
        login: string
    }
}
