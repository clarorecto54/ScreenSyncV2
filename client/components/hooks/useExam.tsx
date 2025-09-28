import { useGlobals } from "@/components/hooks/useGlobals";
import { ExamProp, ExamSocketMapping, ExamTypes } from "@/types/Exam.types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";

const context = createContext<ExamTypes | undefined>(undefined)
export function useExam(): ExamTypes { return useContext(context)! }

export function ExamContextProvider({ children }: { children: ReactNode })
{
    const { socket } = useGlobals()
    const [consumerMode, setConsumerMode] = useState<boolean>(true)
    const [builderMode, setBuilderMode] = useState<boolean>(false)
    const [schemaList, setSchemaList] = useState<ExamProp[]>([])
    useEffect(() =>
    {
        const mappedSocket: Socket<ExamSocketMapping> = socket
        const GetSchema: (list: ExamProp[]) => void = (list) => setSchemaList(list)
        const UpdatedSchema = () => mappedSocket.emit("GetSchema", GetSchema)
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
        schemaList, setSchemaList
    }
    return <context.Provider value={defaultValues}>
        {children}
    </context.Provider>
}