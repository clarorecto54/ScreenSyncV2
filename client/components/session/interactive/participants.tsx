import Button from "@/components/atom/button";
import Textbox from "@/components/atom/textbox";
import { useGlobals } from "@/components/hooks/useGlobals";
import { useSession } from "@/components/hooks/useSession";
import classMerge from "@/components/utils/classMerge";
import { UserProps } from "@/types/session.types";
import { useState } from "react";

export default function Participants() {
    /* ----- STATES & HOOKS ----- */
    const { participantList, interactive, setinteractive } = useSession()
    /* -------- RENDERING ------- */
    return <div
        className="relative flex justify-center items-center">
        {interactive.includes("participants") && <Popup participantList={participantList} />}
        <Button //* PARTICIPANTS
            circle useIcon iconOverlay iconSrc={require("@/public/images/Participants.svg")}
            onClick={() => !interactive.includes("participants") ? setinteractive("participants") : setinteractive("")}
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} >{participantList.length}</Button>
    </div>
}
function Popup({ participantList }: { participantList: UserProps[] }) {
    /* ----- STATES & HOOKS ----- */
    const { socket, myInfo, meetingCode } = useGlobals()
    const {
        host,
        muted, setmuted,
    } = useSession()
    const [search, setSearch] = useState<string>("")
    const [selected, setSelected] = useState<string>("")
    /* -------- RENDERING ------- */
    return <div
        className={classMerge(
            "min-w-[24em] max-w-[24em] aspect-square p-[2em] py-[1.5em] rounded-[2em]", //? Size
            "absolute flex flex-col gap-[1em] -translate-y-[19em]", //? Display
            "backdrop-blur-md backdrop-brightness-50", //? Background
        )}>
        <label //* HEADER
            className="text-[1.25em] font-[Montserrat] font-[600]">
            Audience
        </label>
        <Textbox //* SEARCH BAR
            circle value={search} maxLength={255}
            id="message" placeholder="Search someone here"
            useIcon iconOverlay iconSrc={require("@/public/images/Search.svg")}
            onChange={(thisElement) => setSearch(thisElement.target.value)}
            onFocus={() => setSelected("")}
            iconClass="bg-transparent"
            containerClass="focus-within:border-0 focus-within:bg-[#88888850] w-full"
            className={classMerge(
                "bg-[#88888850] text-white", //? Base
                "focus:bg-[#88888875]", //? Focus
            )} />
        <div //* LIST
            onScroll={() => setSelected("")}
            className={classMerge(
                "h-full overflow-y-scroll pr-[0.5em] px-[0.5em]", //? Base
                "flex flex-col gap-[0.5em]", //? Display
            )}>
            {!search && <div //* YOU TAB
                className={classMerge(
                    "w-full flex gap-[0.5em] justify-between items-center group", //? Base
                    "text-[1em] font-[Montserrat] font-[400] ", //? Font
                )}>
                {myInfo.name} ( You )
                {participantList.length > 1 && <div //* OPTIONS CONTAINER
                    className="flex justify-center items-center">
                    {selected.includes(myInfo.id) && <div //* OPTIONS
                        style={{ translate: `0 -${host ? 7.5 : 4}em` }}
                        className="absolute flex flex-col gap-[0.5em]">
                        <Button //* MUTE ALL
                            circle useIcon iconOverlay iconSrc={require("@/public/images/Mute.svg")}
                            onClick={() => {
                                if (muted.length === 0) { //? Mute All
                                    setmuted(participantList.filter(mute => mute.id !== myInfo.id).map(target => target.id))
                                } else { //? Unmute All
                                    setmuted([])
                                }
                                setSelected("")
                            }}
                            className={classMerge(
                                "bg-[#323232] text-[14px] drop-shadow-md", //? Base
                                "hover:scale-90", //? Hover
                                "transition-all duration-500", //? Animation
                            )}>
                            {muted.length === 0 ? "Mute All" : "Unmute All"}
                        </Button>
                        {host && <Button //* ALERT ALL
                            circle useIcon iconSrc={require("@/public/images/Alert.svg")}
                            onClick={() => {
                                socket.emit("alert-all", meetingCode)
                                setSelected("")
                            }}
                            className={classMerge(
                                "bg-[#F9AE25] text-[14px] text-black drop-shadow-md", //? Base
                                "hover:scale-90", //? Hover
                                "transition-all duration-500", //? Animation
                            )}>
                            Alert All
                        </Button>}
                        {host && <Button //* KICK ALL
                            circle useIcon iconSrc={require("@/public/images/Kick.svg")}
                            onClick={() => {
                                socket.emit("kick-all", meetingCode)
                                setSelected("")
                            }}
                            className={classMerge(
                                "bg-[#E4280E] brightness-105 text-[14px] text-black drop-shadow-md", //? Base
                                "hover:scale-90", //? Hover
                                "transition-all duration-500", //? Animation
                            )}>
                            Kick All
                        </Button>}
                    </div>}
                    <Button //* OPTIONS TRIGGER
                        circle iconOverlay useIcon iconSrc={require("@/public/images/3 Dots.svg")}
                        onClick={() => !selected.includes(myInfo.id) ? setSelected(myInfo.id) : setSelected("")}
                        containerClass={classMerge(
                            "text-[0.75em] opacity-0", //? Base
                            "group group-hover:opacity-100", //? Conditional
                            "transition-opacity duration-500", //? Animation
                        )} />
                </div>}
            </div>}
            {participantList && participantList.map(({ id, name, IPv4 }, index) => {
                if (name.toUpperCase().includes(search.toUpperCase()) && myInfo.id !== id) {
                    return <div //* PARTICIPANTS TAB
                        key={index}
                        className={classMerge(
                            "w-full flex gap-[0.5em] justify-between items-center group", //? Base
                            "text-[1em] font-[Montserrat] font-[400] ", //? Font
                        )}>
                        {name}
                        <div //* OPTIONS CONTAINER
                            className="flex justify-center items-center">
                            {selected.includes(id) && <div //* OPTIONS
                                style={{ translate: `0 -${host ? 7.5 : 4}em` }}
                                className="absolute flex flex-col gap-[0.5em]">
                                <Button //* Mute
                                    circle useIcon iconOverlay iconSrc={require("@/public/images/Mute.svg")}
                                    onClick={() => {
                                        if (!muted.includes(id)) { //? Mute
                                            setmuted(prevValues => [...prevValues, id])
                                        } else { //? Unmute
                                            setmuted(muted.filter(muted => muted !== id))
                                        }
                                        setSelected("")
                                    }}
                                    className={classMerge(
                                        "bg-[#323232] text-[14px] drop-shadow-md", //? Base
                                        "hover:scale-90", //? Hover
                                        "transition-all duration-500", //? Animation
                                    )}>
                                    {!muted.includes(id) ? "Mute" : "Unmute"}
                                </Button>
                                {host && <Button //* Alert
                                    circle useIcon iconSrc={require("@/public/images/Alert.svg")}
                                    onClick={() => {
                                        socket.emit("alert", id)
                                        setSelected("")
                                    }}
                                    className={classMerge(
                                        "bg-[#F9AE25] text-[14px] text-black drop-shadow-md", //? Base
                                        "hover:scale-90", //? Hover
                                        "transition-all duration-500", //? Animation
                                    )}>
                                    Alert
                                </Button>}
                                {host && <Button //* KICK
                                    circle useIcon iconSrc={require("@/public/images/Kick.svg")}
                                    onClick={() => {
                                        socket.emit("kick", id)
                                        setSelected("")
                                    }}
                                    className={classMerge(
                                        "bg-[#E4280E] brightness-105 text-[14px] text-black drop-shadow-md", //? Base
                                        "hover:scale-90", //? Hover
                                        "transition-all duration-500", //? Animation
                                    )}>
                                    Kick
                                </Button>}
                            </div>}
                            <Button //* OTPIONS TRIGGER
                                circle iconOverlay useIcon iconSrc={require("@/public/images/3 Dots.svg")}
                                onClick={() => !selected.includes(id) ? setSelected(id) : setSelected("")}
                                containerClass={classMerge(
                                    "text-[0.75em] opacity-0", //? Base
                                    "group group-hover:opacity-100", //? Conditional
                                    "transition-opacity duration-500", //? Animation
                                )} />
                        </div>
                    </div>
                }
            })}
        </div>
    </div>
}