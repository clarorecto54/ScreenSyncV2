import { ExamProp, HtmlElement } from "@/types/Exam.types";
import AddQuestion from "./generateQuestion";

export default function GenerateBaseSchema(): ExamProp
{
    return {
        title: "",
        logo: "",
        logoFit: "cover",
        logoHeight: "80px",
        logoWidth: "auto",
        timeLimit: 10,
        timeLimitPerPage: 10,
        showTimer: true,
        timerInfoMode: "combined",
        showProgressBar: true,
        progressBarLocation: "bottom",
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
            },
            AddQuestion(1)
        ],
        /* ######### DEFAULT VALUES ######### */
        lazyRenderEnabled: true,
        startSurveyText: "Start Quiz",
        previewMode: "answeredQuestions",
        previewText: "Review your answers"
    }
}