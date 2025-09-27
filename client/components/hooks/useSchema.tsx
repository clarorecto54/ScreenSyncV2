"use client"
import { ExamProp } from "@/types/Exam.types";
import { SchemaErrors, SchemaPage, SchemaTypes } from "@/types/Schema.types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { BuilderPageListener, SchemaDataListener } from "../utils/listeners";
import GenerateBaseSchema from "../utils/generateBaseSchema";
import GenerateSchemaErrorList from "@/components/utils/generateSchemaErrorList";

const context = createContext<SchemaTypes | undefined>(undefined)
export function useSchema(): SchemaTypes { return useContext(context)! }

export function SchemaContextProvider({ children }: { children: ReactNode })
{
    const [builderPage, setBuilderPage] = useState<SchemaPage>("Schema List")
    const [schemaKey, setSchemaKey] = useState<string>("")
    const [builderMode, setBuilderMode] = useState<boolean>(false)
    const [schemaData, setSchemaData] = useState<ExamProp>(GenerateBaseSchema())
    const [questionId, setQuestionId] = useState<string>("")
    const [schemaErrors, setSchemaErrors] = useState<SchemaErrors>(GenerateSchemaErrorList())
    useEffect(() => BuilderPageListener(builderPage, setSchemaKey), [builderPage])
    useEffect(() => SchemaDataListener(setSchemaData, schemaData), [schemaData])
    const defaultValues: SchemaTypes = {
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