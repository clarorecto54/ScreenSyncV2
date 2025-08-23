import { HTMLAttributes, InputHTMLAttributes, forwardRef, useEffect, useRef, useState } from "react"
import Image from "next/image"
import classMerge from "../utils/classMerge"
import Button from "./button"
/* ---- TEXTBOX INTERFACE --- */
interface TextboxProps extends
    InputHTMLAttributes<HTMLInputElement> {
    id: string //? Textbox ID
    circle?: boolean //? Rounded Corners
    useIcon?: boolean //? Icon
    iconSrc?: string //? Icon Path
    iconOverlay?: boolean //? Icon Overlay
    customOverlay?: string //? Icon Custom Overlay
    iconClass?: HTMLAttributes<HTMLLabelElement>["className"] //? Icon Class
    containerClass?: HTMLAttributes<HTMLDivElement>["className"] //? Container Class
}
/* -------- COMPONENT ------- */
export default forwardRef<HTMLInputElement, TextboxProps>(function Textbox({ circle, useIcon, iconSrc, iconOverlay, customOverlay, iconClass, containerClass, type, className, placeholder, id, ...props }, ref) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [dimension, setDimension] = useState<number>(0)
    useEffect(() => {
        const target = containerRef.current
        if (target) {
            setDimension(target.getBoundingClientRect().height)
        }
    }, [containerRef])
    return <div //* CONTAINER
        ref={containerRef}
        className={classMerge(
            "min-h-max min-w-max rounded-[1em]", //? Sizing
            "relative flex flex-row justify-center items-center", //? Display Styling
            "overflow-hidden shadow", //? Background Styling
            "focus-within:border-[1px] focus-within:border-blue-600", //? Border Styling
            circle && "rounded-full", //? Conditional
            containerClass
        )}>
        {useIcon && <label //* ICON BACKGROUND
            htmlFor={id}
            style={{ height: `${dimension}px`, aspectRatio: 1 / 1 }}
            className={classMerge(
                "flex justify-center items-center bg-white aspect-square", //? Base
                circle && "pl-[0.5em]",
                iconClass
            )}>
            <Image //* ICON
                className={classMerge(
                    "h-[1.25em] w-[1.25em] object-cover", //? Base
                    iconOverlay && (customOverlay ?? "whiteOverlay") //? Conditional
                )}
                src={iconSrc ?? require("@/public/images/Missing.svg")}
                alt=""
                sizes="100vw"
            />
        </label>}
        <input //* TEXTBOX
            id={id} ref={ref} {...props} type={type ?? "text"}
            placeholder={placeholder ?? "Text goes here"}
            className={classMerge(
                "min-h-max", //? Resizing Limit
                "h-full w-full p-[1em]", //? Textbox Size
                "bg-white", //? Background Styling
                "text-black text-[1em] font-[Gotham] font-[400]", //? Text & Font Styling
                (circle && !useIcon) && "px-[1.5em]",
                className
            )} />
    </div>
})