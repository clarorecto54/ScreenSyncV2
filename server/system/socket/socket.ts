import { io } from "../../server"
import { RoomCleanup, SocketCleanup } from "../cleanups"
import { ServerLog, TimeLog } from "../log"
import { PeerCount } from "../peer/peer"
import ChatSystem from "./chat"
import InteractiveSystem from "./interactive"
import RoomSystem from "./room"
import StreamSystem from "./stream"

export default function SocketListener() {
    io.on("connection", socket => {
        //* CLIENT CONNECTION
        io.local.emit("leave-room")
        RoomCleanup()
        ServerLog("server", `[ CLIENTS ] Socket: ${io.sockets.sockets.size} | Peer: ${PeerCount}`, true)
        ServerLog("socket", `[ CONNECTED ] ${socket.id}`, true)
        //* CLIENT DISCONNECTION
        socket.on("disconnect", () => {
            RoomCleanup()
            ServerLog("server", `[ CLIENTS ] Socket: ${io.sockets.sockets.size} | Peer: ${PeerCount}`, true)
            ServerLog("socket", `[ DISCONNECTED ] ${socket.id}`, true)
        })
        //* SERVER TIME & PING
        setInterval(() => {
            socket.local.emit("get-server-time", TimeLog(true))
        }, 1000)
        socket.on("ping", (callback: () => void) => {
            callback()
        })
        //* GETTING IPV4
        socket.on("my-ipv4", () => {
            io.to(socket.id).emit("my-ipv4", socket.handshake.address)
        })
        /* -------------------------- */
        RoomSystem(socket)
        ChatSystem(socket)
        InteractiveSystem(socket)
        StreamSystem(socket)
    })
}