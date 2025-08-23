"use client"
import { useGlobals } from "@/components/hooks/useGlobals";
import { SessionContextProvider } from "@/components/hooks/useSession";
import AppDock from "@/components/session/appdock";
import MainDisplay from "@/components/session/display";
import Header from "@/components/session/headers";
import SystemPopup from "@/components/system.popup";
import classMerge from "@/components/utils/classMerge";
import { useEffect } from "react";

export default function Session() {
    /* ----- STATES & HOOKS ----- */
    const { systemPopup } = useGlobals()
    /* ------ EVENT HANDLER ----- */
    useEffect(() => {
        let intervalId: any
        if (systemPopup?.type === "ALERT") {
            intervalId = setInterval(() => {
                navigator.vibrate(500)
            }, 1000)
        } else {
            navigator.vibrate(0)
        }
        return () => {
            clearInterval(intervalId)
            navigator.vibrate(0)
        }
    }, [systemPopup])
    /* -------- RENDERING ------- */
    return <SessionContextProvider>
        <div //* VIEWPORT
            className={classMerge(
                "h-full w-full p-[1.25em] py-[0.75em]", //? Sizing
                "relative flex flex-col gap-[0.75em] justify-center items-start", //? Display
                "bg-black", //? Background
                "text-white font-[600] font-[Gotham]", //? Font Styling
            )}>
            <Header />
            <MainDisplay />
            <AppDock />
        </div>
        <div //* SYSTEM POPUP
            className={classMerge(
                "h-full w-full -z-50 flex justify-center items-center opacity-0 pointer-events-none", //? Base
                "absolute backdrop-blur-md backdrop-brightness-50", //? Background
                "transition-all duration-1000", //? Animation
                systemPopup !== null && "opacity-100 z-50 pointer-events-auto", //? Conditional
            )}>
            {systemPopup?.type === "ALERT" && <audio
                autoPlay loop
                onPlay={() => navigator.vibrate(100)}
                src="/sounds/alarm.wav"
                typeof="audio/wav" />}
            {systemPopup !== null && <SystemPopup />}
        </div>
    </SessionContextProvider>
}