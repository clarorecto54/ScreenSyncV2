import { Socket } from "socket.io";
import { RoomList } from "../cleanups";
import { io } from "../../server";

export default function InteractiveSystem(socket: Socket) {
    socket.on("alert", (targetID: string) => socket.to(targetID).emit("alert"))
    socket.on("kick", (targetID: string) => socket.to(targetID).emit("dissolve-meeting"))
    socket.on("alert-all", (targetRoom: string) => socket.broadcast.to(targetRoom).emit("alert"))
    socket.on("kick-all", (targetRoom: string) => socket.broadcast.to(targetRoom).emit("dissolve-meeting"))
    socket.on("kick-inactive", (targetRoom: string, targetID: string) => {
        RoomList.forEach(room => {
            if (room.id === targetRoom) { //? Find the target room
                io.to(targetID).emit("dissolve-meeting")
                room.inactive = room.inactive.filter(({ id }) => id !== targetID)
                io.to(room.host.id).emit("inactive-list", room.inactive)
            }
        })
    })
    socket.on("alert-all-inactive", (targetRoom: string) => {
        RoomList.forEach(room => {
            if (room.id === targetRoom) { //? Find the target room
                io.to(room.inactive.map(({ id }) => id)).emit("alert")
            }
        })
    })
    socket.on("kick-all-inactive", (targetRoom: string) => {
        RoomList.forEach(room => {
            if (room.id === targetRoom) { //? Find the target room
                io.to(room.inactive.map(({ id }) => id)).emit("dissolve-meeting")
                room.inactive = []
                io.to(room.host.id).emit("inactive-list", room.inactive)
            }
        })
    })
}