import { StaticImageData } from "next/image"

interface SystemPopupProps {
    type: "ERROR" | "INFO" | "ALERT"
    action?: () => void
    closeAction?: () => void
    icon?: StaticImageData
    message: string | JSX.Element
    closeText?: string
    actionText?: string
}