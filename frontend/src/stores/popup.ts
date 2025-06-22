import { defineStore } from "pinia";
import { reactive } from "vue";


export type PopupType = "success" | "info" | "warning" | "error"

export interface PopupInfo {
    type: PopupType
    message: string
}

export const usePopupStore = defineStore("popup",() => {

    const popups = reactive<PopupInfo[]>([])

    const showPopup = (type: PopupType, message: string) => {
        popups.unshift({
            type: type,
            message: message
        })
    }

    const dismissPopup = (popupInfo: PopupInfo) => {
        const index = popups.indexOf(popupInfo)
        if (index != -1) popups.splice(index,1)
    }

    return { popups, showPopup, dismissPopup }
})
