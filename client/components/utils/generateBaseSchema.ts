import { ExamProp, HtmlElement } from "@/types/Exam.types";

export default function GenerateBaseSchema(): ExamProp
{
    return {
        password: "",
        title: "",
        description: "",
        logo: "",
        logoFit: "cover",
        logoHeight: "80px",
        logoWidth: "auto",
        timeLimit: 10,
        timeLimitPerPage: 10,
        showTimer: true,
        showProgressBar: true,
        showPreviewBeforeComplete: true,
        questionOrder: "random",
        pages: [
            {
                elements: [
                    {
                        type: "html",
                        html: ""
                    } satisfies HtmlElement
                ]
            }
        ],
        /* ######### DEFAULT VALUES ######### */
        progressBarLocation: "bottom",
        timerInfoMode: "combined",
        lazyRenderEnabled: true,
        startSurveyText: "Start Quiz",
        previewMode: "answeredQuestions",
        previewText: "Review your answers"
    }
}