import { Socket } from "socket.io-client";
import { Peer } from "peerjs"
import { Dispatch, SetStateAction } from "react"
import { RoomProps, UserProps } from "./session.types";
import { SystemPopupProps } from "./system.popup.types";
interface GlobalProps
{
    socket: Socket
    peer: Peer
    myInfo: UserProps
    meetingCode: string
    systemPopup: SystemPopupProps | null
    roomList: RoomProps[]
    rawWhitelist: string,
    whitelist: string[],
    /* -------------------------- */
    setmyInfo: Dispatch<SetStateAction<UserProps>>
    setmeetingCode: Dispatch<SetStateAction<string>>
    setsystemPopup: Dispatch<SetStateAction<SystemPopupProps | null>>
    setRawWhitelist: Dispatch<SetStateAction<string>>,
    setWhitelist: Dispatch<SetStateAction<string[]>>
}