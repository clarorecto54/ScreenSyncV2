import { MediaConnection } from "peerjs"
import { Dispatch, SetStateAction } from "react"

interface SessionProps {
    host: boolean
    streamAccess: boolean
    mutestream: boolean
    presenting: boolean
    interactive: string
    muted: string[]
    calls: MediaConnection[]
    stream: MediaStream | null
    participantList: UserProps[]
    inactiveList: UserProps[]
    pendingList: UserProps[]
    fullscreen: boolean
    rawWhitelist: string,
    whitelist: string[],
    /* -------------------------- */
    sethost: Dispatch<SetStateAction<boolean>>
    setstreamAcces: Dispatch<SetStateAction<boolean>>
    setmutestream: Dispatch<SetStateAction<boolean>>
    setpresenting: Dispatch<SetStateAction<boolean>>
    setinteractive: Dispatch<SetStateAction<string>>
    setmuted: Dispatch<SetStateAction<string[]>>
    setcalls: Dispatch<SetStateAction<MediaConnection[]>>
    setstream: Dispatch<SetStateAction<MediaStream | null>>
    setParticipantList: Dispatch<SetStateAction<UserProps[]>>
    setinactiveList: Dispatch<SetStateAction<UserProps[]>>
    setpendingList: Dispatch<SetStateAction<UserProps[]>>
    setfullscreen: Dispatch<SetStateAction<boolean>>
    setRawWhitelist: Dispatch<SetStateAction<string>>,
    setWhitelist: Dispatch<SetStateAction<string[]>>
}

interface UserProps {
    id: string
    name: string
    IPv4: string
}

interface MessageProps {
    id: string
    name: string
    message: string | string[]
    time: string
}
interface StreamProps {
    hostID: string
    streamer: UserProps | undefined
    presenting: boolean
}
interface AttendanceProps {
    id: string
    name: string
    time: string
}
interface RoomProps {
    id: string
    key: string
    host: UserProps
    participants: UserProps[]
    whitelist: string[]
    pending: UserProps[]
    chatlog: MessageProps[]
    stream: StreamProps
    entries: AttendanceProps[]
    inactive: UserProps[]
    strict: boolean
}