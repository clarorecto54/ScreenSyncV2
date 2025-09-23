import { Dispatch, SetStateAction } from "react"
import { ExamProp, StandardQuestion } from "./Exam.types"
import { ChipProps, ListItemProps } from "@mui/material"

export type SchemaPage = "Schema Properties" | "Questions" | "Edit Question"

export interface SchemaTypes
{
    builderMode: boolean
    setBuilderMode: Dispatch<SetStateAction<boolean>>
    schemaKey: string
    setschemaKey: Dispatch<SetStateAction<string>>
    schemaData: ExamProp
    setSchemaData: Dispatch<SetStateAction<ExamProp>>
    schemaErrors: SchemaErrors | undefined
    builderPage: SchemaPage
    setBuilderPage: Dispatch<SetStateAction<SchemaPage>>
    questionId: string
    setQuestionId: Dispatch<SetStateAction<string>>
}

export type SchemaValidableKeys = Extract<keyof SchemaErrors, keyof ExamProp>

export type SchemaDataListenerTypes = (
    setSchemaData: Dispatch<SetStateAction<ExamProp>>,
    schemaData: ExamProp,
    schemaKey: string,
    setSchemaErrors: Dispatch<SetStateAction<SchemaErrors | undefined>>
) => void

export type SchemaErrorListenerTypes = (
    schemaData: ExamProp,
    schemaKey: string,
    setSchemaErrors: Dispatch<SetStateAction<SchemaErrors | undefined>>
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