import { useGlobals } from "@/components/hooks/useGlobals";
import { ExamProp, ExamSocketMapping, ExamTypes, SchemaMetrics, SchemaResults } from "@/types/Exam.types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";

const context = createContext<ExamTypes | undefined>(undefined)
export function useExam(): ExamTypes { return useContext(context)! }

export function ExamContextProvider({ children }: { children: ReactNode })
{
    const { socket } = useGlobals()
    const [consumerMode, setConsumerMode] = useState<boolean>(false)
    const [builderMode, setBuilderMode] = useState<boolean>(false)
    const [schemaList, setSchemaList] = useState<ExamProp[]>([])
    const [schemaResults, setSchemaResults] = useState<SchemaResults[]>([])
    const [schemaMetrics, setSchemaMetrics] = useState<SchemaMetrics[]>([])
    useEffect(() =>
    {
        const mappedSocket: Socket<ExamSocketMapping> = socket
        const GetSchema: (list: ExamProp[], result: SchemaResults[], metric: SchemaMetrics[]) => void = (list, result, metric) =>
        {
            setSchemaList(list)
            setSchemaResults(result)
            setSchemaMetrics(metric)
        }
        const UpdatedSchema = () => {
            mappedSocket.emit("GetSchema", GetSchema)
        }
        mappedSocket.emit("GetSchema", GetSchema)
        mappedSocket.on("UpdatedSchema", UpdatedSchema)
        return () =>
        {
            mappedSocket.off("UpdatedSchema", UpdatedSchema)
        }
    }, [])
    const defaultValues: ExamTypes = {
        consumerMode, setConsumerMode,
        builderMode, setBuilderMode,
        schemaList, setSchemaList,
        schemaResults, setSchemaResults,
        schemaMetrics, setSchemaMetrics
    }
    return <context.Provider value={defaultValues}>
        {children}
    </context.Provider>
}