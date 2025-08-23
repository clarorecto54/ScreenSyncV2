export interface UserProps {
    id: string
    name: string
    IPv4: string
}

export interface MessageProps {
    id: string
    name: string
    message: string | string[]
    time: string
}
export interface StreamProps {
    hostID: string
    streamer: UserProps | undefined
    presenting: boolean
}
export interface AttendanceProps {
    id: string
    name: string
    time: string
}
export interface RoomProps {
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