import type GitFile from "@/model/GitFile.ts";

export default interface GitTree {
    tree: GitFile[]
}
