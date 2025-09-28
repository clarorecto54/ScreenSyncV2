"use client"
import { ExamProp, ExamSocketMapping } from "@/types/Exam.types";
import { SchemaErrors, SchemaPage, SchemaTypes } from "@/types/Schema.types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { BuilderPageListener, SchemaDataListener } from "../utils/listeners";
import GenerateBaseSchema from "../utils/generateBaseSchema";
import GenerateSchemaErrorList from "@/components/utils/generateSchemaErrorList";
import { useGlobals } from "@/components/hooks/useGlobals";
import { Socket } from "socket.io-client";
import { useExam } from "@/components/hooks/useExam";
import { Decrypt } from "@/components/utils/crypto";

const context = createContext<SchemaTypes | undefined>(undefined)
export function useSchema(): SchemaTypes { return useContext(context)! }

export function SchemaContextProvider({ children }: { children: ReactNode })
{
    const { socket } = useGlobals()
    const { setConsumerMode } = useExam()
    const [mappedSocket] = useState<Socket<ExamSocketMapping>>(socket)
    const [sessionMode, setSessionMode] = useState<boolean>(false)
    const [builderPage, setBuilderPage] = useState<SchemaPage>("Schema List")
    const [schemaKey, setSchemaKey] = useState<string>("")
    const [builderMode, setBuilderMode] = useState<boolean>(false)
    const [schemaData, setSchemaData] = useState<ExamProp>(GenerateBaseSchema())
    const [questionId, setQuestionId] = useState<string>("")
    const [schemaErrors, setSchemaErrors] = useState<SchemaErrors>(GenerateSchemaErrorList())
    useEffect(() =>
    {
        const ExamAvailable: ExamSocketMapping["ExamAvailable"] = (targetRoom) =>
            mappedSocket.emit("TakeExam", targetRoom, (schema) =>
            {
                setSchemaData(Decrypt(schema))
                setConsumerMode(true)
            })
        const StopExam: ExamSocketMapping["StopExam"] = () =>
        {
            setConsumerMode(false)
            setSchemaData(GenerateBaseSchema())
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
        sessionMode, setSessionMode,
        builderMode, setBuilderMode,
        builderPage, setBuilderPage,
        schemaKey, setSchemaKey,
        schemaData, setSchemaData,
        questionId, setQuestionId,
        schemaErrors, setSchemaErrors,
    }
    return <context.Provider value={defaultValues}>
        {children}
    </context.Provider>
}