import React, { Dispatch, SetStateAction } from "react"
import { Element, ExamProp, StandardQuestion } from "./Exam.types"
import { ChipProps, ListItemProps } from "@mui/material"

export type SchemaPage = "Schema List" | "Schema Properties" | "Questions" | "Edit Question" | "Exam Session" | "Import Question"

export type SchemaCardType = (
    {
        createdOn,
        lock,
        id,
        title,
        description,
        password,
        questions,
        timeLimit,
    }:
        {
            createdOn: Date,
            lock: boolean,
            id: string,
            title: string,
            description: string,
            password: string,
            questions: number,
            timeLimit: number
        }
) => React.ReactNode

export type GeneratePDFResultType = (
    { name, schemaData, points, totalPoints, output }: {
        name: string,
        schemaData: ExamProp,
        points: number,
        totalPoints: number,
        output: Record<string, OutputType>
    }
) => ArrayBuffer

export interface OutputType
{
    answer: string
    correct: string
    score: boolean
}

export interface SchemaTypes
{
    output: Record<string, OutputType>
    setOutput: Dispatch<SetStateAction<Record<string, OutputType>>>
    sessionMode: boolean
    setSessionMode: Dispatch<SetStateAction<boolean>>
    builderMode: boolean
    setBuilderMode: Dispatch<SetStateAction<boolean>>
    schemaKey: string
    setSchemaKey: Dispatch<SetStateAction<string>>
    schemaData: ExamProp
    setSchemaData: Dispatch<SetStateAction<ExamProp>>
    schemaErrors: SchemaErrors
    setSchemaErrors: Dispatch<SetStateAction<SchemaErrors>>
    builderPage: SchemaPage
    setBuilderPage: Dispatch<SetStateAction<SchemaPage>>
    questionId: string
    setQuestionId: Dispatch<SetStateAction<string>>
    imports: Record<string, Element>
    setImports: Dispatch<SetStateAction<Record<string, Element>>>
}

export type SchemaValidableKeys = Extract<keyof SchemaErrors, keyof ExamProp>

export type SchemaDataListenerTypes = (
    setSchemaData: Dispatch<SetStateAction<ExamProp>>,
    schemaData: ExamProp,
) => void

export type BuilderPageListenerTypes = (
    builderPage: SchemaPage,
    setSchemaKey: Dispatch<SetStateAction<string>>
) => void

export interface CustomListItemProps extends ListItemProps
{
    index: number
    choice: string
    questionData: StandardQuestion
    setQuestionData: Dispatch<SetStateAction<StandardQuestion>>
}

export interface SchemaPropertiesErrorList
{
    title: string
    startSurveyText: string
    timeLimit: string
}

export interface SchemaErrors
{
    password: string
    title: string
    description: string
    SchemaStartingDisplayError: string
    timeLimitPerPage: string
    QuestionsError: QuestionErrors[]
}

export interface QuestionErrors
{
    id: string
    name: string
    error: string
    fieldErrors: FieldErrors[]
}

export interface FieldErrors
{
    fieldType: string
    fieldName: string
    fieldError: string
}