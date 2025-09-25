"use client"
import { GlobalProps } from "@/types/globals.types";
import { RoomProps, UserProps } from "@/types/session.types";
import { SystemPopupProps } from "@/types/system.popup.types";
import Peer from "peerjs";
import { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
/* -------- INTERFACE ------- */
const defaultValues: GlobalProps = {
    socket: {} as Socket,
    peer: {} as Peer,
    myInfo: { id: "", IPv4: "", name: "" },
    meetingCode: "",
    systemPopup: null,
    roomList: [],
    rawWhitelist: "",
    whitelist: [],
    /* -------------------------- */
    setmyInfo: () => { },
    setmeetingCode: () => { },
    setsystemPopup: () => { },
    setRawWhitelist: () => { },
    setWhitelist: () => { },
}
const context = createContext<GlobalProps>(defaultValues)
/* ------ HOOK PROVIDER ----- */
export function useGlobals() { return useContext<GlobalProps>(context) }
/* --------- CONTEXT -------- */
export function GlobalContextProvider({ children }: { children: ReactNode })
{
    /* ----- STATES & HOOKS ----- */
    const [socket, setsocket] = useState<Socket>({} as Socket)
    const [peer, setpeer] = useState<Peer>({} as Peer)
    const [myInfo, setmyInfo] = useState<UserProps>({ id: "", IPv4: "", name: "" })
    const [meetingCode, setmeetingCode] = useState<string>("")
    const [systemPopup, setsystemPopup] = useState<SystemPopupProps | null>(null)
    const [roomList, setRoomList] = useState<RoomProps[]>([])
    const [rawWhitelist, setRawWhitelist] = useState<string>("")
    const [whitelist, setWhitelist] = useState<string[]>([])
    const myInfoRef = useRef<UserProps>(myInfo)
    /* ====================================== */
    function ConnectPeer(socketId: string)
    {
        return new Peer(socketId, {
            host: window.location.hostname,
            port: 3002,
            path: "/",
            secure: true,
            pingInterval: 1000,
            config: {
                bundlePolicy: "max-bundle",
                iceCandidatePoolSize: 32,
                iceServers: [{ urls: [`stun:${window.location.hostname}:3003`, `stun:${window.location.hostname}:3004`, `stun:${window.location.hostname}:3005`] }],
                iceTransportPolicy: "all",
                rtcpMuxPolicy: "require",
                sdpSemantics: 'unified-plan'
            }
        })
    }
    /* ====================================== */
    useEffect(() =>
    {
        const socketInstance = io(`https://${window.location.hostname}:3001`)
        function AcceptReq(targetRoom: string)
        {
            setsystemPopup(null) //? Close popup
            socket.emit("join-room", targetRoom, myInfoRef.current) //? Join meeting
        }
        socketInstance.on("accept-req", AcceptReq)
        const ExistingReq = () => setsystemPopup({
            type: "ERROR",
            message: "Your username is already used in this room or someone in the pending list.",
            icon: require("@/public/images/Participants.svg"),
        })
        socketInstance.on("existing-req", ExistingReq)
        const CancelReq = () => setsystemPopup({
            type: "ERROR",
            message: "The host did not allow you to join.",
            icon: require("@/public/images/Close 2.svg")
        })
        socketInstance.on("cancel-req", CancelReq)
        const Alert = () => setsystemPopup({
            type: "ALERT",
            message: "Press close if you're there.",
            icon: require("@/public/images/Alert.svg")
        })
        socketInstance.on("alert", Alert)
        const UserExisted = () => setsystemPopup({
            type: "ERROR",
            message: "Username is already existing on the room. Please change your username.",
            icon: require("@/public/images/Participants.svg"),
        })
        socketInstance.on("user-existed", UserExisted)
        const JoinRoom = (targetRoom: string) => setmeetingCode(targetRoom)
        socketInstance.on("join-room", JoinRoom)
        const RoomList = (rooms: RoomProps[]) => setRoomList(rooms)
        socketInstance.on("room-list", RoomList)
        const OnSocketConnect = () =>
        {
            setmyInfo(prev => ({ ...prev, id: socketInstance.id!, IPv4: window.location.hostname }))
            setpeer(ConnectPeer(socketInstance.id!))
        }
        socketInstance.on("connect", OnSocketConnect)
        const OnSocketDisconnect = () => setmyInfo(prev => ({ ...prev, id: "" }))
        socketInstance.on("disconnect", OnSocketDisconnect)
        setsocket(socketInstance)
        return () =>
        {
            socketInstance.off("accept-req", AcceptReq)
            socketInstance.off("existing-req", ExistingReq)
            socketInstance.off("cancel-req", CancelReq)
            socketInstance.off("alert", Alert)
            socketInstance.off("user-existed", UserExisted)
            socketInstance.off("join-room", JoinRoom)
            socketInstance.off("room-list", RoomList)
            socketInstance.off("connect", OnSocketConnect)
            socketInstance.off("disconnect", OnSocketDisconnect)
        }
    }, [])
    useEffect(() => { myInfoRef.current = myInfo }, [myInfo])
    /* -------- PROVIDER -------- */
    const defaultValues: GlobalProps = {
        socket,
        peer,
        myInfo, setmyInfo,
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