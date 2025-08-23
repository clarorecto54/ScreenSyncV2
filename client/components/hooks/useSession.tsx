"use client"
import { SessionProps, UserProps } from "@/types/session.types"
import { ReactNode, createContext, use, useContext, useEffect, useState } from "react"
import { useGlobals } from "./useGlobals"
import { redirect, RedirectType } from "next/navigation"
import { MediaConnection } from "peerjs"
import { transformSDP } from "../utils/sdp.transform"
/* -------- INTERFACE ------- */
const defaultValues: SessionProps = {
    host: false,
    streamAccess: false,
    mutestream: false,
    presenting: false,
    interactive: "",
    muted: [],
    calls: [],
    stream: null,
    participantList: [],
    inactiveList: [],
    pendingList: [],
    fullscreen: false,
    rawWhitelist: "",
    whitelist: [],
    /* -------------------------- */
    sethost: () => { },
    setstreamAcces: () => { },
    setmutestream: () => { },
    setpresenting: () => { },
    setinteractive: () => { },
    setmuted: () => { },
    setcalls: () => { },
    setstream: () => { },
    setParticipantList: () => { },
    setinactiveList: () => { },
    setpendingList: () => { },
    setfullscreen: () => { },
    setRawWhitelist: () => { },
    setWhitelist: () => { },
}
const context = createContext<SessionProps>(defaultValues)
/* ------ HOOK PROVIDER ----- */
export function useSession() { return useContext<SessionProps>(context) }
/* --------- CONTEXT -------- */
export function SessionContextProvider({ children }: { children: ReactNode }) {
    /* ----- STATES & HOOKS ----- */
    const {
        socket, peer, myInfo,
        meetingCode, setmeetingCode,
    } = useGlobals()
    const [host, sethost] = useState<boolean>(false)
    const [streamAccess, setstreamAcces] = useState<boolean>(false)
    const [mutestream, setmutestream] = useState<boolean>(false)
    const [presenting, setpresenting] = useState<boolean>(false)
    const [interactive, setinteractive] = useState<string>("")
    const [muted, setmuted] = useState<string[]>([])
    const [calls, setcalls] = useState<MediaConnection[]>([])
    const [streamcall, setstreamcall] = useState<MediaConnection | null>(null)
    const [stream, setstream] = useState<MediaStream | null>(null)
    const [participantList, setParticipantList] = useState<UserProps[]>([])
    const [inactiveList, setinactiveList] = useState<UserProps[]>([])
    const [pendingList, setpendingList] = useState<UserProps[]>([])
    const [fullscreen, setfullscreen] = useState<boolean>(false)
    const [rawWhitelist, setRawWhitelist] = useState<string>("")
    const [whitelist, setWhitelist] = useState<string[]>([])
    const [syncedWhitelist, setSyncedWhitelist] = useState<boolean>(false)
    /* ---- SESSION VALIDATOR --- */
    useEffect(() => {
        !meetingCode && redirect("/", RedirectType.replace)
    }, [meetingCode])
    /* ----- SOCKET HANDLER ----- */
    useEffect(() => {
        /* ---- HANDLER FUNCTIONS --- */
        function VisibilityHandler() {
            if (document.hidden && !host) { socket?.emit("inactive", meetingCode, myInfo) }
            else { socket?.emit("active", meetingCode, myInfo) }
        }
        document.addEventListener("visibilitychange", VisibilityHandler)
        //* EMIT (REQ)
        socket?.emit("check-host", meetingCode)
        socket?.emit("participant-list", meetingCode)
        socket?.emit("inactive-list", meetingCode)
        //* ON (RES)
        socket?.on("get-whitelist", (whitelist: string[]) => {
            setWhitelist(whitelist)
            setRawWhitelist(whitelist.join('\n'))
            setSyncedWhitelist(true)
        })
        socket?.on("pending-list", (pendingList: UserProps[]) => setpendingList(pendingList))
        socket?.on("inactive-list", (inactiveList: UserProps[]) => setinactiveList(inactiveList))
        socket?.on("participant-list", (participantList: UserProps[]) => setParticipantList(participantList))
        socket?.on("dissolve-meeting", () => {
            socket.emit("leave-room", meetingCode)
            setmeetingCode("")
        })
        socket?.on("check-host", () => {
            sethost(true)
            socket.emit("get-whitelist", meetingCode)
        })
        //* PEER ON (RES)
        peer?.on("call", call => {
            call.answer(undefined, { sdpTransform: transformSDP })
            call.on("stream", (mainStream) => setstream(mainStream))
            call.on("close", () => {
                call.close()
                if (stream) { for (const track of stream.getTracks()) { track.stop() } }
                setstream(null)
                setpresenting(false)
                setstreamAcces(false)
                setstreamcall(null)
            })
            setstreamcall(call)
        })
        return () => {
            document.removeEventListener("visibilitychange", VisibilityHandler)
            //* SOCKET CLEANUP
            socket?.off("get-whitelist", (whitelist: string[]) => {
                setWhitelist(whitelist)
                setRawWhitelist(whitelist.join('\n'))
                setSyncedWhitelist(true)
            })
            socket?.off("pending-list", (pendingList: UserProps[]) => setpendingList(pendingList))
            socket?.off("inactive-list", (inactiveList: UserProps[]) => setinactiveList(inactiveList))
            socket?.off("participant-list", (participantList: UserProps[]) => setParticipantList(participantList))
            socket?.off("dissolve-meeting", () => {
                socket.emit("leave-room", meetingCode)
                setmeetingCode("")
            })
            socket?.off("check-host", () => {
                sethost(true)
                socket.emit("get-whitelist", meetingCode)
            })
            //* PEER ON (RES)
            peer?.off("call", call => {
                call.answer(undefined, { sdpTransform: transformSDP })
                call.off("stream", (mainStream) => setstream(mainStream))
                call.off("close", () => {
                    call.close()
                    if (stream) { for (const track of stream.getTracks()) { track.stop() } }
                    setstream(null)
                    setpresenting(false)
                    setstreamAcces(false)
                    setstreamcall(null)
                })
                setstreamcall(call)
            })
        }
    }, [])
    /* ------ EVENT HANDLER ----- */
    useEffect(() => {
        if (syncedWhitelist) {
            socket?.emit("update-whitelist", meetingCode, whitelist)
        }
    }, [whitelist])
    /* -------- PROVIDER -------- */
    const defaultValues: SessionProps = {
        host,
        streamAccess,
        mutestream,
        presenting,
        interactive,
        muted,
        calls,
        stream,
        participantList,
        fullscreen,
        inactiveList,
        pendingList,
        rawWhitelist,
        whitelist,
        /* -------------------------- */
        sethost,
        setstreamAcces,
        setmutestream,
        setpresenting,
        setinteractive,
        setmuted,
        setcalls,
        setstream,
        setParticipantList,
        setfullscreen,
        setinactiveList,
        setpendingList,
        setRawWhitelist,
        setWhitelist,
    }
    return <context.Provider value={defaultValues}>{children}</context.Provider>
}