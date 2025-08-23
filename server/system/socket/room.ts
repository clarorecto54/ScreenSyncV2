import { Socket } from "socket.io";
import { RoomProps, UserProps } from "./socket.types";
import { ServerLog, TimeLog } from "../log";
import { io } from "../../server";
import { RoomCleanup, RoomList, SocketCleanup } from "../cleanups";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { readFileSync } from "fs-extra";

export default function RoomSystem(socket: Socket) {
    RoomCleanup()
    socket.on("update-whitelist", (targetRoom: string, whitelist: string[]) => {
        RoomList.forEach(room => {
            if (room.id === targetRoom) {
                room.whitelist = whitelist
            }
        })
        RoomCleanup()
    })
    socket.on("get-whitelist", (targetRoom: string) => {
        RoomList.forEach(room => {
            if (room.id === targetRoom) {
                io.to(socket.id).emit("get-whitelist", room.whitelist)
            }
        })
    })
    socket.on("get-host-name", (targetRoom: string) => {
        RoomList.forEach(room => {
            if (room.id === targetRoom) {
                io.to(socket.id).emit("host-name", room.host.name)
            }
        })
    })
    socket.on("inactive", (targetRoom: string, targetUser: UserProps) => {
        RoomList.forEach(room => {
            if (room.id === targetRoom) { //? Find target room
                room.inactive.push(targetUser) //? Add the inactive user to the list
                io.to(room.host.id).emit("inactive-list", room.inactive) //? Send the updated inactive list to the host
            }
        })
        try {
            const prevData: string = readFileSync(`../log/${targetRoom}/inactive.txt`, "utf-8")
            writeFileSync(`../log/${targetRoom}/inactive.txt`, prevData.concat(`[ ${TimeLog(true)} ][ ${socket.handshake.address} ][ ${socket.id} ][ INACTIVE ] ${targetUser.name}\n`), "utf-8")
        } catch { }
    })
    socket.on("active", (targetRoom: string, targetUser: UserProps) => {
        RoomList.forEach(room => {
            if (room.id === targetRoom) { //? Find the target room
                room.inactive = room.inactive.filter(user => user.id !== targetUser.id) //? Remove the user from the inactive list
                io.to(room.host.id).emit("inactive-list", room.inactive) //? Send the updated inactive list to the host
            }
        })
        try {
            const prevData: string = readFileSync(`../log/${targetRoom}/inactive.txt`, "utf-8")
            writeFileSync(`../log/${targetRoom}/inactive.txt`, prevData.concat(`[ ${TimeLog(true)} ][ ${socket.handshake.address} ][ ${socket.id} ][ ACTIVE ] ${targetUser.name}\n`), "utf-8")
        } catch { }
    })
    socket.on("check-host", (targetRoom: string) => {
        RoomList.forEach(room => {
            if (room.id === targetRoom) { //? Find the target room
                room.host.id === socket.id && io.to(socket.id).emit("check-host")
            }
        })
    })
    socket.on("participant-list", (targetRoom: string) => { RoomList.forEach(room => room.id === targetRoom && io.to(room.id).emit("participant-list", room.participants)) }) //? Sends the updated participant list)
    socket.on("create-room", (room: RoomProps) => {
        const creationTime: string = TimeLog()
        room.entries.push({ //? Creates an attendance of the host
            id: room.host.id,
            name: room.host.name,
            time: creationTime
        })
        RoomList.push(room)
        socket.join(room.id) //? Join the room in socket
        io.local.emit("room-list", RoomList)
        RoomCleanup()
        SocketCleanup()
        ServerLog("server", `[ ROOM ][ ${room.id} ] new room has created.`, true)
        //* LOGS
        if (!existsSync(`../log/${room.id}`)) { mkdirSync(`../log/${room.id}`) }
        if (!existsSync(`../log/${room.id}/attendance.txt`)) { writeFileSync(`../log/${room.id}/attendance.txt`, `[ ${TimeLog(true)} ][ ${socket.handshake.address} ][ ${socket.id} ] ${room.host.name}\n`, "utf-8") }
        if (!existsSync(`../log/${room.id}/chats.txt`)) { writeFileSync(`../log/${room.id}/chats.txt`, "", "utf-8") }
        if (!existsSync(`../log/${room.id}/inactive.txt`)) { writeFileSync(`../log/${room.id}/inactive.txt`, "", "utf-8") }
    })
    socket.on("req-entry", (targetRoom: string, targetUser: UserProps) => {
        RoomList.forEach(room => {
            if (room.id === targetRoom && room.pending) {
                if (!room.participants.some(participant => participant.name.toUpperCase() === targetUser.name.toUpperCase()) && !room.pending.includes(targetUser)) {//? Make sure that the username is not used on the room or pending list
                    room.pending.push(targetUser) //? Add the user to the pending list
                } else { //? This function will trigger when username is already existed in the room or pending list
                    io.to(targetUser.id).emit("existing-req")
                }
                io.to(room.host.id).emit("pending-list", room.pending) //? Send the updated pending list to the host
            }
        })
        RoomCleanup()
    })
    socket.on("cancel-entry", (targetRoom: string, targetUser: UserProps) => {
        RoomList.forEach(room => {
            if (room.id === targetRoom && room.pending) {
                room.pending = room.pending.filter(client => client.id !== targetUser.id) //? Remove user from the pending list
                io.to(room.host.id).emit("pending-list", room.pending) //? Send the updated pending list to the host
            }
        })
        RoomCleanup()
    })
    socket.on("accept-req", (targetRoom: string, targetUser: UserProps) => io.to(targetUser.id).emit("accept-req", targetRoom))
    socket.on("cancel-req", (targetUser: UserProps) => io.to(targetUser.id).emit("cancel-req"))
    socket.on("join-room", (roomID: string, userInfo: UserProps) => {
        RoomList.forEach(room => { //? VALIDATION (Make sure the username is not existed in the room)
            if (room.id === roomID) { //? Find the specific room
                if (room.participants.some(participant => participant.name.toUpperCase() === userInfo.name.toUpperCase())) { //? If username existed
                    io.to(socket.id).emit("user-existed")
                } else { //? Join room if username is not existed
                    if (((userInfo.IPv4 === room.host.IPv4) && (userInfo.name.toUpperCase() === room.host.name.toUpperCase()))) { //? Incase host got reconnected (New ID)
                        room.host.id = socket.id //? Update host ID
                    }
                    room.participants.push(userInfo) //? Adds user to the participants list
                    !room.entries.some(participant => participant.id === socket.id) && room.entries.push({ id: userInfo.id, name: userInfo.name, time: TimeLog() }) //? Adds the attendance of the participant (one time only)
                    io.to(socket.id).emit("join-room", roomID) //? Redirect the client to the room
                    io.to(roomID).emit("participant-list", room.participants) //? Sends the updated participant list
                    io.local.emit("room-list", RoomList) //? Sends the updated roomlist
                    socket.join(roomID) //? Join the room in socket
                }
                if (room.stream.presenting) { //? If a late comer join the meeting while someone is presenting
                    setTimeout(() => {
                        io.to(room.stream.hostID ?? room.stream.streamer?.id).emit("get-stream", socket.id)
                        io.to(socket.id).emit("streaming")
                    }, 1000)
                }
            }
        })
        RoomCleanup()
        SocketCleanup()
        //* LOGS
        try {
            const prevData: string = readFileSync(`../log/${roomID}/attendance.txt`, "utf-8")
            writeFileSync(`../log/${roomID}/attendance.txt`, prevData.concat(`[ ${TimeLog(true)} ][ ${socket.handshake.address} ][ ${socket.id} ] ${userInfo.name}\n`), "utf-8")
        } catch { }
    })
    socket.on("leave-room", (targetRoom: string) => {
        RoomList.forEach(room => {
            if (room.id === targetRoom) { //? Find the target room
                if (room.host.id === socket.id) { //? If host leave the meeting
                    socket.broadcast.to(targetRoom).emit("dissolve-meeting")
                    room.pending?.forEach(client => io.to(client.id).emit("cancel-req"))
                    room.pending = []
                    room.participants = []
                    ServerLog("server", `[ ROOM ][ ${room.id} ] new room has deleted.`, true)
                } else { //? If a participant leave the meeting
                    room.participants = room.participants.filter(participant => participant.id !== socket.id) //? Update the participant list
                    io.to(targetRoom).emit("participant-list", room.participants) //? Sends the updated participant list
                }
            }
        })
        socket.leave(targetRoom) //? Left the room in socket
        io.local.emit("room-list", RoomList) //? Sends the updated roomlist
        RoomCleanup()
        SocketCleanup()
    })

}