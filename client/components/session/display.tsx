import { useSession } from "../hooks/useSession";
import classMerge from "../utils/classMerge";
import Button from "../atom/button";
import { useGlobals } from "../hooks/useGlobals";
import Pending from "../pending/pending";
import DefaultDisplay from "./displays/default";
import StreamDisplay from "./displays/stream";
import ExamDisplay from "./displays/exam";

export default function MainDisplay() {
    /* ----- STATES & HOOKS ----- */
    const { socket, meetingCode } = useGlobals()
    const { host, pendingList } = useSession()
    const { setsystemPopup } = useGlobals()
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
                            socket.emit("accept-req", meetingCode, client) //? Update the user on their request
                            socket.emit("cancel-entry", meetingCode, client) //? Remove the user on the pending list
                        })
                    },
                    actionText: "Accept All",
                    closeAction() { //? Reject All
                        pendingList.forEach(client => {
                            socket.emit("cancel-req", client) //? Update the user on his request
                            socket.emit("cancel-entry", meetingCode, client) //? Remove the user on the pending list
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
        <ExamDisplay />
    </div>
}