import { Server, Socket } from "socket.io";
import { ExamProp, ExamSocketMapping, SchemaMetrics, SchemaSavefile } from "./exam.types";
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
        let metric: SchemaMetrics = {
            totalTakers: 0,
            totalScores: 0,
            avgScore: 0,
            maxScore: 0,
            minScore: 0
        };
        const existing = saveList.some(save => save.id === schema.id)
        if (existing)
        {
            const target = saveList.find(target => target.id === schema.id)!
            metric = target.metric
            saveList = saveList.filter(save => save.id !== schema.id)
        }
        const savefile: SchemaSavefile = {
            id: schema.id,
            name: schema.title,
            subject: schema.description,
            date: new Date(),
            data: EncryptSchema(schema),
            results: [],
            metric
        }
        saveList.push(savefile)
        UpdateSavefile(path, saveList)
        saveList = ReadSavefile(path)
    })
    socket.on("DeleteSchema", (schema) =>
    {
        const existing = saveList.some(save => save.id === schema.id)
        if (!existing) return
        saveList = saveList.filter(save => save.id !== schema.id)
        UpdateSavefile(path, saveList)
        saveList = ReadSavefile(path)
    })
    socket.on("GetSchema", (SendSchema) =>
    {
        ServerLog("socket", `${socket.id} is requesting for the list of schema...`)
        let saveSchema: boolean = false
        const list: ExamProp[] = []
        for (const save of saveList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
        {
            if (save.metric === undefined || save.metric === null)
            {
                save.metric = {
                    totalTakers: 0,
                    totalScores: 0,
                    avgScore: 0,
                    maxScore: 0,
                    minScore: 0
                }
                saveSchema = true
            }
            if (save.results === undefined || save.results === null)
            {
                save.results = []
                saveSchema = true
            }
            list.push(DecryptSchema(save.data))
        }
        SendSchema(list)
        if (saveSchema)
        {
            UpdateSavefile(path, saveList)
            saveList = ReadSavefile(path)
        }
        ServerLog("socket", `${socket.id} has recevied the updated list of schema`)
    })
    socket.on("SendOutExam", (targetRoom, encryptedSchema) =>
    {
        const room = RoomList.find(room => room.id === targetRoom)!
        room.exam = {
            active: true,
            encryptedSchema,
            studentIds: []
        }
        socket.to(targetRoom).emit("ExamAvailable", targetRoom)
    })
    socket.on("TakeExam", (targetRoom, SendExam) =>
    {
        const room = RoomList.find(room => room.id === targetRoom)!
        room.exam.studentIds.push(socket.id)
        socket.to(room.host.id).emit("SendExamStatus", room.exam.studentIds.length)
        SendExam(room.exam.encryptedSchema)
    })
    socket.on("StopExam", (targetRoom) =>
    {
        const room = RoomList.find(room => room.id === targetRoom)!
        room.exam = {
            active: false,
            encryptedSchema: "",
            studentIds: []
        }
        socket.to(room.host.id).emit("SendExamStatus", room.exam.studentIds.length)
        socket.to(targetRoom).emit("StopExam", targetRoom)
    })
    socket.on("SendResult", (targetRoom, result) =>
    {
        const room = RoomList.find(room => room.id === targetRoom)!
        room.exam.studentIds = room.exam.studentIds.filter(id => id !== socket.id)
        const schema = saveList.find(schema => schema.id === result.examId)!
        schema.results.push(result)
        let scores: number = 0;
        schema.results.forEach(result => scores += result.score)
        schema.metric.totalTakers = schema.results.length
        schema.metric.totalScores = scores
        schema.metric.avgScore = schema.metric.totalScores / schema.metric.totalTakers
        if (schema.metric.maxScore < result.score) schema.metric.maxScore = result.score
        if (schema.metric.minScore > result.score) schema.metric.minScore = result.score
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
        UpdateSavefile(path, saveList)
        saveList = ReadSavefile(path)
        socket.to(room.host.id).emit("SendExamStatus", room.exam.studentIds.length)
        socket.to(room.host.id).emit("UpdatedSchemaMetrics", schema.results, schema.metric)
    })
    socket.on("GetSchemaMetrics", (schemaId, cb) =>
    {
        const target = saveList.find(save => save.id === schemaId)!
        cb(target.results, target.metric)
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