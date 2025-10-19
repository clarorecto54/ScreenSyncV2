"use client"
import { ExamProp, ExamSocketMapping, Element } from "@/types/Exam.types";
import { OutputType, SchemaErrors, SchemaPage, SchemaTypes } from "@/types/Schema.types";
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { BuilderPageListener, SchemaDataListener } from "../utils/listeners";
import GenerateBaseSchema from "../utils/generateBaseSchema";
import GenerateSchemaErrorList from "@/components/utils/generateSchemaErrorList";
import { useGlobals } from "@/components/hooks/useGlobals";
import { Socket } from "socket.io-client";
import { useExam } from "@/components/hooks/useExam";
import { DecryptSchema } from "@/components/utils/crypto";
import GeneratePDFResult from "@/components/utils/generatePDFResult";

const context = createContext<SchemaTypes | undefined>(undefined)
export function useSchema(): SchemaTypes { return useContext(context)! }

export function SchemaContextProvider({ children }: { children: ReactNode })
{
    const { socket, meetingCode, myInfo } = useGlobals()
    const { setConsumerMode } = useExam()
    const [output, setOutput] = useState<Record<string, OutputType>>({})
    const outputRef = useRef(output)
    const [mappedSocket] = useState<Socket<ExamSocketMapping>>(socket)
    const [sessionMode, setSessionMode] = useState<boolean>(false)
    const [builderPage, setBuilderPage] = useState<SchemaPage>("Schema List")
    const [schemaKey, setSchemaKey] = useState<string>("")
    const [builderMode, setBuilderMode] = useState<boolean>(false)
    const [schemaData, setSchemaData] = useState<ExamProp>(GenerateBaseSchema())
    const schemaDataRef = useRef(schemaData)
    const [questionId, setQuestionId] = useState<string>("")
    const [schemaErrors, setSchemaErrors] = useState<SchemaErrors>(GenerateSchemaErrorList())
    const [imports, setImports] = useState<Record<string, Element>>({})
    useEffect(() =>
    {
        outputRef.current = output
        schemaDataRef.current = schemaData
    }, [output, schemaData])
    useEffect(() =>
    {
        socket.emit("session-loaded", meetingCode)
        const ExamAvailable: ExamSocketMapping["ExamAvailable"] = (targetRoom) =>
            mappedSocket.emit("TakeExam", targetRoom, (schema) =>
            {
                setSchemaData(DecryptSchema(schema))
                setConsumerMode(true)
            })
        const StopExam: ExamSocketMapping["StopExam"] = () =>
        {
            const instanceOutput = outputRef.current
            const instanceSchemaData = schemaDataRef.current
            const keys = Object.keys(instanceOutput)
            if (keys.length !== 0)
            {
                const totalPoints = keys.length
                let points = 0
                for (const key of keys)
                    if (instanceOutput[key].score)
                        points++
                mappedSocket.emit("SendResult", meetingCode, {
                    id: mappedSocket.id!,
                    examId: schemaData.id,
                    name: myInfo.name,
                    score: points,
                    examName: instanceSchemaData.title,
                    subDesc: instanceSchemaData.description,
                    pdf: GeneratePDFResult({
                        name: myInfo.name,
                        output: instanceOutput,
                        points,
                        schemaData: instanceSchemaData,
                        totalPoints
                    })
                })
            }
            setOutput({})
            setSchemaData(GenerateBaseSchema())
            setConsumerMode(false)
        }
        mappedSocket.on("ExamAvailable", ExamAvailable)
        mappedSocket.on("StopExam", StopExam)
        return () =>
        {
            mappedSocket.off("ExamAvailable", ExamAvailable)
        }
    }, [])
    useEffect(() => BuilderPageListener(builderPage, setSchemaKey), [builderPage])
    useEffect(() => SchemaDataListener(setSchemaData, schemaData), [schemaData])
    const defaultValues: SchemaTypes = {
        output, setOutput,
        sessionMode, setSessionMode,
        builderMode, setBuilderMode,
        builderPage, setBuilderPage,
        schemaKey, setSchemaKey,
        schemaData, setSchemaData,
        questionId, setQuestionId,
        schemaErrors, setSchemaErrors,
        imports, setImports,
    }
    return <context.Provider value={defaultValues}>
        {children}
    </context.Provider>
}