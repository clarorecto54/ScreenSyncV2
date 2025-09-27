import { Server, Socket } from "socket.io";
import { ExamProp, ExamSocketMapping, SchemaSavefile } from "./exam.types";
import { Decrypt, Encrypt } from "../../utils/crypto";
import { readFileSync, writeFileSync } from "fs-extra";
import { ServerLog } from "../log";
import { io } from "../../server";

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
            data: Encrypt(schema)
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
        for (const save of saveList)
            list.push(Decrypt(save.data))
        SendSchema(list)
        ServerLog("socket", `${socket.id} has recevied the updated list of schema`)
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