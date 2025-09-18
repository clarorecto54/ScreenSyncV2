"use client"
import { ExamProp, HtmlElement, StandardQuestion } from "@/types/Exam.types";
import { QuestionErrors, SchemaErrors, SchemaTypes } from "@/types/Schema.types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import SchemaDataListener from "../utils/schemaData.listener";
import GenerateBaseSchema from "../utils/generateBaseSchema";

const context = createContext<SchemaTypes | undefined>(undefined)
export function useSchema(): SchemaTypes { return useContext(context)! }

export function SchemaContextProvider({ children }: { children: ReactNode })
{
    const [schemaBuilder, setSchemaBuilder] = useState<boolean>(false)
    const [schemaData, setSchemaData] = useState<ExamProp>(GenerateBaseSchema())
    const [schemaErrors, setSchemaErrors] = useState<SchemaErrors | undefined>(undefined)
    useEffect(() => SchemaDataListener(schemaData, setSchemaErrors), [schemaData])
    const defaultValues: SchemaTypes = {
        schemaBuilder, setSchemaBuilder,
        schemaData, setSchemaData,
        schemaErrors
    }
    return <context.Provider value={defaultValues}>
        {children}
    </context.Provider>
}