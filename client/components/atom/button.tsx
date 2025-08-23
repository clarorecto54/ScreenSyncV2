"use client"
import { ButtonHTMLAttributes, HTMLAttributes, forwardRef } from "react"
import classMerge from "../utils/classMerge"
import { StaticImageData } from "next/image"
import Image from "next/image"
/* ---- BUTTON INTERFACE ---- */
interface ButtonProps extends
    ButtonHTMLAttributes<HTMLButtonElement> {
    circle?: boolean //? Rounded Corners
    useIcon?: boolean //? Button Icon
    iconSrc?: StaticImageData //? Icon Path
    iconOverlay?: boolean //? Icon Overlay
    customOverlay?: string //? Icon Custom Overlay
    useNotif?: boolean //? Button Notification
    containerClass?: HTMLAttributes<HTMLDivElement>["className"] //? Container Class
}
/* -------- COMPONENT ------- */
export default forwardRef<HTMLButtonElement, ButtonProps>(function Button({ circle, useIcon, iconSrc, iconOverlay, customOverlay, useNotif, containerClass, className, children, type, ...props }, ref) {
    return <div //* CONTAINER
        className={classMerge(
            "min-w-max min-h-max text-[1em]", //? Base
            containerClass //? Conditional
        )}>
        <button //* BUTTON
            ref={ref} {...props} type={type ?? "button"}
            className={classMerge(
                "h-full w-full min-h-max min-w-max p-[1em]", //? Button Size
                "relative flex flex-row gap-[0.75em] justify-center items-center", //? Display Styling
                "text-white text-center", //? Text Styling
                "font-[600] font-[Montserrat]", //? Font Styling
                circle ? "rounded-full px-[1.5em]" : "rounded-[1em]", //? Conditional
                (circle && !children) && "rounded-full p-[1em]", //? Conditional
                className //? Main class for final/specific modifications
            )}>
            {useNotif && <div className={classMerge( //* NOTIFICATION
                "bg-[#dc4b4b] h-[40%] p-[4px]",
                "absolute aspect-square rounded-full",
                "flex justify-center items-center",
                circle ? "-top-[0.25em] -right-[0.25em]" : "-top-[0.5em] -right-[0.5em]",
                "text-[#ddd3d3] text-center font-[Montserrat] font-[500]")}>!</div>}
            {useIcon && <Image //* ICON
                className={classMerge(
                    "object-cover", //? Base
                    `h-[1.5em] w-[1.5em]`,//? Conditional
                    iconOverlay && (customOverlay ?? "whiteOverlay") //? Conditional
                )}
                src={iconSrc ?? require("@/public/images/Missing.svg")}
                alt=""
                sizes="100vw" />}
            {children}
        </button>
    </div>
})