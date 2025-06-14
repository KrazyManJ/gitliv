<template>
    <div class="p-2 rounded bg-white dark:bg-zinc-800 shadow-md">
        <div ref="gitGraphContainer" class="w-full h-full" />
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import type { PropType } from "vue";
import { createGitgraph, templateExtend, TemplateName } from "@gitgraph/js";

export default defineComponent({
    name: "GitGraph",
    props: {
        commitSpacing: {
            type: Number as PropType<number>,
            default: 115, // fallback if not provided
        },
    },
    setup(props) {
        const gitGraphContainer = ref<HTMLElement | null>(null);

        const drawGraph = () => {
            if (!gitGraphContainer.value) return;

            // Clear previous graph (important when redrawing)
            gitGraphContainer.value.innerHTML = "";

            const gitgraph = createGitgraph(gitGraphContainer.value, {
                template: templateExtend(TemplateName.Metro, {
                    colors: ["#F87171", "#60A5FA", "#34D399", "#FBBF24"],
                    branch: {
                        lineWidth: 4,
                        spacing: 40,
                        label: { display: false },
                    },
                    commit: {
                        spacing: props.commitSpacing,
                        dot: { size: 8 },
                        message: { display: false },
                    },
                }),
            });

            // Sample graph structure
            const master = gitgraph.branch("master");
            master.commit("Initial commit");

            const feature = gitgraph.branch("feature/login");
            feature.commit().commit(); // no messages

            master.merge(feature);
            master.commit();
        };

        onMounted(drawGraph);
        watch(() => props.commitSpacing, drawGraph);

        return { gitGraphContainer };
    },
});
</script>
