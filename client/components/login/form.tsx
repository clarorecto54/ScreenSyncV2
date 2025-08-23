"use client"
import { useGlobals } from "../hooks/useGlobals";
import { useEffect, useState } from "react"
import classMerge from "../utils/classMerge";
import Textbox from "../atom/textbox";
import Button from "../atom/button";
import AnimatedLogo from "../animated.logo";
import { RoomProps } from "@/types/session.types";
import { v4 } from "uuid"
import { redirect, RedirectType } from "next/navigation";
import Whitelist from "../whitelist";
export default function LoginForm() {
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "p-[2em] px-[3em]", //? Sizing
            "bg-white rounded-[2em] panelStyle backdrop-blur-md shadow-lg drop-shadow-lg", //? Background
            "flex flex-col justify-center items-center gap-[1em]", //? Display
        )}>
        <Logo />
        <Description />
        <Input />
    </div>
}
function Logo() {
    /* ----- STATES & HOOKS ----- */
    const { myInfo } = useGlobals()
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "flex gap-[0.5em] justify-center items-center", //? Display
        )}>
        <AnimatedLogo size={4} />
        <div //* DESCRIPTION
            className="font-[Montserrat] font-[600] leading-5 Unselectable">
            ScreenSync <br />
            <span className={classMerge(
                "rounded-full", //? Size
                myInfo.id ? "bg-green-600" : "bg-red-600", //? Background
                "flex justify-center items-center", //? Display
                "font-[500] font-[Gotham] text-[0.75em] text-white italic", //? Text Styling
            )}>
                {myInfo.id ? "Connected" : "Disconnected"}
            </span>
        </div>
    </div>
}
function Description() {
    return <div //* DESCRIPTION
        className="w-full flex flex-col gap-[0.5em] max-w-min text-[1em] Unselectable">
        <label //* HEADER 1
            className="font-[500] font-[Montserrat] text-[1em] min-w-max">
            TUPC Screen Mirroring Solution
        </label>
        <label //* DESCRIPTION
            className="font-[400] font-[Montserrat] text-[0.75em]">
            Enjoy the power of visual communication and take your educational experience to the next level
        </label>
    </div>
}
function Input() {
    /* ----- STATES & HOOKS ----- */
    const {
        socket, peer, whitelist, setsystemPopup,
        myInfo, setmyInfo,
        meetingCode, setmeetingCode,
    } = useGlobals()
    const [key, setKey] = useState<string>("")
    const [strict, setStrict] = useState<boolean>(false)
    /* ------ EVENT HANDLER ----- */
    useEffect(() => {
        meetingCode && redirect(`/${meetingCode}`, RedirectType.replace)
    }, [meetingCode])
    useEffect(() => {
        if (whitelist.length !== 0) setStrict(true)
    }, [whitelist, strict])
    /* -------- RENDERING ------- */
    return <form //* INPUTS CONTAINER
        className={
            classMerge(
                "flex flex-col gap-[1em] justify-center items-center", //? Display
            )
        }
        onSubmit={(thisElement) => { //? Start meeting
            thisElement.preventDefault()
            if (myInfo.name.length > 3) {
                const room: RoomProps = {
                    id: v4(),
                    key: key,
                    host: myInfo,
                    participants: [myInfo],
                    whitelist: whitelist,
                    pending: [],
                    stream: { hostID: myInfo.id, streamer: undefined, presenting: false },
                    entries: [],
                    chatlog: [],
                    inactive: [],
                    strict: strict
                }
                socket?.emit("create-room", room)
                setmeetingCode(room.id)
            }
        }}>
        <div //* INPUT CONTAINER
            className="flex flex-col gap-[0.5em]">
            <Textbox //* NAME
                maxLength={32} containerClass="text-[12px]"
                value={myInfo.name} onChange={(thisElement) => setmyInfo(prev => ({ ...prev, name: thisElement.target.value }))}
                id="name" useIcon iconSrc={require("@/public/images/Participants.svg")}
                placeholder="What is your name?" />
            {myInfo.name.length > 3 && <Textbox //* KEY
                maxLength={32} containerClass="text-[12px]"
                value={key} onChange={(thisElement) => setKey(thisElement.target.value)}
                id="key" useIcon iconSrc={require("@/public/images/Key.svg")}
                placeholder="Key is optional" />}
            {myInfo.name.length > 3 && <div //* OPTIONAL FEATURES
                className="flex items-center justify-center gap-[1rem]">
                <Button //* STRICT MODE
                    circle
                    className={classMerge(
                        !strict ? "bg-green-600" : "bg-[#e77d37]", //? Background
                        "text-[0.6rem]", //? Font
                    )}
                    onClick={() => setStrict(!strict)}
                >{strict ? "STRICT ON" : "STRICT OFF"}</Button>
                <Button //* WHITELIST
                    circle
                    onClick={() => setsystemPopup({
                        type: "INFO",
                        message: <Whitelist context="Global" />
                    })}
                    className={classMerge(
                        "text-black text-[0.55rem]", //? Font
                        "outline outline-[2px]", //? Outline
                        "hover:outline-none hover:bg-white", //? Hover
                        "transition-all duration-300", //? Animation
                    )}
                >Whitelist</Button>
            </div>
            }
        </div>
        {(myInfo.name.length > 3 && myInfo.id && socket && peer) && <Button //* START MEETING BUTTON
            type="submit"
            useIcon iconOverlay iconSrc={require("@/public/images/Join.svg")}
            className={classMerge(
                "bg-red-500 hover:bg-red-700 hover:scale-90 text-[12px]", //? Base
                "transition-all duration-300", //? Animation
            )}>
            Start Meeting
        </Button>
        }
    </form >
}