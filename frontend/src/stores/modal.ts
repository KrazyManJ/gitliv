import { defineStore } from "pinia";
import { markRaw, reactive, type AllowedComponentProps, type Component, type VNodeProps } from "vue";

type RemoveEmits<T> = {
    [K in keyof T as K extends `on${string}` ? never : K]: T[K]
}

type ComponentProps<C extends Component> = C extends new (...args: unknown[]) => unknown
    ? RemoveEmits<Omit<InstanceType<C>['$props'], keyof VNodeProps | keyof AllowedComponentProps>>
    : never;

interface ShowModalOptions {
    canClose: boolean
    showCloseX: boolean
    onHide: () => void
}

const SHOW_MODAL_OPTIONS_DEFAULTS: ShowModalOptions = {
    canClose: true,
    showCloseX: false,
    onHide: () => {}
}

export const useModalStore = defineStore("modal",() => {
    const state = reactive<{
        isVisible: boolean
        content: Component | null
        props?: Record<string,unknown>
        options: ShowModalOptions
    }>({
        isVisible: false,
        content: null,
        props: {},
        options: SHOW_MODAL_OPTIONS_DEFAULTS
    })

    function showModal<C extends Component>(modalContent: C, props: ComponentProps<C>, options: Partial<ShowModalOptions> = {}) {
        state.content = markRaw(modalContent)
        state.isVisible = true
        state.props = props
        state.options = { ...state.options ,...options }
    }

    function hideModal() {
        state.isVisible = false
        state.props = {}
        state.content = null
        state.options.onHide()
    }

    return { showModal, hideModal, state }
})
