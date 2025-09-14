import { Dispatch, SetStateAction } from "react"
import { ExamProp } from "./Exam.types"

export interface SchemaTypes
{
    schemaBuilder: boolean
    setSchemaBuilder: Dispatch<SetStateAction<boolean>>
    schemaData: ExamProp
    setSchemaData: Dispatch<SetStateAction<ExamProp>>
}