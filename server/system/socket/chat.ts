import { Socket } from "socket.io";
import { UserProps } from "./socket.types";
import { RoomList } from "../cleanups";
import { TimeLog } from "../log";
import { io } from "../../server";
import { writeFileSync } from "fs";
import { readFileSync } from "fs-extra";

export default function ChatSystem(socket: Socket) {
    socket.on("send-message", (targetRoom: string, { id, name }: UserProps, message: string) => {
        RoomList.forEach(room => {
            if (room.id === targetRoom) { //? Find the target room
                if (room.chatlog.length > 0) {
                    const lastMessage = room.chatlog[room.chatlog.length - 1]
                    if ((lastMessage.name === name) && (lastMessage.time === TimeLog()) && (lastMessage.id === id)) {
                        if (typeof lastMessage.message === "string") { lastMessage.message = [lastMessage.message, message] }
                        else { lastMessage.message.push(message) }
                    } else { room.chatlog.push({ id, name, message, time: TimeLog() }) }
                } else { room.chatlog.push({ id, name, message, time: TimeLog() }) }
                io.to(targetRoom).emit("updated-chat", room.chatlog)
                socket.broadcast.to(targetRoom).emit("new-chat")
            }
        })
        //* LOGS
        try {
            const prevData: string = readFileSync(`../log/${targetRoom}/chats.txt`, "utf-8")
            writeFileSync(`../log/${targetRoom}/chats.txt`, prevData.concat(`[ ${TimeLog(true)} ][ ${socket.handshake.address} ][ ${socket.id} ][ ${name} ] ${message}\n`), "utf-8")
        } catch { }
    })
    socket.on("get-chat", (targetRoom: string) =>
        RoomList.forEach(room => {
            if (room.id === targetRoom) { //? Find the target room
                io.to(socket.id).emit("updated-chat", room.chatlog)
            }
        }))
}