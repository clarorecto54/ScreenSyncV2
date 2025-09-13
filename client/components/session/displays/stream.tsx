import { useGlobals } from "@/components/hooks/useGlobals"
import { useSession } from "@/components/hooks/useSession"
import classMerge from "@/components/utils/classMerge"
import { useRef, useEffect } from "react"

function StreamDisplay()
{
    /* ----- STATES & HOOKS ----- */
    const streamRef = useRef<HTMLVideoElement>(null)
    const { socket, meetingCode } = useGlobals()
    const {
        host, mutestream,
        stream, setstream,
        presenting, setpresenting,
        streamAccess, setstreamAcces,
        fullscreen, setfullscreen,
    } = useSession()
    /* ------ EVENT HANDLER ----- */
    useEffect(() =>
    {
        const target = streamRef.current
        if (target)
        {
            if (stream) { target.srcObject = stream }
            else { target.srcObject = null }
            if (fullscreen)
            {
                target.requestFullscreen({ navigationUI: "hide" }).then(() =>
                {
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
        {stream && stream?.getTracks().length > 0 && stream?.getVideoTracks().length > 0 && <video
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

export default StreamDisplay