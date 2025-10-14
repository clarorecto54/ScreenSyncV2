import { Dispatch, SetStateAction } from "react"

export interface ExamTypes
{
    consumerMode: boolean
    setConsumerMode: Dispatch<SetStateAction<boolean>>
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
    SendOutExam: (
        targetRoom: string,
        encryptedSchema: string
    ) => void
    StopExam: (
        targetRoom: string
    ) => void
    ExamAvailable: (targetRoom: string) => void
    TakeExam: (
        targetRoom: string,
        SendExam: (encryptedSchema: string) => void
    ) => void
    SendResult: (
        targetRoom: string,
        result: ExamResult
    ) => void
    ReceiveResult: (
        result: ExamResult
    ) => void
    SendExamStatus: (
        studentCount: number
    ) => void
    GetSchemaMetrics: (
        schemaId: string,
        cb: (
            results: ExamResult[],
            metric: SchemaMetrics
        ) => void
    ) => void
    UpdatedSchemaMetrics: (
        results: ExamResult[],
        metric: SchemaMetrics
    ) => void
}

export interface SchemaMetrics{
    totalTakers: number
    totalScores: number
    minScore: number
    avgScore: number
    maxScore: number
}

export interface ExamResult
{
    id: string
    examId: string
    name: string
    score: number
    examName: string
    subDesc: string
    pdf: ArrayBuffer
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