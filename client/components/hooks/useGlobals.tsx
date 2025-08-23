"use client"
import { GlobalProps } from "@/types/globals.types";
import { RoomProps, UserProps } from "@/types/session.types";
import { SystemPopupProps } from "@/types/system.popup.types";
import Peer from "peerjs";
import { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
/* -------- INTERFACE ------- */
const defaultValues: GlobalProps = {
    socket: null,
    peer: null,
    myInfo: { id: "", IPv4: "", name: "" },
    IPv4: "",
    meetingCode: "",
    systemPopup: null,
    roomList: [],
    rawWhitelist: "",
    whitelist: [],
    /* -------------------------- */
    setsocket: () => { },
    setpeer: () => { },
    setmyInfo: () => { },
    setIPv4: () => { },
    setmeetingCode: () => { },
    setsystemPopup: () => { },
    setRawWhitelist: () => { },
    setWhitelist: () => { },
}
const context = createContext<GlobalProps>(defaultValues)
/* ------ HOOK PROVIDER ----- */
export function useGlobals() { return useContext<GlobalProps>(context) }
/* --------- CONTEXT -------- */
export function GlobalContextProvider({ children }: { children: ReactNode }) {
    /* ----- STATES & HOOKS ----- */
    const [socket, setsocket] = useState<Socket | null>(null)
    const [peer, setpeer] = useState<Peer | null>(null)
    const [myInfo, setmyInfo] = useState<UserProps>({ id: "", IPv4: "", name: "" })
    const [IPv4, setIPv4] = useState<string>("")
    const [meetingCode, setmeetingCode] = useState<string>("")
    const [systemPopup, setsystemPopup] = useState<SystemPopupProps | null>(null)
    const [roomList, setRoomList] = useState<RoomProps[]>([])
    const [rawWhitelist, setRawWhitelist] = useState<string>("")
    const [whitelist, setWhitelist] = useState<string[]>([])
    const myInfoRef = useRef<UserProps>(myInfo)
    /* ------- IP HANDLER ------- */
    useEffect(() => {
        if (!IPv4) {
            fetch("/api/getIP", { cache: "no-store" })
                .then(res => res.text())
                .then(IP => {
                    setIPv4(IP)
                })
        } else {
            setsocket(io(`https://${IPv4}:3001`, {
                transports: ["websocket", "polling"]
            }))
        }
    }, [IPv4])
    /* ----- SOCKET HANDLER ----- */
    useEffect(() => {
        if (socket) {
            //* EMIT (REQ)
            socket.emit("my-ipv4")
            //* ON (RES)
            socket.on("accept-req", (targetRoom: string) => {
                console.log(myInfoRef.current)
                setsystemPopup(null) //? Close popup
                socket.emit("join-room", targetRoom, myInfoRef.current) //? Join meeting
            })
            socket.on("existing-req", () => setsystemPopup({
                type: "ERROR",
                message: "Your username is already used in this room or someone in the pending list.",
                icon: require("@/public/images/Participants.svg"),
            }))
            socket.on("cancel-req", () => setsystemPopup({
                type: "ERROR",
                message: "The host did not allow you to join.",
                icon: require("@/public/images/Close 2.svg")
            }))
            socket.on("alert", () => setsystemPopup({
                type: "ALERT",
                message: "Press close if you're there.",
                icon: require("@/public/images/Alert.svg")
            }))
            socket.on("user-existed", () => setsystemPopup({
                type: "ERROR",
                message: "Username is already existing on the room. Please change your username.",
                icon: require("@/public/images/Participants.svg"),
            }))
            socket.on("join-room", (targetRoom: string) => {
                setmeetingCode(targetRoom)
            })
            socket.on("room-list", (rooms: RoomProps[]) => setRoomList(rooms))
            socket.on("my-ipv4", (myIPv4: string) => setmyInfo(prev => ({ ...prev, IPv4: myIPv4 })))
            socket.on("connect", () => {
                if (typeof window !== "undefined") {
                    setmyInfo(prev => ({ ...prev, id: socket.id }))
                    setpeer(new Peer(socket.id, {
                        host: IPv4,
                        port: 3002,
                        path: "/",
                        secure: true,
                        pingInterval: 1000,
                        config: {
                            bundlePolicy: "max-bundle",
                            iceCandidatePoolSize: 32,
                            iceServers: [{ urls: ["stun:192.168.2.49:3003", "stun:192.168.2.49:3004", "stun:192.168.2.49:3005"] }],
                            iceTransportPolicy: "all",
                            rtcpMuxPolicy: "require",
                            sdpSemantics: 'unified-plan'
                        }
                    }))
                }
            })
            socket.on("disconnect", () => setmyInfo(prev => ({ ...prev, id: "" })))
        }
        return () => {
            if (socket) {
                socket.off("accept-req", (targetRoom: string) => {
                    console.log(myInfoRef.current)
                    setsystemPopup(null) //? Close popup
                    socket.emit("join-room", targetRoom, myInfoRef.current) //? Join meeting
                })
                socket.off("existing-req", () => setsystemPopup({
                    type: "ERROR",
                    message: "Your username is already used in this room or someone in the pending list.",
                    icon: require("@/public/images/Participants.svg"),
                }))
                socket.off("cancel-req", () => setsystemPopup({
                    type: "ERROR",
                    message: "The host did not allow you to join.",
                    icon: require("@/public/images/Close 2.svg")
                }))
                socket.off("alert", () => setsystemPopup({
                    type: "ALERT",
                    message: "Press close if you're there.",
                    icon: require("@/public/images/Alert.svg")
                }))
                socket.off("user-existed", () => setsystemPopup({
                    type: "ERROR",
                    message: "Username is already existing on the room. Please change your username.",
                    icon: require("@/public/images/Participants.svg"),
                }))
                socket.off("join-room", (targetRoom: string) => {
                    setmeetingCode(targetRoom)
                })
                socket.off("room-list", (rooms: RoomProps[]) => setRoomList(rooms))
                socket.off("my-ipv4", (myIPv4: string) => setmyInfo(prev => ({ ...prev, IPv4: myIPv4 })))
                socket.off("connect", () => {
                    if (typeof window !== "undefined") {
                        setmyInfo(prev => ({ ...prev, id: socket.id }))
                        setpeer(new Peer(socket.id, {
                            host: IPv4,
                            port: 3002,
                            path: "/",
                            secure: true,
                            pingInterval: 1000,
                            config: {
                                bundlePolicy: "max-bundle",
                                iceCandidatePoolSize: 32,
                                iceServers: [{ urls: ["stun:192.168.2.49:3003", "stun:192.168.2.49:3004", "stun:192.168.2.49:3005"] }],
                                iceTransportPolicy: "all",
                                rtcpMuxPolicy: "require",
                                sdpSemantics: 'unified-plan'
                            }
                        }))
                    }
                })
                socket.off("disconnect", () => setmyInfo(prev => ({ ...prev, id: "" })))
            }
        }
    }, [socket])
    useEffect(() => { myInfoRef.current = myInfo }, [myInfo])
    /* -------- PROVIDER -------- */
    const defaultValues: GlobalProps = {
        socket, setsocket,
        peer, setpeer,
        myInfo, setmyInfo,
        IPv4, setIPv4,
        meetingCode, setmeetingCode,
        systemPopup, setsystemPopup,
        roomList,
        rawWhitelist, setRawWhitelist,
        whitelist, setWhitelist,
    }
    return <context.Provider value={defaultValues}>
        {children}
    </context.Provider>
}