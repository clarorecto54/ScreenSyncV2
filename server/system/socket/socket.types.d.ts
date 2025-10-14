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
export interface ExamState
{
    active: boolean
    encryptedSchema: string
    studentIds: string[]
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
    exam: ExamState
    entries: AttendanceProps[]
    inactive: UserProps[]
    strict: boolean
}