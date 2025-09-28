import { Dispatch, SetStateAction } from "react"

export interface ExamTypes
{
    builderMode: boolean
    setBuilderMode: Dispatch<SetStateAction<boolean>>
    schemaList: ExamProp[]
    setSchemaList: Dispatch<SetStateAction<ExamProp[]>>
}

export interface ExamSocketMapping
{
    SaveSchema: (schema: ExamProp) => void
    DeleteSchema: (schema: ExamProp) => void
    GetSchema: (
        SendSchema: (schemaList: ExamProp[]) => void
    ) => void
    UpdatedSchema: () => void
}

export type ExamProp = {
    createdOn: Date
    id: string
    lock: boolean
    password: string
    title: string
    description: string
    logo: string
    logoFit: "contain" | "cover" | "fill" | "none"
    logoWidth: string | "auto"
    logoHeight: string
    timeLimit: number
    timeLimitPerPage: number
    showTimer: boolean
    showProgressBar: boolean
    showPreviewBeforeComplete: boolean
    questionOrder: "initial" | "random"
    pages: Element[]
    /* ########### DEFAULT VALUES ########### */
    firstPageIsStartPage: boolean
    progressBarLocation: "aboveHeader" | "belowHeader" | "bottom" | "topBottom" | "auto"
    timerInfoMode: "survey" | "page" | "combined"
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
    imageWidth: "auto" | number
    imageFit: "contain"
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

export type Question = StandardQuestion | HtmlElement | ImageQuestion | Element

export type Element = {
    id: string
    type: "panel"
    questionOrder: "initial"
    elements: Question[]
}

export type ExamHtmlCondition = {
    expression: string
    html: string
}