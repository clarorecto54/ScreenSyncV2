import classMerge from "../utils/classMerge";
import PendingItem from "./item";
import { useGlobals } from "../hooks/useGlobals";
import { useSession } from "../hooks/useSession";
import { useEffect } from "react";

export default function Pending() {
    /* ----- STATES & HOOKS ----- */
    const { setsystemPopup } = useGlobals()
    const { pendingList } = useSession()
    /* ------ EVENT HANDLER ----- */
    useEffect(() => {
        if (pendingList.length === 0) setsystemPopup(null)
    }, [pendingList])
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "flex flex-col gap-[0.5rem]", //? Display
        )}>
        <label //* HEADER
            className="font-[Montserrat] font-[500]">
            Pending Participants
        </label>
        <div //* PENDING LIST
            className={classMerge(
                "flex flex-col gap-[0.25rem] justify-center items-center ", //? Base
                "overflow-hidden overflow-y-auto max-h-[128px]", //? Overflow Limits
            )}>
            {pendingList.map((client, index) => {
                return <PendingItem key={index} user={client} />
            })}
        </div>
    </div>
}