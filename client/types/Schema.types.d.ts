import { Dispatch, SetStateAction } from "react"
import { ExamProp, StandardQuestion } from "./Exam.types"
import { ChipProps, ListItemProps } from "@mui/material"

export interface SchemaTypes
{
    schemaBuilder: boolean
    setSchemaBuilder: Dispatch<SetStateAction<boolean>>
    schemaData: ExamProp
    setSchemaData: Dispatch<SetStateAction<ExamProp>>
    schemaErrors: SchemaErrors | undefined
}

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
    SchemaTitleError: string
    SchemaStartingDisplayError: string
    SchemaTimeLimitError: string
    QuestionsError: QuestionErrors[]
}

export interface QuestionErrors
{
    name: string
    index: number
    error: string
    fieldErrors: FieldErrors[]
}

export interface FieldErrors
{
    fieldType: string
    fieldName: string
    fieldError: string
}