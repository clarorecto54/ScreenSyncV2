import { UserProps } from "@/types/session.types";
import Button from "../atom/button";
import classMerge from "../utils/classMerge";
import { useGlobals } from "../hooks/useGlobals";

export default function PendingItem({ user }: { user: UserProps }) {
    /* ----- STATES & HOOKS ----- */
    const { socket, meetingCode } = useGlobals()
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "w-full flex justify-between items-center gap-[1em]", //? Display
        )}>
        <label className="font-[500] font-[Montserrat] text-[0.75em] max-w-[16em]"
        >{user.name}</label>
        <div //* CTA
            className="flex gap-[0.25rem] justify-center items-center">
            <Button //* ACCEPT
                circle
                onClick={() => {
                    socket?.emit("accept-req", meetingCode, user) //? Update the user on their request
                    socket?.emit("cancel-entry", meetingCode, user) //? Remove the user on the pending list
                }}
                className={classMerge(
                    "bg-green-600 text-[0.5em] shadow-lg drop-shadow-sm", //? Base
                    "hover:scale-90 transition-all duration-500", //? Animation
                )}
            >Accept</Button>
            <Button //* REJECT
                circle
                onClick={() => {
                    socket?.emit("cancel-req", user) //? Update the user on their request
                    socket?.emit("cancel-entry", meetingCode, user) //? Remove the user on the pending list
                }}
                className={classMerge(
                    "bg-red-600 text-[0.5em] shadow-lg drop-shadow-sm", //? Base
                    "hover:scale-90 transition-all duration-500", //? Animation
                )}
            >Reject</Button>
        </div>
    </div>
}