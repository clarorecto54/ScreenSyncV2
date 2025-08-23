import { io, peer } from "../../server"
import { ServerLog } from "../log"

export var PeerCount: number = 0

export default function PeerListener() {
    peer.on("connection", (client) => {
        PeerCount += 1
        ServerLog("peer", `[ CONNECTED ] ${client.getId()}`, true)
        ServerLog("server", `[ CLIENTS ] Socket: ${io.sockets.sockets.size} | Peer: ${PeerCount}`, true)
    })
    peer.on("disconnect", (client) => {
        PeerCount -= 1
        ServerLog("peer", `[ DISCONNECTED ] ${client.getId()}`, true)
        ServerLog("server", `[ CLIENTS ] Socket: ${io.sockets.sockets.size} | Peer: ${PeerCount}`, true)
    })
}