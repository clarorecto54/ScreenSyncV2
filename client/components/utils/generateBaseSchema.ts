import AddQuestion from "@/components/utils/generateQuestion";
import GenerateRandomBytes from "@/components/utils/randomBytes";
import { ExamProp, HtmlElement } from "@/types/Exam.types";
import { randomBytes } from "crypto";

export default function GenerateBaseSchema(): ExamProp
{
    return {
        id: randomBytes(16).toString("base64"),
        lock: true,
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
                id: "start",
                type: "panel",
                questionOrder: "initial",
                elements: [
                    {
                        type: "html",
                        html: ""
                    } satisfies HtmlElement
                ]
            },
            AddQuestion(GenerateRandomBytes())
        ],
        /* ######### DEFAULT VALUES ######### */
        firstPageIsStartPage: true,
        progressBarLocation: "bottom",
        timerInfoMode: "combined",
        lazyRenderEnabled: true,
        startSurveyText: "Start Quiz",
        previewMode: "answeredQuestions",
        previewText: "Review your answers"
    }
}