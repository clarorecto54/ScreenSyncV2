import { Dispatch, SetStateAction } from "react"

export interface ExamTypes
{
    builderMode: boolean
    setBuilderMode: Dispatch<SetStateAction<boolean>>
    schemaList: ExamProp[]
    setSchemaList: Dispatch<SetStateAction<ExamProp[]>>
}

export type ExamProp = {
    title: string
    startSurveyText: string
    timeLimit: number
    pages: Element[]
    timeLimitPerPage?: number
    showProgressBar?: boolean
    showTimer?: boolean
    firstPageIsStartPage?: boolean
    progressBarLocation?: "aboveHeader" | "belowHeader" | "bottom" | "topBottom" | "auto"
    completedHtml?: string
    completedHtmlOnCondition?: ExamHtmlCondition[]
}

export type HtmlElement = {
    type: "html"
    html: string
}

export type StandardQuestion = {
    type: "radiogroup"
    name: string
    question: string
    choices: string[]
    choicesOrder: "none" | "asc" | "desc" | "random"
    correctAnswer: string
    isRequired: boolean
    titleLocation: "default" | "top" | "bottom" | "left" | "hidden"
}

export type Question = StandardQuestion | HtmlElement

export type Element = {
    elements: Question[]
}

export type ExamHtmlCondition = {
    expression: string
    html: string
}