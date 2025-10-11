import { Server, Socket } from "socket.io";
import { ExamProp, ExamSocketMapping, SchemaSavefile } from "./exam.types";
import { readFileSync, writeFileSync } from "fs-extra";
import { ServerLog } from "../log";
import { io } from "../../server";
import { RoomList } from "../cleanups";
import { existsSync, mkdirSync } from "fs";
import { DecryptSchema, EncryptSchema } from "../../utils/crypto";

export default function ExamSocketListener(socket: Socket<ExamSocketMapping>)
{
    const filename = "Exam-Templates.json"
    const path = `../${filename}`
    let saveList: SchemaSavefile[] = []
    try
    {
        ServerLog("server", `Loading all schema...`)
        const raw = readFileSync(path, "utf-8")
        saveList = JSON.parse(raw) as SchemaSavefile[]
        ServerLog("server", `All schema has been loaded`)
    } catch
    {
        ServerLog("server", `${filename} has not been found, creating a new one...`)
        writeFileSync(
            path,
            JSON.stringify(saveList, null, 1),
            "utf-8"
        )
        ServerLog("server", `${filename} has been created`)
    }
    socket.on("SaveSchema", (schema) =>
    {
        const existing = saveList.some(save => save.id === schema.id)
        if (existing) saveList = saveList.filter(save => save.id !== schema.id)
        const savefile: SchemaSavefile = {
            id: schema.id,
            name: schema.title,
            subject: schema.description,
            date: new Date(),
            data: EncryptSchema(schema)
        }
        saveList.push(savefile)
        UpdateSavefile(path, saveList)
    })
    socket.on("DeleteSchema", (schema) =>
    {
        const existing = saveList.some(save => save.id === schema.id)
        if (!existing) return
        saveList = saveList.filter(save => save.id !== schema.id)
        UpdateSavefile(path, saveList)
    })
    socket.on("GetSchema", (SendSchema) =>
    {
        ServerLog("socket", `${socket.id} is requesting for the list of schema...`)
        const list: ExamProp[] = []
        for (const save of saveList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
            list.push(DecryptSchema(save.data))
        SendSchema(list)
        ServerLog("socket", `${socket.id} has recevied the updated list of schema`)
    })
    socket.on("SendOutExam", (targetRoom, encryptedSchema) =>
    {
        const room = RoomList.find(room => room.id === targetRoom)!
        room.exam = {
            active: true,
            encryptedSchema
        }
        socket.to(targetRoom).emit("ExamAvailable", targetRoom)
    })
    socket.on("TakeExam", (targetRoom, SendExam) =>
    {
        const room = RoomList.find(room => room.id === targetRoom)!
        SendExam(room.exam.encryptedSchema)
    })
    socket.on("StopExam", (targetRoom) =>
    {
        const room = RoomList.find(room => room.id === targetRoom)!
        room.exam = {
            active: false,
            encryptedSchema: ""
        }
        socket.to(targetRoom).emit("StopExam", targetRoom)
    })
    socket.on("SendResult", (targetRoom, result) =>
    {
        const room = RoomList.find(room => room.id === targetRoom)!
        socket.to(room.host.id).emit("ReceiveResult", result)
        const folderPath = `../Exam Results/${result.examName}/${result.subDesc}`
        const filename = `${(result.name ?? "unkown").toUpperCase()}`
        const ext = ".pdf"
        let filePath = `${folderPath}/${filename}${ext}`
        let takeCount = 1
        if (!existsSync(folderPath))
            mkdirSync(folderPath, { recursive: true })
        while (existsSync(filePath))
            filePath = `${folderPath}/${filename}_${takeCount++}${ext}`
        writeFileSync(filePath, Buffer.from(result.pdf))
    })
}

function ReadSavefile(path: string): SchemaSavefile[]
{
    ServerLog("server", `Loading all schema...`)
    const raw = readFileSync(path, "utf-8")
    const updatedList = JSON.parse(raw) as SchemaSavefile[]
    ServerLog("server", `All schema has been loaded`)
    return updatedList
}

function UpdateSavefile(path: string, saveList: SchemaSavefile[])
{
    ServerLog("server", `Saving schema...`)
    writeFileSync(
        path,
        JSON.stringify(saveList, null, 1),
        "utf-8"
    )
    const mappedServer: Server<ExamSocketMapping> = io
    mappedServer.emit("UpdatedSchema")
    ServerLog("server", `Schema has been saved`)
}