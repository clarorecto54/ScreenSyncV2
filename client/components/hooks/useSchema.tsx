"use client"
import { ExamProp } from "@/types/Exam.types";
import { SchemaErrors, SchemaTypes } from "@/types/Schema.types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import SchemaDataListener from "../utils/schemaData.listener";
import GenerateBaseSchema from "../utils/generateBaseSchema";

const context = createContext<SchemaTypes | undefined>(undefined)
export function useSchema(): SchemaTypes { return useContext(context)! }

export function SchemaContextProvider({ children }: { children: ReactNode })
{
    const [schemaBuilder, setSchemaBuilder] = useState<boolean>(false)
    const [previewMode, setPreviewMode] = useState<boolean>(false)
    const [schemaData, setSchemaData] = useState<ExamProp>(GenerateBaseSchema())
    const [schemaErrors, setSchemaErrors] = useState<SchemaErrors | undefined>(undefined)
    useEffect(() => SchemaDataListener(schemaData, setSchemaErrors), [schemaData])
    const defaultValues: SchemaTypes = {
        schemaBuilder, setSchemaBuilder,
        schemaData, setSchemaData,
        schemaErrors,
        previewMode, setPreviewMode
    }
    return <context.Provider value={defaultValues}>
        {children}
    </context.Provider>
}