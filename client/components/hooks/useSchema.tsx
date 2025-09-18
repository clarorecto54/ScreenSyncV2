"use client"
import { ExamProp, HtmlElement, StandardQuestion } from "@/types/Exam.types";
import { SchemaTypes } from "@/types/Schema.types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const context = createContext<SchemaTypes | undefined>(undefined)
export function useSchema(): SchemaTypes { return useContext(context)! }

export function SchemaContextProvider({ children }: { children: ReactNode })
{
    const [schemaBuilder, setSchemaBuilder] = useState<boolean>(false)
    const [schemaData, setSchemaData] = useState<ExamProp>({
        title: "",
        timeLimit: 60,
        startSurveyText: "Start Quiz",
        pages: [
            {
                elements: [
                    {
                        type: "html",
                        html: "Please input any starting message here"
                    } satisfies HtmlElement
                ]
            },
            {
                elements: [{
                    name: "Question 1",
                    question: "",
                    type: "radiogroup",
                    isRequired: true,
                    correctAnswer: "",
                    titleLocation: "top",
                    choicesOrder: "random",
                    choices: []
                } satisfies StandardQuestion]
            }
        ],
    })
    useEffect(() =>
    {
        console.clear()
        console.log(JSON.stringify(schemaData, null, 2));
    }, [schemaData])
    const defaultValues: SchemaTypes = {
        schemaBuilder, setSchemaBuilder,
        schemaData, setSchemaData
    }
    return <context.Provider value={defaultValues}>
        {children}
    </context.Provider>
}