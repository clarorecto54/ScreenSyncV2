import { Socket } from "socket.io-client";
import { Peer } from "peerjs"
import { Dispatch, SetStateAction } from "react"
import { RoomProps, UserProps } from "./session.types";
import { SystemPopupProps } from "./system.popup.types";
interface GlobalProps {
    socket: Socket | null
    peer: Peer | null
    myInfo: UserProps
    IPv4: string
    meetingCode: string
    systemPopup: SystemPopupProps | null
    roomList: RoomProps[]
    rawWhitelist: string,
    whitelist: string[],
    /* -------------------------- */
    setsocket: Dispatch<SetStateAction<Socket | null>>
    setpeer: Dispatch<SetStateAction<Peer | null>>
    setmyInfo: Dispatch<SetStateAction<UserProps>>
    setIPv4: Dispatch<SetStateAction<string>>
    setmeetingCode: Dispatch<SetStateAction<string>>
    setsystemPopup: Dispatch<SetStateAction<SystemPopupProps | null>>
    setRawWhitelist: Dispatch<SetStateAction<string>>,
    setWhitelist: Dispatch<SetStateAction<string[]>>
}