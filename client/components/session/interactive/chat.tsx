import Button from "@/components/atom/button";
import Textbox from "@/components/atom/textbox";
import { useGlobals } from "@/components/hooks/useGlobals";
import { useSession } from "@/components/hooks/useSession";
import classMerge from "@/components/utils/classMerge";
import { MessageProps } from "@/types/session.types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
export default function Chat() {
    /* ----- STATES & HOOKS ----- */
    const { socket, meetingCode } = useGlobals()
    const { interactive, setinteractive } = useSession()
    const [chatlog, setchatlog] = useState<MessageProps[]>([])
    const [newchat, setnewchat] = useState<boolean>(false)
    /* ------ EVENT HANDLER ----- */
    useEffect(() => {
        //* EMIT (REQ)
        socket?.emit("get-chat", meetingCode)
        //* ON (RES)
        socket?.on("updated-chat", (data: MessageProps[]) => setchatlog(data))
        socket?.on("new-chat", () => { !interactive.includes("chat") && setnewchat(true) })
        return () => {
            socket?.off("updated-chat", (data: MessageProps[]) => setchatlog(data))
            socket?.off("new-chat", () => { !interactive.includes("chat") && setnewchat(true) })
        }
    }, [])
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className="relative flex justify-center items-center">
        {interactive.includes("chat") && <Log chatlog={chatlog} setnewchat={setnewchat} />}
        <Button //* CHAT
            circle useIcon iconOverlay iconSrc={require("@/public/images/Chat.svg")}
            onClick={() => {
                !interactive.includes("chat") ? setinteractive("chat") : setinteractive("")
                setnewchat(false)
            }}
            useNotif={newchat}
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />
    </div>
}
function Log({ chatlog, setnewchat }: { chatlog: MessageProps[], setnewchat: Dispatch<SetStateAction<boolean>> }) {
    /* ----- STATES & HOOKS ----- */
    const { socket, meetingCode, myInfo } = useGlobals()
    const { muted } = useSession()
    const [message, setMessage] = useState<string>("")
    /* -------- RENDERING ------- */
    return <div //* POPUP
        className={classMerge(
            "min-w-[24em] max-w-[24em] aspect-square p-[2em] py-[1.5em] rounded-[2em]", //? Size
            "absolute flex flex-col gap-[1em] -translate-y-[19em]", //? Display
            "backdrop-blur-md backdrop-brightness-50", //? Background
        )}>
        <label //* HEADER
            className="text-[1.25em] font-[Montserrat] font-[600]">
            Session Messages
        </label>
        <div //* LOG
            className={classMerge(
                "h-full w-full scroll-smooth", //? Size
                "flex flex-col-reverse gap-[1em] overflow-y-scroll" //? Display
            )}>
            {chatlog && chatlog.slice().reverse().map(({ id, name, time, message }, index) => {
                if (!muted.includes(id)) { //? Filter muted participants
                    return <div //* MESSAGE CONTAINER
                        key={index} className="w-full flex flex-col gap-[0.25em] pr-[1em]">
                        <div //* HEADER
                            className={classMerge(
                                "w-full pl-[0.25em]", //? Base
                                "flex items-center gap-[1em]", //? Display
                                (myInfo.name === name) && "flex-row-reverse", //? Conditional
                                "text-[0.8em] font-[Montserrat] font-[400]", //? Font
                            )}>
                            {(myInfo.name === name) ? "You" : name}
                            <label //* TIME
                                className="text-[0.75em] font-[300] ">
                                {time}
                            </label>
                        </div>
                        <div //* MESSAGE
                            className={classMerge(
                                "w-full inline-flex flex-col gap-[0.25em]", //? Base
                                "text-[1em] font-[Montserrat] font-[400]", //? Font
                            )}>
                            {typeof message === "string" && //* SINGLE
                                <div className={classMerge(
                                    "flex", //? Base
                                    (myInfo.name === name) ? "justify-end pl-[2em]" : "pr-[2em]"
                                )}>
                                    <label className={classMerge(
                                        "bg-[#80808050] w-fit p-[0.5em]",
                                        (myInfo.name === name) ? "pl-[1.25em] pr-[0.75em] rounded-l-[1.5em] rounded-r-[0.5em] text-end" : "pl-[0.75em] pr-[1.25em] rounded-l-[0.5em] rounded-r-[1.5em]",
                                    )}>
                                        {message}
                                    </label>
                                </div>}
                            {typeof message === "object" && message.map((message, index) => { //* MULTI
                                return <div key={index} className={classMerge(
                                    "flex", //? Base
                                    (myInfo.name === name) ? "justify-end pl-[2em]" : "pr-[2em]"
                                )}>
                                    <label className={classMerge(
                                        "bg-[#80808050] w-fit p-[0.5em]",
                                        (myInfo.name === name) ? "pl-[1.25em] pr-[0.75em] rounded-l-[1.5em] rounded-r-[0.5em] text-end" : "pl-[0.75em] pr-[1.25em] rounded-l-[0.5em] rounded-r-[1.5em]",
                                    )}>
                                        {message}
                                    </label>
                                </div>
                            })}
                        </div>
                    </div>
                }
            })}
            {chatlog.length === 0 && <label
                className="h-full w-full text-[0.75em] font-[400] flex justify-center items-center">
                No Messages
            </label>}
        </div>
        <form //* INPUTS
            onSubmit={(thisElement) => {
                thisElement.preventDefault()
                message && socket?.emit("send-message", meetingCode, myInfo, message)
                setMessage("")
            }}
            className={classMerge(
                "flex gap-[0.5em] justify-center items-center ", //? Base
            )}>
            <Textbox //* TEXTBOX
                circle value={message} maxLength={255} autoComplete="off"
                id="message" placeholder="Type your message here"
                onChange={(thisElement) => setMessage(thisElement.target.value)}
                onFocus={() => setnewchat(false)}
                containerClass="focus-within:border-0 w-full"
                className={classMerge(
                    "bg-[#88888850] text-white", //? Base
                    "focus:bg-[#88888875]", //? Focus
                )} />
            {message && <Button //* SEND
                type="submit" circle useIcon iconOverlay iconSrc={require("@/public/images/Send.svg")}
                className={classMerge(
                    "text-[0.75em] p-[1.25em]", //? Base
                )} />}
        </form>
    </div>
}