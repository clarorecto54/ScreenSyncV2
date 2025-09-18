import { Dispatch, SetStateAction } from "react"
import { ExamProp, StandardQuestion } from "./Exam.types"
import { ChipProps, ListItemProps } from "@mui/material"

export interface SchemaTypes
{
    schemaBuilder: boolean
    setSchemaBuilder: Dispatch<SetStateAction<boolean>>
    schemaData: ExamProp
    setSchemaData: Dispatch<SetStateAction<ExamProp>>
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