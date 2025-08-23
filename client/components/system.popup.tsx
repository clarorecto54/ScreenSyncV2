import Image from "next/image";
import Button from "./atom/button";
import { useGlobals } from "./hooks/useGlobals";
import classMerge from "./utils/classMerge";

export default function SystemPopup() {
    /* ----- STATES & HOOKS ----- */
    const { systemPopup, setsystemPopup } = useGlobals()
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "bg-white p-[1.25em] px-[1.5em] rounded-[1.25em] drop-shadow-lg shadow-lg", //? Base
            "flex flex-col gap-[0.75em] justify-center items-center", //? Display
        )}>
        <div //* MESSAGE CONTAINER
            className={classMerge(
                "", //? Base
                "flex justify-center items-center gap-[1.25em]", //? Display
            )}>
            {typeof systemPopup?.message === "string" && <Image //* MESSAGE ICON
                className={classMerge(
                    "h-[3em] w-[3em] object-cover", //? Base
                    systemPopup?.type === "ERROR" ? "redOverlay" : "blueOverlay", //? Overlay
                    systemPopup?.type === "ALERT" && "yellowOverlay"
                )}
                src={systemPopup?.icon ? systemPopup.icon : require("@/public/images/Missing.svg")}
                alt="" />}
            {typeof systemPopup?.message === "string" && <label //* MESSAGE
                className="font-[500] font-[Montserrat] text-[1em] max-w-[24em]">
                {systemPopup?.message}
            </label>}
            {typeof systemPopup?.message !== "string" && systemPopup?.message}
        </div>
        <div className="flex gap-[0.5em] justify-center items-center">
            {systemPopup?.action && <Button //* ACTION BUTTON
                circle useIcon iconOverlay iconSrc={require("@/public/images/Check.svg")}
                onClick={() => {
                    (systemPopup.action && systemPopup.action())
                    setsystemPopup(null)
                }}
                className={classMerge(
                    "bg-green-500 text-[0.6em]", //? Base
                    "hover:scale-90 transition-all duration-500", //? Animation
                )} >{systemPopup.actionText ?? "Yes"}</Button>}
            <Button //* CLOSE BUTTON
                circle useIcon iconOverlay iconSrc={require("@/public/images/Close 2.svg")}
                onClick={() => {
                    (systemPopup?.closeAction && systemPopup.closeAction())
                    setsystemPopup(null)
                }}
                className={classMerge(
                    "bg-red-500 text-[0.6em] shadow-lg drop-shadow-sm", //? Base
                    !systemPopup?.action && "bg-green-500", //? Conditional
                    "hover:scale-90 transition-all duration-500", //? Animation
                )} >{systemPopup?.closeText ?? (systemPopup?.action ? "No" : "Close")}</Button>
        </div>
    </div>
}