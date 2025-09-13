import { ExamTypes } from "@/types/Exam.types";
import { createContext, ReactNode, useContext, useState } from "react";

const context = createContext<ExamTypes | undefined>(undefined)
export function useExam(): ExamTypes { return useContext(context)! }

export function ExamContextProvider({ children }: { children: ReactNode })
{
    const [builderMode, setBuilderMode] = useState<boolean>(false)



    const defaultValues: ExamTypes = {
        builderMode, setBuilderMode
    }
    return <context.Provider value={defaultValues}>
        {children}
    </context.Provider>
}