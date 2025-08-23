import { useEffect, useRef, useState } from "react";
import AnimatedLogo from "../animated.logo";
import { useSession } from "../hooks/useSession";
import classMerge from "../utils/classMerge";
import Button from "../atom/button";
import { useGlobals } from "../hooks/useGlobals";
import Pending from "../pending/pending";

export default function MainDisplay() {
    /* ----- STATES & HOOKS ----- */
    const { socket, meetingCode } = useGlobals()
    const { host, pendingList } = useSession()
    const { systemPopup, setsystemPopup } = useGlobals()
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "h-full w-full", //? Sizing
            "rounded-3xl overflow-hidden", //? Border
            "flex relative", //? Display
        )}>
        {(pendingList.length > 0 && host) && <div className={classMerge(
            "w-full h-full py-[2rem]", //? Sizing
            "absolute z-[1] flex justify-center items-start", //? Display
        )} >
            <Button //* PENDING BUTTON
                circle useIcon iconSrc={require("@/public/images/Participants.svg")}
                onClick={() => setsystemPopup({
                    message: <Pending />,
                    action() { //? Accept All
                        pendingList.forEach(client => {
                            socket?.emit("accept-req", meetingCode, client) //? Update the user on their request
                            socket?.emit("cancel-entry", meetingCode, client) //? Remove the user on the pending list
                        })
                    },
                    actionText: "Accept All",
                    closeAction() { //? Reject All
                        pendingList.forEach(client => {
                            socket?.emit("cancel-req", client) //? Update the user on his request
                            socket?.emit("cancel-entry", meetingCode, client) //? Remove the user on the pending list
                        })
                    },
                    closeText: "Reject All",
                    type: "INFO"
                })}
                className={classMerge(
                    "bg-[#F9AE25] text-[14px] text-black drop-shadow-md", //? Base
                    "hover:scale-90", //? Hover
                    "animate-pulse hover:animate-none", //? Animation
                    "transition-all duration-500", //? Animation
                )}>
                {pendingList.length} Pending Entry
            </Button>
        </div>}
        <DefaultDisplay />
        <StreamDisplay />
    </div>
}
function DefaultDisplay() {
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "h-full w-full", //? Sizing
            "bg-[#525252]", //? Background presenting ? "bg-[#]" : 
            "flex flex-col gap-[32px] justify-center items-center Unselectable", //? Display
            "transition-[background-color] duration-500", //? Animation
        )}>
        <AnimatedLogo size={16} />
        <label //* SCHOOL NAME
            className="text-center font-[500] text-[20px] font-[Montserrat] leading-[40px]">
            Technological University of the Philippines <br />
            Cavite Campus
        </label>
    </div>
}
function StreamDisplay() {
    /* ----- STATES & HOOKS ----- */
    const streamRef = useRef<HTMLVideoElement>(null)
    const { socket, meetingCode } = useGlobals()
    const {
        host, mutestream,
        stream, setstream,
        presenting, setpresenting,
        calls, setcalls,
        streamAccess, setstreamAcces,
        fullscreen, setfullscreen,
    } = useSession()
    /* ------ EVENT HANDLER ----- */
    useEffect(() => {
        const target = streamRef.current
        if (target) {
            if (stream) { target.srcObject = stream }
            else { target.srcObject = null }
            if (fullscreen) {
                target.requestFullscreen({ navigationUI: "hide" }).then(() => {
                    setfullscreen(false)
                    return
                })
            }
        }
    }, [stream, fullscreen])
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "h-full w-full", //? Sizing
            "bg-[#161616]", //? Background
            "absolute flex flex-col gap-[32px] justify-center items-center Unselectable", //? Display
            !presenting && "opacity-0",//? Conditional
            "transition-[opacity] duration-1000", //? Animation
        )}>
        {!stream && <div className="h-full w-full font-[600] font-[Montserrat] flex justify-center items-center">No Stream</div>}
        {stream && <video
            autoPlay
            ref={streamRef}
            muted={mutestream}
            className="h-full w-full rounded-[2em] overflow-hidden"
            style={{
                colorAdjust: "exact",
                colorInterpolation: "sRGB",
                colorRendering: "optimizeQuality",
                textRendering: "optimizeLegibility",
                shapeRendering: "geometricPrecision",
                aspectRatio: stream.getVideoTracks()[0].getSettings().aspectRatio
            }}
        />}
    </div>
}