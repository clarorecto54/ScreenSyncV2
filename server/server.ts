import { PeerServer } from "peer"
import { createServer } from "https"
import { Server } from "socket.io"
import { readFileSync, existsSync, mkdirSync } from "fs"
import { TimeLog } from "./system/log"
import Turn from "node-turn"
import GETIP from "./system/ipv4"
import SocketListener from "./system/socket/socket"
import { GracefulShutdown } from "./system/cleanups"
import PeerListener from "./system/peer/peer"
/* ----- INITIALIZATION ----- */
export const httpsServer = createServer({
    cert: readFileSync("../SSL/server.crt", "utf-8"),
    key: readFileSync("../SSL/server.key", "utf-8")
}, require("express")())
export const io = new Server(httpsServer, {
    cors: { origin: "*" },
    transports: ["websocket", "polling"]
})
export const peer = PeerServer({
    ssl: {
        cert: readFileSync("../SSL/server.crt", "utf-8"),
        key: readFileSync("../SSL/server.key", "utf-8")
    },
    allow_discovery: true,
    proxied: true,
    port: 3002,
    path: "/",
})
export const turn1 = new Turn({
    listeningPort: 3003,
    authMech: "none",
    // debug: (level, message) => {
    //     level = "ALL"
    //     ServerLog("server", `[ TURN 1 ] ${message}`, true)
    // }
})
export const turn2 = new Turn({
    listeningPort: 3004,
    authMech: "none",
    // debug: (level, message) => {
    //     level = "ALL"
    //     ServerLog("server", `[ TURN 2 ] ${message}`, true)
    // }
})
export const turn3 = new Turn({
    listeningPort: 3005,
    authMech: "none",
    // debug: (level, message) => {
    //     level = "ALL"
    //     ServerLog("server", `[ TURN 3 ] ${message}`, true)
    // }
})
/* ------ API HANDLING ------ */
turn1.start(); turn2.start(); turn3.start()
SocketListener(); PeerListener()
/* ----- SERVER STARTUP ----- */
process.on("SIGINT", GracefulShutdown) //? CTRL + C EVENT
process.on("SIGTERM", GracefulShutdown) //? Terminal got closed
process.on("SIGHUP", GracefulShutdown) //? Terminal hang up
httpsServer
    .once("error", GracefulShutdown)
    .listen(3001, () => {
        (!existsSync("../log/") && mkdirSync("../log/"))
        console.clear() //? Clear the log
        console.log(`[ ${TimeLog(true)} ][ RUNNING ][ SOCKET ] https://${GETIP()}:3001`)
        console.log(`[ ${TimeLog(true)} ][ RUNNING ][ PEER ] https://${GETIP()}:3002`)
        console.log(`[ ${TimeLog(true)} ][ RUNNING ][ STUN ] stun:${GETIP()}:3003`)
        console.log(`[ ${TimeLog(true)} ][ RUNNING ][ STUN ] stun:${GETIP()}:3004`)
        console.log(`[ ${TimeLog(true)} ][ RUNNING ][ STUN ] stun:${GETIP()}:3005`)
    })