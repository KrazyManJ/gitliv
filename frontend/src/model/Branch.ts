export default interface Branch {
    name: string
    commit: {
        commit: {
            tree: {
                url: string
            }
        }
    }
}
