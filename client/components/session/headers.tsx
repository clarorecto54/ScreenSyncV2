import { useEffect, useState } from "react";
import classMerge from "../utils/classMerge";
import { useGlobals } from "../hooks/useGlobals";
import { useSession } from "../hooks/useSession";
/* ----- MEETING HEADER ----- */
export default function Header() {
    /* ----- STATES & HOOKS ----- */
    const { socket, myInfo, meetingCode } = useGlobals()
    const [serverTime, setServerTime] = useState<string>("")
    const [ping, setPing] = useState<number>(0)
    const [roomName, setRoomName] = useState<string>("")
    /* ------ EVENT HANDLER ----- */
    useEffect(() => {
        if (socket) {
            setInterval(() => {
                const start = Date.now();
                socket.emit("ping", () => {
                    const duration = Date.now() - start
                    setPing(duration)
                })
            }, 500)
            socket.on("get-server-time", (time: string) => setServerTime(time))
            socket.on("host-name", (hostname: string) => setRoomName(hostname))
            socket.emit("get-host-name", meetingCode)
        }
        return () => {
            if (socket) {
                socket.off("get-server-time", (time: string) => setServerTime(time))
                socket.off("host-name", (hostname: string) => setRoomName(hostname))
            }
        }
    }, [])
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "w-full", //? Sizing
            "grid grid-cols-3", //? Display
            "Unselectable", //? Custom Class
        )}>
        <label //* TIME
            className="font-[400] text-start">
            {serverTime}
        </label>
        <label //* APP TITLE
            className="font-[600] flex gap-[0.75em] justify-center items-center text-center">
            ScreenSync
            <div className="flex gap-[0.25em] justify-center items-center">
                <div className={classMerge(
                    "h-[0.75em] aspect-square rounded-full", //? Size
                    myInfo.id ? "bg-green-600" : "bg-red-600", //? Background
                )} />
                <span className="font-[400] text-[0.75em]">{myInfo.id ? (ping < 1 ? 1 : ping) : 999}ms</span>
            </div>
        </label>
        <label //* ROOM NAME
            className="font-[400] text-end">
            {`${roomName}'s Room`}
        </label>
    </div>
}