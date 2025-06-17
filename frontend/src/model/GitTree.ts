import type GitFile from "@/model/GitFile.ts";

export default interface GitTree {
    sha: string,
    tree: GitFile[]
}
