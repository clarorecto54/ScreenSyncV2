import { Server, Socket } from "socket.io";
import { ExamMetric, ExamProp, ExamSocketMapping, SchemaMetrics, SchemaResults, SchemaSavefile } from "./exam.types";
import { readFileSync, writeFileSync } from "fs-extra";
import { ServerLog } from "../log";
import { RoomList } from "../cleanups";
import { existsSync, mkdirSync } from "fs";
import { DecryptSchema, EncryptSchema } from "../../utils/crypto";
import { io } from "../../server";
import { Mutex } from "async-mutex";

const filelock = new Mutex()

export default function ExamSocketListener(socket: Socket<ExamSocketMapping>)
{
    const filename = "Exam-Templates.json"
    const path = `../${filename}`
    
    // Initialize file if it doesn't exist
    if (!existsSync(path))
    {
        ServerLog("server", `${filename} has not been found, creating a new one...`)
        writeFileSync(path, JSON.stringify([], null, 1), "utf-8")
        ServerLog("server", `${filename} has been created`)
    }
    
    socket.on("SaveSchema", async (schema) =>
    {
        await filelock.runExclusive(() =>
        {
            ServerLog("server", `Saving schema...`)
            
            // Read fresh data inside mutex
            const saveList = ReadSavefile(path)
            
            let metric: ExamMetric = {
                totalTakers: 0,
                totalScores: 0,
                avgScore: 0,
                maxScore: 0,
                minScore: 0
            }
            
            const existingIndex = saveList.findIndex(save => save.id === schema.id)
            if (existingIndex !== -1)
            {
                metric = saveList[existingIndex].metric
                saveList.splice(existingIndex, 1)
            }
            
            const savefile: SchemaSavefile = {
                id: schema.id,
                name: schema.title,
                subject: schema.description,
                date: new Date(),
                data: EncryptSchema(schema),
                results: existingIndex !== -1 ? saveList[existingIndex]?.results || [] : [],
                metric
            }
            
            saveList.push(savefile)
            
            // Write inside mutex
            writeFileSync(path, JSON.stringify(saveList, null, 1), "utf-8")
            
            const mappedServer: Server<ExamSocketMapping> = io
            mappedServer.emit("UpdatedSchema")
            
            ServerLog("server", `Schema has been saved`)
        })
    })
    
    socket.on("DeleteSchema", async (schema) =>
    {
        await filelock.runExclusive(() =>
        {
            ServerLog("server", `Deleting schema...`)
            
            const saveList = ReadSavefile(path)
            const existing = saveList.some(save => save.id === schema.id)
            
            if (!existing) return
            
            const filtered = saveList.filter(save => save.id !== schema.id)
            writeFileSync(path, JSON.stringify(filtered, null, 1), "utf-8")
            
            const mappedServer: Server<ExamSocketMapping> = io
            mappedServer.emit("UpdatedSchema")
            
            ServerLog("server", `Schema has been deleted`)
        })
    })
    
    socket.on("GetSchema", async (SendSchema) =>
    {
        ServerLog("socket", `${socket.id} is requesting for the list of schema...`)
        
        const { lists, results, metrics, needsSave } = await filelock.runExclusive(() =>
        {
            const saveList = ReadSavefile(path)
            let saveSchema = false
            const lists: ExamProp[] = []
            const results: SchemaResults[] = []
            const metrics: SchemaMetrics[] = []
            
            for (const save of saveList)
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
                lists.push(DecryptSchema(save.data))
                results.push({
                    id: save.id,
                    result: save.results
                })
                metrics.push({
                    id: save.id,
                    metric: save.metric
                })
            }
            
            if (saveSchema)
            {
                writeFileSync(path, JSON.stringify(saveList, null, 1), "utf-8")
            }
            
            // Sort by date descending
            const sorted = lists
                .map((list, idx) => ({ list, result: results[idx], metric: metrics[idx], date: saveList[idx].date }))
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            
            return {
                lists: sorted.map(s => s.list),
                results: sorted.map(s => s.result),
                metrics: sorted.map(s => s.metric),
                needsSave: saveSchema
            }
        })
        
        SendSchema(lists, results, metrics)
        ServerLog("socket", `${socket.id} has received the updated list of schema`)
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
    
    socket.on("SendResult", async (targetRoom, result) =>
    {
        await filelock.runExclusive(() =>
        {
            ServerLog("server", `Processing exam result from ${socket.id}...`)
            
            // Read fresh data inside mutex
            const saveList = ReadSavefile(path)
            
            const schema = saveList.find(schema => schema.id === result.examId)
            if (!schema)
            {
                ServerLog("server", `Schema ${result.examId} not found!`)
                return
            }
            
            // Add result
            schema.results.push(result)
            
            // Recalculate metrics
            let scores = 0
            schema.results.forEach(r => scores += r.score)
            
            schema.metric.totalTakers = schema.results.length
            schema.metric.totalScores = scores
            schema.metric.avgScore = schema.metric.totalScores / schema.metric.totalTakers
            
            // Update max score
            if (schema.metric.totalTakers === 1 || result.score > schema.metric.maxScore)
            {
                schema.metric.maxScore = result.score
            }
            
            // Update min score
            if (schema.metric.totalTakers === 1 || result.score < schema.metric.minScore)
            {
                schema.metric.minScore = result.score
            }
            
            // Save PDF file
            const folderPath = `../Exam Results/${result.examName}/${result.subDesc}`
            const filename = `${(result.name ?? "unknown").toUpperCase()}`
            const ext = ".pdf"
            let filePath = `${folderPath}/${filename}${ext}`
            let takeCount = 1
            
            if (!existsSync(folderPath))
            {
                mkdirSync(folderPath, { recursive: true })
            }
            
            while (existsSync(filePath))
            {
                filePath = `${folderPath}/${filename}_${takeCount++}${ext}`
            }
            
            writeFileSync(filePath, Buffer.from(result.pdf))
            
            // Write updated saveList
            writeFileSync(path, JSON.stringify(saveList, null, 1), "utf-8")
            
            const mappedServer: Server<ExamSocketMapping> = io
            mappedServer.emit("UpdatedSchema")
            
            ServerLog("server", `Exam result saved successfully`)
        })
        
        // Update room state outside mutex (this is in-memory)
        const room = RoomList.find(room => room.id === targetRoom)
        if (room)
        {
            room.exam.studentIds = room.exam.studentIds.filter(id => id !== socket.id)
            socket.to(room.host.id).emit("SendExamStatus", room.exam.studentIds.length)
        }
    })
    
    socket.on("GetSchemaMetrics", async (schemaId, cb) =>
    {
        await filelock.runExclusive(() =>
        {
            const saveList = ReadSavefile(path)
            const target = saveList.find(save => save.id === schemaId)
            
            if (target)
            {
                cb(target.results, target.metric)
            }
        })
    })
}

function ReadSavefile(path: string): SchemaSavefile[]
{
    const raw = readFileSync(path, "utf-8")
    return JSON.parse(raw) as SchemaSavefile[]
}