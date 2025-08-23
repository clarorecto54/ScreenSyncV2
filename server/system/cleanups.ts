import { httpsServer, io, turn1, turn2, turn3 } from "../server"
import GETIP from "./ipv4"
import { TimeLog } from "./log"
import { RoomProps } from "./socket/socket.types"

export function GracefulShutdown() {
    io.close(() => {
        console.log(`[ ${TimeLog(true)} ][ SOCKET STOPP ] https://${GETIP()}:3001`)
        turn1.stop(); turn2.stop(); turn3.stop()
        httpsServer.close(() => {
            console.log(`[ ${TimeLog(true)} ][ PEER STOP ] https://${GETIP()}:3002`)
            process.exit(1)
        })
    })
}

export function SocketCleanup() {
    const activeSockets: string[] = []
    io.sockets.sockets.forEach(socket => activeSockets.push(socket.id))
    RoomList.forEach(room => {
        room.participants = room.participants.filter(client => activeSockets.includes(client.id))
        room.inactive = room.inactive.filter(client => activeSockets.includes(client.id))
        io.to(room.id).emit("participant-list", room.participants)
        io.to(room.id).emit("inactive-list", room.inactive)
        if (room.pending) {
            room.pending = room.pending.filter(client => activeSockets.includes(client.id))
            io.to(room.id).emit("pending-list", room.pending)
        }
    })
}

export var RoomList: RoomProps[] = []

export function RoomCleanup() {
    RoomList = RoomList.filter(room => { return room.participants.length !== 0 })
    io.local.emit("room-list", RoomList)
    SocketCleanup()
}