import type GitFileFromTree from "@/model/GitFileFromTree.ts";

export default interface GitTree {
    sha: string,
    tree: GitFileFromTree[]
}
