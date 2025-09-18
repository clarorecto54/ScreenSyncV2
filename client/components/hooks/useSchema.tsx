"use client"
import { ExamProp, HtmlElement, StandardQuestion } from "@/types/Exam.types";
import { QuestionErrors, SchemaErrors, SchemaTypes } from "@/types/Schema.types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const context = createContext<SchemaTypes | undefined>(undefined)
export function useSchema(): SchemaTypes { return useContext(context)! }

export function SchemaContextProvider({ children }: { children: ReactNode })
{
    const [schemaBuilder, setSchemaBuilder] = useState<boolean>(false)
    const [schemaData, setSchemaData] = useState<ExamProp>({
        title: "",
        timeLimit: 30,
        startSurveyText: "Start Quiz",
        pages: [
            {
                elements: [
                    {
                        type: "html",
                        html: ""
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
    const [schemaErrors, setSchemaErrors] = useState<SchemaErrors | undefined>(undefined)
    useEffect(() =>
    {
        const UpdatedSchemaErrors: SchemaErrors = {
            QuestionsError: [],
            SchemaStartingDisplayError: "",
            SchemaTimeLimitError: "",
            SchemaTitleError: ""
        }
        if (!schemaData.title) UpdatedSchemaErrors.SchemaTitleError = "Exam Name must not be empty"
        if (schemaData.timeLimit <= 0) UpdatedSchemaErrors.SchemaTimeLimitError = "Timelimit is invalid"
        if (!(schemaData.pages[0].elements[0] as HtmlElement).html) UpdatedSchemaErrors.SchemaStartingDisplayError = "Please input starting message here"
        schemaData.pages.forEach((page, questionIndex) =>
        {
            let questionError: QuestionErrors = {
                name: "",
                index: questionIndex,
                error: "",
                fieldErrors: [],
            }
            page.elements.forEach((element) =>
            {
                if (element.type === "radiogroup")
                {
                    const panelName = element.name
                    questionError.name = panelName
                    if (!element.question)
                    {
                        questionError.error = "This question has missing fields"
                        questionError.fieldErrors.push({
                            fieldType: element.type,
                            fieldName: "question",
                            fieldError: "This field must not be empty"
                        })
                    }
                    if (element.choices.length <= 0)
                        questionError.error = "This question don't have choices"
                }
            })
            if (questionError.fieldErrors.length > 0 || questionError.error)
                UpdatedSchemaErrors.QuestionsError.push(questionError)
        })
        setSchemaErrors(UpdatedSchemaErrors)
    }, [schemaData])
    const defaultValues: SchemaTypes = {
        schemaBuilder, setSchemaBuilder,
        schemaData, setSchemaData,
        schemaErrors
    }
    return <context.Provider value={defaultValues}>
        {children}
    </context.Provider>
}