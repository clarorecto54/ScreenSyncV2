import { Dispatch, SetStateAction } from "react"

export interface ExamTypes
{
    builderMode: boolean
    setBuilderMode: Dispatch<SetStateAction<boolean>>
}