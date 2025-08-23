import Button from "@/components/atom/button";
import { useGlobals } from "@/components/hooks/useGlobals";
import classMerge from "@/components/utils/classMerge";
import { useRef, useState } from "react";
export default function Reaction() {
    /* ----- STATES & HOOKS ----- */
    const { socket, meetingCode, myInfo } = useGlobals()
    const popupRef = useRef<HTMLDivElement>(null)
    const [showReactions, setShowReactions] = useState<boolean>(false)
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        ref={popupRef}
        className="relative flex justify-center items-center">
        {showReactions && <div //* DROPUP
            style={{
                translate: `0 -5.75em`
            }}
            className={classMerge(
                "p-[0.75em] rounded-full", //? Size
                "absolute flex gap-[0.75em] drop-shadow-lg shadow-lg", //? Display
                "backdrop-blur-md backdrop-brightness-75", //? Background
            )}>
            {['🩷', '🎉', '👋', '👍', '👎', '😂', '😢', '🤬'].map((emoji, index) => {
                const message: string = emoji
                return <Button //* REACTION TRIGGER
                    key={index} circle
                    onClick={() => {
                        socket?.emit("send-message", meetingCode, myInfo, message)
                        setShowReactions(false)
                    }}
                    className={classMerge(
                        "bg-[#525252]", //? Background
                        "hover:bg-[#646464]", //? Hover
                        "aspect-square p-[0.5em]", //? Sizing
                        "text-[1.25em]", //? Emoji Size
                    )} >{emoji}</Button>
            })}
        </div>}
        <Button //* REACTION TRIGGER
            circle useIcon iconOverlay iconSrc={require("@/public/images/Reactions 2.svg")}
            onClick={() => setShowReactions(!showReactions)}
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />
    </div>
}