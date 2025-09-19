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
    logo: string
    logoFit: "contain" | "cover" | "fill" | "none"
    logoWidth: string | "auto"
    logoHeight: string
    timeLimit: number
    timeLimitPerPage: number
    showTimer: boolean
    timerInfoMode: "survey" | "page" | "combined"
    showProgressBar: boolean
    progressBarLocation: "aboveHeader" | "belowHeader" | "bottom" | "topBottom" | "auto"
    showPreviewBeforeComplete: boolean
    questionOrder: "initial" | "random"
    pages: Element[]
    /* ########### DEFAULT VALUES ########### */
    lazyRenderEnabled: boolean
    startSurveyText: string
    previewMode: "answeredQuestions" | "allQuestions"
    previewText: string
    /* ############## OPTIONAL ############## */
    questionsOnPageMode?: "singlePage" | "questionPerPage" | "inputPerPage" | "standard"
    completedHtml?: string
    completedHtmlOnCondition?: ExamHtmlCondition[]
}

export type HtmlElement = {
    type: "html"
    html: string
}

export type ImageQuestion = {
    type: "image",
    name: string,
    imageLink: string,
    imageHeight: number,
}

export type StandardQuestion = {
    type: "radiogroup"
    name: string
    title: string
    choices: string[]
    choicesOrder: "none" | "asc" | "desc" | "random"
    correctAnswer: string
    isRequired: boolean
    titleLocation: "default" | "top" | "bottom" | "left" | "hidden"
}

export type Question = StandardQuestion | HtmlElement | ImageQuestion

export type Element = {
    elements: Question[]
}

export type ExamHtmlCondition = {
    expression: string
    html: string
}